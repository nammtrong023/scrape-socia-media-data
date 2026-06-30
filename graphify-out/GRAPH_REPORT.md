# Graph Report - .  (2026-06-30)

## Corpus Check
- 73 files · ~113,984 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 659 nodes · 1243 edges · 55 communities (48 shown, 7 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 87 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Background Scrapers|Background Scrapers]]
- [[_COMMUNITY_Popup UI Controller|Popup UI Controller]]
- [[_COMMUNITY_Instagram Content Script|Instagram Content Script]]
- [[_COMMUNITY_Icon Platform Concepts|Icon Platform Concepts]]
- [[_COMMUNITY_Instagram Metadata Script|Instagram Metadata Script]]
- [[_COMMUNITY_Extension Manifest|Extension Manifest]]
- [[_COMMUNITY_Facebook Content Script|Facebook Content Script]]
- [[_COMMUNITY_Facebook Metadata Script|Facebook Metadata Script]]
- [[_COMMUNITY_Sort Feed Collector|Sort Feed Collector]]
- [[_COMMUNITY_Popup UI Shell|Popup UI Shell]]
- [[_COMMUNITY_Instagram Explore Sort|Instagram Explore Sort]]
- [[_COMMUNITY_Instagram Saved Sort|Instagram Saved Sort]]
- [[_COMMUNITY_XLSX Library|XLSX Library]]
- [[_COMMUNITY_Minified Helpers A|Minified Helpers A]]
- [[_COMMUNITY_Minified Helpers B|Minified Helpers B]]
- [[_COMMUNITY_Minified Helpers C|Minified Helpers C]]
- [[_COMMUNITY_Minified Helpers D|Minified Helpers D]]
- [[_COMMUNITY_Platform Scraper Panels|Platform Scraper Panels]]
- [[_COMMUNITY_Button Icon Palette|Button Icon Palette]]
- [[_COMMUNITY_Facebook Video Utils|Facebook Video Utils]]
- [[_COMMUNITY_TikTok Interceptor|TikTok Interceptor]]
- [[_COMMUNITY_Minified Helpers E|Minified Helpers E]]
- [[_COMMUNITY_Product Design Docs|Product Design Docs]]
- [[_COMMUNITY_JS Config|JS Config]]
- [[_COMMUNITY_Minified Helpers F|Minified Helpers F]]
- [[_COMMUNITY_Minified Helpers G|Minified Helpers G]]
- [[_COMMUNITY_Minified Helpers H|Minified Helpers H]]
- [[_COMMUNITY_Minified Helpers I|Minified Helpers I]]
- [[_COMMUNITY_Banner Copy Export Icons|Banner Copy Export Icons]]
- [[_COMMUNITY_Brand Lucide Icons|Brand Lucide Icons]]
- [[_COMMUNITY_TikTok Page Interceptor|TikTok Page Interceptor]]
- [[_COMMUNITY_Extension Brand Icons|Extension Brand Icons]]
- [[_COMMUNITY_Package Config|Package Config]]
- [[_COMMUNITY_Minified Helpers J|Minified Helpers J]]
- [[_COMMUNITY_Checkmark Selection Icons|Checkmark Selection Icons]]
- [[_COMMUNITY_Minified Helpers K|Minified Helpers K]]
- [[_COMMUNITY_Export Utilities|Export Utilities]]
- [[_COMMUNITY_Minified Helpers L|Minified Helpers L]]
- [[_COMMUNITY_Shopee Scraper|Shopee Scraper]]
- [[_COMMUNITY_State Management|State Management]]
- [[_COMMUNITY_Popup Filter Icons|Popup Filter Icons]]
- [[_COMMUNITY_WCAG Accessibility|WCAG Accessibility]]
- [[_COMMUNITY_Raycast Button Components|Raycast Button Components]]
- [[_COMMUNITY_Message Types|Message Types]]
- [[_COMMUNITY_Reduced Motion|Reduced Motion]]
- [[_COMMUNITY_Hero Gradient|Hero Gradient]]
- [[_COMMUNITY_Inter Typography|Inter Typography]]

