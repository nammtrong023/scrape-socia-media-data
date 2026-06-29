(() => {
  const GUARD_VERSION = "fb-v4-debug";
  if (window.__fbCommentInterceptorLoaded === GUARD_VERSION) return;
  window.__fbCommentInterceptorLoaded = GUARD_VERSION;

  // ─── Debug helper ─────────────────────────────────────────────────────────────
  function dbg(msg) {
    const ts = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    window.postMessage({ source: "review-exporter-page", type: "FB_DEBUG", payload: `[${ts}] ${msg}` }, "*");
  }

  dbg("✅ Interceptor loaded (v4-debug)");

  // ─── URL check ────────────────────────────────────────────────────────────────
  function isFbGraphQL(url) {
    try { return String(url).includes("facebook.com/api/graphql"); } catch { return false; }
  }

  // ─── JSON cleanup ─────────────────────────────────────────────────────────────
  function stripPrefix(text) {
    const iB = text.indexOf("{") === -1 ? Infinity : text.indexOf("{");
    const iA = text.indexOf("[") === -1 ? Infinity : text.indexOf("[");
    const start = Math.min(iB, iA);
    return start === Infinity ? "" : text.slice(start);
  }

  // ─── Recursive comment extractor ─────────────────────────────────────────────
  function extractComments(obj, found = [], depth = 0) {
    if (!obj || typeof obj !== "object" || depth > 25) return found;
    if (Array.isArray(obj)) {
      for (const item of obj) extractComments(item, found, depth + 1);
      return found;
    }
    for (const [key, value] of Object.entries(obj)) {
      if (key === "edges" && Array.isArray(value)) {
        for (const edge of value) {
          const node = edge?.node;
          if (!node) continue;
          const text =
            node?.body?.text ||
            node?.message?.text ||
            node?.comment?.body?.text ||
            node?.snippet?.text ||
            node?.body_text?.text ||
            null;
          if (text && String(text).trim().length > 0) {
            const authorName =
              node?.author?.name ||
              node?.commenter?.name ||
              node?.actor?.name ||
              node?.author?.short_name ||
              "Unknown";
            found.push({
              text: String(text).trim(),
              author_name: String(authorName).trim(),
              created_time: node?.created_time ?? null,
              react_count: Number(node?.feedback?.reactors?.count ?? node?.feedback?.reaction_count?.count ?? 0) || 0,
            });
          }
          extractComments(node, found, depth + 1);
        }
      } else if (value && typeof value === "object") {
        extractComments(value, found, depth + 1);
      }
    }
    return found;
  }

  // ─── Process a raw GraphQL body ───────────────────────────────────────────────
  function processRawText(rawText, source) {
    if (!rawText) { dbg(`⚠️ ${source}: empty body`); return; }

    const cleaned = stripPrefix(rawText);
    if (!cleaned) { dbg(`⚠️ ${source}: no JSON found — prefix: "${rawText.slice(0, 80)}"`); return; }

    dbg(`📥 ${source}: body ${rawText.length} chars — start: "${cleaned.slice(0, 120)}"`);

    const allComments = [];
    const lines = cleaned.split(/\r?\n/).filter(Boolean);
    let parsed = 0;

    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith("{") && !t.startsWith("[")) continue;
      try {
        const data = JSON.parse(t);
        const batch = extractComments(data);
        allComments.push(...batch);
        parsed++;
        if (batch.length > 0) dbg(`  ↳ line parse OK → ${batch.length} comments`);
      } catch (e) {
        dbg(`  ↳ line parse FAIL: ${String(e).slice(0, 60)}`);
      }
    }

    // Fallback: whole blob
    if (allComments.length === 0 && parsed === 0) {
      try {
        const data = JSON.parse(cleaned);
        allComments.push(...extractComments(data));
        dbg(`  ↳ whole-blob parse → ${allComments.length} comments`);
      } catch (e) {
        dbg(`  ↳ whole-blob parse FAIL: ${String(e).slice(0, 60)}`);
      }
    }

    if (allComments.length > 0) {
      dbg(`📤 Sending batch: ${allComments.length} comments`);
      window.postMessage({ source: "review-exporter-page", type: "FB_COMMENT_BATCH", payload: allComments }, "*");
    } else {
      dbg(`🔍 No comments found in this response`);
    }
  }

  // ─── Fetch interceptor ────────────────────────────────────────────────────────
  let fetchCount = 0;
  const _origFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await _origFetch.apply(this, args);
    try {
      const url = args[0] instanceof Request ? args[0].url : String(args[0] || "");
      if (isFbGraphQL(url)) {
        fetchCount++;
        dbg(`🌐 fetch #${fetchCount}: ${url.slice(-60)}`);
        response.clone().text().then(t => processRawText(t, `fetch#${fetchCount}`)).catch(e => dbg(`fetch clone err: ${e}`));
      }
    } catch (e) { dbg(`fetch intercept err: ${e}`); }
    return response;
  };

  // ─── XHR interceptor ─────────────────────────────────────────────────────────
  let xhrCount = 0;
  const _OrigXHR = window.XMLHttpRequest;
  function _PatchedXHR() {
    const xhr = new _OrigXHR();
    const _open = xhr.open.bind(xhr);
    let _url = "";
    xhr.open = function (method, url, ...rest) {
      _url = String(url || "");
      return _open(method, url, ...rest);
    };
    xhr.addEventListener("load", function () {
      try {
        if (isFbGraphQL(_url) && xhr.responseText) {
          xhrCount++;
          dbg(`🌐 XHR #${xhrCount}: ${_url.slice(-60)}`);
          processRawText(xhr.responseText, `XHR#${xhrCount}`);
        }
      } catch (e) { dbg(`XHR intercept err: ${e}`); }
    });
    return xhr;
  }
  _PatchedXHR.prototype = _OrigXHR.prototype;
  window.XMLHttpRequest = _PatchedXHR;

  // ─── DOM scraper ──────────────────────────────────────────────────────────────
  function scrapeDOM() {
    const results = [];
    const seen = new Set();
    const articles = document.querySelectorAll('[role="article"]');
    dbg(`🔎 DOM scrape: ${articles.length} articles found`);

    const isReelOrVideo = /\/(reel|reels|watch|video)/i.test(location.href);

    for (const article of articles) {
      const parentArticle = article.parentElement?.closest('[role="article"]');
      
      const ariaLabel = (article.getAttribute("aria-label") || "").toLowerCase();
      const isCommentLabel = 
        ariaLabel.includes("comment") || 
        ariaLabel.includes("reply") || 
        ariaLabel.includes("bình luận") || 
        ariaLabel.includes("phản hồi") ||
        ariaLabel.includes("comentario") ||
        ariaLabel.includes("respuesta") ||
        ariaLabel.includes("commentaire") ||
        ariaLabel.includes("réponse") ||
        ariaLabel.includes("kommentar") ||
        ariaLabel.includes("antwort") ||
        ariaLabel.includes("comentário") ||
        ariaLabel.includes("commento") ||
        ariaLabel.includes("risposta");

      // We keep it if:
      // 1. It is nested (standard comment/reply structure).
      // 2. Its aria-label clearly marks it as a comment/reply.
      // 3. We are on a Reels/Video page (where nesting might be absent) - as a fallback.
      const shouldKeep = parentArticle || isCommentLabel || isReelOrVideo;
      if (!shouldKeep) continue;

      const authorEl = article.querySelector("a[role='link'] span, h2 a span, h3 a span") || 
                       article.querySelector("a[role='link'], a[href], [role='link']");
      const author = authorEl?.textContent?.trim() || "Unknown";

      const textEls = article.querySelectorAll('[dir="auto"]');
      let text = "";
      for (const el of textEls) {
        if (
          el.closest("a") || 
          el.closest('[role="link"]') || 
          el.closest('[role="button"]') || 
          el.closest("button") ||
          el.closest("h2") ||
          el.closest("h3") ||
          el.closest("h4")
        ) {
          continue;
        }
        const t = el.textContent?.trim() || "";
        if (t.length <= 1 || t === author) continue;
        text = t;
        break;
      }
      if (!text) continue;

      const key = `${author}|${text.slice(0, 60)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({ text, author_name: author, created_time: null, react_count: 0 });
    }

    dbg(`🔎 DOM scrape result: ${results.length} comments`);
    if (results.length > 0) {
      window.postMessage({ source: "review-exporter-page", type: "FB_COMMENT_BATCH", payload: results }, "*");
    }
    return results.length;
  }

  // ─── Auto-load "View more comments" ──────────────────────────────────────────
  const CLICK_TEXTS = [
    "view more comments", "xem thêm bình luận",
    "more comments", "view more", "xem thêm",
    "load more", "see more comments", "view previous comments",
    "tải thêm", "hiển thị thêm",
    "view reply", "view replies", "show replies",
    "xem phản hồi", "xem câu trả lời", "hiển thị phản hồi"
  ];
  const SKIP_TEXTS = ["hide", "ẩn", "remove", "xóa", "report", "báo cáo"];

  function findLoadButtons() {
    const out = [];
    const els = document.querySelectorAll("div[role='button'], span[role='button'], a[role='button'], button");
    for (const el of els) {
      const label = (el.textContent || el.getAttribute("aria-label") || "").toLowerCase().trim();
      if (!label) continue;
      if (SKIP_TEXTS.some(s => label.startsWith(s))) continue;

      const isLoadMore = CLICK_TEXTS.some(t => label.includes(t));
      const isLoadReplies = (label.includes("reply") || label.includes("replies") || label.includes("phản hồi") || label.includes("trả lời")) && /\d/.test(label);

      if (isLoadMore || isLoadReplies) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) out.push(el);
      }
    }
    return out;
  }

  let _interval = null;
  let _tick = 0;
  let _noButtonStreak = 0;
  const MAX_TICKS = 120;
  const DONE_STREAK = 6;

  function signalDone() {
    dbg(`⏳ Waiting 2.5s grace period for in-flight responses...`);
    setTimeout(() => {
      dbg(`✅ Sending FB_LOAD_DONE`);
      window.postMessage({ source: "review-exporter-page", type: "FB_LOAD_DONE" }, "*");
    }, 2500);
  }

  function autoLoad() {
    if (_interval) return;
    dbg("▶️ autoLoad started");
    _tick = 0;
    _noButtonStreak = 0;
    _interval = setInterval(() => {
      _tick++;
      const buttons = findLoadButtons();
      if (buttons.length > 0) {
        _noButtonStreak = 0;
        dbg(`🖱️ Tick ${_tick}: clicking ${buttons.length} button(s): "${buttons.map(b => b.textContent?.trim().slice(0, 30)).join(", ")}"`);
        for (const btn of buttons) { try { btn.click(); } catch {} }
      } else {
        _noButtonStreak++;
        if (_tick <= 3 || _noButtonStreak % 3 === 0) {
          dbg(`⏱️ Tick ${_tick}: no buttons (streak ${_noButtonStreak}/${DONE_STREAK})`);
        }
      }
      const naturalEnd = _noButtonStreak >= DONE_STREAK && _tick > 5;
      const maxReached = _tick >= MAX_TICKS;
      if (naturalEnd || maxReached) {
        clearInterval(_interval);
        _interval = null;
        dbg(`🏁 autoLoad ended (${maxReached ? "max ticks" : "no more buttons"}). Final DOM scrape...`);
        scrapeDOM();
        signalDone();
      }
    }, 1200);
  }

  // ─── Listen for start signal ─────────────────────────────────────────────────
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.source !== "review-exporter-bridge") return;
    if (data.type === "FB_START_SCRAPE") {
      dbg("📨 Received FB_START_SCRAPE");
      dbg(`📄 Page URL: ${location.href}`);
      dbg(`🌐 fetch patched: ${window.fetch !== _origFetch ? "YES ✅" : "NO ❌"}`);
      setTimeout(() => { dbg("🔎 Initial DOM scrape (400ms)"); scrapeDOM(); }, 400);
      setTimeout(() => { dbg("🔎 Second DOM scrape (1500ms)"); scrapeDOM(); }, 1500);
      autoLoad();
    }
  });
})();
