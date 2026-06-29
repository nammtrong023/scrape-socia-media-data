// ─── Element refs ─────────────────────────────────────────────────────────────
const els = {
  globalStatus:     document.querySelector("#globalStatus"),

  // Tab buttons
  tabTikTok:        document.querySelector("#tabTikTok"),
  tabShopee:        document.querySelector("#tabShopee"),
  tabFacebook:      document.querySelector("#tabFacebook"),

  // Panels
  tiktokPanel:      document.querySelector("#tiktokPanel"),
  shopeePanel:      document.querySelector("#shopeePanel"),
  facebookPanel:    document.querySelector("#facebookPanel"),

  // TikTok
  count:            document.querySelector("#count"),
  progress:         document.querySelector("#progress"),
  urls:             document.querySelector("#urls"),
  start:            document.querySelector("#start"),
  resume:           document.querySelector("#resume"),
  pause:            document.querySelector("#pause"),
  clear:            document.querySelector("#clear"),
  exportXlsx:       document.querySelector("#exportXlsx"),
  exportCsv:        document.querySelector("#exportCsv"),
  hint:             document.querySelector("#hint"),

  // Shopee
  shopeeCount:      document.querySelector("#shopeeCount"),
  shopeeStatus:     document.querySelector("#shopeeStatus"),
  shopeeUrl:        document.querySelector("#shopeeUrl"),
  scrapeShopee:     document.querySelector("#scrapeShopee"),
  clearShopee:      document.querySelector("#clearShopee"),
  exportShopeeXlsx: document.querySelector("#exportShopeeXlsx"),
  exportShopeeCsv:  document.querySelector("#exportShopeeCsv"),
  shopeeHint:       document.querySelector("#shopeeHint"),

  // Facebook
  fbCount:          document.querySelector("#fbCount"),
  fbStatus:         document.querySelector("#fbStatus"),
  fbUrl:            document.querySelector("#fbUrl"),
  fbReelsUrls:      document.querySelector("#fbReelsUrls"),
  startFbTranscript: document.querySelector("#startFbTranscript"),
  exportFbSrt:      document.querySelector("#exportFbSrt"),
  scrapeFacebook:   document.querySelector("#scrapeFacebook"),
  clearFacebook:    document.querySelector("#clearFacebook"),
  exportFbXlsx:     document.querySelector("#exportFbXlsx"),
  exportFbCsv:      document.querySelector("#exportFbCsv"),
  fbHint:           document.querySelector("#fbHint"),

  // Instagram
  tabInstagram:     document.querySelector("#tabInstagram"),
  instagramPanel:   document.querySelector("#instagramPanel"),
  igCount:          document.querySelector("#igCount"),
  igStatus:         document.querySelector("#igStatus"),
  igReelsUrls:      document.querySelector("#igReelsUrls"),
  startIgTranscript: document.querySelector("#startIgTranscript"),
  exportIgSrt:      document.querySelector("#exportIgSrt"),
  clearInstagram:   document.querySelector("#clearInstagram"),
  exportIgXlsx:     document.querySelector("#exportIgXlsx"),
  exportIgCsv:      document.querySelector("#exportIgCsv"),
  igHint:           document.querySelector("#igHint"),

  // Sort Feed elements
  tabSortFeed:      document.querySelector("#tabSortFeed"),
  sortfeedPanel:    document.querySelector("#sortfeedPanel"),
  sortPlatform:     document.querySelector("#platform"),
  modeItems:        document.querySelector("#modeItems"),
  modeDates:        document.querySelector("#modeDates"),
  itemsRow:         document.querySelector("#itemsRow"),
  datesRow:         document.querySelector("#datesRow"),
  itemSelection:    document.querySelector("#itemSelection"),
  dateSelection:    document.querySelector("#dateSelection"),
  sharesButton:     document.querySelector("#sharesButton"),
  sortMessage:      document.querySelector("#message"),
  sortProgress:     document.querySelector("#sortProgress"),
  sortButtons:      Array.from(document.querySelectorAll("#sortfeedPanel [data-sort]")),
  themeToggle:      document.querySelector("#themeToggle"),
};

// ─── State ────────────────────────────────────────────────────────────────────
let activeTab = null;
let currentTabName = "tiktok"; // which panel is showing

// ─── Theme ────────────────────────────────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem("rsp_theme") || "dark";
  applyTheme(saved);
})();

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("rsp_theme", theme);
  const icon = els.themeToggle?.querySelector(".material-symbols-outlined");
  if (icon) icon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
}

els.themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function send(message) {
  return chrome.runtime.sendMessage(message);
}