## God Nodes (most connected - your core abstractions)
1. `getState()` - 33 edges
2. `publicState()` - 27 edges
3. `saveState()` - 14 edges
4. `sleep()` - 14 edges
5. `make_xlsx_lib()` - 12 edges
6. `n()` - 12 edges
7. `i()` - 12 edges
8. `SVG Fill Color #888888` - 12 edges
9. `statePatch()` - 10 edges
10. `runBatchFromCurrent()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Platform Side Navigation` --semantically_similar_to--> `pill-tab Segmented Control`  [INFERRED] [semantically similar]
  popup/popup.html → raycast/DESIGN.md
- `Shopping Bag Icon (Lucide)` --represents--> `Shopee Platform`  [EXTRACTED]
  Icons/shopping-bag.svg → PRODUCT.md
- `Brand Personality (Minimalist, Clean, Expert, High-Contrast)` --semantically_similar_to--> `Dark-Canvas Developer-Tools System`  [INFERRED] [semantically similar]
  PRODUCT.md → raycast/DESIGN.md
- `Brand Personality (Minimalist, Clean, Expert, High-Contrast)` --semantically_similar_to--> `Hairline 1px Border Elevation`  [INFERRED] [semantically similar]
  PRODUCT.md → raycast/DESIGN.md
- `Utility First` --semantically_similar_to--> `Marketing Page Is The Product`  [INFERRED] [semantically similar]
  PRODUCT.md → raycast/DESIGN.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Multi-Platform Scraper Side Panel Tabs** — popup_popup_popup_tiktok_panel, popup_popup_popup_shopee_panel, popup_popup_popup_facebook_panel, popup_popup_popup_instagram_panel, popup_popup_popup_sortfeed_panel [EXTRACTED 1.00]
- **Product Design Principles** — product_utility_first, product_deterministic_feedback, product_harmonious_contrast [EXTRACTED 1.00]
- **Raycast Surface Ladder + Hairline Elevation System** — raycast_design_surface_ladder, raycast_design_hairline_borders, raycast_design_dark_canvas_system [EXTRACTED 1.00]
- **Banner Toolbar Action Icons** — icons_bannericonnew_copyiconnew, icons_bannericonnew_exporticonnew [INFERRED 0.85]
- **Theme Checkmark Banner Variants** — icons_bannericons_blackcheckbanner, icons_bannericons_whitecheckbanner, concept_theme_adaptive_checkmarks [INFERRED 0.85]
- **Grey Button Icon Palette** — icons_buttonicons_chatgrey, icons_buttonicons_downgrey, icons_buttonicons_lovegrey, icons_buttonicons_sortfeedold, icons_buttonicons_check, icons_buttonicons_med_save, icons_buttonicons_play, icons_buttonicons_save, icons_buttonicons_share, concept_svg_fill_888888 [INFERRED 0.85]
- **Save Bookmark Icon Variants** — icons_buttonicons_med_save, icons_buttonicons_save [INFERRED 0.95]
- **Feed Engagement Action Icons** — icons_buttonicons_chatgrey, icons_buttonicons_lovegrey, icons_buttonicons_share, icons_buttonicons_save, icons_buttonicons_play, concept_engagement_actions [INFERRED 0.75]
- **Instagram Hover Engagement Metric Icons** — icons_hover_loveig_asset, icons_hover_lovewhite_asset, icons_hover_whitebubble_asset, icons_hover_playig_asset, icons_hover_playigframe_asset [INFERRED 0.85]
- **Hover Content Action Button Icons** — icons_hover_trans_asset, icons_hover_arrowdownblack_asset, concept_transcribe_action, concept_download_action [INFERRED 0.75]
- **Zero State Platform Brand Icons** — icons_zerostateicons_insta_asset, icons_zerostateicons_facebook_asset, concept_instagram_platform, concept_facebook_platform [INFERRED 0.85]
- **Chrome Extension Icon Size Variants** — icons_icon16, icons_icon48, icons_icon128, concept_chrome_extension_branding [EXTRACTED 1.00]
- **Popup Side Navigation Platform Icons** — icons_zerostateicons_tiktok, icons_shopping_bag, icons_popupicons_sortpopup [EXTRACTED 1.00]
- **Copy Button State Icons** — icons_copyblack, icons_checkblack, concept_copy_to_clipboard, concept_copy_success_state [EXTRACTED 0.95]
- **Brand Logo Family** — icons_astroid, icons_logo, icons_icon128, icons_icon48, icons_icon16, concept_brand_arrow_logo [INFERRED 0.85]
- **Popup Filter and Sort Icons** — icons_popupicons_calenderpopup, icons_popupicons_sortpopup, concept_svg_fill_8d939e, concept_date_range_filter, concept_feed_sorting [INFERRED 0.80]
- **Lucide Stroke Icons** — icons_play, icons_shopping_bag, concept_lucide_icon_library [EXTRACTED 1.00]

