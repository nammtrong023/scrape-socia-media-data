// Page-world script — Saved sorting (counterpart to script_instagram.js and
// explore_sort_instagram.js).
//
// Unlike Profile and Search (which use /graphql/query), the Saved pages fetch
// their data from two REST endpoints (response shape is identical for both):
//
//   All Posts:   /api/v1/feed/saved/posts/
//   Collection:  /api/v1/feed/collection/<collection_id>/posts/
//
// Response shape (verified against captured payloads in
// `Workers/new data/all_posts.js`, `all_posts_scroll.js`,
// `collection_posts.js`):
//
//     {
//       num_results: 21,
//       more_available: true | false,
//       next_max_id: "<cursor>",
//       items: [
//         { media: { pk, code, taken_at, media_type, like_count,
//                    comment_count, play_count, user: { username, ... },
//                    caption: { text, ... } | null, ... } },
//         ...
//       ],
//       status: "ok"
//     }
//
// Field notes vs the GraphQL flow:
//   - Items are flat (`items[].media`) — no edges, no explore_story
//     pollution to filter out.
//   - View count for reels lives on `play_count` (not `view_count`).
//   - Pagination uses `more_available` (boolean), not `page_info.has_next_page`.
//
// Gated on `sessionStorage.sortFeedSurface === "saved"` so it stays dormant
// during Profile or Search sorts.

const SF_SAVED_DEBUG = false;

// Matches either of IG's two Saved REST endpoints:
//   /api/v1/feed/saved/posts/                          ← All Posts
//   /api/v1/feed/collection/<numeric_id>/posts/        ← a specific collection
function sfSavedIsSavedUrl(url) {
  if (!url) return false;
  return (
    url.includes("/api/v1/feed/saved/posts/") ||
    /\/api\/v1\/feed\/collection\/\d+\/posts\//.test(url)
  );
}

const sfSavedMemory = {
  items: [],
};

function sfSavedSaveLocally(meta) {
  // Dedupe by post pk. Collection endpoints have been observed returning the
  // same item across adjacent pages (and the initial /api/v1/feed/collection/
  // request occasionally arrives twice during page hydration). Without this
  // guard the sorted grid renders duplicate tiles. Cheap O(n) check — saved
  // batches are small enough that this is fine.
  if (meta.postID != null) {
    const dup = sfSavedMemory.items.some((m) => m.postID === meta.postID);
    if (dup) {
      if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] saveLocally — DUPLICATE pk", meta.postID, "code", meta.code, "— skipping");
      return sfSavedMemory.items;
    }
  }
  sfSavedMemory.items.push(meta);
  return sfSavedMemory.items;
}

// Convert one media item into the shared metadata shape used by every renderer
// / exporter. Field names match the Profile / Search flows so downstream
// helpers need no surface-specific code.
function sfSavedCreateMetadata(item) {
  const ts = item?.taken_at ? item.taken_at * 1000 : null;
  // REST endpoint uses `play_count` for reels; GraphQL used `view_count`.
  // Coalesce both for safety so any downstream code that reads viewCount
  // gets a value regardless of which field IG populates.
  const views = item?.play_count ?? item?.view_count ?? null;
  return {
    createDate: ts ? new Date(ts).toISOString() : "",
    code: item?.code || "",
    commentsCount: item?.comment_count ?? null,
    likesCount: item?.like_count ?? null,
    mediaType: item?.media_type ?? null,
    viewCount: views,
    userName: item?.user?.username || "",
    caption: item?.caption?.text || "",
    postID: item?.pk ?? null,
  };
}

// Walk the items array and pluck media. The /api/v1/feed/saved/posts/
// endpoint only returns real saved posts — there's no explore_story
// interleaving to filter out, unlike the GraphQL timeline endpoint.
function sfSavedFlattenItems(response) {
  const items = response?.items || [];
  const out = [];
  let invalidCount = 0;
  for (const it of items) {
    const media = it?.media;
    if (!media || !media.pk || !media.code) {
      invalidCount++;
      continue;
    }
    out.push(media);
  }
  if (SF_SAVED_DEBUG) {
    console.log(
      "[SortFeed][saved] flattenItems — total items:", items.length,
      "valid media:", out.length,
      "invalid (filtered):", invalidCount,
    );
  }
  return out;
}

