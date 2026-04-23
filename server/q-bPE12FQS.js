import{w as K,x as f,y as ae,z as le,F as z,A as ce,e as ue,i as fe,n as x,f as q,R as de,Q as me,B as pe}from"./q-eElk3Pzu.js";const J={manifestHash:"zd4150",core:"q-BhSjnTVr.js",preloader:"q-BD-hIznX.js",qwikLoader:"q-naDMFAHy.js",bundleGraphAsset:"assets/DWgNOrsy-bundle-graph.json",injections:[{tag:"link",location:"head",attributes:{rel:"stylesheet",href:"/assets/D_IAzjtr-style.css"}}],mapping:{s_exZi0SOKHhY:"q-DaHVUqsB.js",s_llnQlwdX8jU:"q-LIk4KtJy.js",s_h9T0gAewTXI:"q-CCyD8QUZ.js",s_qRQxW9tw7Ho:"q-BCS_zWvv.js",s_4kdgMIDr8zI:"q-CWARqkHV.js",s_Hu1ellmVtpM:"q-CBlgycHx.js",s_et5zHgnQjwQ:"q-B5ExEHmJ.js",s_rsWWvIAzdZo:"q-D-CB7EwK.js",s_vxAA92AhMlc:"q-DQUQKWU_.js",s_2cavOiSEMms:"q-DSriUXWw.js",s_2dI9iQpVSjA:"q-Dl5BhA-6.js",s_3yS1bGTvor0:"q-LIk4KtJy.js",s_8FCsNe5x1jU:"q-CJaDxPmd.js",s_A7KIDaLSTJA:"q-CHK422jT.js",s_AklZPM550xo:"q-fIvWXeno.js",s_EXkKzyfS3Jk:"q-Cufrv95f.js",s_IejYp2MD03Y:"q-CCyD8QUZ.js",s_JTKB0qYpmCg:"q-woDOLeFm.js",s_KQ9gfpR6bqk:"q-DptGaGkL.js",s_M2URIJmkRto:"q-DU5uAw99.js",s_Q0OFQm9wvzI:"q-Ddpdu_WT.js",s_SJ1dbc0zl9E:"q-C9rTEfPd.js",s_ZWviYXGAIAI:"q-CWQU5XBX.js",s_dIePrpSunh8:"q-ym5ZGdFu.js",s_eYKJKZkUfVw:"q-Bbt20EPl.js",s_iWoP7R6KJDo:"q-DhlzlD_J.js",s_iaZdhcsFI8A:"q-CqOyZi7V.js",s_jeDrgOoTEGM:"q-WoKiOvt-.js",s_oKAR0wLjPAg:"q-HP91h-zU.js",s_pd3oE6BsFD4:"q-FUIrP5Mg.js",s_pyS9A9fhlQg:"q-B2k3HqO7.js",s_q2GpPAk1CZo:"q-DaHVUqsB.js",s_s0pW5QuB5EQ:"q-BCS_zWvv.js",s_taKKq5ashNI:"q-Cmg82DEu.js",s_voVe8lwVXks:"q-BgA__QVW.js",s_w9Qhd0yN6HQ:"q-D6WRtxJg.js",s_A86VnE0LzSo:"q-CCyD8QUZ.js",s_PwiuVu3QFoA:"q-e2DjShc5.js",s_VXOgUQQ4b5w:"q-CtJj8XwD.js",s_XQBUSfhWvPw:"q-BbEULbSo.js",s_zrQRMsdTV3k:"q-DgckEWnC.js",s_6wqeMsseDVA:"q-CCyD8QUZ.js",s_7mSttZ6QGoo:"q-LIk4KtJy.js",s_BMv64B57vlY:"q-D6WRtxJg.js",s_K4937JWDftg:"q-BgA__QVW.js",s_MvVoAWT0vlE:"q-CWQU5XBX.js",s_PuNrOD4muH0:"q-woDOLeFm.js",s_Sw31kwBkwT8:"q-BgA__QVW.js",s_TZCVjT7SIAQ:"q-LIk4KtJy.js",s_X0kv0RnhaSA:"q-BCS_zWvv.js",s_c8yAo756LJ0:"q-LIk4KtJy.js",s_gauDAg7bsGs:"q-CWQU5XBX.js",s_pgddy5y5cuk:"q-CCyD8QUZ.js",s_tjWdhfYC0ks:"q-BgA__QVW.js",s_uFGs40dtygQ:"q-DaHVUqsB.js"}};/**
 * @license
 * @builder.io/qwik/server 1.19.2
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/QwikDev/qwik/blob/main/LICENSE
 */var he=!1,ve="",be=(e,...t)=>{const n=qe(he,e,...t);debugger;return n},ye=e=>e,qe=(e,t,...n)=>{const r=t instanceof Error?t:new Error(t);return console.error("%cQWIK ERROR",ve,r.message,...ye(n),r.stack),r},_e=(e,...t)=>`Code(${e}) https://github.com/QwikDev/qwik/blob/main/packages/qwik/src/core/error/error.ts#L${8+e}`,ge=11,we=(e,...t)=>{const n=_e(e,...t);return be(n,...t)},$e="<sync>";function G(e,t){const n=t?.mapper,r=e.symbolMapper?e.symbolMapper:(s,i,a)=>{if(n){const l=A(s),c=n[l];if(!c){if(l===$e)return[l,""];if(globalThis.__qwik_reg_symbols?.has(l))return[s,"_"];if(a)return[s,`${a}?qrl=${s}`];console.error("Cannot resolve symbol",s,"in",n,a)}return c}};return{isServer:!0,async importSymbol(s,i,a){const l=A(a),c=globalThis.__qwik_reg_symbols?.get(l);if(c)return c;throw we(ge,a)},raf:()=>(console.error("server can not rerender"),Promise.resolve()),nextTick:s=>new Promise(i=>{setTimeout(()=>{i(s())})}),chunkForSymbol(s,i,a){return r(s,n,a)}}}async function Ee(e,t){const n=G(e,t);K(n)}var A=e=>{const t=e.lastIndexOf("_");return t>-1?e.slice(t+1):e},Se="q:instance",L={$DEBUG$:!1,$invPreloadProbability$:.65},ke=Date.now(),Pe=/\.[mc]?js$/,X=0,je=1,Ae=2,Ce=3,Q,N,De=(e,t)=>({$name$:e,$state$:Pe.test(e)?X:Ce,$deps$:Y?t?.map(n=>({...n,$factor$:1})):t,$inverseProbability$:1,$createdTs$:Date.now(),$waitedMs$:0,$loadedMs$:0}),Ie=e=>{const t=new Map;let n=0;for(;n<e.length;){const r=e[n++],o=[];let s,i=1;for(;s=e[n],typeof s=="number";)s<0?i=-s/10:o.push({$name$:e[s],$importProbability$:i,$factor$:1}),n++;t.set(r,o)}return t},Z=e=>{let t=O.get(e);if(!t){let n;if(N){if(n=N.get(e),!n)return;n.length||(n=void 0)}t=De(e,n),O.set(e,t)}return t},Be=(e,t)=>{t&&("debug"in t&&(L.$DEBUG$=!!t.debug),typeof t.preloadProbability=="number"&&(L.$invPreloadProbability$=1-t.preloadProbability)),!(Q!=null||!e)&&(Q="",N=Ie(e))},O=new Map,Y,C,ee=0,S=[],Te=(...e)=>{console.log(`Preloader ${Date.now()-ke}ms ${ee}/${S.length} queued>`,...e)},xe=()=>{O.clear(),C=!1,Y=!0,ee=0,S.length=0},Le=()=>{C&&(S.sort((e,t)=>e.$inverseProbability$-t.$inverseProbability$),C=!1)},Qe=()=>{Le();let e=.4;const t=[];for(const n of S){const r=Math.round((1-n.$inverseProbability$)*10);r!==e&&(e=r,t.push(e)),t.push(n.$name$)}return t},te=(e,t,n)=>{if(n?.has(e))return;const r=e.$inverseProbability$;if(e.$inverseProbability$=t,!(r-e.$inverseProbability$<.01)&&(Q!=null&&e.$state$<Ae&&(e.$state$===X&&(e.$state$=je,S.push(e),L.$DEBUG$&&Te(`queued ${Math.round((1-e.$inverseProbability$)*100)}%`,e.$name$)),C=!0),e.$deps$)){n||(n=new Set),n.add(e);const o=1-e.$inverseProbability$;for(const s of e.$deps$){const i=Z(s.$name$);if(i.$inverseProbability$===0)continue;let a;if(o===1||o>=.99&&R<100)R++,a=Math.min(.01,1-s.$importProbability$);else{const l=1-s.$importProbability$*o,c=s.$factor$,d=l/c;a=Math.max(.02,i.$inverseProbability$*d),s.$factor$=d}te(i,a,n)}}},V=(e,t)=>{const n=Z(e);n&&n.$inverseProbability$>t&&te(n,t)},R,Ne=(e,t)=>{if(!e?.length)return;R=0;let n=t?1-t:.4;if(Array.isArray(e))for(let r=e.length-1;r>=0;r--){const o=e[r];typeof o=="number"?n=1-o/10:V(o,n)}else V(e,n)};function Oe(e){const t=[],n=r=>{if(r)for(const o of r)t.includes(o.url)||(t.push(o.url),o.imports&&n(o.imports))};return n(e),t}var Re=e=>{const t=ce(),n=e?.qrls?.map(r=>{const o=r.$refSymbol$||r.$symbol$,s=r.$chunk$,i=t.chunkForSymbol(o,s,r.dev?.file);return i?i[1]:s}).filter(Boolean);return[...new Set(n)]};function Ue(e,t,n){const r=t.prefetchStrategy;if(r===null)return[];if(!n?.manifest.bundleGraph)return Re(e);if(typeof r?.symbolsToPrefetch=="function")try{const s=r.symbolsToPrefetch({manifest:n.manifest});return Oe(s)}catch(s){console.error("getPrefetchUrls, symbolsToPrefetch()",s)}const o=new Set;for(const s of e?.qrls||[]){const i=A(s.$refSymbol$||s.$symbol$);i&&i.length>=10&&o.add(i)}return[...o]}var We=(e,t)=>{if(!t?.manifest.bundleGraph)return[...new Set(e)];xe();let n=.99;for(const r of e.slice(0,15))Ne(r,n),n*=.85;return Qe()},U=(e,t)=>{if(t==null)return null;const n=`${e}${t}`.split("/"),r=[];for(const o of n)o===".."&&r.length>0?r.pop():r.push(o);return r.join("/")},Me=(e,t,n,r,o)=>{const s=U(e,t?.manifest?.preloader),i="/"+t?.manifest.bundleGraphAsset;if(s&&i&&n!==!1){const l=typeof n=="object"?{debug:n.debug,preloadProbability:n.ssrPreloadProbability}:void 0;Be(t?.manifest.bundleGraph,l);const c=[];n?.debug&&c.push("d:1"),n?.maxIdlePreloads&&c.push(`P:${n.maxIdlePreloads}`),n?.preloadProbability&&c.push(`Q:${n.preloadProbability}`);const d=c.length?`,{${c.join(",")}}`:"",b=`let b=fetch("${i}");import("${s}").then(({l})=>l(${JSON.stringify(e)},b${d}));`;r.push(f("link",{rel:"modulepreload",href:s,nonce:o,crossorigin:"anonymous"}),f("link",{rel:"preload",href:i,as:"fetch",crossorigin:"anonymous",nonce:o}),f("script",{type:"module",async:!0,dangerouslySetInnerHTML:b,nonce:o}))}const a=U(e,t?.manifest.core);a&&r.push(f("link",{rel:"modulepreload",href:a,nonce:o}))},Fe=(e,t,n,r,o)=>{if(r.length===0||n===!1)return null;const{ssrPreloads:s,ssrPreloadProbability:i}=Je(typeof n=="boolean"?void 0:n);let a=s;const l=[],c=[],d=t?.manifest.manifestHash;if(a){const y=t?.manifest.preloader,m=t?.manifest.core,h=We(r,t);let $=4;const k=i*10;for(const v of h)if(typeof v=="string"){if($<k)break;if(v===y||v===m)continue;if(c.push(v),--a===0)break}else $=v}const b=U(e,d&&t?.manifest.preloader);let w=c.length?`${JSON.stringify(c)}.map((l,e)=>{e=document.createElement('link');e.rel='modulepreload';e.href=${JSON.stringify(e)}+l;document.head.appendChild(e)});`:"";return b&&(w+=`window.addEventListener('load',f=>{f=_=>import("${b}").then(({p})=>p(${JSON.stringify(r)}));try{requestIdleCallback(f,{timeout:2000})}catch(e){setTimeout(f,200)}})`),w&&l.push(f("script",{type:"module","q:type":"preload",async:!0,dangerouslySetInnerHTML:w,nonce:o})),l.length>0?f(z,{children:l}):null},He=(e,t,n,r,o)=>{if(n.preloader!==!1){const s=Ue(t,n,r);if(s.length>0){const i=Fe(e,r,n.preloader,s,n.serverData?.nonce);i&&o.push(i)}}};function Je(e){return{...Ve,...e}}var Ve={ssrPreloads:7,ssrPreloadProbability:.5,debug:!1,maxIdlePreloads:25,preloadProbability:.35},Ke='const t=document,e=window,n=new Set,o=new Set([t]);let r;const s=(t,e)=>Array.from(t.querySelectorAll(e)),a=t=>{const e=[];return o.forEach(n=>e.push(...s(n,t))),e},i=t=>{w(t),s(t,"[q\\\\:shadowroot]").forEach(t=>{const e=t.shadowRoot;e&&i(e)})},c=t=>t&&"function"==typeof t.then,l=(t,e,n=e.type)=>{a("[on"+t+"\\\\:"+n+"]").forEach(o=>{b(o,t,e,n)})},f=e=>{if(void 0===e._qwikjson_){let n=(e===t.documentElement?t.body:e).lastElementChild;for(;n;){if("SCRIPT"===n.tagName&&"qwik/json"===n.getAttribute("type")){e._qwikjson_=JSON.parse(n.textContent.replace(/\\\\x3C(\\/?script)/gi,"<$1"));break}n=n.previousElementSibling}}},p=(t,e)=>new CustomEvent(t,{detail:e}),b=async(e,n,o,r=o.type)=>{const s="on"+n+":"+r;e.hasAttribute("preventdefault:"+r)&&o.preventDefault(),e.hasAttribute("stoppropagation:"+r)&&o.stopPropagation();const a=e._qc_,i=a&&a.li.filter(t=>t[0]===s);if(i&&i.length>0){for(const t of i){const n=t[1].getFn([e,o],()=>e.isConnected)(o,e),r=o.cancelBubble;c(n)&&await n,r&&o.stopPropagation()}return}const l=e.getAttribute(s);if(l){const n=e.closest("[q\\\\:container]"),r=n.getAttribute("q:base"),s=n.getAttribute("q:version")||"unknown",a=n.getAttribute("q:manifest-hash")||"dev",i=new URL(r,t.baseURI);for(const p of l.split("\\n")){const l=new URL(p,i),b=l.href,h=l.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",q=performance.now();let _,d,y;const w=p.startsWith("#"),g={qBase:r,qManifest:a,qVersion:s,href:b,symbol:h,element:e,reqTime:q};if(w){const e=n.getAttribute("q:instance");_=(t["qFuncs_"+e]||[])[Number.parseInt(h)],_||(d="sync",y=Error("sym:"+h))}else{u("qsymbol",g);const t=l.href.split("#")[0];try{const e=import(t);f(n),_=(await e)[h],_||(d="no-symbol",y=Error(`${h} not in ${t}`))}catch(t){d||(d="async"),y=t}}if(!_){u("qerror",{importError:d,error:y,...g}),console.error(y);break}const m=t.__q_context__;if(e.isConnected)try{t.__q_context__=[e,o,l];const n=_(o,e);c(n)&&await n}catch(t){u("qerror",{error:t,...g})}finally{t.__q_context__=m}}}},u=(e,n)=>{t.dispatchEvent(p(e,n))},h=t=>t.replace(/([A-Z])/g,t=>"-"+t.toLowerCase()),q=async t=>{let e=h(t.type),n=t.target;for(l("-document",t,e);n&&n.getAttribute;){const o=b(n,"",t,e);let r=t.cancelBubble;c(o)&&await o,r||(r=r||t.cancelBubble||n.hasAttribute("stoppropagation:"+t.type)),n=t.bubbles&&!0!==r?n.parentElement:null}},_=t=>{l("-window",t,h(t.type))},d=()=>{const s=t.readyState;if(!r&&("interactive"==s||"complete"==s)&&(o.forEach(i),r=1,u("qinit"),(e.requestIdleCallback??e.setTimeout).bind(e)(()=>u("qidle")),n.has("qvisible"))){const t=a("[on\\\\:qvisible]"),e=new IntersectionObserver(t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),b(n.target,"",p("qvisible",n)))});t.forEach(t=>e.observe(t))}},y=(t,e,n,o=!1)=>{t.addEventListener(e,n,{capture:o,passive:!1})},w=(...t)=>{for(const r of t)"string"==typeof r?n.has(r)||(o.forEach(t=>y(t,r,q,!0)),y(e,r,_,!0),n.add(r)):o.has(r)||(n.forEach(t=>y(r,t,q,!0)),o.add(r))};if(!("__q_context__"in t)){t.__q_context__=0;const r=e.qwikevents;r&&(Array.isArray(r)?w(...r):w("click","input")),e.qwikevents={events:n,roots:o,push:w},y(t,"readystatechange",d),d()}',ze=`const doc = document;
const win = window;
const events = /* @__PURE__ */ new Set();
const roots = /* @__PURE__ */ new Set([doc]);
let hasInitialized;
const nativeQuerySelectorAll = (root, selector) => Array.from(root.querySelectorAll(selector));
const querySelectorAll = (query) => {
  const elements = [];
  roots.forEach((root) => elements.push(...nativeQuerySelectorAll(root, query)));
  return elements;
};
const findShadowRoots = (fragment) => {
  processEventOrNode(fragment);
  nativeQuerySelectorAll(fragment, "[q\\\\:shadowroot]").forEach((parent) => {
    const shadowRoot = parent.shadowRoot;
    shadowRoot && findShadowRoots(shadowRoot);
  });
};
const isPromise = (promise) => promise && typeof promise.then === "function";
const broadcast = (infix, ev, type = ev.type) => {
  querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((el) => {
    dispatch(el, infix, ev, type);
  });
};
const resolveContainer = (containerEl) => {
  if (containerEl._qwikjson_ === void 0) {
    const parentJSON = containerEl === doc.documentElement ? doc.body : containerEl;
    let script = parentJSON.lastElementChild;
    while (script) {
      if (script.tagName === "SCRIPT" && script.getAttribute("type") === "qwik/json") {
        containerEl._qwikjson_ = JSON.parse(
          script.textContent.replace(/\\\\x3C(\\/?script)/gi, "<$1")
        );
        break;
      }
      script = script.previousElementSibling;
    }
  }
};
const createEvent = (eventName, detail) => new CustomEvent(eventName, {
  detail
});
const dispatch = async (element, onPrefix, ev, eventName = ev.type) => {
  const attrName = "on" + onPrefix + ":" + eventName;
  if (element.hasAttribute("preventdefault:" + eventName)) {
    ev.preventDefault();
  }
  if (element.hasAttribute("stoppropagation:" + eventName)) {
    ev.stopPropagation();
  }
  const ctx = element._qc_;
  const relevantListeners = ctx && ctx.li.filter((li) => li[0] === attrName);
  if (relevantListeners && relevantListeners.length > 0) {
    for (const listener of relevantListeners) {
      const results = listener[1].getFn([element, ev], () => element.isConnected)(ev, element);
      const cancelBubble = ev.cancelBubble;
      if (isPromise(results)) {
        await results;
      }
      if (cancelBubble) {
        ev.stopPropagation();
      }
    }
    return;
  }
  const attrValue = element.getAttribute(attrName);
  if (attrValue) {
    const container = element.closest("[q\\\\:container]");
    const qBase = container.getAttribute("q:base");
    const qVersion = container.getAttribute("q:version") || "unknown";
    const qManifest = container.getAttribute("q:manifest-hash") || "dev";
    const base = new URL(qBase, doc.baseURI);
    for (const qrl of attrValue.split("\\n")) {
      const url = new URL(qrl, base);
      const href = url.href;
      const symbol = url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";
      const reqTime = performance.now();
      let handler;
      let importError;
      let error;
      const isSync = qrl.startsWith("#");
      const eventData = {
        qBase,
        qManifest,
        qVersion,
        href,
        symbol,
        element,
        reqTime
      };
      if (isSync) {
        const hash = container.getAttribute("q:instance");
        handler = (doc["qFuncs_" + hash] || [])[Number.parseInt(symbol)];
        if (!handler) {
          importError = "sync";
          error = new Error("sym:" + symbol);
        }
      } else {
        emitEvent("qsymbol", eventData);
        const uri = url.href.split("#")[0];
        try {
          const module = import(
                        uri
          );
          resolveContainer(container);
          handler = (await module)[symbol];
          if (!handler) {
            importError = "no-symbol";
            error = new Error(\`\${symbol} not in \${uri}\`);
          }
        } catch (err) {
          importError || (importError = "async");
          error = err;
        }
      }
      if (!handler) {
        emitEvent("qerror", {
          importError,
          error,
          ...eventData
        });
        console.error(error);
        break;
      }
      const previousCtx = doc.__q_context__;
      if (element.isConnected) {
        try {
          doc.__q_context__ = [element, ev, url];
          const results = handler(ev, element);
          if (isPromise(results)) {
            await results;
          }
        } catch (error2) {
          emitEvent("qerror", { error: error2, ...eventData });
        } finally {
          doc.__q_context__ = previousCtx;
        }
      }
    }
  }
};
const emitEvent = (eventName, detail) => {
  doc.dispatchEvent(createEvent(eventName, detail));
};
const camelToKebab = (str) => str.replace(/([A-Z])/g, (a) => "-" + a.toLowerCase());
const processDocumentEvent = async (ev) => {
  let type = camelToKebab(ev.type);
  let element = ev.target;
  broadcast("-document", ev, type);
  while (element && element.getAttribute) {
    const results = dispatch(element, "", ev, type);
    let cancelBubble = ev.cancelBubble;
    if (isPromise(results)) {
      await results;
    }
    cancelBubble || (cancelBubble = cancelBubble || ev.cancelBubble || element.hasAttribute("stoppropagation:" + ev.type));
    element = ev.bubbles && cancelBubble !== true ? element.parentElement : null;
  }
};
const processWindowEvent = (ev) => {
  broadcast("-window", ev, camelToKebab(ev.type));
};
const processReadyStateChange = () => {
  const readyState = doc.readyState;
  if (!hasInitialized && (readyState == "interactive" || readyState == "complete")) {
    roots.forEach(findShadowRoots);
    hasInitialized = 1;
    emitEvent("qinit");
    const riC = win.requestIdleCallback ?? win.setTimeout;
    riC.bind(win)(() => emitEvent("qidle"));
    if (events.has("qvisible")) {
      const results = querySelectorAll("[on\\\\:qvisible]");
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            dispatch(entry.target, "", createEvent("qvisible", entry));
          }
        }
      });
      results.forEach((el) => observer.observe(el));
    }
  }
};
const addEventListener = (el, eventName, handler, capture = false) => {
  el.addEventListener(eventName, handler, { capture, passive: false });
};
const processEventOrNode = (...eventNames) => {
  for (const eventNameOrNode of eventNames) {
    if (typeof eventNameOrNode === "string") {
      if (!events.has(eventNameOrNode)) {
        roots.forEach(
          (root) => addEventListener(root, eventNameOrNode, processDocumentEvent, true)
        );
        addEventListener(win, eventNameOrNode, processWindowEvent, true);
        events.add(eventNameOrNode);
      }
    } else {
      if (!roots.has(eventNameOrNode)) {
        events.forEach(
          (eventName) => addEventListener(eventNameOrNode, eventName, processDocumentEvent, true)
        );
        roots.add(eventNameOrNode);
      }
    }
  }
};
if (!("__q_context__" in doc)) {
  doc.__q_context__ = 0;
  const qwikevents = win.qwikevents;
  if (qwikevents) {
    if (Array.isArray(qwikevents)) {
      processEventOrNode(...qwikevents);
    } else {
      processEventOrNode("click", "input");
    }
  }
  win.qwikevents = {
    events,
    roots,
    push: processEventOrNode
  };
  addEventListener(doc, "readystatechange", processReadyStateChange);
  processReadyStateChange();
}`;function Ge(e={}){return e.debug?ze:Ke}function T(){if(typeof performance>"u")return()=>0;const e=performance.now();return()=>(performance.now()-e)/1e6}function Xe(e){let t=e.base;return typeof e.base=="function"&&(t=e.base(e)),typeof t=="string"?(t.endsWith("/")||(t+="/"),t):"/build/"}var Ze="<!DOCTYPE html>";async function Ye(e,t){let n=t.stream,r=0,o=0,s=0,i=0,a="",l;const c=t.streaming?.inOrder??{strategy:"auto",maximunInitialChunk:5e4,maximunChunk:3e4},d=t.containerTagName??"html",b=t.containerAttributes??{},D=n,w=T(),y=Xe(t),m=ne(t.manifest),h=t.serverData?.nonce;function $(){a&&(D.write(a),a="",r=0,s++,s===1&&(i=w()))}function k(u){const p=u.length;r+=p,o+=p,a+=u}switch(c.strategy){case"disabled":n={write:k};break;case"direct":n=D;break;case"auto":let u=0,p=!1;const F=c.maximunChunk??0,B=c.maximunInitialChunk??0;n={write(_){_==="<!--qkssr-f-->"?p||(p=!0):_==="<!--qkssr-pu-->"?u++:_==="<!--qkssr-po-->"?u--:k(_),u===0&&(p||r>=(s===0?B:F))&&(p=!1,$())}};break}d==="html"?n.write(Ze):n.write("<!--cq-->"),m||console.warn("Missing client manifest, loading symbols in the client might 404. Please ensure the client build has run and generated the manifest for the server build."),await Ee(t,m);const v=m?.manifest.injections,P=v?v.map(u=>f(u.tag,u.attributes??{})):[];let j=t.qwikLoader?typeof t.qwikLoader=="object"?t.qwikLoader.include==="never"?2:0:t.qwikLoader==="inline"?1:t.qwikLoader==="never"?2:0:0;const I=m?.manifest.qwikLoader;if(j===0&&!I&&(j=1),j===0)P.unshift(f("link",{rel:"modulepreload",href:`${y}${I}`,nonce:h}),f("script",{type:"module",async:!0,src:`${y}${I}`,nonce:h}));else if(j===1){const u=Ge({debug:t.debug});P.unshift(f("script",{id:"qwikloader",type:"module",async:!0,nonce:h,dangerouslySetInnerHTML:u}))}Me(y,m,t.preloader,P,h);const re=T(),se=[];let W=0,M=0;await ae(e,{stream:n,containerTagName:d,containerAttributes:b,serverData:t.serverData,base:y,beforeContent:P,beforeClose:async(u,p,F,B)=>{W=re();const _=T();l=await le(u,p,void 0,B);const g=[];He(y,l,t,m,g);const ie=JSON.stringify(l.state,void 0,void 0);if(g.push(f("script",{type:"qwik/json",dangerouslySetInnerHTML:tt(ie),nonce:h})),l.funcs.length>0){const E=b[Se];g.push(f("script",{"q:func":"qwik/json",dangerouslySetInnerHTML:st(E,l.funcs),nonce:h}))}const H=Array.from(p.$events$,E=>JSON.stringify(E));if(H.length>0){const E=`(window.qwikevents||(window.qwikevents=[])).push(${H.join(",")})`;g.push(f("script",{dangerouslySetInnerHTML:E,nonce:h}))}return nt(se,u),M=_(),f(z,{children:g})},manifestHash:m?.manifest.manifestHash||"dev"+et()}),d!=="html"&&n.write("<!--/cq-->"),$();const oe=l.resources.some(u=>u._cache!==1/0);return{prefetchResources:void 0,snapshotResult:l,flushes:s,manifest:m?.manifest,size:o,isStatic:!oe,timing:{render:W,snapshot:M,firstFlush:i}}}function et(){return Math.random().toString(36).slice(2)}function ne(e){const t=e?{...J,...e}:J;if(!t||"mapper"in t)return t;if(t.mapping){const n={};return Object.entries(t.mapping).forEach(([r,o])=>{n[A(r)]=[r,o]}),{mapper:n,manifest:t,injections:t.injections||[]}}}var tt=e=>e.replace(/<(\/?script)/gi,"\\x3C$1");function nt(e,t){for(const n of t){const r=n.$componentQrl$?.getSymbol();r&&!e.includes(r)&&e.push(r)}}var rt='document["qFuncs_HASH"]=';function st(e,t){return rt.replace("HASH",e)+`[${t.join(`,
`)}]`}async function ct(e){const t=G({},ne(e));K(t)}const ot=()=>x(me,{children:[q("head",null,null,[q("meta",null,{charset:"utf-8"},null,3,null),q("meta",null,{name:"viewport",content:"width=device-width, initial-scale=1.0"},null,3,null),q("title",null,null,"UniTeia v2",3,null),q("link",null,{rel:"preconnect",href:"https://fonts.googleapis.com"},null,3,null),q("link",null,{rel:"preconnect",href:"https://fonts.gstatic.com",crossorigin:"anonymous"},null,3,null)],3,null),q("body",null,{lang:"en"},x(de,null,3,"Ou_0"),1,null)]},1,"Ou_1"),it=ue(fe(ot,"s_jeDrgOoTEGM"));function ut(e){return Ye(x(it,null,3,"Er_0"),{...e,qwikMapper:pe({url:e.url??"http://localhost:3000/",...e.qwikMapperProps})})}export{J as m,ut as r,ct as s};