## Communities (55 total, 7 thin omitted)

### Community 0 - "Background Scrapers"
Cohesion: 0.06
Nodes (82): buildReadableTranscript(), captionTextToSrt(), clearState(), dbgQueue, decodeFacebookEscapedString(), decodeHtmlEntities(), downloadTranscript(), exportCsv() (+74 more)

### Community 1 - "Popup UI Controller"
Cohesion: 0.10
Nodes (36): detectSortPlatform(), disablePaidSurfaceToggles(), downloadXlsx(), els, exportFacebookXlsxFromState(), exportInstagramXlsxFromState(), exportShopeeXlsxFromState(), exportTikTokXlsxFromState() (+28 more)

### Community 2 - "Instagram Content Script"
Cohesion: 0.08
Nodes (22): an(), cn(), ct(), dt(), ht(), it(), Jt(), Kt() (+14 more)

### Community 3 - "Icon Platform Concepts"
Cohesion: 0.09
Nodes (31): API Key Authentication, Comment Engagement Metric, Download Action, Facebook Platform, Instagram Platform, Like / Love Engagement Metric, Navigation Direction Arrow, Play / Views Video Metric (+23 more)

### Community 4 - "Instagram Metadata Script"
Cohesion: 0.09
Nodes (8): createMetadataJsonReels(), getUserNameReels(), inMemoryFeedData, return_date_range(), return_number_selected(), sort_date_posts(), sort_item_posts(), sort_not_all_reels()

### Community 5 - "Extension Manifest"
Cohesion: 0.08
Nodes (23): action, default_icon, default_title, background, service_worker, type, content_scripts, 128 (+15 more)

### Community 6 - "Facebook Content Script"
Cohesion: 0.13
Nodes (13): an(), cn(), Ct(), et(), Gt(), hn(), Ht(), jt() (+5 more)

### Community 7 - "Facebook Metadata Script"
Cohesion: 0.22
Nodes (17): buildInverter(), collect(), collectFields(), digitsToAscii(), fbDateRange(), fbDateRangeLabel(), fbTargetCount(), find_element_facebook() (+9 more)

### Community 8 - "Sort Feed Collector"
Cohesion: 0.20
Nodes (15): absoluteUrl(), cleanText(), collectOnce(), delay(), describeNode(), getAdapter(), mergeItem(), normalizeItem() (+7 more)

### Community 9 - "Popup UI Shell"
Cohesion: 0.12
Nodes (17): UI Loading State, Loading Zero-State Icon, TikTok Platform Icon, Action Grid (Start/Pause/Resume/Clear Controls), App Shell Layout (Header + Side Nav + Panel Region), Data Footer (Export XLSX + Clear Data), Global Status Indicator, Keyboard Shortcut Keycap Hint (+9 more)

### Community 10 - "Instagram Explore Sort"
Cohesion: 0.18
Nodes (13): sfExploreChain, sfExploreCreateMetadata(), sfExploreDispatch(), sfExploreFindElement(), sfExploreFinishSort(), sfExploreFlattenSerp(), sfExploreIsGraphqlUrl(), sfExploreMemory (+5 more)