// Find the rendered tile in the saved grid for a given shortcode. Same pattern
// as the explore flow (`sfExploreFindElement`) — saved media loads lazily, so
// we scroll the anchor into view and poll for a real image (not the data: URI
// placeholder) before handing the element back.
function sfSavedFindElement(code, retries = 30, interval = 100) {
  const startedAt = Date.now();
  return new Promise((resolve) => {
    const tryFind = (attemptsLeft) => {
      const anchor =
        document.querySelector(`a[href="/p/${code}/"]`) ||
        document.querySelector(`a[href*="/p/${code}/"]`);
      if (anchor) {
        const parentDiv = anchor.closest("div");
        parentDiv?.scrollIntoView({ behavior: "auto", block: "center" });

        const isRealUrl = (u) => u && !u.startsWith("data:image/gif");
        const hasVisualMedia = () => {
          const img = parentDiv?.querySelector("img[src]");
          const imgUrl = img?.getAttribute("src") || "";
          const bgDiv = parentDiv?.querySelector('[style*="background-image"]');
          const bgUrl =
            bgDiv?.style?.backgroundImage?.match(/url\(["']?(.*?)["']?\)/)?.[1] || "";
          return isRealUrl(imgUrl) || isRealUrl(bgUrl);
        };

        const checkMediaLoaded = () => {
          if (hasVisualMedia()) {
            if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] findElement", code, "→ FOUND with media in", Date.now() - startedAt, "ms");
            resolve(parentDiv);
          } else if (retries-- > 0) {
            setTimeout(checkMediaLoaded, interval);
          } else {
            if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] findElement", code, "→ FOUND but media never loaded after", Date.now() - startedAt, "ms");
            resolve(parentDiv);
          }
        };

        if (hasVisualMedia()) {
          if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] findElement", code, "→ FOUND immediately in", Date.now() - startedAt, "ms");
          resolve(parentDiv);
        } else {
          setTimeout(checkMediaLoaded, 200);
        }
      } else if (attemptsLeft > 0) {
        setTimeout(() => tryFind(attemptsLeft - 1), interval);
      } else {
        if (SF_SAVED_DEBUG) console.warn("[SortFeed][saved] findElement", code, "→ NOT FOUND after", Date.now() - startedAt, "ms (no anchor in DOM)");
        resolve(null);
      }
    };
    tryFind(retries);
  });
}

// Saved feed ordering note: IG returns saved items in "most recently saved
// first" order, NOT chronologically by post date. So "oldest" must sort by
// `taken_at` rather than reversing the input.
function sfSavedSortItems(data, sortBy) {
  if (sortBy === "likes") {
    return [...data].sort((a, b) => (b.likesCount ?? 0) - (a.likesCount ?? 0));
  }
  if (sortBy === "comments") {
    return [...data].sort((a, b) => (b.commentsCount ?? 0) - (a.commentsCount ?? 0));
  }
  if (sortBy === "oldest") {
    return [...data].sort((a, b) => {
      const ta = a.createDate ? Date.parse(a.createDate) : 0;
      const tb = b.createDate ? Date.parse(b.createDate) : 0;
      return ta - tb;
    });
  }
  // 'views' is blocked upstream; defensive return.
  return data;
}

