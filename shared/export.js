// ponytail: gom 8 hàm export (TikTok/Shopee/FB/IG × xlsx/csv) thành 3 helpers + timestamp

/**
 * @param {string} filename
 * @param {string} mimeType
 * @param {string} dataUrl
 * @param {boolean} [saveAs]
 */
export async function downloadDataUrl(filename, mimeType, dataUrl, saveAs = true) {
  await chrome.downloads.download({ url: dataUrl, filename, saveAs });
}

/**
 * @param {object[]} rows - array of plain objects
 * @param {{ cols?: {wch: number}[], sheetName?: string }} [opts]
 * @param {string} filenamePrefix
 */
export async function toXlsx(rows, opts = {}, filenamePrefix) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  if (opts.cols) ws["!cols"] = opts.cols;
  XLSX.utils.book_append_sheet(wb, ws, opts.sheetName || "Sheet1");

  const bytes = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const binary = Array.from(new Uint8Array(bytes), (b) => String.fromCharCode(b)).join("");
  const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${btoa(binary)}`;
  await downloadDataUrl(
    `${filenamePrefix}_${timestamp()}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    dataUrl,
  );
}

/**
 * @param {object[]} rows
 * @param {string[]} headers - column keys (also used as CSV header row)
 * @param {string} filenamePrefix
 */
export async function toCsv(rows, headers, filenamePrefix) {
  const lines = [
    headers.join(","),
    ...rows.map((item) => headers.map((h) => csvEscape(item[h])).join(",")),
  ];
  const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(`\uFEFF${lines.join("\n")}`)}`;
  await downloadDataUrl(`${filenamePrefix}_${timestamp()}.csv`, "text/csv;charset=utf-8", dataUrl);
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
