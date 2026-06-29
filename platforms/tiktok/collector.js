(function () {
  const adapters = window.LocalSortFeedPlatforms || {};
  const state = {
    running: false,
    items: new Map(),
    dom: new Map(),
    status: "Ready.",
    stopRequested: false
  };

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "LOCAL_SORT_FEED_START") {
      startCollection(message.sortBy || "views", message.direction || "desc");
      sendResponse(snapshot());
      return true;
    }
    if (message?.type === "LOCAL_SORT_FEED_STATUS") {
      sendResponse(snapshot());
      return true;
    }
    if (message?.type === "LOCAL_SORT_FEED_STOP") {
      state.stopRequested = true;
      state.running = false;
      state.status = "Stopping...";
      publish(false);
      sendResponse(snapshot());
      return true;
    }
    if (message?.type === "LOCAL_SORT_FEED_SORT_DOM") {
      const adapter = getAdapter();
      if (!adapter) {
        state.status = "This page is not supported.";
      } else {
        collectOnce(adapter);
        const result = sortDom(message.sortBy || "views", message.direction || "desc");
        const viewCount = Array.from(state.items.values()).filter((item) => item.views > 0).length;
        state.status = result.sorted
          ? `Sorted ${result.sorted} page items by ${message.sortBy || "views"}. Views read: ${viewCount}. Groups: ${result.groups}, largest: ${result.largestGroup}. Parent: ${result.largestParent || "unknown"}.`
          : "Could not find a sortable grid/list on this page.";
      }
      publish(true);
      sendResponse(snapshot());
      return true;
    }
    if (message?.type === "LOCAL_SORT_FEED_EXPORT_XLSX") {
      exportXlsx(message.items || Array.from(state.items.values()));
      sendResponse({ ok: true });
      return true;
    }
  });

  async function startCollection(sortBy, direction) {
    if (state.running) return;
    const adapter = getAdapter();
    if (!adapter) {
      state.status = "This page is not supported.";
      publish(true);
      return;
    }
    state.running = true;
    state.stopRequested = false;
    state.items.clear();
    state.dom.clear();
    state.status = `Loading and sorting ${adapter.name} items on the page...`;
    publish(false);

    let stalePasses = 0;
    let lastCount = 0;
    for (let pass = 1; pass <= 400 && !state.stopRequested; pass += 1) {
      collectOnce(adapter);
      const result = sortDom(sortBy, direction);
      const count = state.items.size;
      state.status = `Sorted ${result.sorted} page items. Loaded ${count}. Scrolling pass ${pass}.`;
      publish(false);

      stalePasses = count === lastCount ? stalePasses + 1 : 0;
      lastCount = count;
      if (stalePasses >= 8 || reachedPageBottom()) break;
      window.scrollBy({ top: Math.max(window.innerHeight * 0.85, 700), behavior: "smooth" });
      await delay(900);
    }

    collectOnce(adapter);
    const result = sortDom(sortBy, direction);
    state.running = false;
    state.status = state.stopRequested
      ? `Stopped. Sorted ${result.sorted} page items.`
      : `Done. Sorted ${result.sorted} page items directly on the website.`;
    publish(true);
  }

  function collectOnce(adapter) {
    for (const item of adapter.collect()) {
      if (!item?.url) continue;
      const normalized = normalizeItem(item, adapter.name);
      const existing = state.items.get(normalized.url);
      state.items.set(normalized.url, mergeItem(existing, normalized));
      const node = item.element || item.node || null;
      const parent = item.parent || node?.parentElement || null;
      if (node && parent) state.dom.set(normalized.url, { node, parent });
    }
  }

  function sortDom(sortBy, direction) {
    const dir = direction === "asc" ? 1 : -1;
    const groups = new Map();
    for (const item of state.items.values()) {
      const dom = state.dom.get(item.url);
      if (!dom?.node?.isConnected || !dom?.parent?.isConnected) continue;
      if (!groups.has(dom.parent)) groups.set(dom.parent, []);
      groups.get(dom.parent).push({ item, node: dom.node });
    }

    let sorted = 0;
    let largestGroup = 0;
    let largestParent = "";
    for (const [parent, entries] of groups) {
      const uniqueEntries = uniqueByNode(entries);
      if (uniqueEntries.length > largestGroup) {
        largestGroup = uniqueEntries.length;
        largestParent = describeNode(parent);
      }
      if (uniqueEntries.length < 2) continue;
      uniqueEntries.sort((a, b) => (sortValue(a.item, sortBy) - sortValue(b.item, sortBy)) * dir);
      uniqueEntries.forEach((entry, index) => {
        entry.node.style.order = String(index);
        entry.node.dataset.localSortFeedOrder = String(index);
        parent.appendChild(entry.node);
      });
      sorted += uniqueEntries.length;
    }
    return { sorted, groups: groups.size, largestGroup, largestParent };
  }

  function uniqueByNode(entries) {
    const seen = new Set();
    return entries.filter((entry) => {
      if (seen.has(entry.node)) return false;
      seen.add(entry.node);
      return true;
    });
  }

  function sortValue(item, sortBy) {
    if (sortBy === "publishDate") return Date.parse(item.publishDate || "") || 0;
    return Number(item[sortBy] || 0);
  }

  function getAdapter() {
    const host = location.hostname;
    if (host.includes("tiktok.com")) return adapters.tiktok;
    return null;
  }

  function normalizeItem(item, platform) {
    return {
      platform,
      url: absoluteUrl(item.url),
      thumbnailUrl: absoluteUrl(item.thumbnailUrl || ""),
      caption: cleanText(item.caption || ""),
      publishDate: cleanText(item.publishDate || ""),
      views: toNumber(item.views),
      likes: toNumber(item.likes),
      comments: toNumber(item.comments)
    };
  }

  function mergeItem(a, b) {
    if (!a) return b;
    return {
      ...a,
      ...Object.fromEntries(Object.entries(b).filter(([, value]) => value !== "" && value !== 0)),
      views: Math.max(a.views || 0, b.views || 0),
      likes: Math.max(a.likes || 0, b.likes || 0),
      comments: Math.max(a.comments || 0, b.comments || 0)
    };
  }

  function publish(done) {
    chrome.runtime.sendMessage({
      type: "LOCAL_SORT_FEED_PROGRESS",
      ...snapshot(),
      done
    }).catch(() => {});
  }

  function snapshot() {
    return {
      running: state.running,
      status: state.status,
      items: Array.from(state.items.values())
    };
  }

  function exportXlsx(items) {
    if (!window.XLSX) return;
    const rows = items.map((item) => ({
      URL: item.url,
      "Thumbnail URL": item.thumbnailUrl,
      Caption: item.caption,
      "Publish date": item.publishDate,
      Views: item.views,
      Likes: item.likes,
      Comments: item.comments
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sort Feed");
    XLSX.writeFile(workbook, `local-sort-feed-${Date.now()}.xlsx`);
  }

  function reachedPageBottom() {
    return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
  }

  function absoluteUrl(url) {
    if (!url) return "";
    try { return new URL(url, location.origin).href; } catch { return ""; }
  }

  function cleanText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function toNumber(value) {
    if (typeof value === "number") return value;
    const text = String(value || "").toLowerCase().replace(/,/g, "").trim();
    const match = text.match(/([\d.]+)\s*([kmb])?/);
    if (!match) return 0;
    const base = Number(match[1]);
    const scale = match[2] === "k" ? 1e3 : match[2] === "m" ? 1e6 : match[2] === "b" ? 1e9 : 1;
    return Math.round(base * scale);
  }

  function describeNode(node) {
    if (!node) return "";
    const id = node.id ? `#${node.id}` : "";
    const classes = Array.from(node.classList || []).slice(0, 3).map((name) => `.${name}`).join("");
    const role = node.getAttribute?.("role") ? `[role="${node.getAttribute("role")}"]` : "";
    return `${node.tagName?.toLowerCase() || "node"}${id}${classes}${role}`;
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