function sfSavedReadTarget() {
  const raw = sessionStorage.getItem("sortFeedNoItems") || "";
  // Saved allows "all_reels" (unlike Search) — saved collections are finite.
  // Defensive cap keeps memory bounded if a list is unexpectedly huge.
  if (raw === "all_reels") return 10000;
  const n = parseInt(raw.replace("_reels", ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 25;
}

function sfSavedNotifyBanner(count) {
  window.postMessage(
    { insta_banner_notification: true, count: count, type: "Posts" },
    "*",
  );
}

function sfSavedNotifyCollected(count) {
  window.postMessage(
    { item_collected_no: true, number_items: count },
    "*",
  );
}

function sfSavedRemoveBannerAndOverlay() {
  window.postMessage({ insta_banner_notification_remove: true }, "*");
}

function sfSavedFinishSort() {
  sessionStorage.removeItem("sortFeedStopSorting");
  sessionStorage.removeItem("sortFeedStatus");
}

// Process one /api/v1/feed/saved/posts/ response. Accumulates into
// `sfSavedMemory` and resolves with the final array when the target is
// reached, the user clicks Stop, or `more_available` is false. Otherwise
// no-ops (returns null) and waits for the next response.
async function sfSavedProcessBatch(response, moreAvailable, target) {
  const flatItems = sfSavedFlattenItems(response);
  if (SF_SAVED_DEBUG) {
    console.log(
      "[SortFeed][saved] processBatch START — flat items:", flatItems.length,
      "more_available:", moreAvailable, "target:", target,
      "running total before batch:", sfSavedMemory.items.length,
    );
  }

  for (let i = 0; i < flatItems.length; i++) {
    if (!sessionStorage.getItem("sortFeedStatus")) {
      if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] processBatch — sortFeedStatus cleared, bailing");
      return sfSavedMemory.items;
    }

    if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] processBatch — iter", i, "/", flatItems.length - 1, "code:", flatItems[i]?.code);
    const meta = sfSavedCreateMetadata(flatItems[i]);
    const element = await sfSavedFindElement(meta.code);
    meta.element = element?.outerHTML;
    const items = sfSavedSaveLocally(meta);

    sfSavedNotifyCollected(items.length);
    sfSavedNotifyBanner(items.length);
    if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] processBatch — after iter", i, "running total:", items.length);

    if (sessionStorage.getItem("sortFeedStopSorting") === "on") {
      if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] processBatch — user clicked Stop, finalizing");
      sfSavedFinishSort();
      return items;
    }

    if (items.length >= target) {
      if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] processBatch — hit target", target, ", finalizing");
      sfSavedFinishSort();
      return items;
    }

    if (i === flatItems.length - 1 && !moreAvailable) {
      if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] processBatch — end of batch, no more pages, finalizing with", items.length, "items");
      sfSavedFinishSort();
      return items;
    }
  }

  // Still expecting more pages — nudge IG's IntersectionObserver by scrolling
  // the last rendered anchor into view. When a batch's items aren't yet in
  // the DOM (common on Saved — IG sends metadata faster than it renders
  // thumbnails), nothing triggers IG to fetch the next page and we deadlock.
  sfSavedNudgeLoadMore();

  if (SF_SAVED_DEBUG) {
    console.log(
      "[SortFeed][saved] processBatch END — batch consumed but more pages expected.",
      "Running total:", sfSavedMemory.items.length, "/ target", target,
      ". Nudged scroll to last rendered anchor. WAITING for next response.",
    );
  }
  return null;
}

// Trigger IG's natural pagination by scrolling the last rendered post anchor
// into view. Safe no-op if nothing is rendered yet.
function sfSavedNudgeLoadMore() {
  const anchors = document.querySelectorAll('main a[href^="/p/"]');
  const last = anchors[anchors.length - 1];
  if (!last) {
    if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] nudgeLoadMore — no anchors in <main> yet, skipping");
    return;
  }
  const parentDiv = last.closest("div") || last;
  parentDiv.scrollIntoView({ behavior: "auto", block: "end" });
  if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] nudgeLoadMore — scrolled to last anchor:", last.getAttribute("href"));
}

