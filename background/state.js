// ponytail: state + shared helpers — dùng chung cho tất cả platform modules

const STORAGE_KEY = "reviewExporterState";

export const defaultState = {
  urls: [],
  currentIndex: 0,
  comments: [],
  status: "idle",
  currentVideoUrl: "",
  perVideoCounts: {},
  failures: [],
  lastUpdated: null,
  message: "Paste TikTok video URLs, then start a batch.",
  shopee: {
    status: "idle",
    currentUrl: "",
    reviews: [],
    count: 0,
    message: "Open a Shopee product page, then scrape reviews.",
    failures: [],
    lastUpdated: null,
  },
  facebook: {
    status: "idle",
    currentUrl: "",
    comments: [],
    count: 0,
    message: "Open a Facebook post, then scrape comments.",
    failures: [],
    lastUpdated: null,
    debugLog: [],
    transcriptUrls: [],
    transcriptIndex: 0,
    transcripts: [],
    combinedSrt: "",
    combinedTranscript: "",
  },
  instagram: {
    status: "idle",
    currentUrl: "",
    comments: [],
    count: 0,
    message: "Paste Instagram Reel URLs, then create transcripts.",
    failures: [],
    lastUpdated: null,
    transcriptUrls: [],
    transcriptIndex: 0,
    transcripts: [],
    combinedSrt: "",
    combinedTranscript: "",
  },
};

export async function getState() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const saved = stored[STORAGE_KEY] || {};
  return {
    ...defaultState,
    ...saved,
    shopee: { ...defaultState.shopee, ...(saved.shopee || {}) },
    facebook: { ...defaultState.facebook, ...(saved.facebook || {}) },
    instagram: { ...defaultState.instagram, ...(saved.instagram || {}) },
  };
}

export async function saveState(patch) {
  const next = { ...(await getState()), ...patch, lastUpdated: Date.now() };
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  await updateBadge(next);
  return next;
}

/** @param {string} namespace @param {object} patch */
export function namespacePatch(namespace, patch) {
  return getState().then((state) =>
    saveState({ [namespace]: { ...state[namespace], ...patch, lastUpdated: Date.now() } })
  );
}

export function publicState(state) {
  const total = state.urls.length;
  const activeVideo = total && state.status === "running"
    ? Math.min(state.currentIndex + 1, total)
    : Math.min(state.currentIndex, total);
  const currentCount = state.currentVideoUrl ? (state.perVideoCounts[state.currentVideoUrl] || 0) : 0;

  return {
    ...state,
    total,
    count: state.comments.length,
    activeVideo,
    progressText: total ? `Video ${activeVideo}/${total} - ${currentCount} comments` : "Video 0/0 - 0 comments",
    running: state.status === "running",
    paused: state.status === "paused",
    done: state.status === "done",
  };
}

async function updateBadge(state) {
  const count = state.status === "running"
    ? state.comments?.length || 0
    : state.shopee?.status === "running"
      ? state.shopee?.count || 0
      : state.facebook?.status === "running"
        ? state.facebook?.count || 0
        : state.instagram?.status === "running"
          ? state.instagram?.transcripts?.length || 0
          : 0;
  await chrome.action.setBadgeBackgroundColor({ color: "#111111" });
  await chrome.action.setBadgeText({ text: count ? String(count) : "" });
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
