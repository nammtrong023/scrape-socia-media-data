try{chrome.storage.local.set({sortfeed_ig_download_enabled:false,sortfeed_ig_transcribe_enabled:false});}catch(e){}
try{if(sessionStorage.getItem("sortFeedStatus")&&sessionStorage.getItem("sortFeedLocalUserStart")!=="on"){sessionStorage.removeItem("sortFeedStatus");sessionStorage.removeItem("sortFeedSortBy");sessionStorage.removeItem("sortFeedNoItems");sessionStorage.removeItem("sortItemsVsDates");sessionStorage.removeItem("sortFeedPrepLabel");}else if(sessionStorage.getItem("sortFeedLocalUserStart")==="on"){sessionStorage.setItem("sortFeedLocalUserStart","consumed");}}catch(e){}
async function openDB(){return{transaction(){return{objectStore(){return{clear(){}}},done:Promise.resolve()}},close(){}}}
try{
  const sfStyle=document.createElement("style");
  sfStyle.id="sf-local-sort-only";
  sfStyle.textContent="#export-native,#download-all-native,#select-native,#export-native-fb,#download-all-native-fb,#select-native-fb,.sf-hover-btns-wrapper,.sf-fb-hover-cluster,.sf-fb-reel-pill{display:none!important}";
  (document.head||document.documentElement).appendChild(sfStyle);
}catch(e){}
try{window.addEventListener("message",function(e){if(e.source!==window||!e.data)return;if(e.data.fb_render||e.data.logo_animate_off){chrome.runtime.sendMessage({fb_render_done:true}).catch(()=>{});}})}catch(e){}

