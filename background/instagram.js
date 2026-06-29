import { getState, namespacePatch, publicState, sleep, defaultState } from "./state.js";
import { buildReadableTranscript } from "./facebook.js";

// ponytail: reuse FB transcript logic — same API, same fair-use limit
const FB_TRANSCRIPT_CONCURRENCY = 1;
const FB_TRANSCRIPT_RETRIES = 4;
const FB_TRANSCRIPT_MIN_START_INTERVAL_MS = 32000;
const FB_TRANSCRIPT_RATE_LIMIT_WAIT_MS = 65000;

let igTranscriptRunning = false;
let lastIgTranscriptStartAt = 0;

const statePatch = (patch) => namespacePatch("instagram", patch);

export const instagram = {
  runTranscriptBatch,
  clearState,
  exportSrt,
  exportXlsx,
  exportCsv,
};

async function runTranscriptBatch(urlInput) {
  if (igTranscriptRunning) return publicState(await getState());

  const urls = parseInstagramReelUrls(urlInput);
  if (!urls.length) return publicState(await statePatch({ status: "idle", message: "No valid Instagram Reel URLs found." }));

  igTranscriptRunning = true;
  await statePatch({
    status: "running", currentUrl: urls[0], transcriptUrls: urls, transcriptIndex: 0,
    transcripts: [], combinedSrt: "", combinedTranscript: "", count: 0, failures: [],
    message: `Starting ${urls.length} Reel transcript${urls.length === 1 ? "" : "s"}...`,
  });

  try {
    const results = [];
    const failures = [];
    let nextIndex = 0;
    let finished = 0;
    // ponytail: concurrency 1 — same fair-use constraint as Facebook
    const workerCount = Math.min(FB_TRANSCRIPT_CONCURRENCY, urls.length);

    async function transcribeOne(i) {
      const url = urls[i];
      await statePatch({ currentUrl: url, transcriptIndex: i, message: `Transcribing Reel ${i + 1}/${urls.length}...` });
      try {
        await waitForInstagramTranscriptSlot(async (waitMs) => {
          await statePatch({ message: `Waiting ${Math.ceil(waitMs / 1000)}s for API fair-use limit before Reel ${i + 1}/${urls.length}...` });
        });
        const result = await transcribeFacebookReelWithRetry(url, async (error, attempt, waitMs) => {
          await statePatch({ message: `Retrying Reel ${i + 1}/${urls.length} (${attempt}/${FB_TRANSCRIPT_RETRIES}) after ${Math.ceil(waitMs / 1000)}s: ${error.message}` });
          if (/fair usage|2 requests per minute|rate limit|too many requests/i.test(String(error.message || ""))) {
            lastIgTranscriptStartAt = Date.now();
          }
        });
        const srt = extractSrtText(result);
        results.push({ index: i, url, srt });
        const transcripts = [...results].sort((a, b) => a.index - b.index);
        await statePatch({
          transcripts, combinedSrt: "", combinedTranscript: buildReadableTranscript(transcripts), count: transcripts.length,
          message: `Finished Reel ${i + 1}/${urls.length} via API.`,
        });
      } catch (error) {
        failures.push({ url, message: error.message });
        await statePatch({ failures: [...failures], message: `Skipped Reel ${i + 1}/${urls.length}: ${error.message}` });
      }
      finished++;
      await statePatch({ transcriptIndex: finished, message: `Processed ${results.length + failures.length}/${urls.length} Reel${urls.length === 1 ? "" : "s"} (${results.length} ok, ${failures.length} failed).` });
    }

    async function worker() { while (nextIndex < urls.length) { const i = nextIndex++; await transcribeOne(i); } }
    await Promise.all(Array.from({ length: workerCount }, worker));

    const state = await getState();
    const completed = state.instagram.transcripts?.length || 0;
    const firstFailure = state.instagram.failures?.[0]?.message;
    let autoExportMessage = "";
    if (completed) {
      try {
        const transcript = state.instagram.combinedTranscript || buildReadableTranscript(state.instagram.transcripts || []);
        await downloadTranscript(transcript, false);
        autoExportMessage = " Auto-exported transcript.";
      } catch (error) {
        autoExportMessage = ` Auto-export failed: ${error.message}`;
      }
    }
    return publicState(await statePatch({
      status: completed ? "done" : "error", currentUrl: "", transcriptIndex: urls.length,
      message: completed
        ? `Done. Created transcript from ${completed}/${urls.length} Reel${urls.length === 1 ? "" : "s"}.${autoExportMessage}${firstFailure ? ` First skipped: ${firstFailure}` : ""}`
        : `No Reels were transcribed.${firstFailure ? ` First error: ${firstFailure}` : ""}`,
    }));
  } finally {
    igTranscriptRunning = false;
  }
}

