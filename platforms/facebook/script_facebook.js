// Page world (MAIN world) — injected by Facebook/inject_facebook_script.js.
// Wraps fetch/XHR to intercept FB's profile-reels GraphQL @defer stream, then
// reconstructs the reels (merging deferred chunks) and auto-scrolls to paginate.
// Mirrors Instagram/script_instagram.js. See Docs/Sort Logic/FB_Profile_Reels_Sort_Plan.md.
//
// PHASE 4 scope: COLLECT only — logs the raw reconstructed reels. parseReduced
// (Views/Shares) is Phase 5; the final {VideoID,…} object + sort is Phase 6.

(() => {
  // Dev logging only — set false before shipping.
  const SF_FB_DEBUG = false;

  // Guard against a double-inject in the same page load.
  if (window.__sfFbInstalled) return;
  window.__sfFbInstalled = true;

  if (SF_FB_DEBUG) console.log("[SF][FB] script_facebook.js loaded (page world)");

  // ──────────────────────────────────────────────────────────────────────────
  // State
  // ──────────────────────────────────────────────────────────────────────────
  const reelsById = new Map();    // id -> raw reel record (insertion order = API order, latest first)
  let lastHasNextPage = null;     // page_info.has_next_page from the most recent page
  let sawAnyShortsResponse = false;
  let collected = false;          // collect() runs once per load
  let handedOff = false;          // once render/remove is posted, stop ingesting + notifying so
                                  // late in-flight responses don't re-open the progress banner
  let dateModeRange = null;       // [startMs, endMs] when sorting by date range; null in items mode

  // One-shot sort flag: capture it for THIS page load, then clear it immediately so
  // a plain refresh (no sort click) does NOT re-trigger collection. The interceptor
  // and boot both gate on this in-memory boolean, not the (now-cleared) sessionStorage.
  const SORT_ACTIVE = sessionStorage.getItem("sortFeedStatusFacebook") === "on";
  if (SORT_ACTIVE) sessionStorage.removeItem("sortFeedStatusFacebook");

  // ──────────────────────────────────────────────────────────────────────────
  // Reconstruction (research doc §3.3) — exact field keys + null traps
  // ──────────────────────────────────────────────────────────────────────────
  const TARGET_KEYS = new Set([
    "permalink_url", "creation_time", "play_count_reduced",
    "share_count_reduced", "total_comment_count", "unified_reactors", "message", "owner",
    "preferred_thumbnail", "thumbnailImage",   // Phase 7.1 — tile thumbnail for render
  ]);

  // Recursively collect the FIRST useful (non-null) occurrence of each target key.
  function collectFields(node, acc) {
    if (node == null || typeof node !== "object") return;
    if (Array.isArray(node)) { for (const x of node) collectFields(x, acc); return; }
    for (const [k, v] of Object.entries(node)) {
      if (TARGET_KEYS.has(k)) {
        if (k === "unified_reactors") {
          if (v && v.count != null && acc.likes == null) acc.likes = v.count;          // exact likes
        } else if (k === "message") {
          if (v && v.text && acc.caption == null) acc.caption = v.text;                // caption
        } else if (k === "owner") {
          if (v && v.name && acc.profileName == null) acc.profileName = v.name;        // creator / profile name
        } else if (k === "preferred_thumbnail") {
          if (v && v.image && v.image.uri && acc.preferredThumb == null) acc.preferredThumb = v.image.uri; // best thumb
        } else if (k === "thumbnailImage") {
          if (v && v.uri && acc.fallbackThumb == null) acc.fallbackThumb = v.uri;       // fallback thumb
        } else if (v != null && v !== "" && acc[k] == null) {
          acc[k] = v;
        }
      }
      collectFields(v, acc);
    }
  }

  function reelIdFromPermalink(url) {
    const m = /(?:reel|videos)\/(\d+)/.exec(url || "");
    return m ? m[1] : null;
  }

  // Locate the aggregated_fb_shorts connection ANYWHERE in a parsed line. Profile puts it
  // at data.node.aggregated_fb_shorts; Saved nests it under
  // data.node.all_collections.nodes[0].style_renderer.collection.aggregated_fb_shorts
  // (Your Reels likewise). A depth-first search finds it on every surface without
  // hard-coding the path — the edge node shape (profile_reel_node.node) is identical.
  function findAggregatedShorts(node) {
    if (!node || typeof node !== "object") return null;
    if (Array.isArray(node)) {
      for (const x of node) { const r = findAggregatedShorts(x); if (r) return r; }
      return null;
    }
    if (node.aggregated_fb_shorts && node.aggregated_fb_shorts.edges) return node.aggregated_fb_shorts;
    for (const v of Object.values(node)) { const r = findAggregatedShorts(v); if (r) return r; }
    return null;
  }

  // Parse one full @defer streamed body -> { reels, pageInfo }.
  function reconstructReels(rawBody) {
    const lines = rawBody.split("\n").map((l) => l.trim()).filter(Boolean);
    let shorts = null;
    const chunks = [];
    for (const line of lines) {
      let obj; try { obj = JSON.parse(line); } catch (_) { continue; }
      if (obj && Array.isArray(obj.path)) { chunks.push(obj); continue; } // @defer chunk
      const found = findAggregatedShorts(obj);                            // base line (any surface)
      if (found) shorts = found;
    }
    if (!shorts) return { reels: [], pageInfo: null };
    const edges = shorts.edges || [];
    const reels = edges.map((e) => {
      const acc = {};
      collectFields(e && e.profile_reel_node && e.profile_reel_node.node, acc);
      return acc;
    });
    // Merge each deferred chunk into reel N by the integer right after "edges" in its path.
    for (const chunk of chunks) {
      const i = chunk.path.indexOf("edges");
      if (i === -1) continue;
      const idx = chunk.path[i + 1];
      if (typeof idx === "number" && reels[idx]) collectFields(chunk.data, reels[idx]);
    }
    return { reels, pageInfo: shorts.page_info || null };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Ingest — gated; dedupes by reel id
  // ──────────────────────────────────────────────────────────────────────────
  function ingest(rawBody) {
    if (!rawBody || rawBody.indexOf("aggregated_fb_shorts") === -1) return;
    if (!SORT_ACTIVE) return;
    if (handedOff) return; // sort already rendered — ignore late in-flight pages
    let result;
    try { result = reconstructReels(rawBody); } catch (e) { if (SF_FB_DEBUG) console.warn("[SF][FB] reconstruct failed", e); return; }
    const { reels, pageInfo } = result;
    if (!reels.length && !pageInfo) return;
    sawAnyShortsResponse = true;
    let added = 0;
    for (const r of reels) {
      const id = reelIdFromPermalink(r.permalink_url);
      if (!id) continue;
      r.id = id;
      if (!reelsById.has(id)) { reelsById.set(id, r); added++; }
    }
    if (pageInfo && typeof pageInfo.has_next_page === "boolean") lastHasNextPage = pageInfo.has_next_page;
    if (added) notifyProgress(); // refresh the banner as soon as each batch lands (not once per scroll round)
    if (SF_FB_DEBUG) console.log(`[SF][FB] ingest +${added} (total ${reelsById.size}, has_next=${lastHasNextPage})`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Network wraps (research doc §3.1) — installed immediately, before FB fetches
  // ──────────────────────────────────────────────────────────────────────────
  // XHR — the CONFIRMED transport for scroll pagination.
  const _open = XMLHttpRequest.prototype.open;
  const _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u, ...rest) { this.__sfUrl = u; return _open.call(this, m, u, ...rest); };
  XMLHttpRequest.prototype.send = function (b) {
    if (typeof this.__sfUrl === "string" && this.__sfUrl.indexOf("/api/graphql/") !== -1) {
      this.addEventListener("load", () => {
        try { ingest(this.responseText || ""); } catch (_) {}
      });
    }
    return _send.call(this, b);
  };

  // fetch — safety net for the initial batch (clone before reading).
  const _fetch = window.fetch;
  window.fetch = function (...args) {
    const url = (args[0] && args[0].url) || args[0];
    const p = _fetch.apply(this, args);
    try {
      if (typeof url === "string" && url.indexOf("/api/graphql/") !== -1) {
        p.then((res) => { try { res.clone().text().then(ingest).catch(() => {}); } catch (_) {} });
      }
    } catch (_) {}
    return p;
  };

  // ──────────────────────────────────────────────────────────────────────────
  // SSR bootstrap fallback (research doc §3.6) — first batch may be inlined
  // ──────────────────────────────────────────────────────────────────────────
  function scanInlineBootstrap() {
    try {
      // On first load FB doesn't fetch page 1 — it inlines that same @defer stream as
      // separate <script type="application/json"> blobs, each wrapped in a Relay envelope.
      // Feeding a wrapped blob straight to ingest() finds nothing (reconstructReels expects
      // the un-wrapped newline stream). So unwrap every blob to its inner result object(s),
      // rejoin them into the stream reconstructReels already understands, and ingest once —
      // so page 1 counts immediately instead of waiting ~2-3s for the first scroll's fetch.
      const lines = [];
      document.querySelectorAll('script[type="application/json"]').forEach((el) => {
        const txt = el.textContent || "";
        if (txt.indexOf("aggregated_fb_shorts") === -1) return;
        let root; try { root = JSON.parse(txt); } catch (_) { return; }
        (function unwrap(n) {
          if (!n || typeof n !== "object") return;
          if (Array.isArray(n)) { n.forEach(unwrap); return; }
          // a stream "line" = the base result ({data:{node:…}}) or a deferred chunk ({path,…})
          if ((n.data && n.data.node) || Array.isArray(n.path)) { lines.push(JSON.stringify(n)); return; }
          Object.values(n).forEach(unwrap);
        })(root);
      });
      if (lines.length) {
        if (SF_FB_DEBUG) console.log(`[SF][FB] bootstrap scan: ${lines.length} inline stream line(s)`);
        ingest(lines.join("\n"));
      }
    } catch (e) { if (SF_FB_DEBUG) console.warn("[SF][FB] bootstrap scan failed", e); }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Target count from the popup's items selection
  // ──────────────────────────────────────────────────────────────────────────
  function fbTargetCount(noItems) {
    if (!noItems || noItems === "all_reels") return Infinity;
    const m = /^(\d+)/.exec(noItems);          // "25_reels" -> 25, "347" -> 347
    return m ? parseInt(m[1], 10) : Infinity;
  }

  // Date-range mode (Phase 9) — mirrors IG's return_date_range. `key` is the Dates
  // dropdown value: "1_week"|"1_month"|"3_month"|"6_month"|"1_year"|"all_reels", or a
  // custom range "custom_<fromMs>_<toMs>". Returns [startMs, endMs].
  function fbDateRange(key) {
    if (typeof key === "string" && key.startsWith("custom_")) {
      const parts = key.split("_");
      const fromMs = parseInt(parts[1], 10);
      const toMs = parseInt(parts[2], 10);
      if (Number.isFinite(fromMs) && Number.isFinite(toMs)) {
        const end = new Date(toMs);
        end.setHours(23, 59, 59, 999); // capture the full "to" day
        return [fromMs, end.getTime()];
      }
    }
    const days = { "1_week": 7, "1_month": 30, "3_month": 90, "6_month": 180, "1_year": 360, "all_reels": 3600 };
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days[key] != null ? days[key] : 7));
    return [start.getTime(), end.getTime()];
  }

  // Results-banner sub-header SUFFIX, matching IG's handle_sub_header exactly:
  // " from 1 Month Back", " from <Mon D – Mon D>", or "" for all_reels. Leading space so it
  // appends cleanly to "N Reels".
  function fbDateRangeLabel(key, startMs, endMs) {
    const presets = {
      "1_week": " from 1 Week Back", "1_month": " from 1 Month Back", "3_month": " from 3 Months Back",
      "6_month": " from 6 Months Back", "1_year": " from 1 Year Back", "all_reels": "",
    };
    if (key in presets) return presets[key];
    const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const s = new Date(startMs), e = new Date(endMs), now = new Date();
    const sameYear = s.getFullYear() === e.getFullYear() && s.getFullYear() === now.getFullYear();
    if (sameYear) return ` from ${MON[s.getMonth()]} ${s.getDate()} – ${MON[e.getMonth()]} ${e.getDate()}`;
    return ` from ${MON[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()} – ${MON[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // findElement — locate a reel tile by VideoID (mirrors IG's
  // find_element_instagram_again_posts). Grounded in dua_lipa_reel_page.html:
  // every grid tile is <a aria-label="Reel tile preview" href="/reel/<id>/…">.
  // Scrolls the tile into view (FB's lazy-load / pagination trigger) and resolves
  // the tile container. Used as the SCROLL PROXY during collection; the render
  // phase can later layer media-load polling on top.
  // ──────────────────────────────────────────────────────────────────────────
  function find_element_facebook(videoId, retries = 20, interval = 100) {
    return new Promise((resolve) => {
      const tryFind = (attemptsLeft) => {
        const anchor =
          document.querySelector(`a[aria-label="Reel tile preview"][href*="/reel/${videoId}"]`) ||
          document.querySelector(`a[href*="/reel/${videoId}"]`);
        if (anchor) {
          const tile = anchor.closest("div") || anchor;
          tile.scrollIntoView({ behavior: "auto", block: "center" });
          resolve(tile);
        } else if (attemptsLeft > 0) {
          setTimeout(() => tryFind(attemptsLeft - 1), interval);
        } else {
          resolve(null);
        }
      };
      tryFind(retries);
    });
  }
  if (SF_FB_DEBUG) window.__sfFbFindElement = find_element_facebook; // dev: call from console

  // ──────────────────────────────────────────────────────────────────────────
  // parseReduced (research doc §4) — localized compact strings -> Number.
  // FB renders Views/Shares as "1.2M" / "١٫٢ مليون" / "120万" per the viewer's
  // locale; no exact integer exists. ONE generic CLDR inverter (via Intl) learns
  // the format. Applied to Views + Shares ONLY (Likes/Comments/Date are exact).
  // ──────────────────────────────────────────────────────────────────────────
  // One entry per DIGIT SCRIPT (not per language) — FB uses native digits even
  // for a bare lang tag (e.g. "ar" -> ١٢٣), so normalize generically.
  const DIGIT_ZEROS = [
    0x0660, 0x06F0, 0x0966, 0x09E6, 0x0A66, 0x0AE6, 0x0B66, 0x0BE6,
    0x0C66, 0x0CE6, 0x0D66, 0x0E50, 0x0ED0, 0x0F20, 0x1040, 0x17E0,
  ];
  function digitsToAscii(s) {
    return s.replace(/\p{Nd}/gu, (ch) => {
      const cp = ch.codePointAt(0);
      if (cp >= 0x30 && cp <= 0x39) return ch;                 // already ASCII
      for (const z of DIGIT_ZEROS) if (cp >= z && cp <= z + 9) return String(cp - z);
      return ch;                                               // unknown script -> NaN -> null
    });
  }

  // Learn suffix -> scale (K/M/B, lakh/crore, 万/億) by formatting known magnitudes.
  function buildInverter(locale) {
    const nf = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 2 });
    const suffixToScale = new Map();
    for (const k of [3, 4, 5, 6, 7, 8, 9, 12]) {
      const value = Math.pow(10, k);
      const parts = nf.formatToParts(value);
      const suffix = parts.filter((p) => p.type === "compact").map((p) => p.value).join("");
      if (!suffix) continue;
      const numStr = digitsToAscii(
        parts.filter((p) => ["integer", "decimal", "fraction"].includes(p.type)).map((p) => p.value).join("")
      ).replace(/[\u066B\u060C,]/g, ".");
      const shown = parseFloat(numStr);
      if (shown > 0 && !suffixToScale.has(suffix)) suffixToScale.set(suffix, value / shown);
    }
    return suffixToScale;
  }

  // Parse ONE FB reduced string -> Number, or null if unparseable.
  function parseReduced(str, suffixToScale) {
    if (str == null) return null;
    // strip bidi/format marks (LRM/RLM/ALM, isolates/overrides) + NBSP
    let s = String(str).replace(/[\u200E\u200F\u061C\u00A0\u202A-\u202E\u2066-\u2069]/g, "").trim();
    let best = null;
    for (const [suffix, scale] of suffixToScale) {
      if (suffix && s.includes(suffix) && (!best || suffix.length > best.suffix.length)) best = { suffix, scale };
    }
    let scale = 1, numPart = s;
    if (best) { scale = best.scale; numPart = s.split(best.suffix).join(""); }
    numPart = digitsToAscii(numPart).replace(/[\u066B\u060C,]/g, ".").replace(/\s+/g, ""); // comma/Arabic decimal -> "."
    const n = parseFloat(numPart);
    return Number.isNaN(n) ? null : Math.round(n * scale);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Sort (research doc §5) — one numeric comparator; only the source differs.
  // null/NaN (e.g. an unparseable locale for Views/Shares) sinks to the bottom.
  // ──────────────────────────────────────────────────────────────────────────
  function sort_items_facebook(data, sortBy) {
    const num = (v) => (v == null || Number.isNaN(v) ? -Infinity : v);
    const arr = [...data];
    switch (sortBy) {
      case "likes":    return arr.sort((a, b) => num(b.Likes) - num(a.Likes));
      case "comments": return arr.sort((a, b) => num(b.Comments) - num(a.Comments));
      case "shares":   return arr.sort((a, b) => num(b.Shares) - num(a.Shares));
      case "oldest":   return arr.sort((a, b) => a._ts - b._ts);
      case "views":    return arr.sort((a, b) => num(b.Views) - num(a.Views));
      default:         return arr.sort((a, b) => b._ts - a._ts); // newest
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Collect — findElement-driven scroll until target / has_next_page:false / stall
  // ──────────────────────────────────────────────────────────────────────────
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Post the running count to the content-script progress banner (banner_on_facebook.js).
  // Capped at the requested target so the bar/percent read cleanly.
  function notifyProgress() {
    if (handedOff) return;
    let shown;
    if (dateModeRange) {
      // Date mode: show the count of IN-RANGE reels found so far (not total collected —
      // we may be scrolling past newer-than-range reels for a custom past range).
      const [s, e] = dateModeRange;
      shown = [...reelsById.values()].filter((r) => {
        const t = (r.creation_time || 0) * 1000;
        return t >= s && t < e;
      }).length;
    } else {
      const t = fbTargetCount(sessionStorage.getItem("sortFeedNoItemsFacebook"));
      shown = t === Infinity ? reelsById.size : Math.min(reelsById.size, t);
    }
    window.postMessage({ fb_banner_notification: true, count: shown, type: "Reels" }, "*");
  }

  // Trip FB's reel lazy-load the way a MANUAL scroll does. window.scrollTo didn't work,
  // which means FB scrolls an inner container (not the window). So: find the grid's
  // nearest scrollable ancestor and scroll IT to the bottom, plus scrollIntoView the last
  // tile (advances a virtualized grid a window at a time) and nudge the window — belt &
  // suspenders.
  function scroll_to_load_more_facebook() {
    const tiles = document.querySelectorAll('a[aria-label="Reel tile preview"], a[href*="/reel/"]');
    const lastTile = tiles.length ? (tiles[tiles.length - 1].closest("div") || tiles[tiles.length - 1]) : null;

    let sc = null, node = lastTile ? lastTile.parentElement : null, depth = 0;
    while (node && node !== document.documentElement && depth < 24) {
      const oy = getComputedStyle(node).overflowY;
      if ((oy === "auto" || oy === "scroll") && node.scrollHeight - node.clientHeight > 40) { sc = node; break; }
      node = node.parentElement; depth++;
    }

    const se = document.scrollingElement || document.documentElement;
    if (lastTile) lastTile.scrollIntoView({ behavior: "auto", block: "end" });
    if (sc) sc.scrollTop = sc.scrollHeight;
    se.scrollTop = se.scrollHeight;
    try { window.scrollTo(0, se.scrollHeight); } catch (_) {}
    return tiles.length > 0;
  }

  async function collect() {
    if (collected) return;
    collected = true;

    const noItems = sessionStorage.getItem("sortFeedNoItemsFacebook");
    const isDates = sessionStorage.getItem("sortItemsVsDatesFacebook") === "dates";
    if (isDates) dateModeRange = fbDateRange(noItems);
    // Date mode has no count cap — collection is bounded by the range start instead.
    const target = isDates ? Infinity : fbTargetCount(noItems);
    if (SF_FB_DEBUG) console.log(`[SF][FB] collecting — ${isDates ? `dates ${new Date(dateModeRange[0]).toISOString().slice(0, 10)}..${new Date(dateModeRange[1]).toISOString().slice(0, 10)}` : `target=${target === Infinity ? "all" : target}`}`);

    // Start as soon as EITHER a shorts response landed OR FB rendered any reel tile —
    // on some profiles page 1 only loads after a scroll, so waiting for a network
    // response that never comes would stall the whole sort for 15s.
    let waited = 0;
    while (!sawAnyShortsResponse && !document.querySelector('a[aria-label="Reel tile preview"]') && waited < 15000) { await sleep(250); waited += 250; }

    // First count → upgrades the prep banner ("Getting ready to sort") into the
    // live progress banner (Phase 7.3). Posted again after every scroll round below.
    notifyProgress();

    const SCROLL_PAUSE = 1800;
    const MAX_STALLS = 6;          // ~11s of no growth -> stop
    const MAX_ROUNDS = 500;        // hard backstop
    let stalls = 0, rounds = 0, lastCount = reelsById.size;

    while (reelsById.size < target && lastHasNextPage !== false && stalls < MAX_STALLS && rounds < MAX_ROUNDS) {
      // Stop button (progress banner) sets this flag — bail and render whatever we have.
      if (sessionStorage.getItem("sortFeedStopSortingFacebook") === "on") {
        if (SF_FB_DEBUG) console.log("[SF][FB] stop requested → ending collection early");
        break;
      }
      // Scroll proxy: bring the last collected reel's tile into view to trip FB's
      // infinite-scroll. Targeting the bottom-most tile also stays ahead of FB's
      // grid virtualization (data-virtualized), which prunes tiles off the top.
      const ids = [...reelsById.keys()];
      const lastId = ids[ids.length - 1];
      const tile = lastId ? await find_element_facebook(lastId) : null;
      // No collected reel to target yet → scroll FB's actual scroll container (trips
      // lazy-load like a manual scroll).
      if (!tile) scroll_to_load_more_facebook();
      await sleep(SCROLL_PAUSE);
      rounds++;
      if (reelsById.size > lastCount) { lastCount = reelsById.size; stalls = 0; }
      else { stalls++; }
      notifyProgress(); // tick the progress banner with the new count
      if (SF_FB_DEBUG) console.log(`[SF][FB] scroll ${rounds} (${tile ? "findElement" : "loadmore"}) — total=${reelsById.size} has_next=${lastHasNextPage} stalls=${stalls}`);
      // Date mode: reels arrive newest-first, so once the OLDEST collected reel predates the
      // range start, everything beyond is older too — stop scrolling.
      if (isDates) {
        // Stop once the oldest reel WITH a valid timestamp predates the range start. Guard on a
        // truthy creation_time so a missing/null one can't falsely trip an early stop (which would
        // collect almost nothing and filter to 0).
        const allIds = [...reelsById.keys()];
        const oldest = reelsById.get(allIds[allIds.length - 1]);
        if (oldest && oldest.creation_time && oldest.creation_time * 1000 < dateModeRange[0]) break;
      }
    }

    let reels;
    if (isDates) {
      const [s, e] = dateModeRange;
      reels = [...reelsById.values()].filter((r) => {
        const t = (r.creation_time || 0) * 1000;
        return t >= s && t < e;
      });
    } else {
      reels = [...reelsById.values()];
      if (target !== Infinity) reels = reels.slice(0, target);
    }

    if (!reels.length) {
      handedOff = true;
      if (isDates) {
        // Date range matched nothing — render an empty-state banner so the user gets feedback
        // (instead of silently clearing, which reads as "broken").
        if (SF_FB_DEBUG) console.warn("[SF][FB] 0 reels in the selected date range");
        const rangeLabel = fbDateRangeLabel(noItems, dateModeRange[0], dateModeRange[1]);
        const sortByEmpty = sessionStorage.getItem("sortFeedSortByFacebook") || "views";
        window.postMessage({ fb_render: true, payload: [], sortBy: sortByEmpty, rangeLabel, emptyDate: true }, "*");
      } else {
        // No reels on this surface (or FB shape changed). Don't render/hide anything — just
        // tell the progress banner to swap to a friendly "no reels" message and dismiss
        // itself (banner_on_facebook.js). The page is left untouched. Profile/saved/owner alike.
        if (SF_FB_DEBUG) console.warn("[SF][FB] collected 0 reels — surface has no reels (or FB shape changed)");
        window.postMessage({ fb_sort_empty: true }, "*");
      }
      return;
    }

    // ── Phase 5: convert Views + Shares (localized strings) -> numbers. ONLY these two.
    const inv = buildInverter(document.documentElement.lang || "en");

    // ── Phase 6: build the deliverable object, sort by the clicked metric.
    const objects = reels.map((r) => ({
      Profile:  r.profileName ?? null,
      VideoID:  r.id,
      Thumb:    r.preferredThumb || r.fallbackThumb || null, // Phase 7.1 — render tile (not an export column)
      Likes:    r.likes ?? null,
      Comments: r.total_comment_count ?? null,
      Date:     r.creation_time ? new Date(r.creation_time * 1000).toISOString() : null, // full ISO; export slices for CSV / toLocaleString for Excel+JSON (mirrors IG)
      Caption:  r.caption || "",
      Views:    parseReduced(r.play_count_reduced, inv),
      Shares:   parseReduced(r.share_count_reduced, inv),
      _ts:      r.creation_time || 0,   // internal sort key (stripped before handoff)
    }));

    const sortBy = sessionStorage.getItem("sortFeedSortByFacebook") || "views";
    const sorted = sort_items_facebook(objects, sortBy);
    const out = sorted.map(({ _ts, ...rest }) => rest);   // drop the internal key

    if (SF_FB_DEBUG) {
      console.log(`%c[SF][FB] ✅ sorted ${out.length} reels by "${sortBy}"`, "color:#1877f2;font-weight:bold");
      console.table(out.map(({ Thumb, ...rest }) => rest)); // omit long thumb URLs from the table
    }

    // ── Phase 7.0 / 9 — hand the sorted array to the content-script renderer (dom_facebook.js).
    const rangeLabel = isDates ? fbDateRangeLabel(noItems, dateModeRange[0], dateModeRange[1]) : null;
    handedOff = true; // stop further ingest/notify before we post (late pages must not re-open the banner)
    window.postMessage({ fb_render: true, payload: out, sortBy, rangeLabel }, "*");
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Boot — arm the collector only during an active sort
  // ──────────────────────────────────────────────────────────────────────────
  if (SORT_ACTIVE) {
    if (SF_FB_DEBUG) console.log("[SF][FB] sort active → collector armed");
    const start = () => { scanInlineBootstrap(); collect(); };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
      start();
    }
  }
})();