(()=>{(function(){if(window.__sfBanner)return;let e="sf-banner-stack",t="sf-banner-stack-tk",o={download:".sf-download-banner.sf-ready, .sf-download-banner.sf-error",transcribe:".sf-trans-banner.sf-ready, .sf-trans-banner.sf-error, .sf-trans-banner.sf-limit",gsheets:".sf-gsheets-banner.sf-ready, .sf-gsheets-banner.sf-error, .sf-gsheets-banner.sf-signin",upgrade:".sf-upgrade-banner"},n=g=>chrome.runtime.getURL(g);function r(){return/(^|\.)tiktok\.com$/.test(location.hostname)}document.documentElement.classList.add(r()?"sf-on-tk":"sf-on-ig");function s(){let g=r()?t:e,b=document.getElementById(g);return b||(b=document.createElement("div"),b.id=g,b.style.cssText=["position:fixed","top:15%","left:50%","transform:translateX(-50%)","display:flex","flex-direction:column","gap:8px","width:90%","max-width:600px","z-index:100000"].join(";"),document.body.appendChild(b)),b}function a(g,b,y,x,v){if(!g)return function(){};let N=g.querySelector(".sf-progress-fill"),S=g.querySelector(".sf-progress-pct"),B=Date.now(),U=!1;function H(){if(U)return;let E=Date.now()-B,$=Math.min(1,E/x),I=1-Math.pow(1-$,2),D=Math.round(b+(y-b)*I);N&&(N.style.width=D+"%"),S&&(S.textContent=D+"%"),$<1?requestAnimationFrame(H):v&&v()}return requestAnimationFrame(H),function(){U=!0}}function i(g,b){if(!g)return;let y=Math.max(0,Math.min(100,Math.round(b))),x=g.querySelector(".sf-progress-fill"),v=g.querySelector(".sf-progress-pct");x&&(x.style.width=y+"%"),v&&(v.textContent=y+"%")}function m(g,b){return g?new Promise(function(y){setTimeout(function(){if(!g.isConnected){y();return}g.style.animation="sfSlideBounceUp 0.25s ease forwards",setTimeout(function(){g.remove(),y()},250)},b||0)}):Promise.resolve()}function c(g,b){let y=s(),x=o[b],v=x?Array.prototype.slice.call(document.querySelectorAll(x)):[];v.forEach(function(S){m(S,0)});let N=v.length?260:0;return new Promise(function(S){setTimeout(function(){y.appendChild(g),S(g)},N)})}function f(g){if(!g)return;g.classList.add("sf-static");let b=g.querySelector(".sf-icon");b&&b.classList.add("sf-static")}function d(g,b){let y=document.createElement("button");y.className="sf-banner-close",y.type="button",y.setAttribute("aria-label",b||"Close");let x=document.createElement("span");if(x.className="sf-banner-close-x",x.textContent="\xD7",y.appendChild(x),b){let v=document.createElement("span");v.className="sf-banner-close-tooltip",v.textContent=b,y.appendChild(v)}return y.addEventListener("click",function(v){v.stopPropagation(),typeof g=="function"&&g(v)}),y}function u(g,b){let y=document.createElement("button");y.className="sf-banner-stop",y.type="button",y.setAttribute("aria-label",b||"Stop");let x=document.createElement("span");if(x.className="sf-banner-stop-square",y.appendChild(x),b){let v=document.createElement("span");v.className="sf-banner-close-tooltip",v.textContent=b,y.appendChild(v)}return y.addEventListener("click",function(v){v.stopPropagation(),typeof g=="function"&&g(v)}),y}function p(g,b){let y=document.createElement("button");return y.className="sf-copy-btn",y.type="button",y.innerHTML='<img src="'+n("icons/copyBlack.png")+'" alt="" /><span>Copy</span>',y.addEventListener("click",function(x){x.stopPropagation();let v=typeof g=="function"?g():String(g||"");v&&Promise.resolve(navigator.clipboard.writeText(v)).then(function(){y.classList.add("sf-copy-btn--fading"),setTimeout(function(){y.innerHTML='<img src="'+n("icons/checkBlack.png")+'" alt="" /><span>Copied</span>',y.classList.remove("sf-copy-btn--fading"),y.classList.add("sf-copy-btn--copied"),typeof b=="function"&&b()},100)}).catch(function(){})}),y}function l(){try{return!!(chrome&&chrome.runtime&&chrome.runtime.id)}catch{return!1}}function h(g){let b=g||"Tab timed out from inactivity. Refresh the page to reconnect";if(document.querySelector(".sf-ctx-dead-banner"))return;if(!document.getElementById("sf-ctx-dead-style")){let U=document.createElement("style");U.id="sf-ctx-dead-style",U.textContent=["@keyframes sfCtxDeadIn{0%{transform:translateY(-120%);opacity:0}60%{transform:translateY(10px);opacity:1}80%{transform:translateY(-5px)}100%{transform:translateY(0)}}","@keyframes sfCtxDeadOut{0%{transform:translateY(0);opacity:1}20%{transform:translateY(-10px)}100%{transform:translateY(-120%);opacity:0}}","#sf-ctx-dead-stack{position:fixed;top:15%;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;gap:8px;width:90%;max-width:600px;z-index:100001;pointer-events:none}",".sf-ctx-dead-banner{pointer-events:auto;position:relative;width:100%;box-sizing:border-box;background:#ffffff;padding:12px 16px;padding-right:36px;display:flex;align-items:center;gap:10px;border:1px solid rgba(0,0,0,0.15);border-radius:0.75rem;box-shadow:0 4px 12px rgba(0,0,0,0.12);animation:sfCtxDeadIn 0.25s ease;font-family:-apple-system,BlinkMacSystemFont,system-ui,'Segoe UI',Roboto,'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}",".sf-ctx-dead-banner .sf-ctx-dead-msg{font-size:16px;font-weight:500;color:#37352f;flex-grow:1;letter-spacing:-0.01em;line-height:1.4}",".sf-ctx-dead-banner .sf-ctx-dead-x{position:absolute;top:8px;right:8px;width:20px;height:20px;border:0;background:transparent;color:rgba(0,0,0,0.25);font-size:16px;line-height:1;cursor:pointer;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;padding:0;font-family:inherit;transition:background 0.15s ease,color 0.15s ease}",".sf-ctx-dead-banner .sf-ctx-dead-x:hover{background:rgba(0,0,0,0.05);color:rgba(0,0,0,0.55)}"].join(`
`),(document.head||document.documentElement).appendChild(U)}let y=document.getElementById("sf-ctx-dead-stack");y||(y=document.createElement("div"),y.id="sf-ctx-dead-stack",document.body.appendChild(y));let x=document.createElement("div");x.className="sf-ctx-dead-banner";let v=document.createElement("div");v.className="sf-ctx-dead-msg",v.textContent=b,x.appendChild(v);let N=!1;function S(){N||(N=!0,x.style.animation="sfCtxDeadOut 0.25s ease forwards",setTimeout(function(){x.isConnected&&x.remove()},250))}let B=document.createElement("button");B.className="sf-ctx-dead-x",B.type="button",B.setAttribute("aria-label","Close"),B.textContent="\xD7",B.addEventListener("click",function(U){U.stopPropagation(),S()}),x.appendChild(B),y.appendChild(x),setTimeout(S,6e3)}let _={isDownloading:!1,isTranscribing:!1,isGSheetsLoading:!1};window.__sfBanner={getStack:s,animateProgress:a,setProgress:i,dismissBanner:m,enterBanner:c,setStatic:f,makeCloseButton:d,makeStopButton:u,makeCopyButton:p,guards:_,iconURL:n,isContextAlive:l,showContextDeadBanner:h}})();function Xt(e){let t=e.replace(/^\/|\/$/g,"").split("/"),o=e.includes("reels")||e.includes("tagged")||e.includes("feed")||e.includes("reposts");if(t.length>=1&&!o)return!0}function Jt(e){return e.includes("reels")}function Rt(e,t){if(!/^\/explore\/search\//.test(e))return!1;try{let n=new URLSearchParams(t||"").get("q");return!!(n&&n.trim().length>0)}catch{return!1}}function Qe(e){let t=e.match(/^\/[^\/]+\/saved(?:\/(.*))?$/);if(!t)return null;let o=(t[1]||"").replace(/\/$/,"");return o===""||o==="audio"?"saved_root":o==="all-posts"?"saved_all_posts":"saved_collection"}function Kt(e,t,o){if(document.getElementById("banner_most_viewed_reels")!==null)return chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"back_to_back_sorting"}),!1;if(Rt(location.pathname,location.search)){if(e==="views")return chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"explore_views_unsupported"}),!1;if(t==="dates")return chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"explore_dates_unsupported"}),!1;if(o==="all_reels")return chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"explore_all_unsupported"}),!1;sessionStorage.setItem("sortFeedSurface","explore_search"),sessionStorage.setItem("sortFeedPostsVSReels","Posts");try{let r=(new URLSearchParams(location.search).get("q")||"").trim().slice(0,60).replace(/[^a-zA-Z0-9_-]+/g,"_")||"results";sessionStorage.setItem("sortFeedSearchQuery",r)}catch{}return!0}else if(Qe(location.pathname)){let n=Qe(location.pathname);if(n==="saved_root")return chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"saved_root_unsupported"}),!1;if(t==="dates")return chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"saved_dates_unsupported"}),!1;if(n==="saved_all_posts"){if(e==="comments")return chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"saved_all_posts_comments_unsupported"}),!1;if(e==="views")return chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"saved_all_posts_views_unsupported"}),!1}else if(e==="views")return chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"saved_collection_views_unsupported"}),!1;return sessionStorage.setItem("sortFeedSurface","saved"),sessionStorage.setItem("sortFeedPostsVSReels","Posts"),sessionStorage.setItem("sortFeedSavedSubMode",n==="saved_all_posts"?"all_posts":"collection"),!0}else{let n=document.querySelectorAll('[role="tablist"]')[0];if(typeof n<"u"){let s=n.querySelectorAll('[aria-selected="true"]')[0].getAttribute("href");return Xt(s)?e==="views"?(chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"post_views"}),!1):(sessionStorage.setItem("sortFeedPostsVSReels","Posts"),!0):Jt(s)?t==="dates"?(chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"dates_on_reels"}),!1):(sessionStorage.setItem("sortFeedPostsVSReels","Reels"),!0):(chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"no_posts_reels"}),!1)}else return t==="dates"?(chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"dates_go_to_profiles"}),!1):(chrome.runtime.sendMessage({sort_feed_error:!0,error_type:"profile_pages"}),!1)}}async function Zt(){let e=await openDB(),t=e.transaction("TabData","readwrite");await t.objectStore("TabData").clear(),await t.done,e.close()}chrome.runtime.onMessage.addListener((e,t,o)=>{if(e.action==="refreshPage"&&Kt(e.sort_by,e.dates_items,e.no_items)){sessionStorage.removeItem("sortFeedSortBy"),sessionStorage.removeItem("sortFeedNoItems"),sessionStorage.removeItem("sortFeedStatus"),sessionStorage.removeItem("sortItemsVsDates"),sessionStorage.removeItem("sortFeedData"),sessionStorage.removeItem("sortFeedPrepLabel");let n=Qe(location.pathname),r=n==="saved_all_posts"||n==="saved_collection";!Rt(location.pathname,location.search)&&!r&&(sessionStorage.removeItem("sortFeedSurface"),sessionStorage.removeItem("sortFeedSavedSubMode")),Zt(),sessionStorage.setItem("sortFeedLocalUserStart","on"),sessionStorage.setItem("sortFeedSortBy",e.sort_by),sessionStorage.setItem("sortFeedNoItems",e.no_items),sessionStorage.setItem("sortFeedStatus",!0),sessionStorage.setItem("sortItemsVsDates",e.dates_items);let s=sessionStorage.getItem("sortFeedSurface"),a="profile";s==="explore_search"?a="search":s==="saved"&&(a=sessionStorage.getItem("sortFeedSavedSubMode")==="collection"?"collection":"saved"),sessionStorage.setItem("sortFeedPrepLabel",a),window.location.reload()}});(location.hostname==="www.instagram.com"||location.hostname==="instagram.com")&&(Ue=document.createElement("script"),Ue.src=chrome.runtime.getURL("platforms/instagram/script_instagram.js"),Ue.onload=function(){this.remove()},(document.head||document.documentElement).appendChild(Ue),qe=document.createElement("script"),qe.src=chrome.runtime.getURL("platforms/instagram/explore_sort_instagram.js"),qe.onload=function(){this.remove()},(document.head||document.documentElement).appendChild(qe),He=document.createElement("script"),He.src=chrome.runtime.getURL("platforms/instagram/saved_sort_instagram.js"),He.onload=function(){this.remove()},(document.head||document.documentElement).appendChild(He));var Ue,qe,He;function Qt(){if(document.getElementById("sf-select-anim"))return;let e=document.createElement("style");e.id="sf-select-anim",e.textContent=`
    @keyframes sf-btn-in {
      from { opacity: 0; transform: translateY(4px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0)   scale(1);    }
    }
    @keyframes sf-btn-out {
      from { opacity: 1; transform: translateY(0)    scale(1);    }
      to   { opacity: 0; transform: translateY(-2px) scale(0.96); }
    }
    .sf-btn-out { animation: sf-btn-out 130ms cubic-bezier(0.4, 0, 1, 1) forwards; }
    .sf-btn-in  { animation: sf-btn-in  220ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    @keyframes sf-row-in {
      from { opacity: 0; transform: scale(0.985) translateY(2px); }
      to   { opacity: 1; transform: scale(1)     translateY(0);   }
    }
    .sf-row-in { animation: sf-row-in 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    /* Count badge spring-in \u2014 only fires on the initial 0\u21921 swap (Beta \u2192 1).
       Subsequent count changes and the exit back to 0 are intentionally
       instant. */
    @keyframes sf-count-badge-in {
      from { opacity: 0; transform: scale(0.5); }
      to   { opacity: 1; transform: scale(1);   }
    }
    .sf-count-badge-in { animation: sf-count-badge-in 240ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

    body.sf-select-active [data-sf-custom-ui],
    body.sf-select-active [data-sf-custom-ui] * {
      opacity: 0 !important;
      pointer-events: none !important;
    }

    body.sf-select-active .sf-hover-btns-wrapper {
      display: none !important;
    }
  `,document.head.appendChild(e)}function en(){if(document.getElementById("sortfeed-export-menu-styles"))return;let e=document.createElement("style");e.id="sortfeed-export-menu-styles",e.textContent=`
    .sf-menu, .sf-menu * { box-sizing: border-box; }

    .sf-menu {
      position: absolute;
      bottom: calc(100% + 8px);
      right: 0;
      min-width: 170px;
      padding: 6px;
      border-radius: 10px;

      opacity: 0;
      pointer-events: none;

      transform-origin: bottom right;
      transform: translateY(6px) scale(0.98);

      transition:
        opacity 120ms ease,
        transform 140ms cubic-bezier(.2,.8,.2,1);

      z-index: 2147483647;
    }

    .sf-menu.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .sf-menu-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      padding: 9px 10px;
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
      font-size: 13px;
      font-weight: 500;
      line-height: 1;
      margin: 0;
    }
  `,document.head.appendChild(e)}function ht(e,t,o){if(!e)return;let n=e.dataset.sfThemeDark==="1",r=e.dataset.sfIconFilter||"none",s=e.querySelector("span.sf-btn-label")||e.querySelector("span"),a=e.querySelector("img"),i=e.querySelector(".sf-beta-tag"),m=document.getElementById(t),c=document.getElementById("sf-beta-badge");o>0?(e.style.pointerEvents="auto",e.style.cursor="pointer",s&&(s.style.color=""),a&&(a.style.filter=r),c&&(c.style.display="none"),i&&(i.style.background=n?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.06)",i.style.color=n?"rgba(242,243,245,0.5)":"rgba(0,0,0,0.38)"),m?m.textContent=o:(m=document.createElement("span"),m.id=t,m.style.cssText=`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #fde082;
        color: #6B4E00;
        font-size: 0.68rem;
        font-weight: 500;
        border-radius: 100px;
        height: 18px;
        min-width: 18px;
        padding: 0 5px;
        line-height: 1;
        box-sizing: border-box;
        transform-origin: center;
        will-change: transform, opacity;
      `,m.textContent=o,e.appendChild(m),m.offsetWidth,m.classList.add("sf-count-badge-in"))):(e.style.pointerEvents="none",e.style.cursor="default",m&&m.remove(),c&&(c.style.display=""),s&&(s.style.color=n?"rgba(242,243,245,0.25)":"rgba(0,0,0,0.28)"),a&&(a.style.filter=n?"brightness(0) invert(1) brightness(0.3)":"brightness(0) opacity(0.22)"),i&&(i.style.background=n?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.04)",i.style.color=n?"rgba(242,243,245,0.35)":"rgba(0,0,0,0.32)"))}function tn(){let e=document.querySelectorAll(".sf-select-circle[data-sf-selected='true']").length;ht(document.getElementById("sf-export-transcripts-btn"),"sf-select-count-badge",e),ht(document.getElementById("sf-select-download-btn"),"sf-select-download-count-badge",e)}var nn=0,Nt=25;function on(){let e=window.__sfBanner;if(!e||document.querySelector(".sf-select-cap-banner"))return;let t=document.createElement("div");t.className="sf-banner sf-trans-banner sf-static sf-select-cap-banner",t.innerHTML=`
    <img class="sf-icon sf-static" src="${e.iconURL("Icons/logo.png")}" />
    <div class="sf-message">You can only transcribe up to ${Nt} videos at a time</div>
  `,t.appendChild(e.makeCloseButton(()=>e.dismissBanner(t,0))),e.enterBanner(t,"transcribe"),setTimeout(()=>e.dismissBanner(t,0),5e3)}function sn(e){let t=e.querySelector("img");if(e.dataset.sfSelected==="true")e.dataset.sfSelected="false",e.dataset.sfSelectOrder="",e.style.background="transparent",e.style.borderColor="rgba(255,255,255,0.9)",t&&(t.style.opacity="0");else{if(document.querySelectorAll(".sf-select-circle[data-sf-selected='true']").length>=Nt){on();return}e.dataset.sfSelected="true",e.dataset.sfSelectOrder=++nn,e.style.background="white",e.style.borderColor="white",t&&(t.style.opacity="1")}tn()}function rn(){document.body.dataset.sfSelectMode="true",document.body.classList.add("sf-select-active"),document.querySelectorAll("[data-sf-custom-ui]").forEach(n=>{n.style.display="none",Array.from(n.children).forEach(r=>{r.style.opacity="0"})});let e=chrome.runtime.getURL("icons/ButtonIcons/check.svg");document.querySelectorAll("[data-sf-sorted-item]").forEach(n=>{if(n.querySelector(".sf-select-circle"))return;let r=document.createElement("div");r.className="sf-select-circle",r.dataset.sfSelected="false",r.dataset.sfAction="true",r.style.cssText=`
      position: absolute;
      top: 8px; left: 8px;
      width: 22px; height: 22px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.9);
      background: transparent;
      z-index: 20;
      cursor: pointer;
      box-sizing: border-box;
      display: flex; align-items: center; justify-content: center;
      transition: background-color 0.12s ease, border-color 0.12s ease;
      box-shadow: 0 1px 4px rgba(0,0,0,0.35);
    `;let s=document.createElement("img");s.src=e,s.style.cssText=`
      width: 10px; height: 10px;
      pointer-events: none;
      opacity: 0;
      filter: brightness(0);
      transition: opacity 0.1s ease;
    `,r.appendChild(s),n.appendChild(r)});let o=n=>{let r=n.target.closest("[data-sf-sorted-item]");if(!r)return;n.stopPropagation(),n.preventDefault();let s=r.querySelector(".sf-select-circle");s&&sn(s)};document._sfSelectClickHandler=o,document.addEventListener("click",o,!0)}function an(){delete document.body.dataset.sfSelectMode,document.body.classList.remove("sf-select-active"),document.querySelectorAll("[data-sf-custom-ui]").forEach(e=>{Array.from(e.children).forEach(t=>{t.style.opacity="0"}),e.style.display=""}),document.querySelectorAll(".sf-select-circle").forEach(e=>e.remove()),document._sfSelectClickHandler&&(document.removeEventListener("click",document._sfSelectClickHandler,!0),delete document._sfSelectClickHandler)}function ln(e){let t=document.getElementById("sf-btn-row");if(!t)return;if(window.__sfBanner&&!window.__sfBanner.isContextAlive()){window.__sfBanner.showContextDeadBanner();return}Qt(),t.style.alignItems="stretch";let o=document.getElementById("sf-pill-group"),n=document.getElementById("export-native"),r=document.getElementById("select-native"),s=e.isDark?"transparent":"white",a=e.isDark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.04)",i=e.isDark?"brightness(0) invert(1) brightness(0.85)":"opacity(0.5)",m=e.isDark?"rgba(255,255,255,0.22)":"rgb(230, 230, 230)",c=`
    background-color: ${s};
    color: ${e.isDark?"rgba(242,243,245,0.85)":"#1a1a1a"};
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 0.65rem;
    padding: 10px 16px;
    border-radius: 0;
    border: none;
    transition: background-color 0.15s ease;
    font-size: 0.82rem;
    font-weight: 500;
    line-height: 1;
    font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
    white-space: nowrap;
    user-select: none;
    position: relative;
    overflow: visible;
  `,f=document.createElement("div");f.id="sf-export-transcripts-btn",f.style.cssText=c,f.style.borderRadius="0 8px 8px 0",f.style.borderLeft=`1px solid ${m}`,f.dataset.sfThemeDark=e.isDark?"1":"0",f.dataset.sfIconFilter=i;let d=document.createElement("img");d.src=chrome.runtime.getURL("icons/BannerIconNew/ExportIconNew.svg"),d.style.cssText="height: 0.85rem; width: auto; pointer-events: none;";let u=document.createElement("span");u.className="sf-btn-label",u.textContent="Export + Transcripts",f.appendChild(d),f.appendChild(u);let p=I=>{let D=document.createElement("div");return D.className="tooltip",D.textContent=I,D.style.cssText=`
      position: absolute;
      bottom: calc(100% + 6px);
      left: 50%;
      transform: translateX(-50%) translateY(4px);
      background-color: rgb(0, 0, 0);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 400;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: all 0.2s ease;
      font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
      z-index: 1000;
    `,D},l=p("Export selected data with video transcripts");f.appendChild(l);let h=document.createElement("div");h.id="sf-select-download-btn",h.style.cssText=c,h.style.borderRadius="8px 0 0 8px",h.dataset.sfThemeDark=e.isDark?"1":"0",h.dataset.sfIconFilter=i;let _=document.createElement("img");_.src=chrome.runtime.getURL("icons/downloadCompact.svg"),_.style.cssText="height: 0.85rem; width: auto; pointer-events: none;";let g=document.createElement("span");g.className="sf-btn-label",g.textContent="Download",h.appendChild(_),h.appendChild(g);let b=p("Download media from selected posts");h.appendChild(b),h.style.pointerEvents="none",h.style.cursor="default",g.style.color=e.isDark?"rgba(242,243,245,0.25)":"rgba(0,0,0,0.28)",_.style.filter=e.isDark?"brightness(0) invert(1) brightness(0.3)":"brightness(0) opacity(0.22)",h.addEventListener("mouseover",()=>{h.style.pointerEvents!=="none"&&(h.style.backgroundColor=a,b.style.opacity="1",b.style.transform="translateX(-50%) translateY(0)")}),h.addEventListener("mouseout",()=>{h.style.backgroundColor=s,b.style.opacity="0",b.style.transform="translateX(-50%) translateY(4px)"}),h.addEventListener("click",()=>{if(h.style.pointerEvents==="none"||typeof $t!="function")return;let I=$t();if(I.length===0)return;let D=sessionStorage.getItem("sortFeedSurface"),T=D==="explore_search"||D==="saved"?null:window.location.pathname.replace(/^\/|\/$/g,"").split("/")[0]||I[0]?.userName||"sortfeed";typeof Ve=="function"&&Ve(I,T,"selected")});let y=document.createElement("div");y.id="sf-select-pill-group",y.style.cssText=`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    background-color: ${s};
    border: 1px solid ${m};
    border-radius: 8px;
  `,f.style.pointerEvents="none",f.style.cursor="default",u.style.color=e.isDark?"rgba(242,243,245,0.25)":"rgba(0,0,0,0.28)",d.style.filter=e.isDark?"brightness(0) invert(1) brightness(0.3)":"brightness(0) opacity(0.22)";let x=document.createElement("div");x.id="sf-select-close-btn",x.style.cssText=`
    background-color: ${s};
    color: ${e.isDark?"rgba(242,243,245,0.85)":"#1a1a1a"};
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid ${e.isDark?"rgba(255,255,255,0.22)":"rgb(230, 230, 230)"};
    transition: background-color 0.15s ease;
    font-size: 0.82rem;
    font-weight: 500;
    font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
    white-space: nowrap;
    user-select: none;
  `,x.textContent="Cancel",f.addEventListener("mouseover",()=>{f.style.pointerEvents!=="none"&&(f.style.backgroundColor=a,l.style.opacity="1",l.style.transform="translateX(-50%) translateY(0)")}),f.addEventListener("mouseout",()=>{f.style.backgroundColor=s,l.style.opacity="0",l.style.transform="translateX(-50%) translateY(4px)"}),x.addEventListener("mouseover",()=>{x.style.backgroundColor=a}),x.addEventListener("mouseout",()=>{x.style.backgroundColor=s}),x.addEventListener("click",()=>cn(e)),en();let v=document.createElement("div");v.className="sf-menu",v.style.background=e.menuBg,v.style.border=`1px solid ${e.menuBorder}`,v.style.boxShadow=e.menuShadow,v.style.color=e.menuText,v.style.fontFamily="SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif",v.style.overflow="hidden",v.style.borderRadius="12px",v.style.padding="6px",v.style.zIndex="2147483647";let N=()=>v.classList.contains("open"),S=()=>v.classList.add("open"),B=()=>v.classList.remove("open"),U=()=>N()?B():S(),H=(I,D)=>{let q=document.createElement("div");return q.className="sf-menu-item",q.textContent=I,q.addEventListener("mouseenter",()=>{q.style.background=e.menuItemHoverBg}),q.addEventListener("mouseleave",()=>{q.style.background="transparent"}),q.addEventListener("click",T=>{T.stopPropagation(),chrome.runtime.sendMessage({command:"checkProStatus"},R=>{if(R?.isPro){let L=Array.from(document.querySelectorAll(".sf-select-circle[data-sf-selected='true']")).sort((ee,V)=>Number(ee.dataset.sfSelectOrder)-Number(V.dataset.sfSelectOrder)),O=[];L.forEach(ee=>{let V=ee.closest("[data-sf-sorted-item]");if(!(!V||!V.dataset.sfItemJson))try{O.push(JSON.parse(V.dataset.sfItemJson))}catch{}}),bn(O,D,sessionStorage.getItem("sortFeedPostsVSReels"),e),B()}else{let L=document.querySelectorAll(".sf-select-circle[data-sf-selected='true']").length;B();let O=`${L} Post${L!==1?"s":""} selected \u2014 Transcribe selected with Pro`;typeof be=="function"&&be(O)}})}),q};v.appendChild(H("Google Sheets","google_sheets")),v.appendChild(H("Excel","excel")),v.appendChild(H("CSV","csv")),v.appendChild(H("JSON","json")),f.appendChild(v),f.addEventListener("click",I=>{f.style.pointerEvents!=="none"&&(I.stopPropagation(),U())});let E=I=>{f.contains(I.target)||B()},$=I=>{I.key==="Escape"&&B()};document.addEventListener("click",E),document.addEventListener("keydown",$),f._sf_cleanup=()=>{document.removeEventListener("click",E),document.removeEventListener("keydown",$)},[o,n,r].forEach(I=>{I&&(I.style.animationDelay="0ms",I.classList.add("sf-btn-out"))}),setTimeout(()=>{[o,n,r].forEach(I=>{I&&(I.classList.remove("sf-btn-out"),I.style.animationDelay="",I.style.display="none")}),y.appendChild(h),y.appendChild(f),y.classList.add("sf-btn-in"),x.classList.add("sf-btn-in"),x.style.animationDelay="0ms",t.appendChild(y),t.appendChild(x),rn()},175)}function cn(e){let t=document.getElementById("sf-export-transcripts-btn"),o=document.getElementById("sf-select-pill-group"),n=document.getElementById("sf-select-close-btn");t?._sf_cleanup&&t._sf_cleanup(),an(),[o,n].forEach(r=>{r&&(r.style.animationDelay="0ms",r.classList.add("sf-btn-out"))}),setTimeout(()=>{o&&o.remove(),n&&n.remove();let r=document.getElementById("sf-btn-row"),s=document.getElementById("sf-pill-group"),a=document.getElementById("export-native"),i=document.getElementById("select-native");r&&(r.style.alignItems="stretch"),[s,a,i].forEach(m=>{m&&(m.style.display="flex",m.classList.remove("sf-btn-in","sf-btn-out"),m.style.animationDelay="")}),r&&(r.classList.remove("sf-btn-in"),r.offsetWidth,r.classList.add("sf-btn-in"),r.addEventListener("animationend",()=>{r.classList.remove("sf-btn-in")},{once:!0}))},150)}var Te=[],ie=0,le=0,Q=!1,Ge=!1,ae={},Le={},At=0,te=0,Me=0,Pt=null,Ft=null,oe=0,fe=null,me=null,Ye=null,dn=24e4;function Ae(){return document.querySelector(".sf-trans-banner.sf-progress")}function un(){return"Transcribing"}function Ut(){let e=Ae();if(!e)return;let t=Math.max(0,Math.min(100,Math.round(oe)));window.__sfBanner.setProgress(e,t)}function fn(){let e=window.__sfBanner;if(Ae())return;let t=document.createElement("div");t.className="sf-banner sf-trans-banner sf-progress",t.innerHTML=`
    <img class="sf-icon" src="${e.iconURL("Icons/logo.png")}" />
    <div class="sf-body">
      <div class="sf-message">${un()}</div>
      <div class="sf-progress-row">
        <div class="sf-progress-track"><div class="sf-progress-fill"></div></div>
        <span class="sf-progress-pct">0%</span>
      </div>
    </div>
  `,t.appendChild(e.makeStopButton(()=>{Q=!0,e.guards.isTranscribing=!1,he(),chrome.runtime.sendMessage({command:"cancelSelectMission"}),rt(),$e()},"Stop transcribing")),e.enterBanner(t,"transcribe")}function pn(e,t){if(e==null||t==null)return;let o=Ae();if(!o)return;let n=o.querySelector(".sf-body");if(!n||n.querySelector(".sf-subtitle"))return;let r=Math.ceil(Number(t)/60),s=document.createElement("div");s.className="sf-subtitle",s.textContent=`${r} of ${e} monthly mins left`;let a=n.querySelector(".sf-progress-row");a?n.insertBefore(s,a):n.appendChild(s),s.animate([{opacity:0,transform:"translateY(-3px)"},{opacity:1,transform:"translateY(0)"}],{duration:220,easing:"cubic-bezier(0.22, 1, 0.36, 1)",fill:"both"})}function rt(){let e=window.__sfBanner;he();let t=Ae();t&&e.dismissBanner(t,0)}function mn(){let e=window.__sfBanner;he();let t=Ae();t&&e.animateProgress(t,oe,100,400,()=>{e.dismissBanner(t,0)})}function gn(e){return 1-(1-e)*(1-e)}function at(e,t,o){clearInterval(fe),oe=e;let n=Date.now(),r=Math.max(1,o|0);fe=setInterval(()=>{if(Q){clearInterval(fe);return}let s=Math.min(1,(Date.now()-n)/r);if(oe=e+(t-e)*gn(s),Ut(),s>=1&&(clearInterval(fe),fe=null,!Q&&le<te)){let a=(le+1)/te*100,i=Math.min(a-2,oe+8);i>oe+.5&&at(oe,i,9e3)}},80)}function he(){clearInterval(fe),fe=null}function qt(){for(;ie<2&&Te.length>0&&!Q;){let e=Te.shift();ie++,hn(e)}}async function hn(e){if(Q){ie--;return}let t=e.id,o=null,n=null;if(t)try{let a=await fetch(`https://www.instagram.com/api/v1/media/${t}/info/`,{method:"GET",credentials:"include",headers:{"x-ig-app-id":"936619743392459"}});if(a.ok){let i=await a.json(),m=Array.isArray(i)?i[0]:i?.items?.[0]??i,c=d=>d&&d.match(/<AdaptationSet[^>]*contentType="audio"[^>]*>[\s\S]*?<BaseURL>([^<]+)<\/BaseURL>/i)?.[1]?.replace(/&amp;/g,"&")||null,f=m?.clips_metadata?.original_sound_info?.progressive_download_url;if(f&&/^https?:\/\//i.test(f))o="progressive",n=f;else{let d=c(m?.video_dash_manifest);if(d)o="dashAudio",n=d;else{let u=m?.video_versions?.[0]?.url||null;u&&(o="videoFallback",n=u)}}}}catch{}if(!n||Q){ae[e.code].transcript=null,Q||Me++,ie--,le++,et(null);return}let r=++At;Le[r]=e.code;let s=await Ht();chrome.runtime.sendMessage({command:"SelectMissionTranscribe",ReelType:o,ReelURL:n,jobId:r,userID:s,reelIdUi:e.code,profileName:e.userName,platform:"instagram"})}async function Ht(){try{return(await chrome.storage.local.get("sort_feed_user_id"))?.sort_feed_user_id??null}catch{return null}}function et(e){e!==null&&delete Le[e];let t=le>=te,o=Te.length===0&&ie===0;if(t||o)he(),mn(),setTimeout(()=>$e(),700);else{let n=le/te*100;at(oe,n,600),qt()}}function yn(e){let{type:t,jobId:o}=e;if(t==="MISSION_TRANS_STARTED"){pn(e.monthly_quota_mins,e.monthly_usage_secs);return}if(t!=="MISSION_TRANS_LOADING"){if(t==="MISSION_TRANS_RESULT"){let n=Le[o];n&&ae[n]&&(ae[n].transcript=e.transcription??null),ie--,le++,et(o);return}if(t==="MISSION_TRANS_ERROR"){let n=Le[o];n&&ae[n]&&(ae[n].transcript=null),e.errorCode!=="cancelled"&&Me++,ie--,le++,et(o);return}if(t==="MISSION_TRANS_LIMIT"){Q=!0,he(),typeof st=="function"&&e.limitMessage&&st(e.limitMessage),rt(),$e();return}}}function $e(){if(Ge)return;Ge=!0,window.__sfBanner.guards.isTranscribing=!1,clearTimeout(Ye),Ye=null,me&&(chrome.runtime.onMessage.removeListener(me),me=null);let e=Object.values(ae);if(e.length&&(chrome.runtime.sendMessage({export_click:!0,export_format:Pt,posts_vs_reels:Ft,sorted_data:e}),Me>0&&!Q&&typeof ue=="function")){let t=te-Me;setTimeout(()=>{ue(`Transcribed ${t} of ${te} \u2014 failed items are blank in the export`)},1100)}}function bn(e,t,o){chrome.runtime.sendMessage({command:"checkProStatus"},n=>{if(!n?.isPro){typeof be=="function"&&be();return}let r=window.__sfBanner;if(!r||r.guards.isTranscribing)return;Te=[],ie=0,le=0,Q=!1,Ge=!1,ae={},Le={},At=0,Me=0,oe=0,he(),Pt=t,Ft=e[0]?.postsVsReels??o,e.forEach(i=>{ae[i.code]={...i,transcript:i.mediaType===2?"":null}});let s=e.filter(i=>i.mediaType===2);if(te=s.length,Te=[...s],r.guards.isTranscribing=!0,te===0){$e();return}me&&chrome.runtime.onMessage.removeListener(me),me=i=>{typeof i?.type!="string"||!i.type.startsWith("MISSION_TRANS")||yn(i)},chrome.runtime.onMessage.addListener(me),fn(),Ht().then(i=>{i&&chrome.runtime.sendMessage({command:"fetchTransQuotaInfo",jobId:0,userID:i,mission:!0})}),qt(),Ut();let a=1/te*100;at(0,Math.max(4,Math.min(a-4,12)),8e3),clearTimeout(Ye),Ye=setTimeout(()=>{Ge||(Q=!0,he(),rt(),$e())},te*dn)})}function se(){try{return sessionStorage.getItem("sortFeedSavedSubMode")==="all_posts"}catch{return!1}}function re(){try{return sessionStorage.getItem("sortFeedSurface")==="saved"}catch{return!1}}function ne(e){let t=sessionStorage.getItem("sortFeedSurface");if(t==="explore_search")return`search_${sessionStorage.getItem("sortFeedSearchQuery")||"results"}`;if(t==="saved"){let n=location.pathname.replace(/^\/|\/$/g,"").split("/")[2]||"";if(n==="all-posts")return"saved_all_posts";let r=n;try{r=decodeURIComponent(n)}catch{}return`saved_${r.replace(/[^a-zA-Z0-9_-]+/g,"_")||"collection"}`}return e&&e[0]&&e[0].userName||"sortfeed"}function tt(){if(document.getElementById("overlay_sort_reels"))return;let e=document.getElementsByTagName("body")[0],t=document.createElement("div");t.id="overlay_sort_reels",t.style=`
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  background-color: rgba(255,215,112,0.4);
  z-index: 2;
  cursor: pointer;
  `,t.class="animate__animated animate__zoomIn",e.append(t)}function Y(e){if(e===null||e===0||e>=1&&e<=999)return e;if(e>=1e3&&e<1e6)return(e/1e3).toFixed(1)+"K";if(e>=1e6)return(e/1e6).toFixed(1)+"M"}function it(e){!e||e._sfNewTabAttached||(e._sfNewTabAttached=!0,e.addEventListener("click",t=>{if(t.target.closest('[data-sf-action="true"]'))return;let o=t.target.closest("a")||e.querySelector("a");if(!o)return;let n=o.getAttribute("href");if(!n||!n.startsWith("/"))return;t.preventDefault(),t.stopPropagation();let r=new URL(n,"https://www.instagram.com").toString();window.open(r,"_blank","noopener,noreferrer")},!0))}function lt(e="",t=null,o=null,n=null,r=null){let s=document.createElement("div");s.innerHTML=e,s.style="position: relative;";let a=document.createElement("div");if(a.style=`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.80);
    opacity: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    font-weight: bold;
  `,t!==null&&o!==null){let d=document.createElement("div");d.style=`
      display: flex;
      gap: 40px;
      align-items: center;
      flex-direction: column;
    `;let u=document.createElement("span");u.style="display: flex; align-items: center; gap: 5px;",u.innerHTML=`
      <img src="${chrome.runtime.getURL("icons/Hover/LoveIG.png")}" style="width: 16px;" />
      ${t}
    `;let p=document.createElement("span");p.style="display: flex; align-items: center; gap: 5px;",p.innerHTML=`
      <img src="${chrome.runtime.getURL("icons/Hover/whiteBubble.png")}" style="width: 16px;" />
      ${o}
    `,d.appendChild(u),d.appendChild(p),a.appendChild(d)}let i=document.createElement("div");i.style=`
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    z-index: 10;
    pointer-events: auto;
  `;let m=document.createElement("img");m.src=chrome.runtime.getURL("icons/Hover/arrowDownBlack.png"),m.style=`
    width: 9px;
    height: 9px;
    border-radius: 3px;
    background: #fde082;
    padding: 5px;
  `,i.appendChild(m);let c=document.createElement("div");c.textContent="Download",c.style=`
    position: absolute;
    top: 50%;
    left: -6px;
    transform: translate(-100%, -50%);
    background: #000;
    color: #fff;
    font-size: 10px;
    line-height: 1;
    padding: 4px 8px;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    z-index: 99999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: opacity 120ms ease;
  `,i.appendChild(c),i.addEventListener("mouseenter",()=>{c.style.opacity="1"}),i.addEventListener("mouseleave",()=>{c.style.opacity="0"}),i.addEventListener("click",d=>{d.stopPropagation(),window.postMessage({download:!0,download_item:"posts",download_post_id:n,download_profile_name:r})});let f=document.createElement("div");return f.dataset.sfCustomUi="true",f.style=`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
  `,f.appendChild(a),f.appendChild(i),s.appendChild(f),s.addEventListener("mouseenter",()=>{document.body.dataset.sfSelectMode||(a.style.opacity="1",i.style.opacity="1")}),s.addEventListener("mouseleave",d=>{if(document.body.dataset.sfSelectMode)return;let u=d.relatedTarget;s.contains(u)||(a.style.opacity="0",i.style.opacity="0")}),i.dataset.sfAction="true",it(s),s}function ct(e="",t=null,o=null,n=null,r=null,s=null){let a=document.createElement("div");a.style="position: relative;";let i=document.createElement("div");i.innerHTML=e,i.style.pointerEvents="none",a.appendChild(i);let m=document.createElement("div");if(m.style=`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.62);
    opacity: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    font-weight: bold;
  `,t!==null&&o!==null){let g=document.createElement("div");g.style=`
      display: flex;
      gap: 40px;
      align-items: center;
      flex-direction: column;
    `;let b=document.createElement("span");b.style="display: flex; align-items: center; gap: 5px;",b.innerHTML=`
      <img src="${chrome.runtime.getURL("icons/Hover/LoveIG.png")}" style="width: 16px;" />
      ${t}
    `;let y=document.createElement("span");y.style="display: flex; align-items: center; gap: 5px;",y.innerHTML=`
      <img src="${chrome.runtime.getURL("icons/Hover/whiteBubble.png")}" style="width: 16px;" />
      ${o}
    `,g.appendChild(b),g.appendChild(y),m.appendChild(g)}let c=document.createElement("div");c.style=`
    position: absolute;
    bottom: 10px; right: 10px;
    display: flex; flex-direction: column; gap: 5px;
    align-items: flex-end;
    opacity: 0; z-index: 10;
    pointer-events: auto;
  `;let f=document.createElement("div");f.style=`
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; position: relative;
  `;let d=document.createElement("img");d.src=chrome.runtime.getURL("icons/Hover/trans.png"),d.style=`
    width: 9px; height: 9px; border-radius: 3px;
    background: #fde082; padding: 5px; transition: opacity 0.15s ease;
  `,f.appendChild(d);let u=document.createElement("div");u.textContent="Transcribe",u.style=`
    position: absolute; top: 50%; left: -6px;
    transform: translate(-100%, -50%);
    background: #000; color: #fff; font-size: 10px; line-height: 1;
    padding: 4px 8px; border-radius: 6px; white-space: nowrap;
    opacity: 0; pointer-events: none; z-index: 99999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: opacity 120ms ease;
  `,f.appendChild(u),f.addEventListener("mouseenter",()=>{u.style.opacity="1"}),f.addEventListener("mouseleave",()=>{u.style.opacity="0"}),f.addEventListener("click",g=>{g.stopPropagation(),window.postMessage({trans:!0,download_reel_id:n,download_profile_name:r,download_reel_id_ui:s})});let p=document.createElement("div");p.style=`
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; position: relative;
  `;let l=document.createElement("img");l.src=chrome.runtime.getURL("icons/Hover/arrowDownBlack.png"),l.style=`
    width: 9px; height: 9px; border-radius: 3px;
    background: #fde082; padding: 5px; transition: opacity 0.15s ease;
  `,p.appendChild(l);let h=document.createElement("div");h.textContent="Download",h.style=`
    position: absolute; top: 50%; left: -6px;
    transform: translate(-100%, -50%);
    background: #000; color: #fff; font-size: 10px; line-height: 1;
    padding: 4px 8px; border-radius: 6px; white-space: nowrap;
    opacity: 0; pointer-events: none; z-index: 99999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: opacity 120ms ease;
  `,p.appendChild(h),p.addEventListener("mouseenter",()=>{h.style.opacity="1"}),p.addEventListener("mouseleave",()=>{h.style.opacity="0"}),p.addEventListener("click",g=>{g.stopPropagation(),window.postMessage({download:!0,download_item:"reels",download_reel_id:n,download_profile_name:r})});let _=document.createElement("div");return _.dataset.sfCustomUi="true",_.style=`
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 10; pointer-events: none;
  `,c.style.pointerEvents="auto",m.style.pointerEvents="none",c.appendChild(f),c.appendChild(p),_.appendChild(m),_.appendChild(c),a.appendChild(_),a.addEventListener("mouseover",()=>{document.body.dataset.sfSelectMode||(m.style.opacity="1",c.style.opacity="1")}),a.addEventListener("mouseout",g=>{if(document.body.dataset.sfSelectMode)return;let b=g.relatedTarget;b&&a.contains(b)||(m.style.opacity="0",c.style.opacity="0")}),f.dataset.sfAction="true",p.dataset.sfAction="true",it(a),a}function wn(e="",t=null,o=null,n=null,r=null,s=null,a=null){let i=document.createElement("div");i.style="position: relative;";let m=document.createElement("div");m.innerHTML=e,m.style.pointerEvents="none",i.appendChild(m);let c=document.createElement("div");if(c.style=`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.62);
    opacity: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 15px;
    font-weight: bold;
  `,t!==null&&o!==null&&n!==null){let b=document.createElement("div");b.style=`
      display: flex;
      flex-direction: column;
      gap: 30px;
      align-items: center;
    `;let y=(x,v)=>{let N=document.createElement("span");return N.style="display: flex; align-items: center; gap: 5px;",N.innerHTML=`
        <img src="${x}" style="width: 15px;" />
        ${v}
      `,N};b.appendChild(y(chrome.runtime.getURL("icons/Hover/PlayIG.png"),n)),b.appendChild(y(chrome.runtime.getURL("icons/Hover/LoveWhite.png"),t)),b.appendChild(y(chrome.runtime.getURL("icons/Hover/whiteBubble.png"),o)),c.appendChild(b)}let f=document.createElement("div");f.style=`
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
    opacity: 0;
    z-index: 10;
    pointer-events: auto;
    flex-direction: column;      /* \u2B05\uFE0F stack buttons vertically */
    align-items: flex-end;       /* \u2B05\uFE0F keep them right-aligned */
  `;let d=document.createElement("div");d.style=`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative; /* for centered tooltip */
  `;let u=document.createElement("img");u.src=chrome.runtime.getURL("icons/Hover/trans.png"),u.style=`
    width: 9px;
    height: 9px;
    border-radius: 3px;
    background: #fde082;
    padding: 5px;
  `,d.appendChild(u);let p=document.createElement("div");p.textContent="Transcribe",p.style=`
    position: absolute;
    top: 50%;
    left: -6px;
    transform: translate(-100%, -50%);
    background: #000;
    color: #fff;
    font-size: 10px;
    line-height: 1;
    padding: 4px 8px;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    z-index: 99999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: opacity 120ms ease;
  `,d.appendChild(p),d.addEventListener("mouseenter",()=>{p.style.opacity="1"}),d.addEventListener("mouseleave",()=>{p.style.opacity="0"}),d.addEventListener("click",b=>{b.stopPropagation(),window.postMessage({trans:!0,download_reel_id:r,download_profile_name:s,download_reel_id_ui:a})});let l=document.createElement("div");l.style=`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative; /* for centered tooltip */
  `;let h=document.createElement("img");h.src=chrome.runtime.getURL("icons/Hover/arrowDownBlack.png"),h.style=`
    width: 9px;
    height: 9px;
    border-radius: 3px;
    background: #fde082;
    padding: 5px;
  `,l.appendChild(h);let _=document.createElement("div");_.textContent="Download",_.style=`
    position: absolute;
    top: 50%;
    left: -6px;
    transform: translate(-100%, -50%);
    background: #000;
    color: #fff;
    font-size: 10px;
    line-height: 1;
    padding: 4px 8px;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    z-index: 99999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: opacity 120ms ease;
  `,l.appendChild(_),l.addEventListener("mouseenter",()=>{_.style.opacity="1"}),l.addEventListener("mouseleave",()=>{_.style.opacity="0"}),f.appendChild(d),f.appendChild(l),l.addEventListener("click",b=>{b.stopPropagation(),window.postMessage({download:!0,download_item:"reels",download_reel_id:r,download_profile_name:s})});let g=document.createElement("div");return g.dataset.sfCustomUi="true",g.style=`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none; /* non-interactive container */
`,f.style.pointerEvents="auto",c.style.pointerEvents="none",g.appendChild(c),g.appendChild(f),i.appendChild(g),i.addEventListener("mouseover",()=>{document.body.dataset.sfSelectMode||(c.style.opacity="1",f.style.opacity="1")}),i.addEventListener("mouseout",b=>{if(document.body.dataset.sfSelectMode)return;let y=b.relatedTarget;y&&i.contains(y)||(c.style.opacity="0",f.style.opacity="0")}),d.dataset.sfAction="true",l.dataset.sfAction="true",it(i),i}function yt(){sessionStorage.removeItem("sortFeedSortBy"),sessionStorage.removeItem("sortFeedNoItems"),sessionStorage.removeItem("sortFeedStatus"),sessionStorage.removeItem("sortFeedData"),sessionStorage.removeItem("sortFeedDataSorted"),sessionStorage.removeItem("sortFeedPostsVSReels"),sessionStorage.removeItem("sortFeedProfileName"),sessionStorage.removeItem("sortItemsVsDates")}function bt(){let o=document.getElementsByTagName("main")[0].getElementsByTagName("div")[0].querySelector('[role="tablist"]')?.parentElement;if(!o)return null;let n=o.nextElementSibling;for(;n&&n.tagName!=="DIV";)n=n.nextElementSibling;return n}function wt(e){let t=0,o=0,n=0;try{let r=e?e.querySelectorAll("._ac7v"):[],s=r[0];s&&s.children[0]&&(t=s.children[0].getBoundingClientRect().width,s.children[1]&&(o=Math.max(0,s.children[1].getBoundingClientRect().left-s.children[0].getBoundingClientRect().right))),r[0]&&r[1]&&(n=Math.max(0,r[1].getBoundingClientRect().top-r[0].getBoundingClientRect().bottom)),n||(n=o),o||(o=n)}catch{}return{cellW:t,colGap:o,rowGap:n}}function vt(e,t,o,n){let r=Math.max(80,Math.round((t||220)-2));e.style.cssText=`display: grid;grid-template-columns: repeat(auto-fill, minmax(${r}px, 1fr));column-gap: ${Math.round(o||0)}px;row-gap: ${Math.round(n||0)}px;padding-bottom: 0px; padding-top: 0px; position: relative;`}function vn(e,t){return new Promise(o=>{if(t==="Posts"){let n=bt(),r=wt(n);n.style.display="none";let s=document.createElement("div");s.id="div_most_viewed_reels",s.setAttribute("data-sortfeed","true"),s.className=n.className,vt(s,r.cellW,r.colGap,r.rowGap),n.after(s),e.forEach(a=>{let i=[1,8].includes(a.mediaType)?`https://www.instagram.com/${a.userName}/p/${a.code}/`:`https://www.instagram.com/${a.userName}/reel/${a.code}/`,m=JSON.stringify({id:a.postID??null,code:a.code??null,userName:a.userName??null,url:i,postsVsReels:"Posts",createDate:a.createDate?a.createDate.slice(0,10):null,likesCount:a.likesCount??null,commentsCount:a.commentsCount??null,viewCount:a.viewCount??null,shareCount:a.shareCount??null,mediaType:a.mediaType??null,caption:a.caption??null}),c;a.mediaType==2?c=ct(a.element,Y(a.likesCount),Y(a.commentsCount),a.postID,a.userName,a.code):c=lt(a.element,Y(a.likesCount),Y(a.commentsCount),a.postID,a.userName),c.dataset.sfSortedItem="true",c.dataset.sfItemJson=m,c.style.width="100%",c.style.minWidth="0",s.appendChild(c)}),o(!0)}else if(t==="Reels"){let n=bt(),r=wt(n);n.style.display="none";let s=document.createElement("div");s.id="div_most_viewed_reels",s.setAttribute("data-sortfeed","true"),s.className=n.className,vt(s,r.cellW,r.colGap,r.rowGap),n.after(s),e.forEach(a=>{let i=wn(a.element,Y(a.likesCount),Y(a.commentsCount),Y(a.viewCount),a.reelID,a.userName,a.code);i.dataset.sfSortedItem="true",i.dataset.sfItemJson=JSON.stringify({id:a.reelID??null,code:a.code??null,userName:a.userName??null,url:`https://www.instagram.com/${a.userName}/reel/${a.code}/`,postsVsReels:"Reels",createDate:a.createDate?a.createDate.slice(0,10):null,likesCount:a.likesCount??null,commentsCount:a.commentsCount??null,viewCount:a.viewCount??null,shareCount:a.shareCount??null,mediaType:a.mediaType??null,caption:a.caption??null}),i.querySelectorAll("li").forEach(m=>{let c=m.querySelectorAll("span");c.length>=2&&(c[0].remove(),c[1].remove(),c[2].remove())}),i.style.width="100%",i.style.minWidth="0",s.appendChild(i)}),o(!0)}})}function _n(e,t){let o=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],n=new Date(e),r=new Date(t),s=new Date;return n.getFullYear()===r.getFullYear()&&n.getFullYear()===s.getFullYear()?`${o[n.getMonth()]} ${n.getDate()} \u2013 ${o[r.getMonth()]} ${r.getDate()}`:`${o[n.getMonth()]} ${n.getDate()}, ${n.getFullYear()} \u2013 ${o[r.getMonth()]} ${r.getDate()}, ${r.getFullYear()}`}function xn(e,t,o,n){if(o==="items")return`${e} ${t}`;if(o==="dates"&&typeof n=="string"&&n.startsWith("custom_")){let r=/^custom_(\d+)_(\d+)$/.exec(n);if(r){let s=_n(parseInt(r[1],10),parseInt(r[2],10));return`${e} ${t} from ${s}`}return`${e} ${t}`}else{if(o==="dates"&&n==="1_week")return`${e} ${t} from 1 Week Back`;if(o==="dates"&&n==="1_month")return`${e} ${t} from 1 Month Back`;if(o==="dates"&&n==="3_month")return`${e} ${t} from 3 Months Back`;if(o==="dates"&&n==="6_month")return`${e} ${t} from 6 Months Back`;if(o==="dates"&&n==="1_year")return`${e} ${t} from 1 Year Back`;if(o==="dates"&&n==="all_reels")return`${e} ${t}`}}function Sn(e,t){if(e==="views")return`Most Viewed ${t}`;if(e==="comments")return`Most Commented ${t}`;if(e==="likes")return`Most Liked ${t}`;if(e==="oldest")return`Oldest ${t}`}function Cn(e,t){return e===1?t.slice(0,-1):t}function En(e,t){let o,n,r=se(),s=re();t==="Posts"?(o=["Profile","Post","Create Date","Likes"],r||o.push("Comments"),s&&o.push("Views"),o.push("Caption"),n=e.map(i=>{let m=[1,8].includes(i.mediaType)?`https://www.instagram.com/${i.userName}/p/${i.code}/`:`https://www.instagram.com/${i.userName}/reel/${i.code}/`,c=i.createDate?i.createDate.slice(0,10):"",f=[i.userName,m,c,i.likesCount];return r||f.push(i.commentsCount),s&&f.push(i.viewCount??""),f.push(i.caption??""),f})):t==="Reels"&&(o=["Profile","Reel","Views","Likes","Comments"],n=e.map(i=>{let m=`https://www.instagram.com/${i.userName}/reel/${i.code}/`;return[i.userName,m,i.viewCount,i.likesCount,i.commentsCount]}));let a=[o,...n].map(i=>i.join("	")).join(`
`);navigator.clipboard.writeText(a)}function In(){let e=document.documentElement;return Array.from(e.classList).some(o=>o.toLowerCase().includes("dark"))?{isDark:!0,backgroundColor:"rgb(14, 20, 26)",textColor:"#f2f3f5",bannerBorder:"rgba(255,255,255,0.08)",bannerShadow:"0 1px 3px rgba(0,0,0,0.3)",buttonBg:"rgba(255,255,255,0.07)",buttonHoverBg:"rgba(255,255,255,0.22)",buttonBorder:"rgba(255,255,255,0.13)",buttonShadow:"none",buttonText:"rgba(242,243,245,0.85)",buttonIconFilter:"brightness(0) invert(1) brightness(0.85)",menuBg:"rgba(20, 24, 29, 0.98)",menuBorder:"rgba(255,255,255,0.10)",menuShadow:"0 12px 30px rgba(0,0,0,0.55)",menuItemHoverBg:"rgba(255,255,255,0.08)",menuText:"#f2f3f5",menuMutedText:"rgba(242,243,245,0.7)",copyIcon:"icons/BannerIconNew/CopyIconNew.svg",exportIcon:"icons/BannerIconNew/ExportIconNew.svg",checkIcon:"icons/BannerIcons/whiteCheckBanner.png"}:{isDark:!1,backgroundColor:"white",textColor:"black",bannerBorder:"rgba(0,0,0,0.08)",bannerShadow:"0 1px 3px rgba(0,0,0,0.06)",buttonBg:"white",buttonHoverBg:"rgba(0,0,0,0.04)",buttonBorder:"#E6E6E6",buttonShadow:"0 1px 2px rgba(0,0,0,0.05)",buttonText:"#37352F",buttonIconFilter:"opacity(0.5)",menuBg:"rgba(255,255,255,0.98)",menuBorder:"rgba(0,0,0,0.10)",menuShadow:"0 12px 30px rgba(0,0,0,0.12)",menuItemHoverBg:"rgba(0,0,0,0.04)",menuText:"#111",menuMutedText:"rgba(0,0,0,0.55)",copyIcon:"icons/BannerIconNew/CopyIconNew.svg",exportIcon:"icons/BannerIconNew/ExportIconNew.svg",checkIcon:"icons/BannerIcons/blackCheckBanner.png"}}function kn(e,t,o){let n=document.getElementById("export-native");if(!n)return;if(n._sf_cleanup&&n._sf_cleanup(),!document.getElementById("sortfeed-export-menu-styles")){let l=document.createElement("style");l.id="sortfeed-export-menu-styles",l.textContent=`
      .sf-menu, .sf-menu * { box-sizing: border-box; }

      .sf-menu {
        position: absolute;
        bottom: calc(100% + 8px);   /* above the button */
        right: 0;
        min-width: 170px;
        padding: 6px;
        border-radius: 10px;

        opacity: 0;
        pointer-events: none;

        transform-origin: bottom right;
        transform: translateY(6px) scale(0.98);

        transition:
          opacity 120ms ease,
          transform 140ms cubic-bezier(.2,.8,.2,1);

        z-index: 2147483647;
      }

      .sf-menu.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      .sf-menu-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        padding: 9px 10px;
        border-radius: 8px;
        cursor: pointer;
        user-select: none;
        font-size: 13px;
        font-weight: 500;
        line-height: 1;
        margin: 0;
      }

      /* \u2705 hide the export tooltip while menu is open */
      #export-native.sortfeed-menu-open .tooltip {
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `,document.head.appendChild(l)}let r=n.querySelector(".sf-menu");r&&r.remove();let s=document.createElement("div");s.className="sf-menu",s.style.background=e.menuBg,s.style.border=`1px solid ${e.menuBorder}`,s.style.boxShadow=e.menuShadow,s.style.color=e.menuText,s.style.fontFamily="SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif",s.style.overflow="hidden",s.style.borderRadius="12px",s.style.padding="6px",s.style.zIndex="2147483647";let a=()=>{let l=n.querySelector(".tooltip");l&&(l.style.opacity="0")},i=(l,h)=>{let _=document.createElement("div");return _.className="sf-menu-item",_.textContent=l,_.addEventListener("mouseenter",()=>{_.style.background=e.menuItemHoverBg}),_.addEventListener("mouseleave",()=>{_.style.background="transparent"}),_.addEventListener("click",g=>{if(g.stopPropagation(),window.__sfBanner&&!window.__sfBanner.isContextAlive()){window.__sfBanner.showContextDeadBanner(),f();return}chrome.runtime.sendMessage({export_click:!0,export_format:h,posts_vs_reels:t,sorted_data:o}),f()}),_};s.appendChild(i("Google Sheets","google_sheets")),s.appendChild(i("Excel","excel")),s.appendChild(i("CSV","csv")),s.appendChild(i("JSON","json")),n.appendChild(s);let m=()=>s.classList.contains("open"),c=()=>{n.classList.add("sortfeed-menu-open"),s.classList.add("open"),a()},f=()=>{n.classList.remove("sortfeed-menu-open"),s.classList.remove("open")},d=()=>m()?f():c();n._sf_clickBound||(n._sf_clickBound=!0,n.addEventListener("click",l=>{l.stopPropagation(),d()}));let u=l=>{n.contains(l.target)||f()};document.addEventListener("click",u);let p=l=>{l.key==="Escape"&&f()};document.addEventListener("keydown",p),n._sf_cleanup=()=>{document.removeEventListener("click",u),document.removeEventListener("keydown",p)}}function _t(e=null,t=null,o=null,n=null,r=null,s=null){let a=Cn(e,t),i=Sn(o,a),m=xn(e,a,r,s),c=sessionStorage.getItem("sortFeedSurface")==="explore_search",f=sessionStorage.getItem("sortFeedSurface")==="saved",d=c||f,u=document.getElementsByTagName("main")[0].getElementsByTagName("div")[0],p=d?null:u.querySelectorAll('[role="tablist"]')[0],l=In(),h=document.createElement("div");if(h.id="banner_most_viewed_reels",h.style=`
    display: flex;
    align-items: center;
    background-color: ${l.backgroundColor};
    color: ${l.textColor};
    padding: 20px 40px;
    justify-content: space-between;
    margin-bottom: 0.2em;
    border: 1px solid ${l.bannerBorder};
    box-shadow: ${l.bannerShadow};
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom-left-radius: 0;  /* straight bottom edge */
    border-bottom-right-radius: 0;

      position: relative;     /* \u2705 creates stacking context */
      overflow: visible;      /* \u2705 dropdown can spill outside banner */

  `,!document.getElementById("sf-banner-enter-style")){let T=document.createElement("style");T.id="sf-banner-enter-style",T.textContent=`
      @keyframes sf-banner-enter {
        from { opacity: 0; transform: translateY(-8px) scale(0.985); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      .sf-banner-enter {
        animation: sf-banner-enter 380ms cubic-bezier(0.16, 1, 0.3, 1) both;
        will-change: opacity, transform;
      }
    `,document.head.appendChild(T)}if(h.className="sf-banner-enter",h.addEventListener("animationend",()=>{h.classList.remove("sf-banner-enter"),h.style.willChange="auto"},{once:!0}),d){let T=document.getElementById("div_most_viewed_reels"),R=T?.previousElementSibling,L=R&&R.style&&R.style.display==="none"?R:T;if(L&&L.parentElement)L.parentElement.insertBefore(h,L);else{let O=document.getElementsByTagName("main")[0];O?.insertBefore(h,O.firstChild)}}else p.replaceWith(h);document.getElementById("banner_most_viewed_reels").innerHTML=`
    <div class="text_section" style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;">
      <div class="metrics_section">
        <div id="reels_number_section" style="display: flex; flex-direction: row; margin-bottom: -2px; align-items: center;">
          <h2 style="color: ${l.textColor}; margin: 0; font-size: 0.8rem; line-height: 1.1667; font-weight: 500; letter-spacing: 0.02em; font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;">
            ${m}
          </h2>
        </div>
        <h1 style="color: ${l.textColor}; margin: 0; font-size: 1.6rem; line-height: 1.1667; font-weight: 600; letter-spacing: -0.01em; font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;">
          ${i}
        </h1>
      </div>

      <div class="button_section" style="display: flex; flex-direction: column; justify-content: center;">
        <div id="sf-btn-row" style="display: flex; flex-direction: row; gap: 0.6rem; align-items: stretch;">

          <!-- Pill group: Download all, Copy, Export rendered as one segmented control -->
          <div id="sf-pill-group" style="
            display: flex;
            flex-direction: row;
            align-items: stretch;
            background-color: ${l.isDark?"transparent":"white"};
            border: 1px solid ${l.isDark?"rgba(255,255,255,0.22)":"rgb(230, 230, 230)"};
            border-radius: 8px;
          ">

          <!-- Copy Button (right end of the Download all | Copy pill) -->
          <div id="copy-native" style="
            background-color: ${l.isDark?"transparent":"white"};
            color: ${l.isDark?"rgba(242,243,245,0.85)":"#1a1a1a"};
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
            padding: 10px 16px;
            border-radius: 0 8px 8px 0;
            border: none;
            border-left: 1px solid ${l.isDark?"rgba(255,255,255,0.22)":"rgb(230, 230, 230)"};
            transition: background-color 0.15s ease;
            font-size: 0.82rem;
            font-weight: 500;
            font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
            white-space: nowrap;
            user-select: none;
            gap: 0.65rem;
          ">
            <img src="${chrome.runtime.getURL(l.copyIcon)}" style="
              height: 0.85rem;
              width: auto;
              pointer-events: none;
              filter: ${l.buttonIconFilter};
            "/>
            <span class="sf-btn-label">Copy</span>
            <div class="tooltip" style="
              position: absolute;
              bottom: calc(100% + 6px);
              left: 50%;
              transform: translateX(-50%) translateY(4px);
              background-color: rgb(0, 0, 0);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.75rem;
              font-weight: 400;
              white-space: nowrap;
              pointer-events: none;
              opacity: 0;
              transition: all 0.2s ease;
              font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
              z-index: 1000;
            ">Copy as CSV</div>
          </div>

          <!-- Export Button (standalone primary \u2014 black w/ white text, inverted in dark mode) -->
          <div id="export-native" style="
            background-color: ${l.isDark?"#f2f3f5":"#1a1a1a"};
            color: ${l.isDark?"#1a1a1a":"#ffffff"};
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
            padding: 10px 16px;
            border-radius: 8px;
            border: none;
            transition: background-color 0.15s ease;
            font-size: 0.82rem;
            font-weight: 500;
            font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
            white-space: nowrap;
            user-select: none;
            gap: 0.65rem;
          ">
            <img src="${chrome.runtime.getURL(l.exportIcon)}" style="
              height: 0.85rem;
              width: auto;
              pointer-events: none;
              filter: ${l.isDark?"brightness(0)":"brightness(0) invert(1)"};
            "/>
            <span class="sf-btn-label">Export</span>
            <div class="tooltip" style="
              position: absolute;
              bottom: calc(100% + 6px);
              left: 50%;
              transform: translateX(-50%) translateY(4px);
              background-color: rgb(0, 0, 0);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.75rem;
              font-weight: 400;
              white-space: nowrap;
              pointer-events: none;
              opacity: 0;
              transition: all 0.2s ease;
              font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
              z-index: 1000;
            ">Export sorted data</div>
          </div>

          <!-- Download all Button (icon + label, styled like Copy/Export) -->
          <div id="download-all-native" style="
            background-color: ${l.isDark?"transparent":"white"};
            color: ${l.isDark?"rgba(242,243,245,0.85)":"#1a1a1a"};
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
            padding: 10px 16px;
            border-radius: 8px 0 0 8px;
            border: none;
            transition: background-color 0.15s ease;
            font-size: 0.82rem;
            font-weight: 500;
            font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
            white-space: nowrap;
            user-select: none;
            gap: 0.65rem;
          ">
            <img src="${chrome.runtime.getURL("icons/downloadCompact.svg")}" style="
              height: 0.85rem;
              width: auto;
              pointer-events: none;
              filter: ${l.buttonIconFilter};
            "/>
            <span class="sf-btn-label">Download all</span>
            <div class="tooltip" style="
              position: absolute;
              bottom: calc(100% + 6px);
              left: 50%;
              transform: translateX(-50%) translateY(4px);
              background-color: rgb(0, 0, 0);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.75rem;
              font-weight: 400;
              white-space: nowrap;
              pointer-events: none;
              opacity: 0;
              transition: all 0.2s ease;
              font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
              z-index: 1000;
            ">Download media from all sorted posts</div>
          </div>

          </div><!-- /sf-pill-group -->

          <!-- Select Button (text only, Notion border) -->
          <div id="select-native" style="
            background-color: ${l.isDark?"transparent":"white"};
            color: ${l.isDark?"rgba(242,243,245,0.85)":"#1a1a1a"};
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
            padding: 10px 16px;
            border-radius: 8px;
            border: 1px solid ${l.isDark?"rgba(255,255,255,0.22)":"rgb(230, 230, 230)"};
            transition: background-color 0.15s ease;
            font-size: 0.82rem;
            font-weight: 500;
            font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
            white-space: nowrap;
            user-select: none;
          "><div class="tooltip" style="
              position: absolute;
              bottom: calc(100% + 6px);
              left: 50%;
              transform: translateX(-50%) translateY(4px);
              background-color: rgb(0, 0, 0);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.75rem;
              font-weight: 400;
              white-space: nowrap;
              pointer-events: none;
              opacity: 0;
              transition: all 0.2s ease;
              font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
              z-index: 1000;
            ">Pick posts to export and download</div>Select</div>

        </div>
      </div>
    </div>
  `;{let T=document.getElementById("sf-btn-row"),R=document.getElementById("sf-pill-group"),L=document.getElementById("download-all-native"),O=document.getElementById("copy-native"),ee=document.getElementById("export-native"),V=document.getElementById("select-native");R&&L&&O&&R.insertBefore(L,O),T&&ee&&V&&T.insertBefore(ee,V)}let _=document.getElementById("reels_number_section"),g=document.createElement("img");g.src=chrome.runtime.getURL("Icons/logo.png"),g.style=`
    width: auto;
    margin-right: 0.2rem;
    height: 0.7rem;
  `,_.insertBefore(g,_.firstChild);let b=document.getElementById("export-native"),y=b.querySelector(".tooltip"),x=l.isDark?"#f2f3f5":"#1a1a1a",v=l.isDark?"#e2e3e5":"#000000";b.addEventListener("mouseover",()=>{b.classList.contains("sortfeed-menu-open")||(b.style.backgroundColor=v,y.style.opacity="1",y.style.transform="translateX(-50%) translateY(0)")}),b.addEventListener("mouseout",()=>{b.style.backgroundColor=x,y.style.opacity="0",y.style.transform="translateX(-50%) translateY(4px)"});let N=document.getElementById("copy-native"),S=N.querySelector(".tooltip"),B=l.isDark?"transparent":"white",U=l.isDark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.04)";N.addEventListener("mouseover",()=>{N.style.backgroundColor=U,S.style.opacity="1",S.style.transform="translateX(-50%) translateY(0)"}),N.addEventListener("mouseout",()=>{N.style.backgroundColor=B,S.style.opacity="0",S.style.transform="translateX(-50%) translateY(4px)"});let H=document.getElementById("select-native"),E=l.isDark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.04)",$=l.isDark?"transparent":"white",I=H.querySelector(".tooltip");H.addEventListener("mouseover",()=>{H.style.backgroundColor=E,I&&(I.style.opacity="1",I.style.transform="translateX(-50%) translateY(0)")}),H.addEventListener("mouseout",()=>{H.style.backgroundColor=$,I&&(I.style.opacity="0",I.style.transform="translateX(-50%) translateY(4px)")}),H.addEventListener("click",()=>{ln(l)});let D=document.getElementById("download-all-native"),q=D.querySelector(".tooltip");D.addEventListener("mouseover",()=>{D.style.backgroundColor=U,q.style.opacity="1",q.style.transform="translateX(-50%) translateY(0)"}),D.addEventListener("mouseout",()=>{D.style.backgroundColor=B,q.style.opacity="0",q.style.transform="translateX(-50%) translateY(4px)"}),D.addEventListener("click",()=>{if(!n||n.length===0)return;let T=sessionStorage.getItem("sortFeedSurface"),L=T==="explore_search"||T==="saved"?null:window.location.pathname.replace(/^\/|\/$/g,"").split("/")[0]||n[0]?.userName||"sortfeed";typeof Ve=="function"&&Ve(n,L,"all")}),kn(l,t,n),N.addEventListener("click",()=>{En(n,t);let T=N.querySelector(".tooltip"),R=N.querySelector("img"),L=N.querySelector(".sf-btn-label"),O=T.textContent,ee=R.src,V=L?L.textContent:null,Se=R.style.height||"0.85rem";T.textContent="Results copied",L&&(L.textContent="Copied"),R.src=chrome.runtime.getURL(l.checkIcon),R.style.height="0.65rem",R.style.width="auto";let Fe="opacity 0.18s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)";R.style.transition="none",R.style.opacity="0",R.style.transform="scale(0.5)",L&&(L.style.display="inline-block",L.style.transition="none",L.style.opacity="0",L.style.transform="scale(0.5)"),requestAnimationFrame(()=>{R.style.transition=Fe,R.style.opacity="1",R.style.transform="scale(1)",L&&(L.style.transition=Fe,L.style.opacity="1",L.style.transform="scale(1)")}),setTimeout(()=>{let Ce="opacity 0.15s ease, transform 0.15s ease";R.style.transition=Ce,R.style.opacity="0",R.style.transform="scale(0.7)",L&&(L.style.transition=Ce,L.style.opacity="0",L.style.transform="scale(0.7)"),setTimeout(()=>{T.textContent=O,L&&V!=null&&(L.textContent=V),R.src=ee,R.style.height=Se,R.style.transition="none",R.style.opacity="1",R.style.transform="scale(1)",L&&(L.style.transition="none",L.style.opacity="1",L.style.transform="scale(1)")},150)},1350)})}function Bn(){document.querySelectorAll('img[style*="visibility: hidden"]').forEach(e=>{e.style.visibility="visible"})}function Tn(){let e=document.querySelector('[role="tablist"]');if(e){let t=e.parentElement,o=Array.from(t.children),n=o.indexOf(e),r=o[n+1];r&&r.remove()}}window.addEventListener("message",e=>{if(e.source===window){if(e.data.logo_animate_off){if(document.getElementById("banner_most_viewed_reels"))return;let t=e.data.payload,o=sessionStorage.getItem("sortFeedPostsVSReels"),n=e.data.sf_surface==="explore_search";(e.data.sf_surface==="saved"?Pn(t):n?Dn(t):vn(t,o)).then(()=>{let a=t.length,i=sessionStorage.getItem("sortFeedSortBy"),m=sessionStorage.getItem("sortFeedPostsVSReels"),c=sessionStorage.getItem("sortItemsVsDates"),f=sessionStorage.getItem("sortFeedNoItems");window.scrollTo({top:0,behavior:"smooth"}),Bn(),_t(a,m,i,t,c,f),yt(),chrome.runtime.sendMessage({logo_animate_off:!0})})}else if(e.data.logo_animate_off_zero_insta_time_period){let t=null,o=sessionStorage.getItem("sortFeedSortBy"),n=0,r=sessionStorage.getItem("sortItemsVsDates"),s=sessionStorage.getItem("sortFeedNoItems");window.scrollTo({top:0,behavior:"smooth"}),Tn(),_t(n,"Posts",o,t,r,s),yt(),chrome.runtime.sendMessage({logo_animate_off:!0})}else if(e.data.item_collected_no){let t=e.data.number_items;chrome.runtime.sendMessage({item_collected_no:!0,number_items:t})}}});window.addEventListener("load",function(){sessionStorage.getItem("sortFeedStatus")&&(tt(),chrome.runtime.sendMessage({logo_animate_on:!0}))});function Ln(){if(document.getElementById("sf-explore-overrides"))return;let e=document.createElement("style");e.id="sf-explore-overrides",e.textContent=`
    /* Kill IG's infinite-scroll spinner only \u2014 narrowly target the SVG
     * itself, not "any element that contains it". An earlier :has(>...)
     * version could swallow ancestors that also contained IG's sticky
     * header, leaving items unclipped on scroll. */
    body[data-sf-explore-sort-active="true"] svg[aria-label="Loading..."] {
      display: none !important;
    }

    /* Banner needs a low but non-auto z-index so the Export dropdown
     * (z-index 2147483647) reliably paints above sorted-grid tiles, which
     * often live in their own stacking contexts (transform / will-change /
     * etc.). A modest value of 10 wins against auto-z items but stays
     * comfortably below IG's sticky search header (which we lock at 1000
     * below). */
    body[data-sf-explore-sort-active="true"] #banner_most_viewed_reels {
      z-index: 10 !important;
    }

    /* Pin IG's search-results header ("Nike", "running", etc.) to the top
     * of the viewport. IG's natural sticky breaks once we hide the original
     * grid (display:none shrinks the containing block, so the sticky
     * boundary collapses early and items scroll past the header). Forcing
     * sticky + a high z-index + a solid background keeps items from
     * showing above it on scroll. Light/dark backgrounds match IG's theme. */
    body[data-sf-explore-sort-active="true"] main > div > div.html-div:first-child {
      position: sticky !important;
      top: 0 !important;
      z-index: 1000 !important;
      background-color: rgb(255, 255, 255) !important;
    }
    html[class*="dark" i] body[data-sf-explore-sort-active="true"] main > div > div.html-div:first-child {
      background-color: rgb(0, 0, 0) !important;
    }

    /* Flip the Export dropdown and button tooltips to open DOWNWARD on
     * explore. Upward is where IG's chrome lives and that area both clips
     * (overflow) and over-paints (stacking) our content \u2014 opening into the
     * sorted-grid area below sidesteps both. */
    body[data-sf-explore-sort-active="true"] #banner_most_viewed_reels .sf-menu {
      bottom: auto !important;
      top: calc(100% + 8px) !important;
      transform-origin: top right !important;
    }
    body[data-sf-explore-sort-active="true"] #banner_most_viewed_reels .tooltip {
      bottom: auto !important;
      top: calc(100% + 6px) !important;
    }
  `,document.head.appendChild(e)}function Mn(){let e=document.querySelector('main a[href^="/p/"]')||document.querySelector('a[href^="/p/"]');if(!e)return null;let t=e.parentElement,o=0;for(;t&&t!==document.body&&t!==document.documentElement&&o<12;){if(Array.from(t.children).filter(r=>r.querySelector&&r.querySelector('a[href^="/p/"]')).length>=2)return t;t=t.parentElement,o++}return null}function $n(e){let t=0,o=0,n=0;try{let s=getComputedStyle(e);o=parseFloat(s.columnGap)||0,n=parseFloat(s.rowGap)||0;let a=e.firstElementChild;if(a&&(t=a.getBoundingClientRect().width),!t&&s.gridTemplateColumns&&s.gridTemplateColumns!=="none"){let i=s.gridTemplateColumns.trim().split(/\s+/).length,m=e.getBoundingClientRect().width;i>=1&&m>0&&(t=(m-o*(i-1))/i)}}catch{}return`display: grid;grid-template-columns: repeat(auto-fill, minmax(${Math.max(80,Math.round((t||220)-2))}px, 1fr));column-gap: ${Math.round(o)}px;row-gap: ${Math.round(n)}px;padding-bottom: 0px; padding-top: 0px; position: relative;`}function Dn(e){return new Promise(t=>{let o=Mn();if(!o){console.error("[SortFeed][explore] grid container not found \u2014 DOM may have changed"),t(!1);return}let n=$n(o);o.style.display="none",Ln(),document.body.setAttribute("data-sf-explore-sort-active","true");let r=document.createElement("div");r.id="div_most_viewed_reels",r.setAttribute("data-sortfeed","true"),r.className=o.className,r.style=n,o.after(r),e.forEach(s=>{let a=s.mediaType===2,i=a?`https://www.instagram.com/${s.userName}/reel/${s.code}/`:`https://www.instagram.com/${s.userName}/p/${s.code}/`,m=JSON.stringify({id:s.postID??null,code:s.code??null,userName:s.userName??null,url:i,postsVsReels:"Posts",createDate:s.createDate?s.createDate.slice(0,10):null,likesCount:s.likesCount??null,commentsCount:s.commentsCount??null,viewCount:s.viewCount??null,shareCount:s.shareCount??null,mediaType:s.mediaType??null,caption:s.caption??null}),c;a?c=ct(s.element,Y(s.likesCount),Y(s.commentsCount),s.postID,s.userName,s.code):c=lt(s.element,Y(s.likesCount),Y(s.commentsCount),s.postID,s.userName),c.dataset.sfSortedItem="true",c.dataset.sfItemJson=m,c.style.width="100%",c.style.minWidth="0",r.appendChild(c)}),t(!0)})}function Rn(){if(document.getElementById("sf-saved-overrides"))return;let e=document.createElement("style");e.id="sf-saved-overrides",e.textContent=`
    /* Kill IG's infinite-scroll spinner. Narrowly target the SVG itself,
     * not "any element containing it" \u2014 a :has(>...) selector could
     * accidentally swallow the sticky header wrapper. */
    body[data-sf-saved-sort-active="true"] svg[aria-label="Loading..."] {
      display: none !important;
    }

    /* Banner z-index \u2014 same reasoning as explore: low enough to stay
     * under IG's sticky header, high enough to win against transformed /
     * will-change tiles in the sorted grid. */
    body[data-sf-saved-sort-active="true"] #banner_most_viewed_reels {
      z-index: 10 !important;
    }

    /* Trap the sorted grid in its own stacking context. Without this, the
     * Select-mode circles (z-index: 20) participate in the body's context
     * and paint OVER the banner's Export dropdown (whose menu inherits the
     * banner's z-index: 10). With an explicit z-index here, the grid
     * becomes a stacking context: circles still paint above their tiles,
     * but the grid as a whole sits below the banner. */
    body[data-sf-saved-sort-active="true"] #div_most_viewed_reels {
      z-index: 1 !important;
    }

    /* Pin Saved's header (Back link + "All Posts" / collection name) to
     * the top of the viewport. Hiding the <article> collapses IG's
     * sticky boundary, so we force sticky + high z-index + theme-aware
     * background to prevent sorted items showing above it on scroll. */
    body[data-sf-saved-sort-active="true"] main > div > div.html-div:first-child {
      position: sticky !important;
      top: 0 !important;
      z-index: 1000 !important;
      background-color: rgb(255, 255, 255) !important;
    }
    html[class*="dark" i] body[data-sf-saved-sort-active="true"] main > div > div.html-div:first-child {
      background-color: rgb(0, 0, 0) !important;
    }

    /* Flip the Export dropdown and button tooltips to open DOWNWARD on
     * saved, for the same reason as explore: upward area both clips
     * (overflow) and over-paints (stacking). */
    body[data-sf-saved-sort-active="true"] #banner_most_viewed_reels .sf-menu {
      bottom: auto !important;
      top: calc(100% + 8px) !important;
      transform-origin: top right !important;
    }
    body[data-sf-saved-sort-active="true"] #banner_most_viewed_reels .tooltip {
      bottom: auto !important;
      top: calc(100% + 6px) !important;
    }
  `,document.head.appendChild(e)}function Nn(){let e=document.querySelector('main[role="main"] article');if(e)return e;let t=document.querySelector('main a[href^="/p/"]')||document.querySelector('a[href^="/p/"]');if(!t)return null;let o=t.parentElement,n=0;for(;o&&o!==document.body&&o!==document.documentElement&&n<12;){let s=Array.from(o.children).filter(a=>a.querySelector&&a.querySelector('a[href^="/p/"]'));if(s.length>=2){let a=s[0];if(Array.from(a.children).filter(m=>m.querySelector&&m.querySelector('a[href^="/p/"]')).length>=2)return o}o=o.parentElement,n++}return null}function An(e,t,o){let n=[],r=(s,a)=>`<span style="display: flex; align-items: center; gap: 5px;"><img src="${chrome.runtime.getURL(s)}" style="width: 15px; height: 15px; object-fit: contain;" />${a}</span>`;return e!=null&&n.push(r("icons/Hover/LoveIG.png",Y(e))),t!=null&&n.push(r("icons/Hover/whiteBubble.png",Y(t))),o!=null&&n.push(r("icons/Hover/PlayIGFrame.png",Y(o))),n.length===0?"":`<div style="display: flex; flex-direction: column; gap: 30px; align-items: center;">${n.join("")}</div>`}function Pn(e){return new Promise(t=>{let o=Nn();if(!o){console.error("[SortFeed][saved] grid container not found \u2014 DOM may have changed"),t(!1);return}o.style.display="none",Rn(),document.body.setAttribute("data-sf-saved-sort-active","true");let n=document.createElement("div");n.id="div_most_viewed_reels",n.setAttribute("data-sortfeed","true"),n.className=o.className,n.style="display: flex; flex-direction: column; padding-bottom: 0px; padding-top: 0px; position: relative;",o.after(n);let r="_ac7v xat24cr x1f01sob xcghwft xzboxd6",s="x11i5rnm x1ntc13c x9i3mqj x2pgyrj";for(let a=0;a<e.length;a+=3){let i=document.createElement("div");for(i.className=r,e.slice(a,a+3).forEach(c=>{let f=c.mediaType===2,d=f?`https://www.instagram.com/${c.userName}/reel/${c.code}/`:`https://www.instagram.com/${c.userName}/p/${c.code}/`,u=JSON.stringify({id:c.postID??null,code:c.code??null,userName:c.userName??null,url:d,postsVsReels:"Posts",createDate:c.createDate?c.createDate.slice(0,10):null,likesCount:c.likesCount??null,commentsCount:c.commentsCount??null,viewCount:c.viewCount??null,shareCount:c.shareCount??null,mediaType:c.mediaType??null,caption:c.caption??null}),p;f?p=ct(c.element,null,null,c.postID,c.userName,c.code):p=lt(c.element,null,null,c.postID,c.userName);let l=p.querySelector("[data-sf-custom-ui] > div");l&&(l.innerHTML=An(c.likesCount,c.commentsCount,c.viewCount)),p.dataset.sfSortedItem="true",p.dataset.sfItemJson=u,i.appendChild(p)});i.children.length<3;){let c=document.createElement("div");c.className=s,i.appendChild(c)}n.appendChild(i)}t(!0)})}window.addEventListener("message",e=>{if(e.data.insta_banner_notification){let t=e.data.count,o=e.data.type;Vn(t,o)}});function zt(){let e=document.getElementById("sf-banner-stack");return e||(e=document.createElement("div"),e.id="sf-banner-stack",e.style.cssText=["position:fixed","top:15%","left:50%","transform:translateX(-50%)","display:flex","flex-direction:column","gap:8px","width:90%","max-width:600px","z-index:100000"].join(";"),document.body.appendChild(e)),e}function Fn(){let e=parseInt(sessionStorage.getItem("sortFeedNoItems"));return Number.isFinite(e)&&e>0?e:0}function Un(){return sessionStorage.getItem("sortItemsVsDates")||"items"}var ze=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function qn(e,t){let o=new Date(e),n=new Date(t),r=new Date;return o.getFullYear()===n.getFullYear()&&o.getFullYear()===r.getFullYear()?`${ze[o.getMonth()]} ${o.getDate()} to ${ze[n.getMonth()]} ${n.getDate()}`:`${ze[o.getMonth()]} ${o.getDate()}, ${o.getFullYear()} to ${ze[n.getMonth()]} ${n.getDate()}, ${n.getFullYear()}`}function xt(e,t){if(e===0){let o=sessionStorage.getItem("sortFeedNoItems")||"",n=/^custom_(\d+)_(\d+)$/.exec(o);if(n)return`Searching ${qn(parseInt(n[1],10),parseInt(n[2],10))} \u2014 don't scroll`}return`${e} ${t} sorted \u2014 don't scroll`}function Oe(e,t,o){let n=/^(\d+)(\s[\s\S]*)$/.exec(t);if(!n){e.textContent=t;return}let r=n[1],s=n[2],a=e.querySelector(".sf-count");if(!a){e.textContent="",a=document.createElement("span"),a.className="sf-count",a.style.display="inline-block",a.textContent=r,e.appendChild(a),e.appendChild(document.createTextNode(s));return}let i=a.nextSibling;i&&i.nodeType===Node.TEXT_NODE&&i.textContent!==s&&(i.textContent=s),a.textContent!==r&&(a.textContent=r,o&&o.animate&&a.animate([{opacity:.35,transform:"translateY(-3px)"},{opacity:1,transform:"translateY(0)"}],{duration:180,easing:"cubic-bezier(0.22, 1, 0.36, 1)"}))}function Hn(e,t){let o=e.textContent||"",n=o.startsWith("Searching "),r=t.startsWith("Searching "),s=o.startsWith("Getting ready");if(!n&&!r&&!s){Oe(e,t,{animate:!0});return}if(n&&r){Oe(e,t);return}let a="cubic-bezier(0.22, 1, 0.36, 1)";e.animate([{opacity:1,transform:"translateY(0)"},{opacity:0,transform:"translateY(-4px)"}],{duration:150,easing:a,fill:"forwards"}).onfinish=()=>{Oe(e,t),e.animate([{opacity:0,transform:"translateY(5px)"},{opacity:1,transform:"translateY(0)"}],{duration:200,easing:a,fill:"forwards"})}}function zn(e){let t=window.__sfBanner;if(!t||document.querySelector(".sf-sort-banner.sf-progress"))return;let o=document.createElement("div");o.className="sf-banner sf-sort-banner sf-progress sf-prep",o.innerHTML=`
    <img class="sf-icon" src="${t.iconURL("Icons/logo.png")}" />
    <div class="sf-body">
      <div class="sf-message"></div>
    </div>
  `,o.querySelector(".sf-message").textContent=e,o.style.animation="none",zt().appendChild(o),o.animate([{opacity:0,transform:"translateY(-120%)"},{opacity:1,transform:"translateY(10px)",offset:.6},{transform:"translateY(-5px)",offset:.8},{opacity:1,transform:"translateY(0)"}],{duration:360,easing:"ease",fill:"both"})}function jn(e){e.classList.remove("sf-prep");let t=window.__sfBanner,o=e.querySelector(".sf-body");if(o&&!o.querySelector(".sf-progress-row")){let n=document.createElement("div");n.className="sf-progress-row",n.innerHTML='<div class="sf-progress-track"><div class="sf-progress-fill"></div></div><span class="sf-progress-pct">0%</span>',o.appendChild(n)}t&&!e.querySelector(".sf-banner-stop")&&e.appendChild(t.makeStopButton(()=>{sessionStorage.setItem("sortFeedStopSorting","on")},"Stop sorting"));try{sessionStorage.removeItem("sortFeedPrepLabel")}catch{}}function On(){try{let t=location.pathname.replace(/^\/|\/$/g,"").split("/")[2]||"";if(t&&t!=="all-posts"){let o=t;try{o=decodeURIComponent(t)}catch{}let n=o.replace(/[-_]+/g," ").trim();if(n)return n}}catch{}return"Collection"}function Gn(e){return e==="profile"?"Getting ready to sort":e==="search"?"Getting ready to sort Search":e==="saved"?"Getting ready to sort Saved":e==="collection"?"Getting ready to sort "+On():null}function Yn(){let e;try{e=sessionStorage.getItem("sortFeedPrepLabel")}catch{return}let t=Gn(e);if(!t)return;let o=()=>{if(sessionStorage.getItem("sortFeedStopSorting")!=="on"&&!document.querySelector(".sf-sort-banner.sf-progress:not(.sf-prep)")){if(!window.__sfBanner||!document.body||typeof tt!="function"){setTimeout(o,60);return}tt(),zn(t)}};o()}Yn();function Vn(e=25,t="Posts"){let o=window.__sfBanner;if(!o)return;let n=document.querySelector(".sf-sort-banner.sf-progress"),r=Un(),s=Fn();if(n){n.classList.contains("sf-prep")&&jn(n);let i=n.querySelector(".sf-message");if(i&&Hn(i,xt(e,t)),r==="items"&&s>0){let m=Math.min(100,Math.round(e/s*100));o.setProgress(n,m)}return}let a=document.createElement("div");if(a.className="sf-banner sf-sort-banner sf-progress",a.innerHTML=`
    <img class="sf-icon" src="${o.iconURL("Icons/logo.png")}" />
    <div class="sf-body">
      <div class="sf-message"></div>
      <div class="sf-progress-row">
        <div class="sf-progress-track"><div class="sf-progress-fill"></div></div>
        <span class="sf-progress-pct">0%</span>
      </div>
    </div>
  `,Oe(a.querySelector(".sf-message"),xt(e,t)),a.appendChild(o.makeStopButton(()=>{sessionStorage.setItem("sortFeedStopSorting","on")},"Stop sorting")),zt().appendChild(a),r==="items"&&s>0){let i=Math.min(100,Math.round(e/s*100));o.setProgress(a,i)}else o.animateProgress(a,0,90,6e4)}function Wn(){let e=document.querySelector(".sf-sort-banner.sf-progress");if(!e)return;let t=window.__sfBanner,o=e.querySelector(".sf-progress-pct"),n=o&&parseInt(o.textContent)||0;t?t.animateProgress(e,n,100,300,()=>{t.dismissBanner(e,0)}):(e.style.animation="sfSlideBounceUp 0.25s ease forwards",setTimeout(()=>e.remove(),250))}window.addEventListener("message",e=>{if(e.data.insta_banner_notification_remove){Wn();let t=document.getElementById("overlay_sort_reels");t&&t.remove()}});var ce="data-sf-hover-injected",De="sf-hover-btns-wrapper",We=!0,Xe=!0;chrome.storage.local.get(["sortfeed_ig_download_enabled","sortfeed_ig_transcribe_enabled"],e=>{e.sortfeed_ig_download_enabled===!1&&(We=!1),e.sortfeed_ig_transcribe_enabled===!1&&(Xe=!1)});chrome.storage.onChanged.addListener(e=>{"sortfeed_ig_download_enabled"in e&&(We=e.sortfeed_ig_download_enabled.newValue!==!1,St()),"sortfeed_ig_transcribe_enabled"in e&&(Xe=e.sortfeed_ig_transcribe_enabled.newValue!==!1,St())});function St(){document.querySelectorAll(`[${ce}]`).forEach(e=>{e.removeAttribute(ce),e.querySelector(`.${De}`)?.remove()}),dt()}function Xn(e){let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",o=BigInt(0);for(let n of e){let r=t.indexOf(n);r!==-1&&(o=o*BigInt(64)+BigInt(r))}return o.toString()}function Jn(){return window.location.pathname.replace(/^\/|\/$/g,"").split("/")[0]||""}function Kn(){let e=window.location.pathname;if(/\/saved\/audio\/?$/.test(e))return!1;if(/\/saved\//.test(e)||/^\/explore\/?$/.test(e)||/^\/explore\/search\/?/.test(e))return!0;let t=["explore","reels","stories","direct","accounts","notifications","p","reel","tv","locations","hashtag","audio"],o=e.replace(/^\/|\/$/g,"").split("/");return!!(o.length===1&&!t.includes(o[0])||o.length===2&&["reels","tagged"].includes(o[1]))}function Zn(e){let t=e.getAttribute("href")||"";return!!(/\/reel\/[^\/]+\//.test(t)||e.querySelector('[aria-label="Clip"], [aria-label*="Reel"], [aria-label*="Video"]')||e.querySelector("video"))}function Qn(){if(document.getElementById("sf-hover-style"))return;let e=document.createElement("style");e.id="sf-hover-style",e.textContent=`
    .${De} {
      position: absolute;
      bottom: 10px; right: 10px;
      display: flex; flex-direction: column; gap: 5px;
      align-items: flex-end;
      opacity: 0;
      pointer-events: none;
      z-index: 10;
    }

    /* Show on anchor hover \u2014 CSS keeps IG's KPI layer alive */
    a[${ce}]:hover .${De} {
      opacity: 1;
      pointer-events: auto;
    }

    .sf-hover-btn {
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; position: relative;
    }

    .sf-hover-btn img {
      width: 9px; height: 9px; border-radius: 3px;
      background: #fde082; padding: 5px;
    }

    .sf-hover-tip {
      position: absolute; top: 50%; left: -6px;
      transform: translate(-100%, -50%);
      background: #000; color: #fff; font-size: 10px; line-height: 1;
      padding: 4px 8px; border-radius: 6px; white-space: nowrap;
      opacity: 0; pointer-events: none; z-index: 99999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: opacity 120ms ease;
    }

    .sf-hover-btn:hover .sf-hover-tip {
      opacity: 1;
    }
  `,document.head.appendChild(e)}function Ct(e,t,o,n,r){let s=e==="trans"?chrome.runtime.getURL("icons/Hover/trans.png"):chrome.runtime.getURL("icons/Hover/arrowDownBlack.png"),a=e==="trans"?"Transcribe":"Download",i=document.createElement("div");i.className="sf-hover-btn",i.dataset.sfAction="true";let m=document.createElement("img");m.src=s;let c=document.createElement("div");return c.className="sf-hover-tip",c.textContent=a,i.addEventListener("click",f=>{f.stopPropagation(),f.preventDefault(),e==="download"?window.postMessage({download:!0,download_item:r?"reels":"posts",download_reel_id:r?t:void 0,download_post_id:r?void 0:t,download_profile_name:n}):window.postMessage({trans:!0,download_reel_id:t,download_profile_name:n,download_reel_id_ui:o})}),i.appendChild(m),i.appendChild(c),i}function eo(e,t,o){if(e.hasAttribute(ce))return;e.setAttribute(ce,"true");let n=Xn(t),r=Jn(),s=document.createElement("div");if(s.className=De,o&&Xe&&s.appendChild(Ct("trans",n,t,r,o)),We&&s.appendChild(Ct("download",n,t,r,o)),!s.hasChildNodes())return;let a=e.querySelector("._aajz");a?a.appendChild(s):e.appendChild(s)}function dt(){if(!Kn()||sessionStorage.getItem("sortFeedStatus")==="true"||!We&&!Xe)return;Array.from(document.querySelectorAll("a[href]")).filter(t=>/\/(p|reel)\/[^\/]+\//.test(t.getAttribute("href")||"")).forEach(t=>{let n=t.getAttribute("href").match(/\/(p|reel)\/([^\/]+)\//);if(!n)return;let r=n[2];if(t.hasAttribute(ce))return;let s=Zn(t);eo(t,r,s)})}function jt(){document.querySelectorAll(`.${De}`).forEach(e=>e.remove()),document.querySelectorAll(`[${ce}]`).forEach(e=>e.removeAttribute(ce))}var Et=window.location.pathname,It=null,to=new MutationObserver(()=>{window.location.pathname!==Et&&(Et=window.location.pathname,jt()),clearTimeout(It),It=setTimeout(dt,300)});window.addEventListener("message",e=>{e.data&&e.data.sf_sort_started&&jt()});function kt(){Qn(),to.observe(document.body,{childList:!0,subtree:!0}),dt()}document.body?kt():document.addEventListener("DOMContentLoaded",kt);(function(){let e="sf-sp-pill",t=!0,o=!0;chrome.storage.local.get(["sortfeed_ig_download_enabled","sortfeed_ig_transcribe_enabled"],w=>{w.sortfeed_ig_download_enabled===!1&&(t=!1),w.sortfeed_ig_transcribe_enabled===!1&&(o=!1)}),chrome.storage.onChanged.addListener(w=>{"sortfeed_ig_download_enabled"in w&&(t=w.sortfeed_ig_download_enabled.newValue!==!1,D(),T()),"sortfeed_ig_transcribe_enabled"in w&&(o=w.sortfeed_ig_transcribe_enabled.newValue!==!1,D(),T())});function n(){return/\/(p|reel|reels)\/[^\/]+\/?$/.test(window.location.pathname)}function r(){let w=window.location.pathname.match(/\/(p|reel|reels)\/([^\/]+)/);return w?w[2]:null}function s(){return/\/(reel|reels)\//.test(window.location.pathname)}function a(w){let F="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",A=BigInt(0);for(let P of w){let z=F.indexOf(P);z!==-1&&(A=A*BigInt(64)+BigInt(z))}return A.toString()}let i=["explore","reels","reel","p","direct","accounts","stories","notifications"];function m(){let w=window.location.pathname.match(/^\/([^\/]+)\/(p|reel)\//);if(w)return w[1];let F=r();if(F){let C=document.querySelector(`a[href*="/${F}/"]`);if(C){let M=(C.getAttribute("href")||"").match(/^\/([^\/]+)\/(p|reel|reels)\//);if(M)return M[1]}}let A=document.querySelectorAll('a[role="link"][href*="/reels/"]');for(let C of A){let M=(C.getAttribute("href")||"").match(/^\/([^\/]+)\/reels\//);if(M&&!i.includes(M[1]))return M[1]}let P=document.querySelectorAll('img[alt*="profile picture"]');for(let C of P){let M=(C.getAttribute("alt")||"").match(/^([^']+)'s profile picture/);if(M){let j=M[1].trim();if(j&&!i.includes(j))return j}}let z=document.querySelectorAll('header a[href*="/"]');for(let C of z){let M=(C.getAttribute("href")||"").match(/^\/([^\/]+)\/?$/);if(M&&!i.includes(M[1]))return M[1]}let W=document.querySelector('a[role="link"][href^="/"][tabindex="0"]');if(W){let k=(W.getAttribute("href")||"").match(/^\/([^\/]+)\/?$/);if(k&&!i.includes(k[1]))return k[1]}return""}function c(){if(document.getElementById("sf-sp-style"))return;let w=document.createElement("style");w.id="sf-sp-style",w.textContent=`
      @keyframes sf-sp-fadein {
        from { opacity: 0; transform: scale(0.88); }
        to   { opacity: 1; transform: scale(1); }
      }

      #${e} {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-end;
        z-index: 10;
        animation: sf-sp-fadein 350ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .sf-sp-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        opacity: 0.80;
        transition: opacity 180ms ease;
      }

      .sf-sp-btn:hover {
        opacity: 1 !important;
      }

      .sf-sp-btn img {
        width: 9px;
        height: 9px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.72);
        padding: 5px;
        transition: background 180ms ease;
      }

      .sf-sp-btn:hover img {
        background: #fde082;
      }

      .sf-sp-tip {
        position: absolute;
        top: 50%;
        left: -6px;
        transform: translate(-100%, -50%);
        background: #000;
        color: #fff;
        font-size: 10px;
        line-height: 1;
        padding: 4px 8px;
        border-radius: 6px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        z-index: 99999;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: opacity 120ms ease;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .sf-sp-beta {
        font-size: 0.5rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        background: rgba(255, 255, 255, 0.12);
        color: rgba(255, 255, 255, 0.55);
        border-radius: 3px;
        padding: 1.5px 4px;
      }

      .sf-sp-btn:hover .sf-sp-tip {
        opacity: 1 !important;
      }
    `,document.head.appendChild(w)}function f(w,F,A,P,z){let W=w==="trans"?chrome.runtime.getURL("icons/Hover/trans.png"):chrome.runtime.getURL("icons/Hover/arrowDownBlack.png"),C=w==="trans"?"Transcribe":"Download",k=document.createElement("div");k.className="sf-sp-btn";let M=document.createElement("img");M.src=W;let j=document.createElement("div");j.className="sf-sp-tip";let Ee=document.createElement("span");return Ee.textContent=C,j.appendChild(Ee),k.appendChild(M),k.appendChild(j),k.addEventListener("click",Ie=>{Ie.stopPropagation(),Ie.preventDefault(),w==="download"?window.postMessage({download:!0,download_item:z?"reels":"posts",download_reel_id:z?F:void 0,download_post_id:z?void 0:F,download_profile_name:P,download_code:A}):window.postMessage({trans:!0,download_reel_id:F,download_profile_name:P,download_reel_id_ui:A})}),k}function d(){if(u()){let C=document.querySelector('div[role="presentation"]');if(C){let k=C;for(;k.parentElement;){if(k=k.parentElement,k.getAttribute("role")==="button"&&k.hasAttribute("tabindex")){let M=k.getBoundingClientRect();if(M.width>200&&M.height>200)return{el:k,hasVideo:!!k.querySelector("video")}}if(k.tagName==="ARTICLE"||k===document.body)break}for(k=C;k.parentElement;){k=k.parentElement;let M=k.getBoundingClientRect();if(M.width>200&&M.height>200)return{el:k,hasVideo:!!k.querySelector("video")};if(k.tagName==="ARTICLE"||k===document.body)break}}}let w=document.querySelectorAll('div[aria-label="Video player"][role="group"]');if(w.length>1)for(let C of w){let k=C.getBoundingClientRect();if(k.top>=-100&&k.top<window.innerHeight/2)return{el:C,hasVideo:!0}}let F=w[0];if(F)return{el:F,hasVideo:!0};let A=document.querySelector("div._aatk");if(A){let C=A.querySelector('div[role="button"][tabindex]');if(C)return{el:C,hasVideo:!!C.querySelector("video")}}for(let C of["article._aatb","article._ab6k","article._aalr"]){let k=document.querySelector(C);if(k){let M=k.querySelector('div[role="button"][tabindex]');if(M){let j=M.getBoundingClientRect();if(j.width>250&&j.height>250)return{el:M,hasVideo:!!M.querySelector("video")}}}}let P=document.querySelector("div._aagu");if(P){let C=P;for(;C.parentElement;){if(C=C.parentElement,C.getAttribute("role")==="button"&&C.hasAttribute("tabindex"))return{el:C,hasVideo:!!C.querySelector("video")};if(C.tagName==="ARTICLE"||C===document.body)break}for(C=P;C.parentElement;){C=C.parentElement;let k=C.getBoundingClientRect();if(k.width>200&&k.height>200)return{el:C,hasVideo:!!C.querySelector("video")};if(C.tagName==="ARTICLE"||C===document.body)break}return{el:P,hasVideo:!1}}let z=document.querySelector("video");if(z){let C=z;for(;C.parentElement;){if(C=C.parentElement,C.getAttribute("role")==="button"&&C.hasAttribute("tabindex")){let k=C.getBoundingClientRect();if(k.width>250&&k.height>250)return{el:C,hasVideo:!0}}if(C===document.body)break}}let W=document.querySelectorAll('img[crossorigin="anonymous"]');for(let C of W){let k=C.getBoundingClientRect();if(k.width<200||k.height<200)continue;let M=C;for(;M.parentElement;){if(M=M.parentElement,M.getAttribute("role")==="button"&&M.hasAttribute("tabindex"))return{el:M,hasVideo:!!M.querySelector("video")};if(M.tagName==="ARTICLE"||M===document.body)break}}return null}function u(){return!!document.querySelector("._acnb")}function p(){let w=new URLSearchParams(window.location.search);return parseInt(w.get("img_index")||"1",10)}let l=null;function h(){return l!==null||(p()<=1?l=!!document.querySelector("video"):l=!1),l}let _=null;function g(){let w=document.querySelector("#"+e+" .sf-sp-btn-trans");if(!w)return;p()<=1&&h()?(w.style.opacity="",w.style.pointerEvents="",w.style.maxHeight="30px",w.style.marginBottom=""):(w.style.opacity="0",w.style.pointerEvents="none",w.style.maxHeight="0px",w.style.marginBottom="-5px")}function b(){if(_)return;let w=window.location.search;_=setInterval(()=>{window.location.search!==w&&(w=window.location.search,g())},200)}function y(){_&&(clearInterval(_),_=null),l=null}let x="data-sf-reels-injected",v=null;function N(){return/\/reels\//.test(window.location.pathname)}function S(w){let F=w.querySelector('a[role="link"][href*="/reels/"]');if(F){let P=(F.getAttribute("href")||"").match(/^\/([^\/]+)\/reels\//);if(P&&!i.includes(P[1]))return P[1]}let A=w.querySelector('img[alt*="profile picture"]');if(A){let P=(A.getAttribute("alt")||"").match(/^([^']+)'s profile picture/);if(P)return P[1].trim()}return""}function B(w,F){let A=w==="trans"?chrome.runtime.getURL("icons/Hover/trans.png"):chrome.runtime.getURL("icons/Hover/arrowDownBlack.png"),P=w==="trans"?"Transcribe":"Download",z=document.createElement("div");z.className="sf-sp-btn";let W=document.createElement("img");W.src=A;let C=document.createElement("div");C.className="sf-sp-tip";let k=document.createElement("span");return k.textContent=P,C.appendChild(k),z.appendChild(W),z.appendChild(C),z.addEventListener("click",M=>{M.stopPropagation(),M.preventDefault();let j=r()||"",Ee=a(j),Ie=S(F)||m();w==="download"?window.postMessage({download:!0,download_item:"reels",download_reel_id:Ee,download_profile_name:Ie,download_code:j}):window.postMessage({trans:!0,download_reel_id:Ee,download_profile_name:Ie,download_reel_id_ui:j})}),z}function U(w){if(w.hasAttribute(x))return;w.setAttribute(x,"true");let F=w.querySelector('div[aria-label="Video player"][role="group"]');if(!F)return;let A=getComputedStyle(F).position;(A==="static"||A==="")&&(F.style.position="relative");let P=document.createElement("div");P.className="sf-sp-pill-reels",P.style.cssText=`
      position: absolute; top: 10px; right: 10px;
      display: flex; flex-direction: column; gap: 5px; align-items: flex-end;
      z-index: 10;
      animation: sf-sp-fadein 350ms cubic-bezier(0.16, 1, 0.3, 1) both;
    `,o&&P.appendChild(B("trans",w)),t&&P.appendChild(B("download",w)),F.appendChild(P)}function H(){let w=document.querySelector('div[tabindex="-1"][style*="scroll-snap"]')||document.querySelector('div[tabindex="-1"].x1pq812k');if(!w)return!1;let F=w.children;for(let A of F)A.tagName==="DIV"&&U(A);return v||(v=new MutationObserver(A=>{for(let P of A)for(let z of P.addedNodes)z.nodeType===1&&z.tagName==="DIV"&&setTimeout(()=>U(z),200)}),v.observe(w,{childList:!0})),!0}function E(){v&&(v.disconnect(),v=null),document.querySelectorAll(".sf-sp-pill-reels").forEach(w=>w.remove()),document.querySelectorAll(`[${x}]`).forEach(w=>w.removeAttribute(x))}function $(){let w=document.getElementById(e);return w&&document.body.contains(w)}function I(){if(!n()||!t&&!o)return!1;if(N())return H();if($())return!0;D();let w=r();if(!w)return!1;let F=d();if(!F)return!1;let{el:A,hasVideo:P}=F,z=getComputedStyle(A).position;(z==="static"||z==="")&&(A.style.position="relative");let W=a(w),C=m(),k=s()||P,M=u(),j=document.createElement("div");return j.id=e,M?(t&&j.appendChild(f("download",W,w,C,!1)),A.appendChild(j)):(k&&o&&j.appendChild(f("trans",W,w,C,!0)),t&&j.appendChild(f("download",W,w,C,k)),A.appendChild(j)),!0}function D(){let w=document.getElementById(e);w&&w.remove(),E(),y()}let q=null;function T(){if(R(),!n())return;let w=0,F=25;function A(){w>=F||n()&&(w++,I()||(q=setTimeout(A,150)))}A()}function R(){q&&(clearTimeout(q),q=null)}let L=location.pathname;function O(){setTimeout(()=>{location.pathname!==L&&(L=location.pathname,R(),D(),T())},0)}let ee=history.pushState;history.pushState=function(){ee.apply(this,arguments),O()};let V=history.replaceState;history.replaceState=function(){V.apply(this,arguments),O()},window.addEventListener("popstate",O);let Se=null,Fe=new MutationObserver(()=>{clearTimeout(Se),Se=setTimeout(()=>{n()&&!$()&&T()},100)});function Ce(){c(),Fe.observe(document.body,{childList:!0,subtree:!0}),T()}document.body?Ce():document.addEventListener("DOMContentLoaded",Ce)})();var Re=null;function ye(){window.__sfBanner.guards.isGSheetsLoading=!1,Re=null}function Pe(){return document.querySelector(".sf-gsheets-banner.sf-progress")}function no(){let e=Pe();if(!e)return 0;let t=e.querySelector(".sf-progress-pct");return t&&parseInt(t.textContent)||0}function oo(){let e=window.__sfBanner;if(Pe())return;let t=document.createElement("div");t.className="sf-banner sf-gsheets-banner sf-progress",t.innerHTML=`
    <img class="sf-icon" src="${e.iconURL("Icons/logo.png")}" />
    <div class="sf-body">
      <div class="sf-message">Creating Google Sheet</div>
      <div class="sf-progress-row">
        <div class="sf-progress-track"><div class="sf-progress-fill"></div></div>
        <span class="sf-progress-pct">0%</span>
      </div>
    </div>
  `,t.appendChild(e.makeCloseButton(()=>{Re&&Re.abort(),e.dismissBanner(t,0),ye()})),e.enterBanner(t,"gsheets").then(()=>{e.animateProgress(t,0,85,4e3)})}function so(){let e=window.__sfBanner,t=Pe();if(!t){ye();return}e.animateProgress(t,no(),100,400,()=>{e.dismissBanner(t,0)}),ye()}function Bt(){let e=window.__sfBanner,t=Pe();t&&e.dismissBanner(t,0),ye()}function Tt(e){let t=window.__sfBanner,o=Pe();o&&t.dismissBanner(o,0),setTimeout(()=>{let n=document.createElement("div");n.className="sf-banner sf-gsheets-banner sf-error sf-static",n.innerHTML=`
      <img class="sf-icon sf-static" src="${t.iconURL("Icons/logo.png")}" />
      <div class="sf-message">${e||"Couldn't create sheet \u2014 try again"}</div>
    `,n.appendChild(t.makeCloseButton(()=>t.dismissBanner(n,0))),t.enterBanner(n,"gsheets"),setTimeout(()=>t.dismissBanner(n,0),5e3)},o?260:0),ye()}function ro(){let e=window.__sfBanner;if(document.querySelector(".sf-gsheets-banner.sf-signin"))return;let t=document.createElement("div");t.className="sf-banner sf-gsheets-banner sf-signin sf-static",t.innerHTML=`
    <img class="sf-icon sf-static" src="${e.iconURL("Icons/logo.png")}" />
    <div class="sf-message">Sign in to Sort Feed to use Google Sheets export</div>
    <button class="sf-signin-btn" type="button">Sign in</button>
  `,t.querySelector(".sf-signin-btn").addEventListener("click",()=>{window.open("https://account.sortfeed.com","_blank","noopener,noreferrer")}),t.appendChild(e.makeCloseButton(()=>e.dismissBanner(t,0))),e.enterBanner(t,"gsheets"),setTimeout(()=>e.dismissBanner(t,0),5e3)}async function ao(e,t,o){let n=window.__sfBanner;if(!n||n.guards.isGSheetsLoading)return;let s=(await chrome.storage.local.get("sort_feed_user_id"))?.sort_feed_user_id??null;if(!s){ro();return}n.guards.isGSheetsLoading=!0,Re=new AbortController;let a=Re.signal;oo();let i=!1;try{i=(await(await fetch("https://api.sortfeed.com/check-google-sheets-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userID:s}),signal:a})).json())?.hasToken===!0}catch(m){if(m.name==="AbortError"){ye();return}console.error("[Sort Feed] Token check failed",m)}if(i)try{let m=typeof se=="function"&&se(),c=typeof re=="function"&&re(),p=await(await fetch("https://api.sortfeed.com/v2/create-google-sheet-instagram",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userID:s,name:e,sorted_data:t,posts_vs_reels:o,excludeColumns:m?["Comments"]:[],extraColumns:c?[{key:"viewCount",header:"Views",before:"Captions"}]:[],sheetName:`${e}_${t.length}_${o.toLowerCase()}`}),signal:a})).json();if(p?.noToken){Bt();let l=`https://connect.sortfeed.com/google-sheets?userID=${encodeURIComponent(s)}`;chrome.runtime.sendMessage({type:"OPEN_TAB_GSHEETS",url:l})}else p?.sheetUrl?(so(),chrome.runtime.sendMessage({type:"OPEN_TAB_GSHEETS",url:p.sheetUrl})):(console.error("[Sort Feed] Sheet creation failed",p),Tt("Couldn't create sheet \u2014 try again"))}catch(m){if(m.name==="AbortError"){ye();return}console.error("[Sort Feed] Sheet creation error",m),Tt("Couldn't create sheet \u2014 try again")}else{Bt();let m=`https://connect.sortfeed.com/google-sheets?userID=${encodeURIComponent(s)}`;chrome.runtime.sendMessage({type:"OPEN_TAB_GSHEETS",url:m})}}chrome.runtime.onMessage.addListener((e,t,o)=>{if(e.export_click_background&&e.export_format==="google_sheets"){let n=e.sorted_data,r=e.posts_vs_reels,s=typeof ne=="function"?ne(n):n[0].userName;ao(s,n,r)}});function ke(e){let t=e==null?"":String(e);return t.includes(",")||t.includes('"')||t.includes(`
`)?'"'+t.replace(/"/g,'""')+'"':t}function io(e=null,t=null,o=null){let n=t.some(r=>"transcript"in r);if(o==="Posts"){let r=typeof se=="function"&&se(),s=typeof re=="function"&&re(),a=["Profile","Post","Create Date","Likes"];r||a.push("Comments"),s&&a.push("Views"),a.push("Caption"),n&&a.push("Transcript");let i=t.map(d=>{let u=[1,8].includes(d.mediaType)?`https://www.instagram.com/${d.userName}/p/${d.code}/`:`https://www.instagram.com/${d.userName}/reel/${d.code}/`,p=d.createDate?d.createDate.slice(0,10):"",l=[ke(d.userName),ke(u),p,d.likesCount];return r||l.push(d.commentsCount),s&&l.push(d.viewCount??""),l.push(ke(d.caption)),n&&l.push(ke(d.transcript??"")),l}),m=[a,...i].map(d=>d.join(",")).join(`
`),c=new Blob([m],{type:"text/csv;charset=utf-8;"}),f=document.createElement("a");if(f.download!==void 0){let d=URL.createObjectURL(c);f.setAttribute("href",d),f.setAttribute("download",`${e}_${t.length}_${o.toLowerCase()}.csv`),f.style.visibility="hidden",document.body.appendChild(f),f.click(),document.body.removeChild(f)}}else if(o==="Reels"){let r=["Profile","Reel","Views","Likes","Comments"];n&&r.push("Transcript");let s=t.map(c=>{let f=`https://www.instagram.com/${c.userName}/reel/${c.code}/`,d=[c.userName,f,c.viewCount,c.likesCount,c.commentsCount];return n&&d.push(ke(c.transcript??"")),d}),a=[r,...s].map(c=>c.join(",")).join(`
`),i=new Blob([a],{type:"text/csv;charset=utf-8;"}),m=document.createElement("a");if(m.download!==void 0){let c=URL.createObjectURL(i);m.setAttribute("href",c),m.setAttribute("download",`${e}_${t.length}_${o.toLowerCase()}.csv`),m.style.visibility="hidden",document.body.appendChild(m),m.click(),document.body.removeChild(m)}}}chrome.runtime.onMessage.addListener((e,t,o)=>{if(e.export_click_background&&e.export_format==="csv"){let n=e.sorted_data,r=e.posts_vs_reels,s=typeof ne=="function"?ne(n):n[0].userName;io(s,n,r)}});function lo(e=null,t=null,o=null){let n=`${e}_${t.length}_${o.toLowerCase()}.json`,r=t.some(d=>"transcript"in d),s=typeof se=="function"&&se(),a=typeof re=="function"&&re(),i=t.map(d=>{if(o==="Posts"){let u=[1,8].includes(d.mediaType)?`https://www.instagram.com/${d.userName}/p/${d.code}/`:`https://www.instagram.com/${d.userName}/reel/${d.code}/`,p=new Date(d.createDate).toLocaleString("en-US",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",second:"2-digit",hour12:!0}),l={Profile:d.userName,Post:u,"Create Date":p,Likes:d.likesCount};return s||(l.Comments=d.commentsCount),a&&(l.Views=d.viewCount??""),l.Captions=d.caption,r&&(l.Transcript=d.transcript??""),l}if(o==="Reels"){let u=`https://www.instagram.com/${d.userName}/reel/${d.code}/`,p={Profile:d.userName,Reel:u,Views:d.viewCount,Likes:d.likesCount,Comments:d.commentsCount};return r&&(p.Transcript=d.transcript??""),p}return{}}),m=new Blob([JSON.stringify(i,null,2)],{type:"application/json;charset=utf-8;"}),c=document.createElement("a"),f=URL.createObjectURL(m);c.setAttribute("href",f),c.setAttribute("download",n),c.style.visibility="hidden",document.body.appendChild(c),c.click(),document.body.removeChild(c)}chrome.runtime.onMessage.addListener((e,t,o)=>{if(e.export_click_background&&e.export_format==="json"){let n=e.sorted_data,r=e.posts_vs_reels,s=typeof ne=="function"?ne(n):n[0].userName;lo(s,n,r)}});function co(e=null,t=null,o=null){let n=[],r=[],s=t.some(f=>"transcript"in f);if(o==="Posts"){let f=typeof se=="function"&&se(),d=typeof re=="function"&&re();n=["Profile","Post","Create Date","Likes"],f||n.push("Comments"),d&&n.push("Views"),n.push("Captions"),s&&n.push("Transcript"),r=t.map(u=>{let p=[1,8].includes(u.mediaType)?`https://www.instagram.com/${u.userName}/p/${u.code}/`:`https://www.instagram.com/${u.userName}/reel/${u.code}/`,l=new Date(u.createDate).toLocaleString("en-US",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",second:"2-digit",hour12:!0}),h=[u.userName,p,l,u.likesCount];return f||h.push(u.commentsCount),d&&h.push(u.viewCount??""),h.push(u.caption),s&&h.push(u.transcript??""),h})}else o==="Reels"&&(n=["Profile","Reel","Views","Likes","Comments"],s&&n.push("Transcript"),r=t.map(f=>{let d=`https://www.instagram.com/${f.userName}/reel/${f.code}/`,u=[f.userName,d,f.viewCount,f.likesCount,f.commentsCount];return s&&u.push(f.transcript??""),u}));let a=[n,...r],i=XLSX.utils.aoa_to_sheet(a),m=XLSX.utils.book_new();XLSX.utils.book_append_sheet(m,i,o);let c=`${e}_${t.length}_${o.toLowerCase()}.xlsx`;XLSX.writeFile(m,c)}chrome.runtime.onMessage.addListener((e,t,o)=>{if(e.export_click_background&&e.export_format==="excel"){let n=e.sorted_data,r=e.posts_vs_reels,s=typeof ne=="function"?ne(n):n[0].userName;io(s,n,r)}});var Z=null;window.addEventListener("message",e=>{let t=e.data;if(!t||!t.download)return;let o=window.__sfBanner;if(o){if(t.download_item==="reels"){if(o.guards.isDownloading)return;o.guards.isDownloading=!0,Z=new AbortController,ve("Downloading"),fo(t.download_reel_id,t.download_profile_name,t.download_code||"",Z.signal)}else if(t.download_item==="posts"){if(o.guards.isDownloading)return;o.guards.isDownloading=!0,Z=new AbortController,uo(t.download_post_id,t.download_profile_name,t.download_code||"",Z.signal)}}});async function uo(e,t,o,n){let r=`https://www.instagram.com/api/v1/media/${e}/info/`;try{let s=await fetch(r,{method:"GET",credentials:"include",signal:n,headers:{"x-ig-app-id":"936619743392459","x-ig-www-claim":window._sharedData?.config?.csrf_token||""}});if(!s.ok)throw new Error(`Failed: ${s.status}`);let a=await s.json();o||(o=a.items?.[0]?.code||"");let{carouselFlag:i,ReelFlag:m}=Ot(a);if(!i&&m){ve("Downloading");let c=a.items?.[0]?.video_versions?.[0]?.url;c?await ut(c,t,o,n)&&ge():G("Couldn't find video \u2014 try again")}else if(!i&&!m){ve("Downloading");let c=a.items[0].image_versions2.candidates[0].url;c?await Gt(c,t,o,n)&&ge():G("Couldn't find image \u2014 try again")}else if(i){let c=a.items[0].carousel_media,f=c.length;ve("Downloading");let d=[];for(let u=0;u<f&&!(n&&n.aborted);u++){let p=c[u],l=!!p.video_versions,h=l?p.video_versions[0].url:p.image_versions2.candidates[0].url,_=l?"mp4":"jpg",g=`${t}_${o}_${u+1}.${_}`,b=Math.round(u/f*100),y=Math.round((u+1)/f*100);try{let x=await fetch(h,{signal:n});if(!x.ok)continue;let v=x.headers.get("content-length"),N=v?parseInt(v,10):0,S=0,B=b,U=y-2,H=setInterval(()=>{B<U&&(B++,Be(B))},40),E=x.body.getReader(),$=[];try{for(;;){let{done:q,value:T}=await E.read();if(q)break;if($.push(T),S+=T.length,N>0){let R=Math.round(S/N*100);B=b+Math.round(R/100*(y-b)),Be(Math.min(B,y-1))}}}finally{clearInterval(H)}B=y,Be(Math.min(B,99));let I=_==="mp4"?"video/mp4":"image/jpeg",D=new Blob($,{type:I});d.push({name:g,blob:D})}catch(x){if(x.name==="AbortError")throw x}}if(n&&n.aborted)return de(),null;if(d.length>0){let u=await ft(d),p=URL.createObjectURL(u),l=document.createElement("a");l.href=p,l.download=`${t}_${o}.zip`,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(p),ge()}else G("Download failed \u2014 try again")}return a}catch(s){return s.name==="AbortError"?(de(),null):(console.error("Error fetching reel info:",s),G("Couldn't download \u2014 try again"),null)}}function Ot(e){let t=!!e.items?.[0]?.carousel_media_count,o=!!e.items?.[0]?.video_versions;return{carouselFlag:t,ReelFlag:o}}async function fo(e,t,o,n){let r=`https://www.instagram.com/api/v1/media/${e}/info/`;try{let s=await fetch(r,{method:"GET",credentials:"include",signal:n,headers:{"x-ig-app-id":"936619743392459","x-ig-www-claim":window._sharedData?.config?.csrf_token||""}});if(!s.ok)throw new Error(`Failed: ${s.status}`);let a=await s.json();o||(o=a.items?.[0]?.code||"");let i=a.items?.[0]?.video_versions?.[0]?.url;return i?await ut(i,t,o,n)&&ge():G("Couldn't find video \u2014 try again"),a}catch(s){return s.name==="AbortError"?(de(),null):(console.error("Error fetching reel info:",s),G("Couldn't download \u2014 try again"),null)}}async function ut(e,t,o,n){try{let r=await fetch(e,{signal:n});if(!r.ok)throw new Error(`Failed to fetch video: ${r.status}`);let s=r.headers.get("content-length"),a=s?parseInt(s,10):0,i=0,m=r.body.getReader(),c=[];for(;;){let{done:p,value:l}=await m.read();if(p)break;if(c.push(l),i+=l.length,a>0){let h=Math.round(i/a*100);Be(h)}}let f=new Blob(c,{type:"video/mp4"}),d=URL.createObjectURL(f),u=document.createElement("a");return u.href=d,u.download=`${t}_${o}.mp4`,document.body.appendChild(u),u.click(),document.body.removeChild(u),URL.revokeObjectURL(d),!0}catch(r){return r.name==="AbortError"||(console.error("Error downloading reel:",r),G("Couldn't download reel")),!1}}async function Gt(e,t,o,n){try{let r=await fetch(e,{signal:n});if(!r.ok)throw new Error(`Failed to fetch image: ${r.status}`);let s=r.headers.get("content-length"),a=s?parseInt(s,10):0,i=0,m=r.body.getReader(),c=[];for(;;){let{done:p,value:l}=await m.read();if(p)break;if(c.push(l),i+=l.length,a>0){let h=Math.round(i/a*100);Be(h)}}let f=new Blob(c,{type:"image/jpeg"}),d=URL.createObjectURL(f),u=document.createElement("a");return u.href=d,u.download=`${t}_${o}.jpg`,document.body.appendChild(u),u.click(),document.body.removeChild(u),URL.revokeObjectURL(d),!0}catch(r){return r.name==="AbortError"||(console.error("Error downloading post:",r),G("Couldn't download post")),!1}}function de(){window.__sfBanner.guards.isDownloading=!1,Z=null}function po(){let e=document.querySelector(".sf-download-banner.sf-progress");if(!e)return 0;let t=e.querySelector(".sf-progress-pct");return t&&parseInt(t.textContent)||0}function ve(e){let t=window.__sfBanner;if(document.querySelector(".sf-download-banner.sf-progress"))return;let o=document.createElement("div");o.className="sf-banner sf-download-banner sf-progress",o.innerHTML=`
    <img class="sf-icon" src="${t.iconURL("Icons/logo.png")}" />
    <div class="sf-body">
      <div class="sf-message">${e||"Downloading"}</div>
      <div class="sf-progress-row">
        <div class="sf-progress-track"><div class="sf-progress-fill"></div></div>
        <span class="sf-progress-pct">0%</span>
      </div>
    </div>
  `,o.appendChild(t.makeStopButton(()=>{Z&&Z.abort(),t.dismissBanner(o,0),de()},"Stop downloading")),t.enterBanner(o,"download")}function Be(e){let t=document.querySelector(".sf-download-banner.sf-progress");t&&window.__sfBanner.setProgress(t,e)}function ge(){let e=window.__sfBanner,t=document.querySelector(".sf-download-banner.sf-progress");if(!t){de();return}e.animateProgress(t,po(),100,400,()=>{e.dismissBanner(t,0)}),de()}function G(e){let t=window.__sfBanner,o=document.querySelector(".sf-download-banner.sf-progress");o&&t.dismissBanner(o,0),setTimeout(()=>{let n=document.createElement("div");n.className="sf-banner sf-download-banner sf-error sf-static",n.innerHTML=`
      <img class="sf-icon sf-static" src="${t.iconURL("Icons/logo.png")}" />
      <div class="sf-message">${e||"Download failed \u2014 try again"}</div>
    `,n.appendChild(t.makeCloseButton(()=>t.dismissBanner(n,0))),t.enterBanner(n,"download"),setTimeout(()=>t.dismissBanner(n,0),5e3)},o?260:0),de()}async function ft(e){let t=[],o=[],n=0;for(let i of e){let m=new TextEncoder().encode(i.name),c=new Uint8Array(await i.blob.arrayBuffer()),f=go(c),d=new ArrayBuffer(30+m.length),u=new DataView(d);u.setUint32(0,67324752,!0),u.setUint16(4,20,!0),u.setUint16(6,0,!0),u.setUint16(8,0,!0),u.setUint16(10,0,!0),u.setUint16(12,0,!0),u.setUint32(14,f,!0),u.setUint32(18,c.length,!0),u.setUint32(22,c.length,!0),u.setUint16(26,m.length,!0),u.setUint16(28,0,!0),new Uint8Array(d,30).set(m);let p=new ArrayBuffer(46+m.length),l=new DataView(p);l.setUint32(0,33639248,!0),l.setUint16(4,20,!0),l.setUint16(6,20,!0),l.setUint16(8,0,!0),l.setUint16(10,0,!0),l.setUint16(12,0,!0),l.setUint16(14,0,!0),l.setUint32(16,f,!0),l.setUint32(20,c.length,!0),l.setUint32(24,c.length,!0),l.setUint16(28,m.length,!0),l.setUint16(30,0,!0),l.setUint16(32,0,!0),l.setUint16(34,0,!0),l.setUint16(36,0,!0),l.setUint32(38,0,!0),l.setUint32(42,n,!0),new Uint8Array(p,46).set(m),t.push(new Uint8Array(d),c),o.push(new Uint8Array(p)),n+=d.byteLength+c.length}let r=o.reduce((i,m)=>i+m.length,0),s=new ArrayBuffer(22),a=new DataView(s);return a.setUint32(0,101010256,!0),a.setUint16(4,0,!0),a.setUint16(6,0,!0),a.setUint16(8,e.length,!0),a.setUint16(10,e.length,!0),a.setUint32(12,r,!0),a.setUint32(16,n,!0),a.setUint16(20,0,!0),new Blob([...t,...o,new Uint8Array(s)],{type:"application/zip"})}var mo=(()=>{let e=new Uint32Array(256);for(let t=0;t<256;t++){let o=t;for(let n=0;n<8;n++)o=o&1?3988292384^o>>>1:o>>>1;e[t]=o}return e})();function go(e){let t=4294967295;for(let o=0;o<e.length;o++)t=mo[(t^e[o])&255]^t>>>8;return(t^4294967295)>>>0}async function nt(e,t,o,n){let r=await fetch(e,{signal:o});if(!r.ok)throw new Error(`HTTP ${r.status}`);let s=r.headers.get("content-length"),a=s?parseInt(s,10):0,i=0,m=0,c=null;!a&&n&&(c=setInterval(()=>{m<95&&(m+=1,n(m))},40));let f=r.body.getReader(),d=[];try{for(;;){let{done:u,value:p}=await f.read();if(u)break;d.push(p),i+=p.length,a>0&&n&&n(Math.min(99,Math.round(i/a*100)))}}finally{c&&clearInterval(c)}return n&&n(100),new Blob(d,{type:t})}async function ho(e,t,o,n,r){let s=e.length,a=new Array(s).fill(0),i=()=>{if(!r)return;let f=0;for(let d=0;d<s;d++)f+=a[d];r(f/s*100)},c=(await Promise.all(e.map(async(f,d)=>{if(n&&n.aborted)return null;let u=!!f.video_versions,p=u?f.video_versions[0].url:f.image_versions2.candidates[0].url,l=u?"mp4":"jpg",h=`${t}_${o}_${d+1}.${l}`;try{let _=await nt(p,u?"video/mp4":"image/jpeg",n,g=>{a[d]=Math.max(0,Math.min(1,g/100)),i()});return a[d]=1,i(),{name:h,blob:_}}catch{return null}}))).filter(Boolean);return c.length===0?null:await ft(c)}function yo(){let e=window.__sfBanner,t=document.querySelector(".sf-download-banner.sf-progress");if(!t)return;let o=t.querySelector(".sf-banner-stop");if(!o)return;let n=e.makeStopButton(()=>{Z&&Z.abort()},"Stop downloading");o.replaceWith(n)}function bo(e){let t=document.querySelector(".sf-download-banner.sf-progress");if(!t)return;let o=t.querySelector(".sf-message");o&&(o.textContent=e)}function Ke(e){return(e||"sortfeed").replace(/[^a-zA-Z0-9_\-]/g,"")||"sortfeed"}var Lt=2;async function Mt(e,t){let o=window.__sfBanner;if(!o||o.guards.isDownloading||!e||e.length===0)return;o.guards.isDownloading=!0,Z=new AbortController;let n=Z.signal,r=e.length;ve(`Downloading 1 of ${r}`),yo();let s=new Array(r),a=0,i=new Array(Lt).fill(0),m=()=>{bo(`Downloading ${Math.min(a+1,r)} of ${r}`);let l=0;for(let g=0;g<i.length;g++)l+=i[g];let h=(a+l)/r*100,_=document.querySelector(".sf-download-banner.sf-progress");_&&o.setProgress(_,Math.min(99,Math.round(h)))},c=0,f=()=>c<r?c++:-1;async function d(l){for(;!n.aborted;){let h=f();if(h<0)return;i[l]=0;let _=e[h]||{},g=_.id??_.postID??_.reelID,b=_.code||"",y=Ke(t||_.userName||"creator");if(!g){a++,i[l]=0,m();continue}let x=v=>{i[l]=Math.max(0,Math.min(1,v/100)),m()};try{let v=`https://www.instagram.com/api/v1/media/${g}/info/`,N=await fetch(v,{method:"GET",credentials:"include",signal:n,headers:{"x-ig-app-id":"936619743392459","x-ig-www-claim":window._sharedData?.config?.csrf_token||""}});if(!N.ok)throw new Error(`HTTP ${N.status}`);let S=await N.json(),B=b||S.items?.[0]?.code||"",{carouselFlag:U,ReelFlag:H}=Ot(S);if(!U&&H){let E=S.items?.[0]?.video_versions?.[0]?.url;if(E){let $=await nt(E,"video/mp4",n,x);s[h]={name:`${y}_${B}.mp4`,blob:$}}}else if(!U&&!H){let E=S.items[0].image_versions2.candidates[0].url;if(E){let $=await nt(E,"image/jpeg",n,x);s[h]={name:`${y}_${B}.jpg`,blob:$}}}else if(U){let E=S.items[0].carousel_media,$=await ho(E,y,B,n,x);$&&(s[h]={name:`${y}_${B}.zip`,blob:$})}}catch(v){if(v.name==="AbortError")return}finally{a++,i[l]=0,m()}}}let u=[];for(let l=0;l<Lt;l++)u.push(d(l));await Promise.all(u);let p=s.filter(Boolean);if(p.length===0){de();let l=document.querySelector(".sf-download-banner.sf-progress");l&&o.dismissBanner(l,0),n.aborted||G("Download failed \u2014 try again");return}try{let l=await ft(p),h=URL.createObjectURL(l),_=document.createElement("a");_.href=h;let g;t?g=Ke(t):typeof ne=="function"?g=Ke(ne(e)):g="sortfeed",_.download=`${g}_${p.length}.zip`,document.body.appendChild(_),_.click(),document.body.removeChild(_),URL.revokeObjectURL(h)}catch{}ge()}function $t(){let e=Array.from(document.querySelectorAll(".sf-select-circle[data-sf-selected='true']")).sort((o,n)=>Number(o.dataset.sfSelectOrder)-Number(n.dataset.sfSelectOrder)),t=[];return e.forEach(o=>{let n=o.closest("[data-sf-sorted-item]");if(!(!n||!n.dataset.sfItemJson))try{t.push(JSON.parse(n.dataset.sfItemJson))}catch{}}),t}function Ve(e,t,o){if(!(!e||e.length===0)){if(o!=="selected"){Mt(e,t);return}chrome.runtime.sendMessage({command:"checkProStatus"},n=>{if(!n?.isPro){let r=e.length,s=`${r} Post${r!==1?"s":""} selected \u2014 Download selected media with Pro`;typeof be=="function"&&be(s);return}Mt(e,t)})}}(()=>{let t=(...E)=>!1,o="sf-story-download-button",n="sf-story-style",r=/^\/stories\/([^/]+)(?:\/(\d+))?\/?/,s=!0;chrome.storage.local.get(["sortfeed_ig_download_enabled"],E=>{E.sortfeed_ig_download_enabled===!1&&(s=!1,l())}),chrome.storage.onChanged.addListener(E=>{"sortfeed_ig_download_enabled"in E&&(s=E.sortfeed_ig_download_enabled.newValue!==!1,s?a(location.pathname)&&b():(y(),l()))});function a(E){let $=E.match(r);if(!$)return null;let I=$[1],D=E.split("/").filter(Boolean);if(I==="highlights"){let q=D[2],T=D[3]||null;return q?{kind:"highlight",highlightId:q,mediaId:T,username:"highlights"}:null}return{kind:"live",username:I,mediaId:$[2]||null}}function i(){if(document.getElementById(n))return;let E=document.createElement("style");E.id=n,E.textContent=`
      @keyframes sf-story-fadein {
        from { opacity: 0; transform: scale(0.88); }
        to   { opacity: 1; transform: scale(1); }
      }

      #${o} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-left: 4px;
        margin-right: 14px;
        opacity: 0.85;
        transition: opacity 180ms ease;
        animation: sf-story-fadein 280ms cubic-bezier(0.16, 1, 0.3, 1) both;
        position: relative;
        z-index: 5;
      }

      #${o}:hover { opacity: 1; }

      #${o} .sf-story-icon {
        width: 10px;
        height: 10px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.72);
        padding: 5px;
        display: block;
        transition: background 180ms ease;
      }

      #${o}:hover .sf-story-icon {
        background: #fde082;
      }

      #${o} .sf-story-tip {
        position: absolute;
        top: 50%;
        right: calc(100% + 8px);
        transform: translateY(-50%);
        background: #000;
        color: #fff;
        font-size: 10px;
        line-height: 1;
        padding: 4px 8px;
        border-radius: 6px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        z-index: 99999;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: opacity 120ms ease;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      #${o}:hover .sf-story-tip { opacity: 1; }
    `,document.head.appendChild(E)}function m(){let E=document.querySelector('div[style*="translateX("][style*="%"]');if(!E)return null;let $=E.parentElement,I=$&&$.parentElement;if(!I)return null;let D=I.nextElementSibling;return!D||!D.querySelector('[role="button"]')?null:D}function c(){let E=document.querySelectorAll('svg[aria-label="Menu"]');for(let $ of E){let I=$.closest('[role="button"]');if(!I||!I.parentElement)continue;let D=I.parentElement;if(Array.from(D.children).filter(T=>T===I||T.getAttribute&&T.getAttribute("role")==="button"||T.querySelector?.('[role="button"]')||T.querySelector?.("a[href]")).length>=2)return D}return null}function f(){return m()||c()}function d(){let E=document.querySelector('div[style*="translateX("][style*="%"]');if(!E)return-1;let $=E.parentElement,I=$&&$.parentElement;return I?Array.from(I.children).indexOf($):-1}function u(){let E=document.createElement("div");E.id=o,E.setAttribute("role","button"),E.setAttribute("tabindex","0"),E.setAttribute("aria-label","Download");let $=document.createElement("img");$.className="sf-story-icon",$.src=chrome.runtime.getURL("icons/Hover/arrowDownBlack.png"),$.alt="",$.draggable=!1,E.appendChild($);let I=document.createElement("div");I.className="sf-story-tip";let D=document.createElement("span");D.textContent="Download",I.appendChild(D),E.appendChild(I);let q=T=>{T.stopPropagation(),T.preventDefault();let R=a(location.pathname);if(!R)return;let L=d();t("click \u2192 route",R,"currentIndex",L),window.postMessage({download:!0,download_item:"story",route:R,currentIndex:L},"*")};return E.addEventListener("click",q),E.addEventListener("keydown",T=>{(T.key==="Enter"||T.key===" ")&&q(T)}),E}function p(){if(!s)return!1;if(document.getElementById(o))return!0;if(!a(location.pathname))return!1;let E=f();if(!E)return t("no icon row"),!1;let $=u(),I=E.children[1]||null;return E.insertBefore($,I),t("attached before",I,"in row",E),!0}function l(){let E=document.getElementById(o);E&&E.remove()}let h=null,_=0,g=40;function b(){y(),_=0;let E=()=>{if(_++,!a(location.pathname)){l();return}p()||_>=g||(h=setTimeout(E,150))};E()}function y(){h&&(clearTimeout(h),h=null)}let x=location.pathname;function v(){setTimeout(()=>{if(location.pathname===x)return;if(x=location.pathname,!a(x)){y(),l();return}document.getElementById(o)||b()},0)}let N=history.pushState;history.pushState=function(){N.apply(this,arguments),v()};let S=history.replaceState;history.replaceState=function(){S.apply(this,arguments),v()},window.addEventListener("popstate",v);let B=null,U=new MutationObserver(()=>{clearTimeout(B),B=setTimeout(()=>{a(location.pathname)&&!document.getElementById(o)&&b()},100)});function H(){i(),U.observe(document.body,{childList:!0,subtree:!0}),a(location.pathname)&&b()}document.body?H():document.addEventListener("DOMContentLoaded",H)})();(()=>{let t=(...d)=>!1,o=()=>({"x-ig-app-id":"936619743392459","x-ig-www-claim":window._sharedData?.config?.csrf_token||""}),n={},r={};window.addEventListener("message",d=>{let u=d.data;if(u){if(u.sf_reels_media&&u.sf_reels_media.reel_id){let{reel_id:p,items:l,user:h}=u.sf_reels_media;r[p]={items:l,user:h},h&&h.username&&(n[h.username.toLowerCase()]=p),t("cached reel",p,l?.length,"items")}if(u.sf_reels_tray&&Array.isArray(u.sf_reels_tray)){for(let p of u.sf_reels_tray)p&&p.user&&p.user.username&&p.id&&(n[p.user.username.toLowerCase()]=p.id);t("cached tray entries",Object.keys(n).length)}}}),window.addEventListener("message",async d=>{let u=d.data;if(!u||!u.download||u.download_item!=="story")return;let p=window.__sfBanner;if(p&&!p.guards.isDownloading){p.guards.isDownloading=!0,ve("Downloading");try{await s(u)}catch(l){console.error("[SF Story Dl] unexpected",l),G("Couldn't download story \u2014 try again")}}});async function s({route:d,currentIndex:u}){t("runStoryDownload start",{route:d,currentIndex:u,cacheKeys:Object.keys(r),trayKeys:Object.keys(n)});let p=null,l=null;if(d.kind==="highlight")p="highlight:"+d.highlightId,l="highlights",t("highlight branch, reelId =",p);else{l=d.username;let S=l.toLowerCase();if(n[S])p=n[S],t("trayCache hit for",S,"\u2192",p);else{t("trayCache miss for",S,"\u2014 fetching tray");try{let B=await i();t("tray fetched, entries:",B.length);for(let U of B)U?.user?.username&&(n[U.user.username.toLowerCase()]=U.id);p=n[S],t("after tray fetch, reelId =",p)}catch(B){if(t("tray fetch failed",B),B&&B.status===401){G("Log in to Instagram first");return}}}if(!p){t("tray did not include",l,"\u2014 trying web_profile_info");try{let B=await a(l);t("web_profile_info \u2192 user_id",B),B&&(p=String(B),n[S]=p)}catch(B){if(t("web_profile_info fetch failed",B),B&&B.status===401){G("Log in to Instagram first");return}}}if(!p){t("could not resolve reelId for",l),G("Couldn't find this story \u2014 try again");return}}let h=r[p];if(h&&h.items)t("reelCache hit for",p,"items:",h.items.length);else{t("reelCache miss for",p,"\u2014 fetching reels_media");try{let S=await m(p);t("reels_media fetched",S?`items: ${S.items?.length}`:"null"),S&&(h=S,r[p]=S,S.user?.username&&(l=S.user.username))}catch(S){if(t("reels_media fetch failed",S),S&&S.status===401){G("Log in to Instagram first");return}}}if(!h||!h.items||h.items.length===0){t("no items available for",p),G("This story is no longer available");return}h.user?.username&&(l=h.user.username);let _=h.items;t("items summary",_.map((S,B)=>({i:B,pk:S.pk,id:S.id,media_type:S.media_type,has_video:!!S.video_versions?.length,has_image:!!S.image_versions2?.candidates?.length})));let g=null,b=null;typeof u=="number"&&u>=0&&u<_.length&&(g=_[u],b="currentIndex="+u),!g&&d.mediaId&&(g=_.find(S=>String(S.pk)===String(d.mediaId)||String(S.id||"").endsWith("_"+d.mediaId)),g&&(b="mediaId="+d.mediaId)),g||(g=_[0],b="fallback to items[0]"),t("picked item",{pk:g?.pk,media_type:g?.media_type,reason:b});let y=c(g);if(t("pickBestMedia \u2192",y),!y){t("FAIL: pickBestMedia returned null. item keys:",Object.keys(g||{})),G("Couldn't find this story's media");return}let x=l||"story",v="story_"+(g.pk||g.id||Date.now());t("downloading",y.type,"\u2192",y.url.slice(0,120));let N=new AbortController;if(y.type==="video"){let S=await ut(y.url,x,v,N.signal);t("actually_download_reel returned",S),S&&ge()}else{let S=await Gt(y.url,x,v,N.signal);t("actually_download_post returned",S),S&&ge()}}async function a(d){let u="https://www.instagram.com/api/v1/users/web_profile_info/?username="+encodeURIComponent(d),p=await fetch(u,{method:"GET",credentials:"include",headers:o()});if(!p.ok){let h=new Error("web_profile_info "+p.status);throw h.status=p.status,h}return(await p.json())?.data?.user?.id||null}async function i(){let d=await fetch("https://www.instagram.com/api/v1/feed/reels_tray/?is_following_feed=false",{method:"GET",credentials:"include",headers:o()});if(!d.ok){let p=new Error("tray "+d.status);throw p.status=d.status,p}return(await d.json()).tray||[]}async function m(d){let u="https://www.instagram.com/api/v1/feed/reels_media/?reel_ids="+encodeURIComponent(d),p=await fetch(u,{method:"GET",credentials:"include",headers:o()});if(!p.ok){let _=new Error("reels_media "+p.status);throw _.status=p.status,_}let l=await p.json(),h=l?.reels_media?.[0]||l?.reels&&l.reels[d];return h?{items:h.items||[],user:h.user||null}:null}function c(d){if(!d)return null;let u=f(d.video_versions);if(u&&u.url)return{type:"video",url:u.url};let p=f(d.image_versions2?.candidates);return p&&p.url?{type:"image",url:p.url}:null}function f(d){if(!Array.isArray(d)||d.length===0)return null;let u=d[0];for(let p of d)(p.width||0)*(p.height||0)>(u.width||0)*(u.height||0)&&(u=p);return u}})();var pt=0,J=!1,Yt="",Vt="",Ne,ot=0,pe=null,X=null,wo=16e4,Je=null,_e={offline:"You're offline \u2014 check your connection and try again",network:"Couldn't reach Sort Feed servers \u2014 check your connection and try again",timeout:"This took too long \u2014 you weren't charged. Try again",media_fetch_failed:"Couldn't download this reel's audio \u2014 refresh and try again",media_too_large:"This video is too long to transcribe",whisper_failed:"The transcription engine hiccuped \u2014 you weren't charged. Try again",empty_transcript:"No speech found in this video \u2014 you weren't charged",internal_error:"Couldn't reach Sort Feed servers \u2014 try again in a minute",missing_fields:"Something went wrong \u2014 refresh the page and try again",audio_extract_failed:"Couldn't read this reel's audio \u2014 refresh the page and try again",not_signed_in:"Sign in to Sort Feed to use transcription"};function mt(){window.__sfBanner.guards.isTranscribing=!1}function xe(){return document.querySelector(".sf-trans-banner.sf-progress")}function vo(){let e=window.__sfBanner;document.querySelectorAll(".sf-trans-banner.sf-ready, .sf-trans-banner.sf-limit, .sf-trans-banner.sf-error").forEach(t=>e.dismissBanner(t,0))}function Wt(e,t){let o=window.__sfBanner;if(o.guards.isTranscribing=!0,xe())return;let n="";e!=null&&t!=null&&(n=`<div class="sf-subtitle">${Math.ceil(Number(t)/60)} of ${e} monthly mins left</div>`);let r=document.createElement("div");r.className="sf-banner sf-trans-banner sf-progress",r.innerHTML=`
    <img class="sf-icon" src="${o.iconURL("Icons/logo.png")}" />
    <div class="sf-body">
      <div class="sf-message">Transcribing</div>
      ${n}
      <div class="sf-progress-row">
        <div class="sf-progress-track"><div class="sf-progress-fill"></div></div>
        <span class="sf-progress-pct">0%</span>
      </div>
    </div>
  `,r.appendChild(o.makeStopButton(()=>So(),"Stop transcribing")),o.enterBanner(r,"transcribe"),clearTimeout(Ne),Ne=setTimeout(()=>{let s=Je;s&&gt().then(a=>{chrome.runtime.sendMessage({command:"refundTransJob",clientJobId:s,userID:a,platform:"instagram"})}),K(),ue(_e.timeout)},wo)}function _o(e,t){if(e==null||t==null)return;let o=xe();if(!o)return;let n=o.querySelector(".sf-body");if(!n||n.querySelector(".sf-subtitle"))return;let r=Math.ceil(Number(t)/60),s=document.createElement("div");s.className="sf-subtitle",s.textContent=`${r} of ${e} monthly mins left`;let a=n.querySelector(".sf-progress-row");a?n.insertBefore(s,a):n.appendChild(s),s.animate([{opacity:0,transform:"translateY(-3px)"},{opacity:1,transform:"translateY(0)"}],{duration:220,easing:"cubic-bezier(0.22, 1, 0.36, 1)",fill:"both"})}function Dt(e){if(J)return;ot=Math.max(0,Math.min(100,Math.round(e)));let t=xe();t&&window.__sfBanner.setProgress(t,ot)}function xo(e){return 1-(1-e)*(1-e)}function je(e,t,o){clearInterval(pe),pe=null,Dt(e);let n=Date.now(),r=Math.max(1,o|0);pe=setInterval(()=>{let s=Math.min(1,(Date.now()-n)/r),a=xo(s);Dt(e+(t-e)*a),s>=1&&(clearInterval(pe),pe=null)},80)}function we(){clearInterval(pe),pe=null}function K(){we(),clearTimeout(Ne);let e=window.__sfBanner,t=xe();t&&e.dismissBanner(t,0),mt()}function So(){if(J)return;J=!0,window.__sfBanner.guards.isTranscribing=!1,we(),clearTimeout(Ne),Je=null;let e=window.__sfBanner,t=xe();t&&e.dismissBanner(t,0),chrome.runtime.sendMessage({command:"cancelTranscription",jobId:pt})}function Co(e,t,o){let n=window.__sfBanner,r=(e||"").trim(),s=r.length>0,a="Transcript ready";t&&(a=`Transcript ready \u2014 first ~${Math.max(1,Math.round(Number(o||0)/60))} min (video too long for a full transcript)`);let i=document.createElement("div");i.className="sf-banner sf-trans-banner sf-ready sf-static"+(s?"":" sf-no-snippet"),i.innerHTML=`
    <div class="sf-trans-ready-fill"></div>
    <div class="sf-trans-ready-top">
      <img class="sf-icon sf-static" src="${n.iconURL("Icons/logo.png")}" />
      <div class="sf-message"></div>
    </div>
  `,i.querySelector(".sf-message").textContent=a;let m=n.makeCopyButton(r,()=>{setTimeout(()=>n.dismissBanner(i,0),900)});if(s){let f=document.createElement("div");f.className="sf-trans-snippet-row";let d=document.createElement("div");d.className="sf-trans-snippet";let u=document.createElement("div");u.className="sf-trans-text";let p=140,l=r.length>p?r.slice(0,p).trimEnd()+"\u2026":r;u.textContent=`"${l}"`,d.appendChild(u),d.appendChild(m),f.appendChild(d),i.appendChild(f)}else i.querySelector(".sf-trans-ready-top").appendChild(m);i.appendChild(n.makeCloseButton(()=>n.dismissBanner(i,0))),n.enterBanner(i,"transcribe");let c=i.querySelector(".sf-trans-ready-fill");c&&c.addEventListener("animationend",()=>n.dismissBanner(i,0),{once:!0})}function st(e){let t=window.__sfBanner,o=(e||"").replace(/(\d+\s+days?)/i,'<span style="font-weight:600;">$1</span>'),n=document.createElement("div");n.className="sf-banner sf-trans-banner sf-limit sf-static",n.innerHTML=`
    <img class="sf-icon sf-static" src="${t.iconURL("Icons/logo.png")}" />
    <div class="sf-message">${o}</div>
  `,n.appendChild(t.makeCloseButton(()=>t.dismissBanner(n,0))),t.enterBanner(n,"transcribe"),setTimeout(()=>t.dismissBanner(n,0),5e3),mt()}function ue(e){clearTimeout(Ne);let t=window.__sfBanner,o=xe();o&&t.dismissBanner(o,0),setTimeout(()=>{let n=document.createElement("div");n.className="sf-banner sf-trans-banner sf-error sf-static",n.innerHTML=`
      <img class="sf-icon sf-static" src="${t.iconURL("Icons/logo.png")}" />
      <div class="sf-message">${e||"Transcription failed \u2014 try again"}</div>
    `,n.appendChild(t.makeCloseButton(()=>t.dismissBanner(n,0))),t.enterBanner(n,"transcribe"),setTimeout(()=>t.dismissBanner(n,0),5e3)},o?260:0),mt()}function be(e){let t=window.__sfBanner;if(!t)return;let o=e||"Unlock 500 min/month of transcripts \u2014 Go Pro",n=document.querySelector(".sf-upgrade-banner");if(n){let s=n.querySelector(".sf-message");s&&(s.textContent=o);return}let r=document.createElement("div");r.className="sf-banner sf-upgrade-banner sf-static",r.innerHTML=`
    <img class="sf-icon sf-static" src="${t.iconURL("Icons/logo.png")}" />
    <div class="sf-message">${o}</div>
    <button class="sf-pro-btn" type="button">
      <img src="${t.iconURL("icons/ZeroStateIcons/black_star.svg")}" alt="" />
      <span>Get Pro</span>
    </button>
  `,r.querySelector(".sf-pro-btn").addEventListener("click",()=>{window.open("https://www.sortfeed.com/#price","_blank")}),r.appendChild(t.makeCloseButton(()=>t.dismissBanner(r,0))),t.enterBanner(r,"upgrade"),setTimeout(()=>t.dismissBanner(r,0),5e3)}window.addEventListener("message",e=>{let t=e.data;if(t&&t.trans)return});async function Eo(e,t,o,n){if(J){K?.();return}let r=`https://www.instagram.com/api/v1/media/${e}/info/`;try{let s=await fetch(r,{method:"GET",credentials:"include",headers:{"x-ig-app-id":"936619743392459","x-ig-www-claim":window._sharedData?.config?.csrf_token||""}});if(!s.ok)throw new Error(`Failed: ${s.status}`);let a=await s.json();if(J)return null;let i=Array.isArray(a)?a[0]:a?.items?.[0]??a,m=u=>u&&u.match(/<AdaptationSet[^>]*contentType="audio"[^>]*>[\s\S]*?<BaseURL>([^<]+)<\/BaseURL>/i)?.[1]?.replace(/&amp;/g,"&")||null,c=i?.clips_metadata?.original_sound_info?.progressive_download_url;if(c&&/^https?:\/\//i.test(c)){if(J){K?.();return}return Ze("progressive",c,o,e,"instagram",n,t),c}let f=m(i?.video_dash_manifest);if(f){if(J){K?.();return}return Ze("dashAudio",f,o,e,"instagram",n,t),f}let d=i?.video_versions?.[0]?.url||null;if(d){if(J){K?.();return}return Ze("videoFallback",d,o,e,"instagram",n,t),d}return K(),ue(_e.audio_extract_failed),null}catch{return K(),J||ue(_e.audio_extract_failed),null}}async function gt(){try{let t=(await chrome.storage.local.get("sort_feed_user_id"))?.sort_feed_user_id;return t||(console.warn("No userID found in storage."),null)}catch(e){return console.error("Error fetching userID from storage:",e),null}}async function Ze(e=null,t=null,o=null,n=null,r=null,s=null,a=null){if(J)return;if(!t)return console.warn("No ReelURL to send."),!1;let i=await gt();if(!i)return K(),ue(_e.not_signed_in),!1;chrome.runtime.sendMessage({command:"InstagramReelTranscribe",ReelType:e,ReelURL:t,jobId:o,userID:i,contentId:n,platform:r,reelIdUi:s,profileName:a})}chrome.runtime.onMessage.addListener(e=>{if(e.type==="TRANS_LIMIT_REACHED"){try{K?.()}catch{}X&&(clearTimeout(X),X=null),we?.(),st(e.data||"You\u2019ve reached your monthly transcription limit.");return}if(!J&&!(!e||e.jobId!==pt)){if(e.type==="TRANS_STARTED"&&(Je=e.clientJobId||null,Wt(null,null)),e.type==="TRANS_QUOTA_INFO"&&_o(e.monthly_quota_mins,e.monthly_usage_secs),e.type==="TRANS_LOADING"&&(we?.(),X&&clearTimeout(X),je(0,70,3500),X=setTimeout(()=>{je(70,80,3500),X=setTimeout(()=>{je(80,95,12e3)},3500)},3500)),e.type==="TRANSCRIPTION_RESULT"){X&&(clearTimeout(X),X=null),we();let t=(e.data.transcription||"").trim();if(!t){ue(_e.empty_transcript);return}je(Math.max(ot,80),100,250),setTimeout(()=>{let o=new Blob([t],{type:"text/plain"}),n=URL.createObjectURL(o),r=document.createElement("a");r.href=n,r.download=`${Yt}_${Vt}.txt`,r.click(),URL.revokeObjectURL(n),K(),setTimeout(()=>{Co(t,e.data.partial,e.data.duration_seconds)},200)},300)}else if(e.type==="TRANSCRIPTION_ERROR"){if(X&&(clearTimeout(X),X=null),we(),e.errorCode==="cancelled"){K();return}ue(_e[e.errorCode]||"Transcription failed \u2014 try again")}}});})();
