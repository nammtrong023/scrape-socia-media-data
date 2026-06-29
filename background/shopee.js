import { getState, saveState, namespacePatch, publicState } from "./state.js";

export const shopee = { runScrape, clearState, exportXlsx, exportCsv, updateProgress };

const statePatch = (patch) => namespacePatch("shopee", patch);

async function runScrape(tabId) {
  if (!tabId) {
    return publicState(await statePatch({ status: "error", message: "No active Shopee tab found." }));
  }
  const tab = await chrome.tabs.get(tabId);
  if (!/shopee\.vn/i.test(tab.url || "")) {
    return publicState(await statePatch({ status: "error", message: "Open a Shopee product page before scraping." }));
  }

  await statePatch({ status: "running", currentUrl: tab.url, reviews: [], count: 0, message: "Starting Shopee scrape...", failures: [] });
  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: ["shared/interceptor-bridge.js"], world: "ISOLATED" });
    await chrome.scripting.executeScript({ target: { tabId }, files: ["platforms/shopee/scraper.js"], world: "MAIN" });
    const result = await chrome.tabs.sendMessage(tabId, { type: "REVIEW_EXPORTER_SHOPEE_SCRAPE", timeoutMs: 10 * 60 * 1000 });
    if (!result?.ok) throw new Error(result?.message || "Shopee scrape failed.");
    return publicState(await statePatch({
      status: "done",
      reviews: result.reviews || [],
      count: result.reviews?.length || 0,
      message: result.message || `Done. Captured ${result.reviews?.length || 0} Shopee reviews.`,
    }));
  } catch (error) {
    const state = await getState();
    return publicState(await statePatch({
      status: "error",
      failures: [...state.shopee.failures, { url: tab.url, message: error.message }],
      message: `Shopee scrape failed: ${error.message}`,
    }));
  }
}

async function clearState() {
  const { defaultState } = await import("./state.js");
  return publicState(await statePatch(defaultState.shopee));
}

async function exportXlsx() {
  const state = await getState();
  const reviews = state.shopee.reviews || [];
  if (!reviews.length) return publicState(await statePatch({ message: "No Shopee reviews captured yet." }));
  return publicState(await statePatch({
    message: `Ready to export ${reviews.length} Shopee reviews. Use Export XLSX in the side panel.`,
  }));
}

async function exportCsv() {
  const state = await getState();
  const reviews = state.shopee.reviews || [];
  if (!reviews.length) return publicState(await statePatch({ message: "No Shopee reviews captured yet." }));

  const headers = ["Tên người mua", "Số sao", "Nội dung"];
  const rows = [headers.join(","), ...reviews.map((item) => headers.map((h) => csvEscape(item[h])).join(","))];
  const url = `data:text/csv;charset=utf-8,${encodeURIComponent(`\uFEFF${rows.join("\n")}`)}`;
  await chrome.downloads.download({ url, filename: `shopee_reviews_${timestamp()}.csv`, saveAs: true });
  return publicState(await statePatch({ message: `Exported ${reviews.length} Shopee reviews to CSV.` }));
}

async function updateProgress(payload) {
  const state = await getState();
  if (state.shopee.status !== "running") return;
  await statePatch({
    currentUrl: payload.url || state.shopee.currentUrl,
    count: payload.count || state.shopee.count,
    message: payload.message || `Captured ${payload.count || state.shopee.count} Shopee reviews...`,
  });
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
