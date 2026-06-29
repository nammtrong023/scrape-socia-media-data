(() => {
  const version = "sidebar-shopee-v1";
  if (window.__reviewExporterPageInterceptorLoaded === version) return;
  window.__reviewExporterPageInterceptorLoaded = version;

  const COMMENT_PATH = "/api/comment/list/";

  function emit(type, payload) {
    window.postMessage({ source: "review-exporter-page", type, payload }, "*");
  }

  function normalize(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function isCommentUrl(url) {
    try {
      return new URL(String(url), location.href).pathname === COMMENT_PATH;
    } catch {
      return false;
    }
  }

  function getAwemeId(videoUrl = location.href) {
    const fromUrl = String(videoUrl).match(/\/video\/(\d+)/)?.[1];
    if (fromUrl) return fromUrl;

    const canonical = document.querySelector('link[rel="canonical"]')?.href || "";
    return canonical.match(/\/video\/(\d+)/)?.[1] || "";
  }

  function parseComment(item, videoUrl) {
    const user = item.user || {};
    return {
      video_url: videoUrl,
      comment_text: normalize(item.text || item.comment || item.share_info?.desc),
      username: normalize(user.unique_id || user.nickname || item.user_name || item.nickname),
      like_count: item.digg_count ?? item.like_count ?? "",
    };
  }

  function parseCommentResponse(data, requestUrl, videoUrl = location.href) {
    const url = new URL(String(requestUrl), location.href);
    const comments = Array.isArray(data?.comments)
      ? data.comments.map((item) => parseComment(item, videoUrl)).filter((item) => item.comment_text)
      : [];

    return {
      aweme_id: data?.aweme_id || url.searchParams.get("aweme_id") || getAwemeId(videoUrl),
      cursor: data?.cursor ?? url.searchParams.get("cursor") ?? "0",
      has_more: Number(data?.has_more || 0),
      comments,
    };
  }

  const originalFetch = window.fetch;
  window.fetch = async function reviewExporterFetch(input, init) {
    const requestUrl = typeof input === "string" ? input : input?.url;
    const response = await originalFetch.apply(this, arguments);

    if (isCommentUrl(requestUrl)) {
      response.clone().json().then((data) => {
        emit("COMMENT_API_RESPONSE", parseCommentResponse(data, requestUrl));
      }).catch(() => {});
    }

    return response;
  };

  const OriginalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function ReviewExporterXHR() {
    const xhr = new OriginalXHR();
    let requestUrl = "";

    const originalOpen = xhr.open;
    xhr.open = function open(method, url) {
      requestUrl = url;
      return originalOpen.apply(xhr, arguments);
    };

    xhr.addEventListener("load", () => {
      if (!isCommentUrl(requestUrl)) return;
      try {
        emit("COMMENT_API_RESPONSE", parseCommentResponse(JSON.parse(xhr.responseText), requestUrl));
      } catch {}
    });

    return xhr;
  };

  async function collectComments({ videoUrl, maxComments }) {
    const awemeId = getAwemeId(videoUrl);
    if (!awemeId) {
      return { ok: false, comments: [], message: "Could not parse TikTok video id from URL." };
    }

    const comments = [];
    let cursor = "0";
    let hasMore = 1;
    const started = Date.now();
    const max = Number(maxComments) || 200;

    while (hasMore && comments.length < max && Date.now() - started < 30000) {
      const count = Math.min(20, max - comments.length);
      const url = new URL(COMMENT_PATH, location.origin);
      url.searchParams.set("aweme_id", awemeId);
      url.searchParams.set("count", String(count));
      url.searchParams.set("cursor", String(cursor));
      url.searchParams.set("aid", "1988");
      url.searchParams.set("app_name", "tiktok_web");
      url.searchParams.set("app_language", navigator.language || "en");
      url.searchParams.set("browser_language", navigator.language || "en");

      const response = await originalFetch(url.toString(), {
        method: "GET",
        credentials: "include",
        headers: { accept: "application/json, text/plain, */*" },
      });

      if (!response.ok) {
        return { ok: false, comments, message: `TikTok comment API returned ${response.status}.` };
      }

      const data = await response.json();
      const parsed = parseCommentResponse(data, url.toString(), videoUrl);
      emit("COMMENT_API_RESPONSE", parsed);

      comments.push(...parsed.comments);
      hasMore = parsed.has_more;
      cursor = parsed.cursor;

      if (!parsed.comments.length && !hasMore) break;
      await new Promise((resolve) => setTimeout(resolve, 450 + Math.random() * 450));
    }

    return {
      ok: true,
      aweme_id: awemeId,
      comments: comments.slice(0, max),
      has_more: hasMore,
      cursor,
      message: `Captured ${comments.length} comments.`,
    };
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.source !== "review-exporter-bridge" || data.type !== "COLLECT_COMMENTS") return;

    collectComments(data)
      .then((result) => {
        window.postMessage({
          source: "review-exporter-page",
          type: "COLLECT_RESULT",
          requestId: data.requestId,
          result,
        }, "*");
      })
      .catch((error) => {
        window.postMessage({
          source: "review-exporter-page",
          type: "COLLECT_RESULT",
          requestId: data.requestId,
          result: { ok: false, comments: [], message: error.message },
        }, "*");
      });
  });
})();
