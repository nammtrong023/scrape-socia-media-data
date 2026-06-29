import { getState, namespacePatch, publicState, sleep, defaultState } from "./state.js";

const FB_TRANSCRIPT_CONCURRENCY = 1;
const FB_TRANSCRIPT_RETRIES = 4;
const FB_TRANSCRIPT_MIN_START_INTERVAL_MS = 32000;
const FB_TRANSCRIPT_RATE_LIMIT_WAIT_MS = 65000;
const FB_NATIVE_CAPTION_TIMEOUT_MS = 12000;

let fbTranscriptRunning = false;
let lastFbTranscriptStartAt = 0;
let dbgQueue = Promise.resolve();

const statePatch = (patch) => namespacePatch("facebook", patch);

export const facebook = {
  runScrape,
  clearState,
  exportXlsx,
  exportCsv,
  runTranscriptBatch,
  exportSrt,
  mergeBatch,
  handleDone,
  dbgLog: facebookDbgLog,
};

// ─── public handlers ─────────────────────────────────────────────────────────

async function runScrape(tabId) {
  if (!tabId) return publicState(await statePatch({ status: "error", message: "No active Facebook tab found." }));
  const tab = await chrome.tabs.get(tabId);
  if (!/facebook\.com/i.test(tab.url || "")) {
    return publicState(await statePatch({ status: "error", message: "Open a Facebook post before scraping." }));
  }

  await statePatch({
    status: "running", currentUrl: tab.url, comments: [], count: 0,
    message: "Injecting interceptor and loading comments...", failures: [],
    debugLog: [`[bg] ▶️ runFacebookScrape on: ${tab.url}`],
  });
  try {
    await facebookDbgLog("Injecting interceptor-bridge (ISOLATED)...");
    await injectInterceptor(tabId);
    await facebookDbgLog("Injecting facebook-interceptor (MAIN)... done");
    await chrome.tabs.sendMessage(tabId, { type: "REVIEW_EXPORTER_FB_START_SCRAPE" });
    await facebookDbgLog("FB_START_SCRAPE sent to tab");
    return publicState(await getState());
  } catch (error) {
    const state = await getState();
    await facebookDbgLog(`ERROR: ${error.message}`);
    return publicState(await statePatch({
      status: "error",
      failures: [...state.facebook.failures, { url: tab.url, message: error.message }],
      message: `Facebook scrape failed: ${error.message}`,
    }));
  }
}

async function clearState() {
  return publicState(await statePatch(defaultState.facebook));
}

async function exportXlsx() {
  const state = await getState();
  const comments = state.facebook.comments || [];
  if (!comments.length) return publicState(await statePatch({ message: "No Facebook comments captured yet." }));
  return publicState(await statePatch({
    message: `Ready to export ${comments.length} Facebook comments. Use Export XLSX in the side panel.`,
  }));
}

async function exportCsv() {
  const state = await getState();
  const comments = state.facebook.comments || [];
  if (!comments.length) return publicState(await statePatch({ message: "No Facebook comments captured yet." }));

  const headers = ["post_url", "author_name", "comment_text"];
  const rows = [headers.join(","), ...comments.map((item) => headers.map((h) => csvEscape(item[h])).join(","))];
  const url = `data:text/csv;charset=utf-8,${encodeURIComponent(`\uFEFF${rows.join("\n")}`)}`;
  await chrome.downloads.download({ url, filename: `facebook_comments_${timestamp()}.csv`, saveAs: true });
  return publicState(await statePatch({ message: `Exported ${comments.length} Facebook comments to CSV.` }));
}