function exportTimestamp() {
  const d = new Date();
  const pad = (v) => String(v).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

async function downloadXlsx(filename, rows, sheetName, cols) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  if (cols) ws["!cols"] = cols;
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const bytes = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const binary = Array.from(new Uint8Array(bytes), (b) => String.fromCharCode(b)).join("");
  const url = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${btoa(binary)}`;
  await chrome.downloads.download({ url, filename, saveAs: true });
}

async function exportTikTokXlsxFromState(state) {
  if (!state.comments?.length) return null;
  await downloadXlsx(
    `tiktok_comments_batch_${exportTimestamp()}.xlsx`,
    state.comments.map((item) => ({ comments: item.comment_text })),
    "comments",
    [{ wch: 90 }],
  );
  return `Exported ${state.comments.length} comments to XLSX.`;
}

async function exportShopeeXlsxFromState(state) {
  const reviews = state.shopee?.reviews || [];
  if (!reviews.length) return null;
  await downloadXlsx(
    `shopee_reviews_${exportTimestamp()}.xlsx`,
    reviews,
    "Danh gia",
    [{ wch: 20 }, { wch: 8 }, { wch: 80 }],
  );
  return `Exported ${reviews.length} Shopee reviews to XLSX.`;
}

async function exportFacebookXlsxFromState(state) {
  const comments = state.facebook?.comments || [];
  if (!comments.length) return null;
  await downloadXlsx(
    `facebook_comments_${exportTimestamp()}.xlsx`,
    comments.map((c) => ({
      post_url: c.post_url,
      author_name: c.author_name,
      comment_text: c.comment_text,
    })),
    "Comments",
    [{ wch: 40 }, { wch: 24 }, { wch: 80 }],
  );
  return `Exported ${comments.length} Facebook comments to XLSX.`;
}

async function exportInstagramXlsxFromState(state) {
  const transcripts = state.instagram?.transcripts || [];
  if (!transcripts.length) return null;
  await downloadXlsx(
    `instagram_reels_transcripts_${exportTimestamp()}.xlsx`,
    transcripts.map((t) => ({ reel_url: t.url, transcript: t.srt || "" })),
    "Transcripts",
    [{ wch: 50 }, { wch: 120 }],
  );
  return `Exported ${transcripts.length} Instagram Reel transcript${transcripts.length === 1 ? "" : "s"} to XLSX.`;
}

async function exportXlsxLocally(platform) {
  const state = await send({ type: "REVIEW_EXPORTER_GET_STATE" });
  const exporters = {
    tiktok: exportTikTokXlsxFromState,
    shopee: exportShopeeXlsxFromState,
    facebook: exportFacebookXlsxFromState,
    instagram: exportInstagramXlsxFromState,
  };
  const message = await exporters[platform](state);
  if (!message) return state;
  if (platform === "tiktok") return { ...state, message };
  if (platform === "shopee") return { ...state, shopee: { ...state.shopee, message } };
  if (platform === "facebook") return { ...state, facebook: { ...state.facebook, message } };
  return { ...state, instagram: { ...state.instagram, message } };
}

function statusLabel(status) {
  return { idle: "Idle", running: "Running", paused: "Paused", done: "Done", error: "Error" }[status] || "Idle";
}

function isShopeeUrl(url) {
  return /https?:\/\/([^/]+\.)?shopee\.vn\//i.test(url || "");
}

function isFacebookUrl(url) {
  return /https?:\/\/([^/]+\.)?facebook\.com\//i.test(url || "");
}

function isFacebookReelUrl(url) {
  return /https?:\/\/([^/]+\.)?facebook\.com\/(?:reel|reels)\//i.test(url || "");
}

function isInstagramUrl(url) {
  return /https?:\/\/([^/]+\.)?instagram\.com\//i.test(url || "");
}

// ─── Tab switching ────────────────────────────────────────────────────────────
const TAB_CONFIG = {
  tiktok:   { btn: "tabTikTok",   panel: "tiktokPanel" },
  shopee:   { btn: "tabShopee",   panel: "shopeePanel" },
  facebook: { btn: "tabFacebook", panel: "facebookPanel" },
  instagram: { btn: "tabInstagram", panel: "instagramPanel" },
  sortfeed: { btn: "tabSortFeed", panel: "sortfeedPanel" },
};

function switchTab(tabName) {
  if (!TAB_CONFIG[tabName]) return;
  currentTabName = tabName;

  for (const [name, cfg] of Object.entries(TAB_CONFIG)) {
    const isActive = name === tabName;
    els[cfg.btn].classList.toggle("active", isActive);
    els[cfg.panel].hidden = !isActive;
  }

  // Persist
  chrome.storage.local.set({ activeTabName: tabName }).catch(() => {});
}

// Wire up tab buttons
els.tabTikTok.addEventListener("click",   () => switchTab("tiktok"));
els.tabShopee.addEventListener("click",   () => switchTab("shopee"));
els.tabFacebook.addEventListener("click", () => switchTab("facebook"));
els.tabInstagram.addEventListener("click", () => switchTab("instagram"));
els.tabSortFeed.addEventListener("click", () => switchTab("sortfeed"));

// ─── Render ───────────────────────────────────────────────────────────────────
function renderTikTok(state) {
  const urlsText = (state.urls || []).join("\n");
  if (urlsText && !els.urls.value.trim()) els.urls.value = urlsText;

  els.count.textContent    = String(state.count || 0);
  els.progress.textContent = `${state.activeVideo || 0}/${state.total || 0}`;
  els.globalStatus.textContent = statusLabel(state.status);
  els.hint.textContent     = state.progressText && state.total ? state.progressText : state.message;

  const isRunning  = state.status === "running";
  const canResume  = state.status === "paused" && (state.urls || []).length > 0;
  const hasComments = (state.count || 0) > 0;

  els.start.disabled      = isRunning;
  els.resume.disabled     = !canResume || isRunning;
  els.pause.disabled      = !isRunning;
  els.exportXlsx.disabled = isRunning || !hasComments;
  els.exportCsv.disabled  = isRunning || !hasComments;
}

function renderShopee(state) {
  const shopee    = state.shopee || {};
  const isRunning = shopee.status === "running";
  const hasData   = (shopee.count || 0) > 0 || (shopee.reviews || []).length > 0;

  els.shopeeCount.textContent  = String(shopee.count || shopee.reviews?.length || 0);
  els.shopeeStatus.textContent = statusLabel(shopee.status);
  els.shopeeHint.textContent   = shopee.message || "Open a Shopee product page, then scrape reviews.";
  els.shopeeUrl.textContent    = shopee.currentUrl || "Open a Shopee product page.";

  els.scrapeShopee.disabled     = isRunning || !isShopeeUrl(activeTab?.url);
  els.clearShopee.disabled      = isRunning;
  els.exportShopeeXlsx.disabled = isRunning || !hasData;
  els.exportShopeeCsv.disabled  = isRunning || !hasData;
}

function renderFacebook(state) {
  const fb        = state.facebook || {};
  const isRunning = fb.status === "running";
  const hasData   = (fb.count || 0) > 0 || (fb.comments || []).length > 0;
  const reelsUrlsText = (fb.transcriptUrls || []).join("\n");
  if (reelsUrlsText && !els.fbReelsUrls.value.trim()) els.fbReelsUrls.value = reelsUrlsText;
  const transcriptCount = fb.transcripts?.length || 0;
  const hasSrt = Boolean(fb.combinedTranscript || fb.combinedSrt) || transcriptCount > 0;

  els.fbCount.textContent  = transcriptCount ? String(transcriptCount) : String(fb.count || fb.comments?.length || 0);
  els.fbStatus.textContent = statusLabel(fb.status);
  els.fbHint.textContent   = fb.message || "Paste Facebook Reels URLs, then create one SRT.";
  els.fbUrl.textContent    = fb.currentUrl || "Paste public Facebook Reels URLs below.";

  els.startFbTranscript.disabled = isRunning;
  els.exportFbSrt.disabled = isRunning || !hasSrt;
  els.scrapeFacebook.disabled = isRunning || !isFacebookUrl(activeTab?.url);
  els.clearFacebook.disabled  = isRunning;
  els.exportFbXlsx.disabled   = isRunning || !hasData;
  els.exportFbCsv.disabled    = isRunning || !hasData;
}

function renderInstagram(state) {
  const ig        = state.instagram || {};
  const isRunning = ig.status === "running";
  // ponytail: Keep it simple, count is transcripts length. No scrape comments for IG.
  const urlsText  = (ig.transcriptUrls || []).join("\n");
  if (urlsText && !els.igReelsUrls.value.trim()) els.igReelsUrls.value = urlsText;
  const transcriptCount = ig.transcripts?.length || 0;
  const hasSrt = Boolean(ig.combinedTranscript || ig.combinedSrt) || transcriptCount > 0;

  els.igCount.textContent  = String(transcriptCount);
  els.igStatus.textContent = statusLabel(ig.status);
  els.igHint.textContent   = ig.message || "Paste Instagram Reel URLs, then create transcripts.";

  els.startIgTranscript.disabled = isRunning;
  els.exportIgSrt.disabled = isRunning || !hasSrt;
  els.clearInstagram.disabled  = isRunning;
  els.exportIgXlsx.disabled   = isRunning || !hasSrt;
  els.exportIgCsv.disabled    = isRunning || !hasSrt;
}

function render(state) {
  if (!state) return;
  renderTikTok(state);
  renderShopee(state);
  renderFacebook(state);
  renderInstagram(state);
}

// ─── Active tab detection + auto-switch ───────────────────────────────────────
async function updateActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  activeTab = tab || null;

  const url = activeTab?.url || "";

  // Restore persisted tab first
  const stored = await chrome.storage.local.get("activeTabName").catch(() => ({}));
  const savedTab = stored.activeTabName || null;

  // Auto-switch based on current URL or keep manual choice
  if (savedTab && TAB_CONFIG[savedTab]) {
    switchTab(savedTab);
  } else if (isFacebookUrl(url)) {
    switchTab("facebook");
  } else if (isShopeeUrl(url)) {
    switchTab("shopee");
  } else if (isInstagramUrl(url)) {
    switchTab("instagram");
  } else {
    switchTab("tiktok");
  }
}

// ─── Refresh ──────────────────────────────────────────────────────────────────
async function refresh() {
  try {
    await updateActiveTab();
    render(await send({ type: "REVIEW_EXPORTER_GET_STATE" }));
    await initSortFeed();
  } catch {
    els.globalStatus.textContent = "N/A";
    els.hint.textContent = "Extension background is not ready. Reopen the side panel.";
  }
}

// ─── TikTok event listeners ───────────────────────────────────────────────────
els.start.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_START_BATCH", urls: els.urls.value }));
});

els.resume.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_RESUME_BATCH" }));
});

els.pause.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_PAUSE_BATCH" }));
});

els.clear.addEventListener("click", async () => {
  els.urls.value = "";
  render(await send({ type: "REVIEW_EXPORTER_CLEAR_STATE" }));
});

els.exportXlsx.addEventListener("click", async () => {
  render(await exportXlsxLocally("tiktok"));
});

els.exportCsv.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_EXPORT_CSV" }));
});

// ─── Shopee event listeners ───────────────────────────────────────────────────
els.scrapeShopee.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_SHOPEE_SCRAPE", tabId: activeTab?.id }));
});

els.clearShopee.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_CLEAR_SHOPEE" }));
});

els.exportShopeeXlsx.addEventListener("click", async () => {
  render(await exportXlsxLocally("shopee"));
});

els.exportShopeeCsv.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_EXPORT_SHOPEE_CSV" }));
});

// ─── Facebook event listeners ─────────────────────────────────────────────────
els.scrapeFacebook.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_FB_SCRAPE", tabId: activeTab?.id }));
});

els.startFbTranscript.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_FB_TRANSCRIPT_BATCH", urls: els.fbReelsUrls.value }));
});

els.exportFbSrt.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_FB_EXPORT_SRT" }));
});

els.clearFacebook.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_FB_CLEAR" }));
});

els.exportFbXlsx.addEventListener("click", async () => {
  render(await exportXlsxLocally("facebook"));
});

els.exportFbCsv.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_FB_EXPORT_CSV" }));
});

// ─── Instagram event listeners ────────────────────────────────────────────────
els.startIgTranscript.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_IG_TRANSCRIPT_BATCH", urls: els.igReelsUrls.value }));
});

els.exportIgSrt.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_IG_EXPORT_SRT" }));
});

els.clearInstagram.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_IG_CLEAR" }));
});

els.exportIgXlsx.addEventListener("click", async () => {
  render(await exportXlsxLocally("instagram"));
});

els.exportIgCsv.addEventListener("click", async () => {
  render(await send({ type: "REVIEW_EXPORTER_IG_EXPORT_CSV" }));
});

// ─── Lifecycle ────────────────────────────────────────────────────────────────
chrome.tabs.onActivated.addListener(refresh);
chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.status === "complete" || changeInfo.url) refresh();
});

refresh();
setInterval(refresh, 1500);

// ─── Sort Feed Logic ─────────────────────────────────────────────────────────
const sortState = {
  platform: "unknown",
  mode: "items"
};

async function initSortFeed() {
  const url = activeTab?.url || "";
  sortState.platform = detectSortPlatform(url);
  await disablePaidSurfaceToggles();
  renderSortPlatform();
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.logo_animate_on) {
    setBusySort(`Collecting ${platformNameSort()} items...`, 8);
  }
  if (message?.item_collected_no) {
    const count = Number(message.number_items || 0);
    setBusySort(`Collected ${count} items...`, Math.min(95, count));
  }
  if (message?.logo_animate_off || message?.fb_render_done) {
    setDoneSort("Sorted grid rendered.");
  }
  if (message?.sort_feed_error) {
    setDoneSort(errorMessageSort(message));
  }
});

els.modeItems.addEventListener("click", () => setModeSort("items"));
els.modeDates.addEventListener("click", () => setModeSort("dates"));

els.sortButtons.forEach((button) => {
  button.addEventListener("click", () => startSort(button.dataset.sort));
});

function setModeSort(mode) {
  sortState.mode = mode;
  els.modeItems.classList.toggle("active", mode === "items");
  els.modeDates.classList.toggle("active", mode === "dates");
  if (els.itemsRow) els.itemsRow.hidden = mode !== "items";
  if (els.datesRow) els.datesRow.hidden = mode !== "dates";
}

function startSort(sortBy) {
  if (!activeTab?.id) return;
  if (sortState.platform === "instagram") {
    sendInstagramSort(sortBy);
    return;
  }
  if (sortState.platform === "facebook") {
    sendFacebookSort(sortBy);
    return;
  }
  setStatusSort("Open Instagram or Facebook Reels first.");
}

function sendInstagramSort(sortBy) {
  chrome.tabs.sendMessage(activeTab.id, {
    action: "refreshPage",
    sort_by: sortBy,
    dates_items: sortState.mode,
    no_items: selectionValueSort()
  }, handleStartResponseSort);
  setBusySort("Starting Instagram sort...", 4);
}

function sendFacebookSort(sortBy) {
  chrome.tabs.sendMessage(activeTab.id, {
    action: "refreshPageFacebook",
    sort_by: sortBy,
    dates_items: sortState.mode,
    no_items: selectionValueSort()
  }, handleStartResponseSort);
  setBusySort("Starting Facebook sort...", 4);
}

function handleStartResponseSort() {
  if (chrome.runtime.lastError) {
    setDoneSort("Refresh the page, then try again.");
  }
}

function selectionValueSort() {
  return sortState.mode === "dates" ? els.dateSelection.value : els.itemSelection.value;
}

function renderSortPlatform() {
  const supported = sortState.platform === "instagram" || sortState.platform === "facebook";
  els.sortPlatform.textContent = supported ? `${platformNameSort()} profile sorter` : "Open Instagram or Facebook Reels.";
  els.sharesButton.disabled = sortState.platform === "instagram";
  els.sortButtons.forEach((button) => {
    button.disabled = !supported || (button.dataset.sort === "shares" && sortState.platform === "instagram");
  });
}

function setBusySort(text, progress) {
  setStatusSort(text);
  els.sortProgress.value = progress;
  els.sortButtons.forEach((button) => button.disabled = true);
}

function setDoneSort(text) {
  setStatusSort(text);
  els.sortProgress.value = 100;
  renderSortPlatform();
}

function setStatusSort(text) {
  els.sortMessage.textContent = text;
}

function detectSortPlatform(url) {
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("facebook.com")) return "facebook";
  return "unknown";
}

function platformNameSort() {
  return sortState.platform === "facebook" ? "Facebook" : sortState.platform === "instagram" ? "Instagram" : "this page";
}

async function disablePaidSurfaceToggles() {
  await chrome.storage.local.set({
    sortfeed_ig_download_enabled: false,
    sortfeed_ig_transcribe_enabled: false,
    sortfeed_fb_download_enabled: false,
    sortfeed_fb_transcribe_enabled: false
  });
}

function errorMessageSort(message) {
  const type = message?.error_type;
  const messages = {
    back_to_back_sorting: "Refresh the page to start a new sort.",
    post_views: "Instagram Posts do not expose views. Use Reels or another metric.",
    profile_pages: "Open a profile Posts/Reels tab first.",
    no_posts_reels: "Open the Posts or Reels tab first.",
    dates_on_reels: "Date filters work on Instagram Posts only.",
    explore_views_unsupported: "Search views are not available. Use likes, comments, or oldest.",
    saved_root_unsupported: "Open a saved collection or All Posts first.",
    fb_reels_only: "Facebook sorting works on Reels tabs only.",
    fb_go_to_profiles: "Open a Facebook profile Reels page first.",
    fb_saved_dates_unsupported: "Date filters are not supported on this Facebook Reels surface."
  };
  return messages[type] || "Sorting is not available on this page.";
}