async function clearState() {
  return publicState(await statePatch(defaultState.instagram));
}

async function exportSrt() {
  const state = await getState();
  const transcript = state.instagram.combinedTranscript || buildReadableTranscript(state.instagram.transcripts || []);
  if (!transcript.trim()) return publicState(await statePatch({ message: "No Instagram Reels transcript captured yet." }));
  await downloadTranscript(transcript, true);
  return publicState(await statePatch({ message: "Exported readable Instagram Reels transcript." }));
}

async function exportXlsx() {
  const state = await getState();
  const transcripts = state.instagram.transcripts || [];
  if (!transcripts.length) return publicState(await statePatch({ message: "No Instagram Reels transcript captured yet." }));
  return publicState(await statePatch({
    message: `Ready to export ${transcripts.length} Instagram transcript${transcripts.length === 1 ? "" : "s"}. Use Export XLSX in the side panel.`,
  }));
}

async function exportCsv() {
  const state = await getState();
  const transcripts = state.instagram.transcripts || [];
  if (!transcripts.length) return publicState(await statePatch({ message: "No Instagram Reels transcript captured yet." }));

  const headers = ["reel_url", "transcript"];
  const rows = [headers.join(","), ...transcripts.map((t) => [csvEscape(t.url), csvEscape(buildReadableTranscript([t]))].join(","))];
  const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(`\uFEFF${rows.join("\n")}`)}`;
  await chrome.downloads.download({ url: dataUrl, filename: `instagram_reels_transcripts_${timestamp()}.csv`, saveAs: true });
  return publicState(await statePatch({ message: `Exported ${transcripts.length} Instagram Reel transcript${transcripts.length === 1 ? "" : "s"} to CSV.` }));
}

// ─── internal ─────────────────────────────────────────────────────────────────

function parseInstagramReelUrls(input) {
  return [...new Set(
    String(input || "").split(/[\n,]+/).flatMap((p) => p.split(/\s+/))
      .map((u) => u.trim()).filter(Boolean)
      // ponytail: accept /reel/, /p/, /tv/ paths — all have audio
      .filter((u) => /^https?:\/\/([^.]+\.)?instagram\.com\//i.test(u))
  )];
}

async function waitForInstagramTranscriptSlot(onWait) {
  const elapsed = Date.now() - lastIgTranscriptStartAt;
  const waitMs = Math.max(0, FB_TRANSCRIPT_MIN_START_INTERVAL_MS - elapsed);
  if (waitMs > 0) { if (onWait) await onWait(waitMs); await sleep(waitMs); }
  lastIgTranscriptStartAt = Date.now();
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
  if ((data.status === "processing" || data.status === "queued" || data.status === "pending") && taskId) return pollTranscript(taskId);
  if (data.status === "error" || data.success === false) throw new Error(data.error || data.message || "Transcription failed.");
  return data;
}

async function pollTranscript(taskId) {
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
  return Boolean(error?.retryable) || message.includes("rate limit") || message.includes("fair usage")
    || message.includes("2 requests per minute") || message.includes("too many requests")
    || message.includes("timeout") || message.includes("timed out")
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

async function downloadTranscript(transcript, saveAs = true) {
  const url = `data:text/plain;charset=utf-8,${encodeURIComponent(`\uFEFF${transcript}`)}`;
  await chrome.downloads.download({ url, filename: `instagram_reels_transcript_${timestamp()}.txt`, saveAs });
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
