import { getState, saveState, namespacePatch, publicState, sleep, defaultState } from "./state.js";

const MAX_COMMENTS_PER_VIDEO = 200;
const COMMENT_REQUEST_TIMEOUT_MS = 45000;

let batchRunning = false;
let managedTabId = null;
let mergeQueue = Promise.resolve();

export const tiktok = {
  startBatch,
  resumeBatch,
  pauseBatch,
  clearState: clearTikTokState,
  exportXlsx,
  exportCsv,
  mergeObservedResponse,
};

// ─── public handlers ─────────────────────────────────────────────────────────

async function startBatch(urlInput) {
  const current = await getState();
  if (current.status === "running" && batchRunning) return publicState(current);

  const urls = parseUrls(urlInput);
  if (!urls.length) {
    return publicState(await saveState({ status: "idle", message: "No valid TikTok video URLs found." }));
  }

  const state = await saveState({
    urls, currentIndex: 0, comments: [], status: "running",
    currentVideoUrl: "", perVideoCounts: {}, failures: [], message: "Starting batch...",
  });
  runBatchFromCurrent();
  return publicState(state);
}

async function resumeBatch() {
  const state = await getState();
  if (!state.urls.length) return publicState(await saveState({ message: "No saved queue to resume." }));
  if (state.currentIndex >= state.urls.length) return publicState(await saveState({ status: "done" }));
  const runningState = await saveState({ status: "running", message: "Resuming batch..." });
  runBatchFromCurrent();
  return publicState(runningState);
}

async function pauseBatch() {
  return publicState(await saveState({ status: "paused", message: "Paused. Resume to continue this queue." }));
}

async function clearTikTokState() {
  const state = await getState();
  const STORAGE_KEY = "reviewExporterState";
  await chrome.storage.local.set({
    [STORAGE_KEY]: { ...defaultState, shopee: state.shopee, facebook: state.facebook, lastUpdated: Date.now() },
  });
  await chrome.action.setBadgeText({ text: "" });
  return publicState(await getState());
}

async function exportXlsx() {
  const state = await getState();
  if (!state.comments.length) {
    return publicState(await saveState({ message: "No comments captured yet." }));
  }
  return publicState(await saveState({
    message: `Ready to export ${state.comments.length} comments. Use Export XLSX in the side panel.`,
  }));
}

async function exportCsv() {
  const state = await getState();
  if (!state.comments.length) {
    return publicState(await saveState({ message: "No comments captured yet." }));
  }
  const headers = ["video_url", "comment_text", "username", "like_count"];
  const rows = [headers.join(","), ...state.comments.map((item) => headers.map((h) => csvEscape(item[h])).join(","))];
  const url = `data:text/csv;charset=utf-8,${encodeURIComponent(`\uFEFF${rows.join("\n")}`)}`;
  await chrome.downloads.download({ url, filename: `tiktok_comments_batch_${timestamp()}.csv`, saveAs: true });
  return publicState(await saveState({ message: `Exported ${state.comments.length} comments to CSV.` }));
}

async function mergeObservedResponse(payload) {
  const state = await getState();
  if (state.status !== "running" || !state.currentVideoUrl) return;
  mergeQueue = mergeQueue.then(() => mergeComments(state.currentVideoUrl, payload?.comments || []));
  return mergeQueue;
}

// ─── internal ─────────────────────────────────────────────────────────────────