// Shared handler — same parse + dispatch logic used by both XHR and fetch
// wraps. Side-effects: batches into sfSavedMemory and posts a sorted payload
// out via window.postMessage when the sort finalizes.
function sfSavedHandleResponse(responseText, urlForLog, source) {
  if (sessionStorage.getItem("sortFeedSurface") !== "saved") return;
  if (!sessionStorage.getItem("sortFeedStatus")) return;

  let jsonResponse;
  try {
    jsonResponse = JSON.parse(responseText);
  } catch (e) {
    if (SF_SAVED_DEBUG) console.warn("[SortFeed][saved]", source, "— JSON.parse failed:", e);
    return;
  }

  // Sanity check — the saved endpoint always returns an `items` array.
  if (!Array.isArray(jsonResponse?.items)) {
    if (SF_SAVED_DEBUG) {
      const keys = jsonResponse ? Object.keys(jsonResponse).slice(0, 10) : [];
      console.log("[SortFeed][saved]", source, "— response has no items array. top-level keys:", keys);
    }
    return;
  }

  const moreAvailable = !!jsonResponse.more_available;
  const target = sfSavedReadTarget();

  if (SF_SAVED_DEBUG) {
    console.log(
      "[SortFeed][saved]", source, "— /api/v1/feed/saved/posts/ response received.",
      "num_results:", jsonResponse.num_results,
      "more_available:", moreAvailable,
      "target:", target,
    );
  }

  sfSavedProcessBatch(jsonResponse, moreAvailable, target).then((items) => {
    if (!items) return; // batch consumed, waiting for next response

    const sortBy = sessionStorage.getItem("sortFeedSortBy");
    const sorted = sfSavedSortItems(items, sortBy);

    if (SF_SAVED_DEBUG) {
      console.log(
        "[SortFeed][saved] sort complete —",
        sorted.length, "items, sorted by", sortBy,
        ". Posting to renderer.",
      );
    }

    sfSavedRemoveBannerAndOverlay();

    window.postMessage(
      {
        logo_animate_off: true,
        payload: sorted,
        sf_surface: "saved",
      },
      "*",
    );
  }).catch((e) => {
    if (SF_SAVED_DEBUG) console.error("[SortFeed][saved] processBatch threw:", e);
  });
}

// XHR wrap — catches the case where IG still uses XMLHttpRequest for the
// saved endpoint.
(function () {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    this._sfSavedUrl = url;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    this.addEventListener("load", function () {
      if (sessionStorage.getItem("sortFeedSurface") !== "saved") return;
      if (!sessionStorage.getItem("sortFeedStatus")) return;
      if (!sfSavedIsSavedUrl(this._sfSavedUrl)) return;
      if (this.responseType !== "" && this.responseType !== "text") return;

      if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] XHR load — saved/collection endpoint response received:", this._sfSavedUrl);
      sfSavedHandleResponse(this.responseText, this._sfSavedUrl, "XHR");
    });
    return originalSend.apply(this, arguments);
  };
})();

// Fetch wrap — modern IG code paths use fetch() for REST endpoints. The
// saved page in particular fires its data via fetch(), so this is the
// primary capture path. We clone the response so the original consumer still
// gets to read the body uninterrupted.
(function () {
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    const fetchPromise = originalFetch.apply(this, args);

    // Cheap pre-filter — skip the clone+text cost when the URL isn't ours.
    const url = typeof args[0] === "string" ? args[0] : (args[0]?.url || "");
    if (!sfSavedIsSavedUrl(url)) return fetchPromise;

    fetchPromise.then((response) => {
      if (sessionStorage.getItem("sortFeedSurface") !== "saved") return;
      if (!sessionStorage.getItem("sortFeedStatus")) return;
      try {
        const clone = response.clone();
        clone.text().then((text) => {
          if (SF_SAVED_DEBUG) console.log("[SortFeed][saved] fetch resolved — saved/collection endpoint response received:", url);
          sfSavedHandleResponse(text, url, "fetch");
        }).catch(() => {});
      } catch (e) {
        if (SF_SAVED_DEBUG) console.warn("[SortFeed][saved] fetch — clone/text failed:", e);
      }
    }).catch(() => {});

    return fetchPromise;
  };
})();
