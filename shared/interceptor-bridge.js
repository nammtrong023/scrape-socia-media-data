(() => {
  const version = "sidebar-shopee-fb-v1";
  if (window.__reviewExporterBridgeLoaded === version) return;
  window.__reviewExporterBridgeLoaded = version;

  const pending = new Map();

  function postToPage(payload) {
    window.postMessage({ source: "review-exporter-bridge", ...payload }, "*");
  }

  function safeSendMessage(msg) {
    if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.id) return;
    try {
      chrome.runtime.sendMessage(msg).catch(() => {});
    } catch {}
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.source !== "review-exporter-page") return;

    // ── TikTok ────────────────────────────────────────────────────────────────
    if (data.type === "COMMENT_API_RESPONSE") {
      safeSendMessage({
        type: "REVIEW_EXPORTER_COMMENT_API_RESPONSE",
        payload: data.payload,
      });
      return;
    }

    if (data.type === "COLLECT_RESULT") {
      const request = pending.get(data.requestId);
      if (!request) return;
      clearTimeout(request.timer);
      pending.delete(data.requestId);
      request.resolve(data.result);
      return;
    }

    // ── Shopee ────────────────────────────────────────────────────────────────
    if (data.type === "SHOPEE_PROGRESS") {
      safeSendMessage({
        type: "REVIEW_EXPORTER_SHOPEE_PROGRESS",
        payload: data.payload,
      });
      return;
    }

    if (data.type === "SHOPEE_RESULT") {
      const request = pending.get(data.requestId);
      if (!request) return;
      clearTimeout(request.timer);
      pending.delete(data.requestId);
      request.resolve(data.result);
      return;
    }

    // ── Facebook ──────────────────────────────────────────────────────────────
    if (data.type === "FB_COMMENT_BATCH") {
      safeSendMessage({
        type: "REVIEW_EXPORTER_FB_BATCH",
        payload: data.payload,
      });
      return;
    }

    if (data.type === "FB_LOAD_DONE") {
      safeSendMessage({ type: "REVIEW_EXPORTER_FB_DONE" });
      return;
    }

    if (data.type === "FB_DEBUG") {
      safeSendMessage({ type: "REVIEW_EXPORTER_FB_DEBUG", payload: data.payload });
      return;
    }
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const handled = [
      "REVIEW_EXPORTER_COLLECT_COMMENTS",
      "REVIEW_EXPORTER_SHOPEE_SCRAPE",
      "REVIEW_EXPORTER_FB_START_SCRAPE",
    ];
    if (!handled.includes(message.type)) return;

    // Facebook: fire-and-forget — no pending promise needed
    if (message.type === "REVIEW_EXPORTER_FB_START_SCRAPE") {
      postToPage({ type: "FB_START_SCRAPE" });
      sendResponse({ ok: true });
      return;
    }

    const requestId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const timeoutMs = message.timeoutMs || 45000;

    const promise = new Promise((resolve) => {
      const timer = setTimeout(() => {
        pending.delete(requestId);
        resolve({ ok: false, comments: [], reviews: [], message: "Timed out waiting for scraper response." });
      }, timeoutMs);

      pending.set(requestId, { resolve, timer });

      if (message.type === "REVIEW_EXPORTER_COLLECT_COMMENTS") {
        postToPage({
          type: "COLLECT_COMMENTS",
          requestId,
          videoUrl: message.videoUrl,
          maxComments: message.maxComments,
        });
      }

      if (message.type === "REVIEW_EXPORTER_SHOPEE_SCRAPE") {
        postToPage({
          type: "SHOPEE_SCRAPE_START",
          requestId,
        });
      }
    });

    promise.then(sendResponse);
    return true;
  });
})();
