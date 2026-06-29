
const DEBUG = false;

// let isSortingSessionActive = false;
// const IG_SESSION_KEY = "sfIGSession";

let profileNameIG=null; 

const inMemoryFeedData = {
  items: [],
};

function save_data_locally_again(singleNodeJSON) {
  inMemoryFeedData.items.push(singleNodeJSON);
  return inMemoryFeedData.items;
}

function reset_in_memory_feed_data() {
  inMemoryFeedData.items = [];
}

function createMetadataJson(jsonResponse) {
  let metadataPerPost = {};

  // Create date
  let createDate = jsonResponse?.taken_at;
  let timestamp = createDate ? createDate * 1000 : null;
  metadataPerPost.createDate = timestamp
    ? new Date(timestamp).toISOString()
    : "";

  // Create code (post ID)
  metadataPerPost.code = jsonResponse?.code || "";

  // Comments count
  metadataPerPost.commentsCount = jsonResponse?.comment_count ?? null;

  // Likes count
  metadataPerPost.likesCount = jsonResponse?.like_count ?? null;

  // Media type
  metadataPerPost.mediaType = jsonResponse?.media_type ?? null;

  // View count
  metadataPerPost.viewCount = jsonResponse?.view_count ?? null;

  // Username
  metadataPerPost.userName = jsonResponse?.user?.username || "";

  // Caption text
  metadataPerPost.caption = jsonResponse?.caption?.text || "";

  // Post id
  metadataPerPost.postID = jsonResponse?.pk ?? null;

  return metadataPerPost;
}

function getUserNameReels() {
  // 1️⃣ Check cache
  // const cached = sessionStorage.getItem("sortFeedProfileName");
  // if (cached) return cached;

  // 2️⃣ Try to read from DOM immediately
  if (profileNameIG) {
    return profileNameIG;
  }
  else {
  const usernameElement = document.querySelector("header h2 span");
  if (usernameElement) {
    const username = usernameElement.innerText.trim(); 
    profileNameIG=username;
    // sessionStorage.setItem("sortFeedProfileName", username);
    return profileNameIG;
  }
  }
  // // 3️⃣ Nothing found
  // return "";
}

function createMetadataJsonReels(jsonResponse) {
  let metadataPerPost = {};

  // View count (try play_count, fallback to view_count)
  let createPlayCount =
    jsonResponse?.play_count ?? jsonResponse?.view_count ?? null;
  metadataPerPost.viewCount = createPlayCount;

  // Post ID
  metadataPerPost.code = jsonResponse?.code || "";

  // Comments count
  metadataPerPost.commentsCount = jsonResponse?.comment_count ?? null;

  // Likes count
  metadataPerPost.likesCount = jsonResponse?.like_count ?? null;

  // Media type
  metadataPerPost.mediaType = jsonResponse?.media_type ?? null;

  // Username (assumes a helper function like getUserNameReels exists)
  let createUserName = getUserNameReels?.() || "";
  metadataPerPost.userName = createUserName;

  // Reel id
  metadataPerPost.reelID = jsonResponse?.pk ?? null;

  return metadataPerPost;
}