async function runTranscriptBatch(urlInput) {
  if (fbTranscriptRunning) return publicState(await getState());

  const urls = parseFacebookReelUrls(urlInput);
  if (!urls.length) return publicState(await statePatch({ status: "idle", message: "No valid Facebook Reels URLs found." }));

  fbTranscriptRunning = true;
  await statePatch({
    status: "running", currentUrl: urls[0], transcriptUrls: urls, transcriptIndex: 0,
    transcripts: [], combinedSrt: "", combinedTranscript: "", count: 0, failures: [],
    message: `Starting ${urls.length} Reels transcript${urls.length === 1 ? "" : "s"}: checking Facebook captions first, then API fallback...`,
  });

  try {
    const results = [];
    const failures = [];
    let nextIndex = 0;
    let finished = 0;
    const workerCount = Math.min(FB_TRANSCRIPT_CONCURRENCY, urls.length);

    async function transcribeOne(i) {
      const url = urls[i];
      await statePatch({ currentUrl: url, transcriptIndex: i, message: `Transcribing Reel ${i + 1}/${urls.length}...` });
      try {
        await statePatch({ message: `Checking native Facebook captions for Reel ${i + 1}/${urls.length}...` });
        const nativeCaption = await fetchFacebookNativeCaption(url);
        let srt = nativeCaption?.srt || "";
        if (!srt.trim()) {
          await waitForFacebookTranscriptSlot(async (waitMs) => {
            await statePatch({ message: `No native caption found. Waiting ${Math.ceil(waitMs / 1000)}s for API fair-use limit before Reel ${i + 1}/${urls.length}...` });
          });
          const result = await transcribeFacebookReelWithRetry(url, async (error, attempt, waitMs) => {
            await statePatch({ message: `Retrying Reel ${i + 1}/${urls.length} (${attempt}/${FB_TRANSCRIPT_RETRIES}) after ${Math.ceil(waitMs / 1000)}s: ${error.message}` });
            if (/fair usage|2 requests per minute|rate limit|too many requests/i.test(String(error.message || ""))) {
              lastFbTranscriptStartAt = Date.now();
            }
          });
          srt = extractSrtText(result);
        }
        results.push({ index: i, url, srt });
        const transcripts = [...results].sort((a, b) => a.index - b.index);
        await statePatch({
          transcripts, combinedSrt: "", combinedTranscript: buildReadableTranscript(transcripts), count: transcripts.length,
          message: `Finished Reel ${i + 1}/${urls.length}${nativeCaption ? " from Facebook captions" : " via API fallback"}.`,
        });
      } catch (error) {
        failures.push({ url, message: error.message });
        await statePatch({ failures: [...failures], message: `Skipped Reel ${i + 1}/${urls.length}: ${error.message}` });
      }
      finished++;
      const completed = results.length;
      const failed = failures.length;
      await statePatch({ transcriptIndex: finished, message: `Processed ${completed + failed}/${urls.length} Reel${urls.length === 1 ? "" : "s"} (${completed} ok, ${failed} failed).` });
    }

    async function worker() { while (nextIndex < urls.length) { const i = nextIndex++; await transcribeOne(i); } }
    await Promise.all(Array.from({ length: workerCount }, worker));

    const state = await getState();
    const completed = state.facebook.transcripts?.length || 0;
    const firstFailure = state.facebook.failures?.[0]?.message;
    let autoExportMessage = "";
    if (completed) {
      try {
        const transcript = state.facebook.combinedTranscript || buildReadableTranscript(state.facebook.transcripts || []);
        await downloadTranscript(transcript, false);
        autoExportMessage = " Auto-exported transcript.";
      } catch (error) {
        autoExportMessage = ` Auto-export failed: ${error.message}`;
      }
    }
    return publicState(await statePatch({
      status: completed ? "done" : "error", currentUrl: "", transcriptIndex: urls.length,
      message: completed
        ? `Done. Created one readable transcript from ${completed}/${urls.length} Reel${urls.length === 1 ? "" : "s"}.${autoExportMessage}${firstFailure ? ` First skipped: ${firstFailure}` : ""}`
        : `No Reels were transcribed.${firstFailure ? ` First error: ${firstFailure}` : ""}`,
    }));
  } finally {
    fbTranscriptRunning = false;
  }
}

async function exportSrt() {
  const state = await getState();
  const transcript = state.facebook.combinedTranscript || buildReadableTranscript(state.facebook.transcripts || []);
  if (!transcript.trim()) return publicState(await statePatch({ message: "No Facebook Reels transcript captured yet." }));
  await downloadTranscript(transcript, true);
  return publicState(await statePatch({ message: "Exported readable Facebook Reels transcript." }));
}

