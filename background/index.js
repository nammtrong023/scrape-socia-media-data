import { getState, saveState, publicState, defaultState } from "./state.js";
import { tiktok } from "./tiktok.js";
import { shopee } from "./shopee.js";
import { facebook } from "./facebook.js";
import { instagram } from "./instagram.js";

// ─── Lifecycle ────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async () => {
  const state = await getState();
  if (!state.lastUpdated) await saveState({});
});

chrome.action.onClicked.addListener((tab) => {
  if (tab?.windowId !== undefined) {
    try { Promise.resolve(chrome.sidePanel.open({ windowId: tab.windowId })).catch(() => {}); } catch {}
  }
});

// ─── Message router ───────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const respond = (promise) => {
    promise.then(sendResponse).catch(async (error) => {
      sendResponse(publicState(await saveState({ status: "error", message: error.message })));
    });
    return true;
  };

  // State
  if (message.type === "REVIEW_EXPORTER_GET_STATE") {
    return respond(getDisplayState().then(publicState));
  }

  // TikTok
  if (message.type === "REVIEW_EXPORTER_START_BATCH")        return respond(tiktok.startBatch(message.urls));
  if (message.type === "REVIEW_EXPORTER_RESUME_BATCH")       return respond(tiktok.resumeBatch());
  if (message.type === "REVIEW_EXPORTER_PAUSE_BATCH")        return respond(tiktok.pauseBatch());
  if (message.type === "REVIEW_EXPORTER_CLEAR_STATE")        return respond(tiktok.clearState());
  if (message.type === "REVIEW_EXPORTER_EXPORT_XLSX")        return respond(tiktok.exportXlsx());
  if (message.type === "REVIEW_EXPORTER_EXPORT_CSV")         return respond(tiktok.exportCsv());
  if (message.type === "REVIEW_EXPORTER_COMMENT_API_RESPONSE") {
    tiktok.mergeObservedResponse(message.payload).catch(() => {});
    return;
  }

  // Shopee
  if (message.type === "REVIEW_EXPORTER_SHOPEE_SCRAPE")      return respond(shopee.runScrape(message.tabId));
  if (message.type === "REVIEW_EXPORTER_CLEAR_SHOPEE")       return respond(shopee.clearState());
  if (message.type === "REVIEW_EXPORTER_EXPORT_SHOPEE_XLSX") return respond(shopee.exportXlsx());
  if (message.type === "REVIEW_EXPORTER_EXPORT_SHOPEE_CSV")  return respond(shopee.exportCsv());
  if (message.type === "REVIEW_EXPORTER_SHOPEE_PROGRESS") {
    shopee.updateProgress(message.payload).catch(() => {});
    return;
  }

  // Facebook
  if (message.type === "REVIEW_EXPORTER_FB_SCRAPE")          return respond(facebook.runScrape(message.tabId));
  if (message.type === "REVIEW_EXPORTER_FB_CLEAR")           return respond(facebook.clearState());
  if (message.type === "REVIEW_EXPORTER_FB_EXPORT_XLSX")     return respond(facebook.exportXlsx());
  if (message.type === "REVIEW_EXPORTER_FB_EXPORT_CSV")      return respond(facebook.exportCsv());
  if (message.type === "REVIEW_EXPORTER_FB_TRANSCRIPT_BATCH") return respond(facebook.runTranscriptBatch(message.urls));
  if (message.type === "REVIEW_EXPORTER_FB_EXPORT_SRT")      return respond(facebook.exportSrt());
  if (message.type === "REVIEW_EXPORTER_FB_BATCH") { facebook.mergeBatch(message.payload).catch(() => {}); return; }
  if (message.type === "REVIEW_EXPORTER_FB_DONE")  { facebook.handleDone(); return; }
  if (message.type === "REVIEW_EXPORTER_FB_DEBUG") { facebook.dbgLog(message.payload).catch(() => {}); return; }

  // Instagram
  if (message.type === "REVIEW_EXPORTER_IG_TRANSCRIPT_BATCH") return respond(instagram.runTranscriptBatch(message.urls));
  if (message.type === "REVIEW_EXPORTER_IG_EXPORT_SRT")       return respond(instagram.exportSrt());
  if (message.type === "REVIEW_EXPORTER_IG_CLEAR")            return respond(instagram.clearState());
  if (message.type === "REVIEW_EXPORTER_IG_EXPORT_XLSX")      return respond(instagram.exportXlsx());
  if (message.type === "REVIEW_EXPORTER_IG_EXPORT_CSV")       return respond(instagram.exportCsv());

  if (message.type === "OPEN_COBALT_FB_REEL") {
    openCobaltForFacebookReel(message.videoId).catch(() => {});
    return;
  }
});

// ─── internal ─────────────────────────────────────────────────────────────────

async function getDisplayState() {
  const state = await getState();
  // ponytail: reset stale "running" status after service worker restart
  if (state.status === "running") {
    return saveState({ status: "paused", message: "Batch paused after background idle. Resume to continue." });
  }
  return state;
}

async function openCobaltForFacebookReel(videoId) {
  if (!videoId) return;
  const tab = await chrome.tabs.create({ url: "https://cobalt.tools" });
  const reelUrl = `https://www.facebook.com/reel/${videoId}`;

  chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
    if (tabId !== tab.id || info.status !== "complete") return;
    chrome.tabs.onUpdated.removeListener(listener);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (url) => {
        const input = document.querySelector('input[placeholder*="link"]');
        if (!input) return;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        setter.call(input, url);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        document.querySelector('button[type="submit"]')?.click();
      },
      args: [reelUrl],
    }).catch(() => {});
  });
}