function scroll_to_view(lastElement) {
  lastElement.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Save feed data locally, init and append
function save_data_locally(singleNodeJSON) {
  if (sessionStorage.getItem("sortFeedData") !== null) {
    let itemsCleaned = JSON.parse(sessionStorage.getItem("sortFeedData"));
    itemsCleaned.push(singleNodeJSON);
    sessionStorage.setItem("sortFeedData", JSON.stringify(itemsCleaned));
    return itemsCleaned;
  } else {
    let itemsCleaned = [];
    itemsCleaned.push(singleNodeJSON);
    sessionStorage.setItem("sortFeedData", JSON.stringify(itemsCleaned));
    return itemsCleaned;
  }
}

// Return no of items selected, 0 if all items were selected
function return_number_selected() {
  let sort_selected = sessionStorage.getItem("sortFeedNoItems");

  if (sort_selected === "all_reels") {
    return 0;
  } else {
    return parseInt(sort_selected.replace("_reels", ""), 10) || 0;
  }
}

// Return href
function return_herf(singleNodeJSON) {
  // if media type is 1 or 8 then post (/natgeo/p/DGn8RJ7TQ22/")
  if ([1, 8].includes(singleNodeJSON["mediaType"])) {
    return `/${singleNodeJSON["userName"]}/p/${singleNodeJSON["code"]}/`;
  }
  // if media type is 8 then reel (natgeo/reel/DGolfZ-KQxF/)
  else {
    return `/${singleNodeJSON["userName"]}/reel/${singleNodeJSON["code"]}/`;
  }
}

function find_element(href, retries = 30, interval = 100) {
  return new Promise((resolve) => {
    const tryFind = (attemptsLeft) => {
      const element = document.querySelector(`a[href*="${href}"]`);
      if (element) {
        const parentDiv = element.closest("div");
        resolve(parentDiv);
      } else if (attemptsLeft > 0) {
        setTimeout(() => tryFind(attemptsLeft - 1), interval);
      } else {
        resolve(null);
      }
    };
    tryFind(retries); // Start the loop with retry count
  });
}

// function find_element_instagram_again(href, retries = 30, interval = 100) {
//   return new Promise((resolve) => {
//     const tryFind = (attemptsLeft) => {
//       const element = document.querySelector(`a[href*="${href}"]`);
//       // console.log(`Looking for: a[href*="${href}"]`, element ? 'FOUND' : 'NOT FOUND', `(attempts left: ${attemptsLeft})`);

//       if (element) {
        
//         // this is the div that has the reel 
//         const parentDiv = element.closest("div");
//         // Scroll to trigger lazy loading (same spot as TikTok)
//         parentDiv?.scrollIntoView({ behavior: "auto", block: "center" });

//         // Retry until background-image is valid, then resolve
//         const checkBgLoaded = () => {
//           const bgDiv = parentDiv?.querySelector('[style*="background-image"]');
//           const match = bgDiv?.style?.backgroundImage?.match(/url\(["']?(.*?)["']?\)/);
//           const bgUrl = match ? match[1] : "";
//           const isValid = bgUrl && !bgUrl.startsWith("data:image/gif");

//           if (isValid) {
//             resolve(parentDiv);
//           } else if (retries > 0) {
//             retries--;
//             setTimeout(checkBgLoaded, interval);
//           } else {
//             // Fallback resolve even if media didn't fully load
//             resolve(parentDiv);
//           }
//         };

//         setTimeout(checkBgLoaded, 300);
//       } else if (attemptsLeft > 0) {
//         setTimeout(() => tryFind(attemptsLeft - 1), interval);
//       } else {
//         resolve(null);
//       }
//     };
//     tryFind(retries);
//   });
// }

function find_element_instagram_again(href, retries = 30, interval = 100) {
  return new Promise((resolve) => {
    const tryFind = (attemptsLeft) => {
      const element = document.querySelector(`a[href*="${href}"]`);

      if (element) {
        const parentDiv = element.closest("div");
        parentDiv?.scrollIntoView({ behavior: "auto", block: "center" });

        const isValidBg = () => {
          const bgDiv = parentDiv?.querySelector('[style*="background-image"]');
          const match = bgDiv?.style?.backgroundImage?.match(/url\(["']?(.*?)["']?\)/);
          const bgUrl = match ? match[1] : "";
          return bgUrl && !bgUrl.startsWith("data:image/gif");
        };

        const checkBgLoaded = () => {
          if (isValidBg()) {
            resolve(parentDiv);
          } else if (retries-- > 0) {
            setTimeout(checkBgLoaded, interval);
          } else {
            resolve(parentDiv);
          }
        };

        // Check immediately first, only wait if not ready
        if (isValidBg()) {
          resolve(parentDiv);
        } else {
          setTimeout(checkBgLoaded, 200);
        }

      } else if (attemptsLeft > 0) {
        setTimeout(() => tryFind(attemptsLeft - 1), interval);
      } else {
        resolve(null);
      }
    };

    tryFind(retries);
  });
}

function find_element_instagram_again_posts(href, retries = 30, interval = 100) {
  return new Promise((resolve) => {
    const tryFind = (attemptsLeft) => {
      const anchor = document.querySelector(`a[href*="${href}"]`);
      if (anchor) {
        const parentDiv = anchor.closest("div");
        parentDiv?.scrollIntoView({ behavior: "auto", block: "center" });

        const isRealUrl = (u) => u && !u.startsWith("data:image/gif");

        const hasVisualMedia = () => {
          // 1) <img src="...">
          const img = parentDiv?.querySelector("img[src]");
          const imgUrl = img?.getAttribute("src") || "";

          // 2) inline background-image: url(...)
          const bgDiv = parentDiv?.querySelector('[style*="background-image"]');
          const bgUrl = bgDiv?.style?.backgroundImage
            ?.match(/url\(["']?(.*?)["']?\)/)?.[1] || "";

          return isRealUrl(imgUrl) || isRealUrl(bgUrl);
        };

        const checkMediaLoaded = () => {
          if (hasVisualMedia()) {
            resolve(parentDiv);
          } else if (retries-- > 0) {
            setTimeout(checkMediaLoaded, interval);
          } else {
            // Fallback: don't block forever—resolve so lazy loading can continue
            resolve(parentDiv);
          }
        };

        // Try immediately; if not ready yet, poll
        if (hasVisualMedia()) {
          resolve(parentDiv);
        } else {
          setTimeout(checkMediaLoaded, 200);
        }
      } else if (attemptsLeft > 0) {
        // setTimeout(() => tryFind(a - 1), interval);
        setTimeout(() => tryFind(attemptsLeft - 1), interval);
      } else {
        resolve(null);
      }
    };

    tryFind(retries);
  });
}


// Sort based on selection, most views, etc.
function sort_items(data, sortBy) {
  if (sortBy === "views") {
    return [...data].sort((a, b) => b.viewCount - a.viewCount);
  } else if (sortBy === "likes") {
    return [...data].sort((a, b) => b.likesCount - a.likesCount);
  } else if (sortBy === "comments") {
    return [...data].sort((a, b) => b.commentsCount - a.commentsCount);
  } else if (sortBy === "oldest") {
    return [...data].reverse();
  } else {
    return 0;
  }
}

// Add string element key/field to main posts data
function update_data_object_with_element(singleNodeJSON, element) {
  // create user name (profile name)
  singleNodeJSON.element = element?.outerHTML;
  return singleNodeJSON;
}


function send_items_collected_no(itemsCleaned) {
  if (itemsCleaned !== null) {
    try {
      let items_collected_no = itemsCleaned.length;
      // if (DEBUG) console.log('SEND MESSAGE');
      window.postMessage(
        { item_collected_no: true, number_items: items_collected_no },
        "*",
      );
    } catch (e) {
      console.error("Error sending message", e);
    }
  }
}

function insta_banner_notification(itemsCleaned, postType) {
  if (itemsCleaned !== null) {
    try {
      let items_collected_no = itemsCleaned.length;
      window.postMessage(
        {
          insta_banner_notification: true,
          count: items_collected_no,
          type: postType,
        },
        "*",
      );
    } catch (e) {
      console.error("Error sending message", e);
    }
  }
}

// sends message to banner_on_insta to remove both (overlay & loading banner)
function removeSortFeedBannerMessage() {
  window.postMessage({ insta_banner_notification_remove: true }, "*");
}

async function sort_item_posts(
  numberItems,
  jsonResponse,
  sort_selected,
  nextPage,
) {
  return new Promise(async (resolve) => {
    for (let i = 0; i < numberItems; i++) {
      let singleNode =jsonResponse.data.xdt_api__v1__feed__user_timeline_graphql_connection.edges[i].node;
      let singleNodeJSON = createMetadataJson(singleNode);
      let post_id = singleNodeJSON.code;
      let element = await find_element_instagram_again_posts(post_id);
      let singleNodeJSONUpdated = update_data_object_with_element(singleNodeJSON,element);
      let itemsCleaned = save_data_locally_again(singleNodeJSONUpdated);

      if (sessionStorage.getItem("sortFeedStatus")) { 
      send_items_collected_no(itemsCleaned);
      insta_banner_notification(itemsCleaned, "Posts");
      // check that Stop Socrting wasn't clicks
      let sort_feed_sorting = sessionStorage.getItem("sortFeedStopSorting");

      // ✅ Case 00 -- user clicked stop sorting
      if (sort_feed_sorting === "on") {

        sessionStorage.removeItem("sortFeedStopSorting");
        sessionStorage.removeItem("sortFeedStatus");
        profileNameIG=null; 
        resolve(itemsCleaned);
        return;
      } 
      
      else { 
        // ✅ Case 01 -- scrapped same length chosen
        if (itemsCleaned.length === sort_selected) {

          // reset params & remove overlay/banner
          sessionStorage.removeItem("sortFeedStopSorting");
          sessionStorage.removeItem("sortFeedStatus");
          profileNameIG=null; 
          // removeSortFeedBannerMessage();
          // resolve 
          resolve(itemsCleaned);
          return;
        } 

        // ✅ Case 02 -- no more next pages and reached end of network length
        else if (i === numberItems - 1 && !nextPage) {

          // reset params & remove overlay/banner
          sessionStorage.removeItem("sortFeedStopSorting");
          sessionStorage.removeItem("sortFeedStatus");
          profileNameIG=null; 
          // removeSortFeedBannerMessage();
          // resolve 
          resolve(itemsCleaned);
          return;
        }
        
        // ✅ Case 03 -- keep scrapping!
        else if (i === numberItems - 1 && nextPage) {

          break;
        } 
      }
    }
    }
  });
}

// sort reels function.
async function sort_not_all_reels(
  numberItems,
  jsonResponse,
  sort_selected,
  nextPage,
) {
  return new Promise(async (resolve) => {
    for (let i = 0; i < numberItems; i++) {
      let singleNode =
        jsonResponse.data.xdt_api__v1__clips__user__connection_v2.edges[i].node.media;
      
      if (singleNode.media_type === 2) {
        let singleNodeJSON = createMetadataJsonReels(singleNode);
        // get HTML elements
        let href = return_herf(singleNodeJSON);
        let post_id = singleNodeJSON.code;
        let element = await find_element_instagram_again(post_id);

        // // debug components  
        // console.log('element'); 
        // console.log(post_id); 
        
        let singleNodeJSONUpdated = update_data_object_with_element(
          singleNodeJSON,
          element,
        );
        let itemsCleaned = save_data_locally_again(singleNodeJSONUpdated);

      if (sessionStorage.getItem("sortFeedStatus")) {
        send_items_collected_no(itemsCleaned);
        // add loading banner with updated reels number 
        insta_banner_notification(itemsCleaned, "Reels");
        let sort_feed_sorting = sessionStorage.getItem("sortFeedStopSorting");

        // ✅ Case 00 -- user clicked stop sorting
        if (sort_feed_sorting === "on") {
  
            // reset params & remove overlay/banner
          sessionStorage.removeItem("sortFeedStopSorting");
          sessionStorage.removeItem("sortFeedStatus");
          profileNameIG=null; 
          // removeSortFeedBannerMessage();
          // resolve 

          resolve(itemsCleaned);
          return;
        } 
        
        else { 
          // ✅ Case 01 -- scrapped same length chosen
          if (itemsCleaned.length === sort_selected) {
  
            // reset params & remove overlay/banner
            sessionStorage.removeItem("sortFeedStopSorting");
            sessionStorage.removeItem("sortFeedStatus");
            profileNameIG=null; 
            // removeSortFeedBannerMessage();
            // resolve 

            resolve(itemsCleaned);
            return;
          } 

          // ✅ Case 02 -- no more next pages and reached end of network length
          else if (i === numberItems - 1 && !nextPage) {
  




            // reset params & remove overlay/banner
            sessionStorage.removeItem("sortFeedStopSorting");
            sessionStorage.removeItem("sortFeedStatus");
            profileNameIG=null; 
            // removeSortFeedBannerMessage();
            // resolve 

            resolve(itemsCleaned);
            return;
          }
          
          // ✅ Case 03 -- keep scrapping!
          else if (i === numberItems - 1 && nextPage) {
  
            break;
          } 
        }
      }
      }
    }
  });
}

// remove overlay
function remove_overlay() {
  // if (DEBUG) console.log('REMOVED OVERLAY');
  // document.getElementById("overlay_sort_reels").remove();
  const ov = document.getElementById("overlay_sort_reels");
  if (ov) ov.remove();
}

function return_date_range(sort_selected) {
  // Custom range — encoded as `custom_<fromMs>_<toMs>`
  if (typeof sort_selected === "string" && sort_selected.startsWith("custom_")) {
    const parts = sort_selected.split("_");
    const fromMs = parseInt(parts[1], 10);
    const toMs = parseInt(parts[2], 10);
    if (Number.isFinite(fromMs) && Number.isFinite(toMs)) {
      const start_date = new Date(fromMs);
      const end_date = new Date(toMs);
      // Normalise To to end-of-day so a same-day pick captures the full day.
      end_date.setHours(23, 59, 59, 999);
      return [start_date, end_date];
    }
  }
  let start_date = new Date(); // Current date
  let end_date = new Date(); // Copy current date
  if (sort_selected === "1_week") {
    start_date.setDate(end_date.getDate() - 7);
    return [start_date, end_date];
  } else if (sort_selected === "1_month") {
    start_date.setDate(end_date.getDate() - 30);
    return [start_date, end_date];
  } else if (sort_selected === "3_month") {
    start_date.setDate(end_date.getDate() - 90);
    return [start_date, end_date];
  } else if (sort_selected === "6_month") {
    start_date.setDate(end_date.getDate() - 180);
    return [start_date, end_date];
  } else if (sort_selected === "1_year") {
    start_date.setDate(end_date.getDate() - 360);
    return [start_date, end_date];
  } else if (sort_selected === "all_reels") {
    start_date.setDate(end_date.getDate() - 3600); // 10 years ago
    return [start_date, end_date];
  }
}

function is_create_date_in_range(createDate, startDate, endDate) {
  const createDateObj = new Date(createDate);
  if (isNaN(createDateObj) || isNaN(startDate) || isNaN(endDate)) {
    throw new Error("Invalid date format");
  }
  return createDateObj >= startDate && createDateObj < endDate;
}

async function sort_date_posts(
  numberItems,
  jsonResponse,
  nextPage,
  startDate,
  endDate
) {
  return new Promise(async (resolve) => {
    // Show the sort banner immediately so the user sees feedback even when the
    // first batch of posts is all newer than the requested range (skipped via continue).
    insta_banner_notification(inMemoryFeedData.items || [], "Posts");
    for (let i = 0; i < numberItems; i++) {
      let singleNode = jsonResponse.data.xdt_api__v1__feed__user_timeline_graphql_connection.edges[i].node;
      let singleNodeJSON = createMetadataJson(singleNode);
      let element = await find_element_instagram_again_posts(singleNodeJSON.code);
      let singleNodeJSONUpdated = update_data_object_with_element(singleNodeJSON, element);
      let createDate = singleNodeJSONUpdated.createDate;


      if (sessionStorage.getItem("sortFeedStatus")) {
      let sort_feed_sorting = sessionStorage.getItem("sortFeedStopSorting");

        // ✅ Case 00 -- user clicked stop sorting
        if (sort_feed_sorting === "on") {
          // Only save the in-progress post if it's actually in range. For deep
          // past ranges where the loop is skipping newer-than-end posts, the
          // current post is out-of-range and saving it would surface a wrong post.
          let itemsCleaned;
          try {
            if (is_create_date_in_range(createDate, startDate, endDate)) {
              itemsCleaned = save_data_locally_again(singleNodeJSONUpdated);
            } else {
              itemsCleaned = inMemoryFeedData.items;
            }
          } catch (e) {
            itemsCleaned = inMemoryFeedData.items;
          }
          removeSortFeedBannerMessage();
          sessionStorage.removeItem("sortFeedStopSorting");
          sessionStorage.removeItem("sortFeedStatus");
          resolve(itemsCleaned);
          return;
        } else {

          // ✅ Case 01 — In range, more items ahead (keep scrolling)
          if (is_create_date_in_range(createDate, startDate, endDate) && i !== numberItems - 1) {
  
            let itemsCleaned = save_data_locally_again(singleNodeJSONUpdated);
            send_items_collected_no(itemsCleaned);
            insta_banner_notification(itemsCleaned, "Posts");
          }

          // ✅ Case 02 — In range, last item, no next page
          else if (is_create_date_in_range(createDate, startDate, endDate) && i === numberItems - 1 && nextPage === false) {
  
            let itemsCleaned = save_data_locally_again(singleNodeJSONUpdated);
            send_items_collected_no(itemsCleaned);
            insta_banner_notification(itemsCleaned, "Posts");
            sessionStorage.removeItem("sortFeedStopSorting");
            sessionStorage.removeItem("sortFeedStatus");
            resolve(itemsCleaned);
          }

          // ✅ Case 03 — In range, last item, but more pages
          else if (is_create_date_in_range(createDate, startDate, endDate) && i === numberItems - 1 && nextPage === true) {
  
            let itemsCleaned = save_data_locally_again(singleNodeJSONUpdated);
            send_items_collected_no(itemsCleaned);
            insta_banner_notification(itemsCleaned, "Posts");
          }

          // ✅ Case 04 — Out of range
          else if (!is_create_date_in_range(createDate, startDate, endDate)) {
            if (singleNode.timeline_pinned_user_ids && singleNode.timeline_pinned_user_ids.length > 0) {
              continue; // skip pinned
            }
            // Newer than the end of the range — skip and keep scrolling toward older posts.
            // (For relative-back ranges where end ≈ now this branch never fires.)
            if (new Date(createDate) > endDate) {
              continue;
            }
            // Older than the start — stop the scroll.
            let itemsCleaned = inMemoryFeedData.items;
            sessionStorage.removeItem("sortFeedStopSorting");
            sessionStorage.removeItem("sortFeedStatus");
            resolve(itemsCleaned);
            break;
          }
        }
      }
    }
  });
}


// Main listening function
(function () {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    method,
    url,
    async,
    user,
    password,
  ) {
    this._url = url; // Store the URL for later use
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    this.addEventListener("load", function () {
      // Stories: cache reels_media so the story download button can pick the
      // active item without an extra fetch.
      if (this._url && this._url.includes("/api/v1/feed/reels_media/")) {
        try {
          const json = JSON.parse(this.responseText);
          const reels = json?.reels_media;
          if (Array.isArray(reels)) {
            for (const reel of reels) {
              if (reel?.id && Array.isArray(reel.items)) {
                window.postMessage(
                  {
                    sf_reels_media: {
                      reel_id: reel.id,
                      items: reel.items,
                      user: reel.user || null,
                    },
                  },
                  "*",
                );
              }
            }
          }
        } catch (e) {}
      }

      // Stories: cache reels_tray so the first click on a live story skips a fetch.
      if (this._url && this._url.includes("/api/v1/feed/reels_tray/")) {
        try {
          const json = JSON.parse(this.responseText);
          if (Array.isArray(json?.tray)) {
            window.postMessage({ sf_reels_tray: json.tray }, "*");
          }
        } catch (e) {}
      }

      // Posts tab: Date sorting
      if (
        this._url.includes("/graphql/query") &&
        (this.responseType === "" || this.responseType === "text") &&
        sessionStorage.getItem("sortFeedStatus") &&
        sessionStorage.getItem("sortFeedPostsVSReels") === "Posts" &&
        sessionStorage.getItem("sortItemsVsDates") === "dates" &&
        sessionStorage.getItem("sortFeedSurface") !== "explore_search" &&
        sessionStorage.getItem("sortFeedSurface") !== "saved"
      ) {
        try {
          let jsonResponse = JSON.parse(this.responseText);
          if (
            jsonResponse.data
              .xdt_api__v1__feed__user_timeline_graphql_connection
          ) {
            let numberItems =
              jsonResponse.data
                .xdt_api__v1__feed__user_timeline_graphql_connection.edges
                .length;
            let nextPage =
              jsonResponse.data
                .xdt_api__v1__feed__user_timeline_graphql_connection.page_info
                .has_next_page;
            let sort_selected = sessionStorage.getItem("sortFeedNoItems");
            let [start_date, end_date] = return_date_range(sort_selected);

            sort_date_posts(
              numberItems,
              jsonResponse,
              nextPage,
              start_date,
              end_date,
            ).then((itemsCleaned) => {
              if (itemsCleaned === null) {
                removeSortFeedBannerMessage();
                remove_overlay();
                window.postMessage(
                  { logo_animate_off_zero_insta_time_period: true },
                  "*",
                );
              } else {
                let sort_by = sessionStorage.getItem("sortFeedSortBy");
                let sorted_items = sort_items(itemsCleaned, sort_by);
                removeSortFeedBannerMessage();
                remove_overlay();
                window.postMessage(
                  { logo_animate_off: true, payload: sorted_items },
                  "*",
                );
              }
            });
          }
        } catch (e) {}
      }

      // Posts tab: Item sorting
      else if (
        this._url.includes("/graphql/query") &&
        (this.responseType === "" || this.responseType === "text") &&
        sessionStorage.getItem("sortFeedStatus") &&
        sessionStorage.getItem("sortFeedPostsVSReels") === "Posts" &&
        sessionStorage.getItem("sortItemsVsDates") === "items" &&
        sessionStorage.getItem("sortFeedSurface") !== "explore_search" &&
        sessionStorage.getItem("sortFeedSurface") !== "saved"
      ) {
        // if (!isSortingSessionActive) {
        //   reset_in_memory_feed_data(); // ✅ only on first call
        //   isSortingSessionActive = true;
        // }

        try {
          let jsonResponse = JSON.parse(this.responseText);
          if (
            jsonResponse.data
              .xdt_api__v1__feed__user_timeline_graphql_connection
          ) {
            let numberItems =
              jsonResponse.data
                .xdt_api__v1__feed__user_timeline_graphql_connection.edges
                .length;
            let nextPage =
              jsonResponse.data
                .xdt_api__v1__feed__user_timeline_graphql_connection.page_info
                .has_next_page;
            let sort_selected = return_number_selected();

            let sortValue = sort_selected == 0 ? 10000 : sort_selected;
            sort_item_posts(
              numberItems,
              jsonResponse,
              sortValue,
              nextPage,
            ).then((itemsCleaned) => {
              let sort_by = sessionStorage.getItem("sortFeedSortBy");
              let sorted_items = sort_items(itemsCleaned, sort_by);
              removeSortFeedBannerMessage();
              remove_overlay();
              window.postMessage(
                { logo_animate_off: true, payload: sorted_items },
                "*",
              );
            });
          }
        } catch (e) {}
      }
      // Reels tab: Item sorting
      else if (
        this._url.includes("/graphql/query") &&
        (this.responseType === "" || this.responseType === "text") &&
        sessionStorage.getItem("sortFeedStatus") &&
        sessionStorage.getItem("sortFeedPostsVSReels") === "Reels" &&
        sessionStorage.getItem("sortFeedSurface") !== "explore_search" &&
        sessionStorage.getItem("sortFeedSurface") !== "saved"
      ) {

        try {
          let jsonResponse = JSON.parse(this.responseText);
          if (jsonResponse.data?.xdt_api__v1__clips__user__connection_v2) {
            let numberItems =
              jsonResponse.data.xdt_api__v1__clips__user__connection_v2.edges.length;
            let nextPage =
              jsonResponse.data.xdt_api__v1__clips__user__connection_v2.page_info
                .has_next_page;
            let sort_selected = return_number_selected();
            let sortValue = sort_selected == 0 ? 10000 : sort_selected;


            sort_not_all_reels(numberItems, jsonResponse, sortValue, nextPage)
              .then((itemsCleaned) => {

                let sort_by = sessionStorage.getItem("sortFeedSortBy");
                let sorted_items = sort_items(itemsCleaned, sort_by);

                removeSortFeedBannerMessage(); // sends message to banner_on_insta to remove overlay and loading banner 
                remove_overlay(); // removes overlay again 


                window.postMessage(
                  { logo_animate_off: true, payload: sorted_items },
                  "*",
                );

              })
              .catch((e) => {
                console.error("Reels sort error:", e);
              });
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
    return originalSend.apply(this, arguments);
  };
})();