### Community 11 - "Instagram Saved Sort"
Cohesion: 0.20
Nodes (13): sfSavedCreateMetadata(), sfSavedFindElement(), sfSavedFinishSort(), sfSavedFlattenItems(), sfSavedHandleResponse(), sfSavedIsSavedUrl(), sfSavedMemory, sfSavedNotifyBanner() (+5 more)

### Community 12 - "XLSX Library"
Cohesion: 0.20
Nodes (15): make_xlsx_lib(), a(), en(), Ge(), i(), J(), ke(), n() (+7 more)

### Community 13 - "Minified Helpers A"
Cohesion: 0.29
Nodes (15): a(), b(), c(), Ce(), d(), f(), g(), h() (+7 more)

### Community 14 - "Minified Helpers B"
Cohesion: 0.19
Nodes (15): Be(), de(), fo(), ft(), ge(), go(), Gt(), ho() (+7 more)

### Community 15 - "Minified Helpers C"
Cohesion: 0.23
Nodes (13): b(), c(), f(), G(), h(), He(), Je(), Kt() (+5 more)

### Community 16 - "Minified Helpers D"
Cohesion: 0.21
Nodes (12): co(), en(), hn(), io(), jn(), ln(), lo(), Oe() (+4 more)

### Community 17 - "Platform Scraper Panels"
Cohesion: 0.23
Nodes (12): Facebook Comments & Reels Panel, Instagram Reels Transcripts Panel, Shopee Product Reviews Panel, Platform Side Navigation, Sort Feed Progress Bar, Sort Feed Profile Sorter Panel, Structured Data Extraction (Reviews, Comments, Profile/Feed Sort), Facebook Platform (+4 more)

### Community 18 - "Button Icon Palette"
Cohesion: 0.35
Nodes (11): Social Engagement Actions, Feed Sorting Control, SVG Fill Color #888888, Chat Icon Grey, Down Chevron Icon Grey, Love Heart Icon Grey, Medium Save Bookmark Icon, Play Icon (+3 more)

### Community 19 - "Facebook Video Utils"
Cohesion: 0.25
Nodes (11): bn(), ce(), extractVideoUrlFromPage(), gn(), ie(), Lt(), wn(), xn() (+3 more)

### Community 20 - "TikTok Interceptor"
Cohesion: 0.35
Nodes (9): autoLoad(), dbg(), extractComments(), isFbGraphQL(), _PatchedXHR(), processRawText(), scrapeDOM(), signalDone() (+1 more)

### Community 21 - "Minified Helpers E"
Cohesion: 0.24
Nodes (11): Ae(), at(), $e(), et(), fn(), he(), mn(), pn() (+3 more)

### Community 22 - "Product Design Docs"
Cohesion: 0.20
Nodes (11): Data Scraper Extension UI, Theme Toggle Button, Brand Personality (Minimalist, Clean, Expert, High-Contrast), Dark Mode Switching, Data Analysts, Google Extension Side Panel, Social Media Researchers, Dark-Canvas Developer-Tools System (+3 more)

### Community 23 - "JS Config"
Cohesion: 0.20
Nodes (9): compilerOptions, checkJs, lib, moduleResolution, noEmit, strict, target, exclude (+1 more)

### Community 24 - "Minified Helpers F"
Cohesion: 0.33
Nodes (10): ae(), At(), dn(), fn(), ln(), mn(), pn(), re() (+2 more)

### Community 25 - "Minified Helpers G"
Cohesion: 0.29
Nodes (10): Fe(), ft(), jn(), me(), ne(), nn(), qn(), tt() (+2 more)

### Community 26 - "Minified Helpers H"
Cohesion: 0.33
Nodes (10): ao(), bt(), no(), oo(), Pe(), ro(), so(), tt() (+2 more)

### Community 27 - "Minified Helpers I"
Cohesion: 0.25
Nodes (9): Dt(), It(), Mt(), ot(), pt(), qe(), qt(), Rt() (+1 more)

### Community 28 - "Banner Copy Export Icons"
Cohesion: 0.32
Nodes (8): Copy Success Confirmation State, Copy to Clipboard Action, Export Sorted Data Action, SVG Fill Color #191919, Copy Icon (Banner Toolbar), Export Icon (Banner Toolbar), Black Checkmark Icon, Black Copy Icon

