// ponytail: generic state helpers thay shopeeStatePatch/facebookStatePatch/instagramStatePatch
// Dùng trong background service worker (ES Modules, không phải importScripts context)

const STORAGE_KEY = "reviewExporterState";

/** @returns {Promise<object>} */
export async function getState(defaultState) {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const saved = stored[STORAGE_KEY] || {};
  if (!defaultState) return saved;
  return mergeWithDefault(defaultState, saved);
}

/** @param {object} patch */
export async function saveState(current, patch) {
  const next = { ...current, ...patch, lastUpdated: Date.now() };
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  return next;
}

/**
 * Patch một namespace lồng trong state (ví dụ: "shopee", "facebook", "instagram").
 * @param {string} namespace
 * @param {object} patch
 * @param {() => Promise<object>} getStateFn - hàm getState đầy đủ của background
 * @param {(patch: object) => Promise<object>} saveStateFn
 */
export function makeNamespacePatch(namespace, getStateFn, saveStateFn) {
  return (patch) =>
    getStateFn().then((state) =>
      saveStateFn({
        [namespace]: { ...state[namespace], ...patch, lastUpdated: Date.now() },
      })
    );
}

// ─── internal ─────────────────────────────────────────────────────────────────

function mergeWithDefault(defaultState, saved) {
  const result = { ...defaultState, ...saved };
  // Merge các namespace lồng (shopee, facebook, instagram)
  for (const key of Object.keys(defaultState)) {
    if (defaultState[key] && typeof defaultState[key] === "object" && !Array.isArray(defaultState[key])) {
      result[key] = { ...defaultState[key], ...(saved[key] || {}) };
    }
  }
  return result;
}