async function mergeBatch(incoming) {
  const state = await getState();
  const currentUrl = state.facebook.currentUrl;
  if (!currentUrl) return;

  const seen = new Set(state.facebook.comments.map((c) => fbDedupeKey(currentUrl, c)));
  const next = [...state.facebook.comments];
  let added = 0;
  for (const item of incoming || []) {
    if (!item?.text) continue;
    const key = fbDedupeKey(currentUrl, item);
    if (seen.has(key)) continue;
    seen.add(key);
    next.push({ post_url: currentUrl, author_name: item.author_name || "Unknown", comment_text: item.text, react_count: item.react_count ?? 0, created_time: item.created_time || null });
    added++;
  }
  await facebookDbgLog(`[bg] mergeBatch: +${added} new (${incoming?.length ?? 0} incoming, ${next.length} total)`);
  await statePatch({ comments: next, count: next.length, message: `Captured ${next.length} comments...` });
}

async function handleDone() {
  setTimeout(async () => {
    try {
      const s = await getState();
      const count = s.facebook.count || 0;
      await statePatch({ status: "done", message: `Done. Captured ${count} comment${count === 1 ? "" : "s"}.` });
    } catch {}
  }, 3000);
}

// ─── internal ─────────────────────────────────────────────────────────────────

function parseFacebookReelUrls(input) {
  return [...new Set(
    String(input || "").split(/[\n,]+/).flatMap((p) => p.split(/\s+/))
      .map((u) => u.trim()).filter(Boolean)
      .filter((u) => /^https?:\/\/([^.]+\.)?facebook\.com\/(?:reel|reels)\//i.test(u))
  )];
}

async function facebookDbgLog(msg) {
  dbgQueue = dbgQueue.then(async () => {
    try {
      const state = await getState();
      const ts = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const entry = `[bg ${ts}] ${msg}`;
      const log = [...(state.facebook.debugLog || []), entry].slice(-60);
      const STORAGE_KEY = "reviewExporterState";
      const next = { ...state, facebook: { ...state.facebook, debugLog: log } };
      await chrome.storage.local.set({ [STORAGE_KEY]: next });
    } catch {}
  });
  return dbgQueue;
}

async function injectInterceptor(tabId) {
  await chrome.scripting.executeScript({ target: { tabId }, files: ["shared/interceptor-bridge.js"], world: "ISOLATED" });
  await chrome.scripting.executeScript({ target: { tabId }, files: ["platforms/facebook/interceptor.js"], world: "MAIN" });
}

async function waitForFacebookTranscriptSlot(onWait) {
  const elapsed = Date.now() - lastFbTranscriptStartAt;
  const waitMs = Math.max(0, FB_TRANSCRIPT_MIN_START_INTERVAL_MS - elapsed);
  if (waitMs > 0) { if (onWait) await onWait(waitMs); await sleep(waitMs); }
  lastFbTranscriptStartAt = Date.now();
}

async function fetchFacebookNativeCaption(url) {
  try {
    const pageResponse = await fetchWithTimeout(url, { headers: { Accept: "text/html,application/xhtml+xml" }, credentials: "include" });
    if (!pageResponse.ok) return null;
    const html = await pageResponse.text();
    const captionUrls = findFacebookCaptionUrls(html);
    for (const captionUrl of captionUrls.slice(0, 6)) {
      try {
        const captionResponse = await fetchWithTimeout(captionUrl, { headers: { Accept: "text/vtt,application/x-subrip,text/plain,*/*" }, credentials: "include" });
        if (!captionResponse.ok) continue;
        const captionText = await captionResponse.text();
        const srt = captionTextToSrt(captionText);
        if (srt.trim()) return { srt, source: "facebook-native" };
      } catch {}
    }
  } catch {}
  return null;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = FB_NATIVE_CAPTION_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try { return await fetch(url, { ...options, signal: controller.signal }); } finally { clearTimeout(timer); }
}

async function transcribeFacebookReel(url) {
  const response = await fetch("https://api.letclone.ai/api/v1/fb-transcript/transcribe", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ url, language: null, strategy: "auto", segment: 1, format: "srt", include_metadata: true }),
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 429) { const e = new Error(data.error || data.message || "Rate limited by transcript API."); e.retryable = true; throw e; }
  if (!response.ok) { const e = new Error(data.error || data.message || `Transcript API failed with status ${response.status}.`); e.retryable = response.status >= 500; throw e; }
  const taskId = data.task_id || data.taskId || data.data?.task_id || data.data?.taskId || data.result?.task_id || data.result?.taskId;
  if ((data.status === "processing" || data.status === "queued" || data.status === "pending") && taskId) return pollFacebookTranscript(taskId);
  if (data.status === "error" || data.success === false) throw new Error(data.error || data.message || "Transcription failed.");
  return data;
}