### Community 29 - "Brand Lucide Icons"
Cohesion: 0.25
Nodes (8): Download Media Action, Lucide Icon Library, SVG Theme-Adaptive currentColor, SVG Fill Color #18a8b8, Astroid Brand Mark, Compact Download Icon, Play Icon (Lucide), Shopping Bag Icon (Lucide)

### Community 30 - "TikTok Page Interceptor"
Cohesion: 0.43
Nodes (6): collectComments(), emit(), getAwemeId(), normalize(), parseComment(), parseCommentResponse()

### Community 31 - "Extension Brand Icons"
Cohesion: 0.43
Nodes (7): In-Page Banner Branding, Arrow Motion Brand Logo, Chrome Extension Branding, Chrome Extension Icon 128px, Chrome Extension Icon 16px, Chrome Extension Icon 48px, Sort Feed Brand Logo

### Community 32 - "Package Config"
Cohesion: 0.29
Nodes (6): description, name, private, scripts, zip, version

### Community 33 - "Minified Helpers J"
Cohesion: 0.43
Nodes (7): eo(), K(), O(), ue(), wt(), xe(), Ze()

### Community 34 - "Checkmark Selection Icons"
Cohesion: 0.53
Nodes (6): Feed Item Selection UI, Theme Adaptive Checkmark Variants, Verified Success State, Black Check Banner Icon, White Check Banner Icon, Checkmark Icon

### Community 35 - "Minified Helpers K"
Cohesion: 0.40
Nodes (6): d(), l(), p(), s(), v(), y()

### Community 36 - "Export Utilities"
Cohesion: 0.60
Nodes (4): downloadDataUrl(), timestamp(), toCsv(), toXlsx()

### Community 37 - "Minified Helpers L"
Cohesion: 0.40
Nodes (5): In(), kn(), _n(), _t(), xn()

### Community 38 - "Shopee Scraper"
Cohesion: 0.70
Nodes (4): cleanComment(), emit(), parseProductIds(), scrapeShopee()

### Community 40 - "Popup Filter Icons"
Cohesion: 0.67
Nodes (4): Date Range Filter UI, SVG Fill Color #8D939E, Calendar Popup Icon, Sort Popup Icon

## Ambiguous Edges - Review These
- `Data Scraper Extension UI` → `Raycast Design System`  [AMBIGUOUS]
  popup/popup.html · relation: conceptually_related_to
- `Chat Icon Grey` → `Sort Feed Icon Legacy`  [AMBIGUOUS]
  Icons/ButtonIcons/SortFeedOld.svg · relation: semantically_similar_to
- `Play Icon` → `Play Icon (Lucide)`  [AMBIGUOUS]
  Icons/play.svg · relation: semantically_similar_to
- `arrowDownBlack.png — Black Downward Arrow Icon` → `Transcribe Action`  [AMBIGUOUS]
  Icons/Hover/arrowDownBlack.png · relation: conceptually_related_to
- `trans.png — Transparent Placeholder Icon` → `Download Action`  [AMBIGUOUS]
  Icons/Hover/trans.png · relation: conceptually_related_to
- `Play Icon (Lucide)` → `Download Media Action`  [AMBIGUOUS]
  Icons/play.svg · relation: conceptually_related_to

## Knowledge Gaps
- **63 isolated node(s):** `dbgQueue`, `mergeQueue`, `checkJs`, `moduleResolution`, `target` (+58 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Data Scraper Extension UI` and `Raycast Design System`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Chat Icon Grey` and `Sort Feed Icon Legacy`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Play Icon` and `Play Icon (Lucide)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `arrowDownBlack.png — Black Downward Arrow Icon` and `Transcribe Action`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `trans.png — Transparent Placeholder Icon` and `Download Action`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Play Icon (Lucide)` and `Download Media Action`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `n()` connect `XLSX Library` to `Instagram Content Script`, `Minified Helpers L`, `Facebook Content Script`, `Minified Helpers A`, `Minified Helpers C`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._