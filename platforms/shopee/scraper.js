(() => {
  const version = "sidebar-shopee-v1";
  if (window.__reviewExporterShopeeScraperLoaded === version) return;
  window.__reviewExporterShopeeScraperLoaded = version;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function emit(type, payload) {
    window.postMessage({ source: "review-exporter-page", type, ...payload }, "*");
  }

  function parseProductIds(url) {
    const matchDot = url.match(/i\.(\d+)\.(\d+)/);
    const matchProduct = url.match(/\/product\/(\d+)\/(\d+)/);
    const params = new URLSearchParams(new URL(url).search);

    if (matchDot) return { shopId: matchDot[1], itemId: matchDot[2] };
    if (matchProduct) return { shopId: matchProduct[1], itemId: matchProduct[2] };
    return {
      shopId: params.get("shopid"),
      itemId: params.get("itemid"),
    };
  }

  function cleanComment(text) {
    return String(text || "").trim().replace(/\s+/g, " ");
  }

  async function scrapeShopee(requestId) {
    const pageUrl = window.location.href;
    const { shopId, itemId } = parseProductIds(pageUrl);

    if (!shopId || !itemId) {
      return {
        ok: false,
        reviews: [],
        message: `Could not find Shopee shopId/itemId from URL: ${pageUrl}`,
      };
    }

    const reviews = [];
    let offset = 0;
    const limit = 50;

    while (true) {
      const apiUrl = `https://shopee.vn/api/v2/item/get_ratings?filter=0&itemid=${encodeURIComponent(itemId)}&limit=${limit}&offset=${offset}&shopid=${encodeURIComponent(shopId)}&type=0`;
      const response = await fetch(apiUrl, {
        credentials: "include",
        headers: { accept: "application/json, text/plain, */*" },
      });

      if (!response.ok) {
        return {
          ok: reviews.length > 0,
          reviews,
          message: response.status === 403
            ? "Shopee asked for verification. Exporting captured reviews."
            : `Shopee ratings API returned ${response.status}.`,
        };
      }

      let data;
      try {
        data = await response.json();
      } catch {
        return {
          ok: reviews.length > 0,
          reviews,
          message: "Shopee returned an unreadable response. Exporting captured reviews.",
        };
      }

      const ratings = data?.data?.ratings || [];
      if (!ratings.length) {
        return {
          ok: true,
          reviews,
          message: `Captured ${reviews.length} Shopee reviews.`,
        };
      }

      for (const rating of ratings) {
        const comment = cleanComment(rating.comment);
        if (!comment) continue;
        reviews.push({
          "Tên người mua": rating.author_username || "",
          "Số sao": rating.rating_star || "",
          "Nội dung": comment,
        });
      }

      emit("SHOPEE_PROGRESS", {
        payload: {
          url: pageUrl,
          count: reviews.length,
          message: `Captured ${reviews.length} Shopee reviews...`,
        },
      });

      offset += limit;
      await sleep(Math.random() * 2000 + 1500);
    }
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.source !== "review-exporter-bridge" || data.type !== "SHOPEE_SCRAPE_START") return;

    scrapeShopee(data.requestId)
      .then((result) => {
        emit("SHOPEE_RESULT", {
          requestId: data.requestId,
          result,
        });
      })
      .catch((error) => {
        emit("SHOPEE_RESULT", {
          requestId: data.requestId,
          result: { ok: false, reviews: [], message: error.message },
        });
      });
  });
})();