async function pollFacebookTranscript(taskId) {
  for (let attempt = 0; attempt < 120; attempt++) {
    await sleep(3000);
    const response = await fetch(`https://api.letclone.ai/api/v1/fb-transcript/status/${encodeURIComponent(taskId)}`, { headers: { Accept: "application/json" } });
    const data = await response.json().catch(() => ({}));
    if (response.status === 429 || response.status >= 500) { await sleep(5000 + Math.random() * 5000); continue; }
    if (data.status === "completed") return data;
    if (data.status === "error") throw new Error(data.error || "Transcription failed.");
    await statePatch({ message: `Transcribing Reel... ${Math.min(attempt + 1, 120)}/120` });
  }
  throw new Error("Transcription timed out.");
}

function isRetryableTranscriptError(error) {
  const message = String(error?.message || "").toLowerCase();
  return Boolean(error?.retryable)
    || message.includes("rate limit") || message.includes("fair usage") || message.includes("2 requests per minute")
    || message.includes("too many requests") || message.includes("timeout") || message.includes("timed out")
    || message.includes("network") || message.includes("failed to fetch") || /\b5\d\d\b/.test(message);
}

async function transcribeFacebookReelWithRetry(url, onRetry) {
  let lastError = null;
  for (let attempt = 0; attempt <= FB_TRANSCRIPT_RETRIES; attempt++) {
    try { return await transcribeFacebookReel(url); } catch (error) {
      lastError = error;
      if (attempt >= FB_TRANSCRIPT_RETRIES || !isRetryableTranscriptError(error)) break;
      const rateLimited = /fair usage|2 requests per minute|rate limit|too many requests/i.test(String(error.message || ""));
      const waitMs = rateLimited ? FB_TRANSCRIPT_RATE_LIMIT_WAIT_MS + Math.random() * 8000 : 5000 * (attempt + 1) + Math.random() * 5000;
      if (onRetry) await onRetry(error, attempt + 1, waitMs);
      await sleep(waitMs);
    }
  }
  throw lastError;
}

function extractSrtText(result) {
  const candidates = [result?.srt, result?.content, result?.transcript, result?.data?.srt, result?.data?.content, result?.data?.transcript, result?.result?.srt, result?.result?.content, result?.result?.transcript];
  const text = candidates.find((v) => typeof v === "string" && v.trim());
  if (!text) throw new Error("Transcript API returned no SRT content.");
  return text.trim();
}

function fbDedupeKey(url, item) {
  const textVal = item.text || item.comment_text || "";
  return [url, String(textVal || "").replace(/\s+/g, " ").trim().toLowerCase(), String(item.author_name || "").toLowerCase()].join("|");
}

async function downloadTranscript(transcript, saveAs = true) {
  const url = `data:text/plain;charset=utf-8,${encodeURIComponent(`\uFEFF${transcript}`)}`;
  await chrome.downloads.download({ url, filename: `facebook_reels_transcript_${timestamp()}.txt`, saveAs });
}

// ─── SRT helpers (shared with instagram.js) ──────────────────────────────────

function srtTimeToMs(value) {
  const match = String(value || "").match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
  if (!match) return 0;
  const [, hh, mm, ss, ms] = match.map(Number);
  return (((hh * 60) + mm) * 60 + ss) * 1000 + ms;
}

function msToReadableTime(value) {
  const safe = Math.max(0, Math.floor((value || 0) / 1000));
  const hh = Math.floor(safe / 3600);
  const mm = Math.floor((safe % 3600) / 60);
  const ss = safe % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function parseSrtCues(srt) {
  return String(srt || "").replace(/\r/g, "").split(/\n{2,}/).map((block) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const timeIndex = lines.findIndex((l) => l.includes("-->"));
    if (timeIndex === -1) return null;
    const [start, end] = lines[timeIndex].split("-->").map((p) => p.trim().split(/\s+/)[0]);
    const text = lines.slice(timeIndex + 1).join("\n").trim();
    if (!text) return null;
    return { startMs: srtTimeToMs(start), endMs: srtTimeToMs(end), text };
  }).filter(Boolean);
}

