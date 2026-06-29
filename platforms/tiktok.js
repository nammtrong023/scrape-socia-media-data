(function () {
  window.LocalSortFeedPlatforms = window.LocalSortFeedPlatforms || {};
  window.LocalSortFeedPlatforms.tiktok = {
    name: "TikTok",
    collect
  };

  function collect() {
    const items = [];
    document.querySelectorAll('a[href*="/video/"], a[href*="/photo/"]').forEach((link) => {
      const card = link.closest('[data-e2e], div') || link;
      const text = card.innerText || link.getAttribute("aria-label") || "";
      items.push({
        url: link.href,
        element: findTile(link),
        thumbnailUrl: card.querySelector("img")?.src || "",
        caption: link.getAttribute("title") || link.getAttribute("aria-label") || text.split("\n")[0] || "",
        views: pickMetric(text, ["views", "view"]),
        likes: pickMetric(text, ["likes", "like"]),
        comments: pickMetric(text, ["comments", "comment"])
      });
    });
    return items;
  }

  function findTile(link) {
    let node = link;
    while (node?.parentElement && node !== document.body) {
      const parent = node.parentElement;
      const videoLinks = parent.querySelectorAll('a[href*="/video/"], a[href*="/photo/"]');
      if (videoLinks.length >= 2) return node;
      node = parent;
    }
    return link;
  }

  function pickMetric(text, labels) {
    const lines = String(text || "").split(/\n+/).map((line) => line.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i += 1) {
      if (labels.some((label) => lines[i].toLowerCase().includes(label))) return lines[i - 1] || lines[i];
    }
    const compact = lines.find((line) => /^[\d,.]+[kmb]?$/i.test(line));
    return compact || "";
  }
})();