function parseUrls(input) {
  return [...new Set(
    String(input || "").split(/[\n,]+/).flatMap((p) => p.split(/\s+/))
      .map((u) => u.trim()).filter(Boolean)
      .filter((u) => /^https?:\/\/([^.]+\.)?tiktok\.com\//i.test(u))
  )];
}

function normalizeComment(text) { return String(text || "").replace(/\s+/g, " ").trim().toLowerCase(); }

function dedupeKey(item) {
  return [item.video_url || "", normalizeComment(item.comment_text), normalizeComment(item.username)].join("|");
}

async function mergeComments(videoUrl, incoming) {
  const state = await getState();
  const seen = new Set(state.comments.map(dedupeKey));
  const nextComments = [...state.comments];
  let added = 0;
  for (const item of incoming || []) {
    const row = {
      video_url: item.video_url || videoUrl,
      comment_text: String(item.comment_text || "").trim(),
      username: String(item.username || "").trim(),
      like_count: item.like_count ?? "",
    };
    const key = dedupeKey(row);
    if (!row.comment_text || seen.has(key)) continue;
    seen.add(key);
    nextComments.push(row);
    added++;
  }
  await saveState({
    comments: nextComments,
    perVideoCounts: { ...state.perVideoCounts, [videoUrl]: (state.perVideoCounts[videoUrl] || 0) + added },
    message: `Video ${state.currentIndex + 1}/${state.urls.length} - ${added} new comments.`,
  });
}

async function runBatchFromCurrent() {
  if (batchRunning) return;
  batchRunning = true;
  try {
    let state = await getState();
    const tabId = await getOrCreateBatchTab(state.urls[state.currentIndex] || "https://www.tiktok.com/");
    while (state.status === "running" && state.currentIndex < state.urls.length) {
      const videoUrl = state.urls[state.currentIndex];
      state = await saveState({ currentVideoUrl: videoUrl, message: `Opening video ${state.currentIndex + 1}/${state.urls.length}...` });
      try {
        await chrome.tabs.update(tabId, { url: videoUrl, active: true });
        await chrome.tabs.update(tabId, { muted: true });
        await waitForTabComplete(tabId);
        await sleep(1200);
        await muteTab(tabId);
        await injectInterceptors(tabId);
        state = await saveState({ message: `Collecting video ${state.currentIndex + 1}/${state.urls.length}...` });
        const result = await chrome.tabs.sendMessage(tabId, {
          type: "REVIEW_EXPORTER_COLLECT_COMMENTS",
          videoUrl,
          maxComments: MAX_COMMENTS_PER_VIDEO,
          timeoutMs: COMMENT_REQUEST_TIMEOUT_MS,
        });
        if (!result?.ok) throw new Error(result?.message || "Comment API collection failed.");
        mergeQueue = mergeQueue.then(() => mergeComments(videoUrl, result.comments));
        await mergeQueue;
      } catch (error) {
        const latest = await getState();
        await saveState({
          failures: [...latest.failures, { url: videoUrl, message: error.message }],
          message: `Skipped video ${latest.currentIndex + 1}/${latest.urls.length}: ${error.message}`,
        });
      }
      state = await getState();
      if (state.status !== "running") break;
      await saveState({ currentIndex: state.currentIndex + 1 });
      await sleep(1000 + Math.random() * 900);
      state = await getState();
    }
    state = await getState();
    if (state.status === "running") {
      await saveState({ status: "done", currentIndex: state.urls.length, currentVideoUrl: "", message: `Done. Captured ${state.comments.length} comments.` });
    }
  } catch (error) {
    await saveState({ status: "error", message: `Batch failed: ${error.message}` });
  } finally {
    batchRunning = false;
  }
}

async function getOrCreateBatchTab(url) {
  if (managedTabId) {
    try { await chrome.tabs.get(managedTabId); return managedTabId; } catch { managedTabId = null; }
  }
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab?.id && !/^chrome:|^edge:|^about:/i.test(activeTab.url || "")) {
    managedTabId = activeTab.id;
    return managedTabId;
  }
  const tab = await chrome.tabs.create({ url, active: true });
  await chrome.tabs.update(tab.id, { muted: true });
  managedTabId = tab.id;
  return managedTabId;
}

async function waitForTabComplete(tabId, timeoutMs = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const tab = await chrome.tabs.get(tabId);
    if (tab.status === "complete") return tab;
    await sleep(300);
  }
  throw new Error("Timed out waiting for TikTok page load.");
}

async function muteTab(tabId) {
  await chrome.tabs.update(tabId, { muted: true });
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => { document.querySelectorAll("video, audio").forEach((el) => { el.muted = true; el.volume = 0; }); },
    world: "MAIN",
  });
}

async function injectInterceptors(tabId) {
  await chrome.scripting.executeScript({ target: { tabId }, files: ["shared/interceptor-bridge.js"], world: "ISOLATED" });
  await chrome.scripting.executeScript({ target: { tabId }, files: ["platforms/tiktok/page-interceptor.js"], world: "MAIN" });
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