export function buildReadableTranscript(transcripts) {
  let offsetMs = 0;
  const blocks = [];
  for (const [videoIndex, transcript] of transcripts.entries()) {
    const cues = parseSrtCues(transcript.srt);
    const displayIndex = Number.isInteger(transcript.index) ? transcript.index + 1 : videoIndex + 1;
    blocks.push(`VIDEO ${displayIndex}: ${transcript.url}`);
    let maxEnd = 2000;
    for (const cue of cues) {
      blocks.push([`${msToReadableTime(offsetMs + cue.startMs)} --> ${msToReadableTime(offsetMs + cue.endMs)}`, cue.text].join("\n"));
      maxEnd = Math.max(maxEnd, cue.endMs);
    }
    offsetMs += maxEnd + 3000;
  }
  return `${blocks.join("\n\n")}\n`;
}

// ─── Caption parsing helpers ──────────────────────────────────────────────────

function decodeHtmlEntities(value) {
  return String(value || "").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function decodeFacebookEscapedString(value) {
  const text = decodeHtmlEntities(String(value || ""));
  try { return JSON.parse(`"${text.replace(/"/g, "\\\"")}"`); } catch {
    return text.replace(/\\\//g, "/").replace(/\\u0025/g, "%").replace(/\\u0026/g, "&").replace(/\\u003d/g, "=").replace(/\\u003f/g, "?");
  }
}

function normalizeFacebookCaptionUrl(value) {
  const decoded = decodeFacebookEscapedString(value).trim();
  if (!decoded || !/^https?:\/\//i.test(decoded)) return "";
  return decoded.replace(/\\+/g, "");
}

function findFacebookCaptionUrls(text) {
  const source = String(text || "");
  const urls = [];
  const seen = new Set();
  function add(value) { const url = normalizeFacebookCaptionUrl(value); if (!url || seen.has(url)) return; seen.add(url); urls.push(url); }
  const keyPattern = /"(?:[^"]*(?:caption|subtitle)[^"]*(?:url|uri|src)|(?:url|uri|src)[^"]*(?:caption|subtitle)[^"]*)"\s*:\s*"([^"]+)"/gi;
  for (const match of source.matchAll(keyPattern)) add(match[1]);
  const urlPattern = /https?:\/\/[^"' <>\n\r]+?(?:\.vtt|\.srt|caption|subtitle|subtitles)[^"' <>\n\r]*/gi;
  for (const match of source.matchAll(urlPattern)) add(match[0]);
  return urls;
}

function captionTimeToMs(value) {
  const match = String(value || "").match(/(?:(\d{2,}):)?(\d{2}):(\d{2})[,.](\d{1,3})/);
  if (!match) return 0;
  const [, hh = "0", mm, ss, ms] = match;
  return (((Number(hh) * 60) + Number(mm)) * 60 + Number(ss)) * 1000 + Number(ms.padEnd(3, "0"));
}

function captionTextToSrt(text) {
  const blocks = String(text || "").replace(/^\uFEFF/, "").replace(/\r/g, "").replace(/^WEBVTT[^\n]*(?:\n|$)/i, "").split(/\n{2,}/).map((block) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const timeIndex = lines.findIndex((l) => l.includes("-->"));
    if (timeIndex === -1) return null;
    const [start, end] = lines[timeIndex].split("-->").map((p) => p.trim().split(/\s+/)[0]);
    const cueText = lines.slice(timeIndex + 1).join("\n").replace(/<[^>]+>/g, "").trim();
    if (!cueText) return null;
    return { startMs: captionTimeToMs(start), endMs: captionTimeToMs(end), text: cueText };
  }).filter(Boolean);

  if (!blocks.length) return "";
  return `${blocks.map((cue, index) => [index + 1, `${msToReadableTime(cue.startMs)},000 --> ${msToReadableTime(cue.endMs)},000`, cue.text].join("\n")).join("\n\n")}\n`;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function timestamp() {
  const d = new Date();
  const pad = (v) => String(v).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}
