import{B as Y,C as f,E as fe,F as de,G as U,H as me,S as he,D as K,c as Z,i as X,I as pe,h as P,b as v,J,R as be,Q as ve}from"./q-KxNN2JpW.js";const V={manifestHash:"kxxqih",core:"q-DaSwm3_Y.js",preloader:"q-BD-hIznX.js",qwikLoader:"q-naDMFAHy.js",bundleGraphAsset:"assets/GkEw1xFg-bundle-graph.json",injections:[{tag:"link",location:"head",attributes:{rel:"stylesheet",href:"/assets/BZhrOi44-style.css"}}],mapping:{s_YByGWHHLVPs:"q-B2etuhcj.js",s_llnQlwdX8jU:"q-Dz4tiK4B.js",s_ISp4guh0neE:"q-CUHzhSiD.js",s_h9T0gAewTXI:"q-BsV0ziLB.js",s_qRQxW9tw7Ho:"q-Dp_Yf8q_.js",s_4kdgMIDr8zI:"q-0oNmDCV7.js",s_FV99QrlQA4U:"q-CbSfRsv3.js",s_et5zHgnQjwQ:"q-D_F0EgxW.js",s_rsWWvIAzdZo:"q-C_UKTPws.js",s_vxAA92AhMlc:"q-DyNTuLoC.js",s_2cavOiSEMms:"q-DI06hC3I.js",s_2dI9iQpVSjA:"q-_ymQeI-k.js",s_3yS1bGTvor0:"q-Dz4tiK4B.js",s_8FCsNe5x1jU:"q-DSaNGJhG.js",s_A7KIDaLSTJA:"q-NgWyAyw8.js",s_AklZPM550xo:"q-uUv6Pstm.js",s_EXkKzyfS3Jk:"q-DZ4qtUMs.js",s_IejYp2MD03Y:"q-BsV0ziLB.js",s_JTKB0qYpmCg:"q-KbAa_fvn.js",s_KQ9gfpR6bqk:"q-DvalH55-.js",s_KnNPA87CAYY:"q-BLWWWA0h.js",s_LrlOjUj1bIs:"q-BsILKGz1.js",s_M2URIJmkRto:"q-4Vj491pA.js",s_Q0OFQm9wvzI:"q-DU6I12qy.js",s_SJ1dbc0zl9E:"q-PejmNH9E.js",s_ZWviYXGAIAI:"q-Do13KiJZ.js",s_dIePrpSunh8:"q-D0i_Xpsr.js",s_eYKJKZkUfVw:"q-DgPk7FC4.js",s_f1MYmRJyHhk:"q-DLbqMpcM.js",s_iWoP7R6KJDo:"q-Cxz5i95W.js",s_iaZdhcsFI8A:"q-DI1kKJwL.js",s_jeDrgOoTEGM:"q-BVl_U4dA.js",s_oKAR0wLjPAg:"q-61bovRvN.js",s_pd3oE6BsFD4:"q-4WcrU-N7.js",s_pyS9A9fhlQg:"q-Bbh3PHvx.js",s_q2GpPAk1CZo:"q-B2etuhcj.js",s_s0pW5QuB5EQ:"q-Dp_Yf8q_.js",s_taKKq5ashNI:"q-egr_hKlZ.js",s_uG4SqfxOayU:"q-0NPPDAs-.js",s_voVe8lwVXks:"q-CDbDfjNv.js",s_w9Qhd0yN6HQ:"q-BL-axoac.js",s_A86VnE0LzSo:"q-BsV0ziLB.js",s_PwiuVu3QFoA:"q-e2DjShc5.js",s_VXOgUQQ4b5w:"q-D91Ynm8g.js",s_XQBUSfhWvPw:"q-CA-bifHG.js",s_zrQRMsdTV3k:"q-ChXxhMIA.js",s_6wqeMsseDVA:"q-BsV0ziLB.js",s_7mSttZ6QGoo:"q-Dz4tiK4B.js",s_BMv64B57vlY:"q-BL-axoac.js",s_K4937JWDftg:"q-CDbDfjNv.js",s_MvVoAWT0vlE:"q-Do13KiJZ.js",s_PuNrOD4muH0:"q-KbAa_fvn.js",s_Sw31kwBkwT8:"q-CDbDfjNv.js",s_TZCVjT7SIAQ:"q-Dz4tiK4B.js",s_X0kv0RnhaSA:"q-Dp_Yf8q_.js",s_c8yAo756LJ0:"q-Dz4tiK4B.js",s_gauDAg7bsGs:"q-Do13KiJZ.js",s_pgddy5y5cuk:"q-BsV0ziLB.js",s_tjWdhfYC0ks:"q-CDbDfjNv.js",s_uFGs40dtygQ:"q-B2etuhcj.js"}};/**
 * @license
 * @builder.io/qwik/server 1.19.2
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/QwikDev/qwik/blob/main/LICENSE
 */var ye=!1,_e="",ge=(e,...t)=>{const n=we(ye,e,...t);debugger;return n},qe=e=>e,we=(e,t,...n)=>{const r=t instanceof Error?t:new Error(t);return console.error("%cQWIK ERROR",_e,r.message,...qe(n),r.stack),r},$e=(e,...t)=>`Code(${e}) https://github.com/QwikDev/qwik/blob/main/packages/qwik/src/core/error/error.ts#L${8+e}`,Se=11,Pe=(e,...t)=>{const n=$e(e,...t);return ge(n,...t)},Ee="<sync>";function ee(e,t){const n=t?.mapper,r=e.symbolMapper?e.symbolMapper:(s,i,a)=>{if(n){const l=D(s),c=n[l];if(!c){if(l===Ee)return[l,""];if(globalThis.__qwik_reg_symbols?.has(l))return[s,"_"];if(a)return[s,`${a}?qrl=${s}`];console.error("Cannot resolve symbol",s,"in",n,a)}return c}};return{isServer:!0,async importSymbol(s,i,a){const l=D(a),c=globalThis.__qwik_reg_symbols?.get(l);if(c)return c;throw Pe(Se,a)},raf:()=>(console.error("server can not rerender"),Promise.resolve()),nextTick:s=>new Promise(i=>{setTimeout(()=>{i(s())})}),chunkForSymbol(s,i,a){return r(s,n,a)}}}async function je(e,t){const n=ee(e,t);Y(n)}var D=e=>{const t=e.lastIndexOf("_");return t>-1?e.slice(t+1):e},ke="q:instance",C={$DEBUG$:!1,$invPreloadProbability$:.65},Ae=Date.now(),De=/\.[mc]?js$/,te=0,Ne=1,xe=2,Le=3,T,O,Ie=(e,t)=>({$name$:e,$state$:De.test(e)?te:Le,$deps$:re?t?.map(n=>({...n,$factor$:1})):t,$inverseProbability$:1,$createdTs$:Date.now(),$waitedMs$:0,$loadedMs$:0}),Be=e=>{const t=new Map;let n=0;for(;n<e.length;){const r=e[n++],o=[];let s,i=1;for(;s=e[n],typeof s=="number";)s<0?i=-s/10:o.push({$name$:e[s],$importProbability$:i,$factor$:1}),n++;t.set(r,o)}return t},ne=e=>{let t=R.get(e);if(!t){let n;if(O){if(n=O.get(e),!n)return;n.length||(n=void 0)}t=Ie(e,n),R.set(e,t)}return t},Ce=(e,t)=>{t&&("debug"in t&&(C.$DEBUG$=!!t.debug),typeof t.preloadProbability=="number"&&(C.$invPreloadProbability$=1-t.preloadProbability)),!(T!=null||!e)&&(T="",O=Be(e))},R=new Map,re,N,se=0,E=[],Te=(...e)=>{console.log(`Preloader ${Date.now()-Ae}ms ${se}/${E.length} queued>`,...e)},Oe=()=>{R.clear(),N=!1,re=!0,se=0,E.length=0},Re=()=>{N&&(E.sort((e,t)=>e.$inverseProbability$-t.$inverseProbability$),N=!1)},Qe=()=>{Re();let e=.4;const t=[];for(const n of E){const r=Math.round((1-n.$inverseProbability$)*10);r!==e&&(e=r,t.push(e)),t.push(n.$name$)}return t},oe=(e,t,n)=>{if(n?.has(e))return;const r=e.$inverseProbability$;if(e.$inverseProbability$=t,!(r-e.$inverseProbability$<.01)&&(T!=null&&e.$state$<xe&&(e.$state$===te&&(e.$state$=Ne,E.push(e),C.$DEBUG$&&Te(`queued ${Math.round((1-e.$inverseProbability$)*100)}%`,e.$name$)),N=!0),e.$deps$)){n||(n=new Set),n.add(e);const o=1-e.$inverseProbability$;for(const s of e.$deps$){const i=ne(s.$name$);if(i.$inverseProbability$===0)continue;let a;if(o===1||o>=.99&&Q<100)Q++,a=Math.min(.01,1-s.$importProbability$);else{const l=1-s.$importProbability$*o,c=s.$factor$,d=l/c;a=Math.max(.02,i.$inverseProbability$*d),s.$factor$=d}oe(i,a,n)}}},W=(e,t)=>{const n=ne(e);n&&n.$inverseProbability$>t&&oe(n,t)},Q,Me=(e,t)=>{if(!e?.length)return;Q=0;let n=t?1-t:.4;if(Array.isArray(e))for(let r=e.length-1;r>=0;r--){const o=e[r];typeof o=="number"?n=1-o/10:W(o,n)}else W(e,n)};function Ue(e){const t=[],n=r=>{if(r)for(const o of r)t.includes(o.url)||(t.push(o.url),o.imports&&n(o.imports))};return n(e),t}var Fe=e=>{const t=me(),n=e?.qrls?.map(r=>{const o=r.$refSymbol$||r.$symbol$,s=r.$chunk$,i=t.chunkForSymbol(o,s,r.dev?.file);return i?i[1]:s}).filter(Boolean);return[...new Set(n)]};function He(e,t,n){const r=t.prefetchStrategy;if(r===null)return[];if(!n?.manifest.bundleGraph)return Fe(e);if(typeof r?.symbolsToPrefetch=="function")try{const s=r.symbolsToPrefetch({manifest:n.manifest});return Ue(s)}catch(s){console.error("getPrefetchUrls, symbolsToPrefetch()",s)}const o=new Set;for(const s of e?.qrls||[]){const i=D(s.$refSymbol$||s.$symbol$);i&&i.length>=10&&o.add(i)}return[...o]}var ze=(e,t)=>{if(!t?.manifest.bundleGraph)return[...new Set(e)];Oe();let n=.99;for(const r of e.slice(0,15))Me(r,n),n*=.85;return Qe()},M=(e,t)=>{if(t==null)return null;const n=`${e}${t}`.split("/"),r=[];for(const o of n)o===".."&&r.length>0?r.pop():r.push(o);return r.join("/")},Ge=(e,t,n,r,o)=>{const s=M(e,t?.manifest?.preloader),i="/"+t?.manifest.bundleGraphAsset;if(s&&i&&n!==!1){const l=typeof n=="object"?{debug:n.debug,preloadProbability:n.ssrPreloadProbability}:void 0;Ce(t?.manifest.bundleGraph,l);const c=[];n?.debug&&c.push("d:1"),n?.maxIdlePreloads&&c.push(`P:${n.maxIdlePreloads}`),n?.preloadProbability&&c.push(`Q:${n.preloadProbability}`);const d=c.length?`,{${c.join(",")}}`:"",y=`let b=fetch("${i}");import("${s}").then(({l})=>l(${JSON.stringify(e)},b${d}));`;r.push(f("link",{rel:"modulepreload",href:s,nonce:o,crossorigin:"anonymous"}),f("link",{rel:"preload",href:i,as:"fetch",crossorigin:"anonymous",nonce:o}),f("script",{type:"module",async:!0,dangerouslySetInnerHTML:y,nonce:o}))}const a=M(e,t?.manifest.core);a&&r.push(f("link",{rel:"modulepreload",href:a,nonce:o}))},Ke=(e,t,n,r,o)=>{if(r.length===0||n===!1)return null;const{ssrPreloads:s,ssrPreloadProbability:i}=Ve(typeof n=="boolean"?void 0:n);let a=s;const l=[],c=[],d=t?.manifest.manifestHash;if(a){const _=t?.manifest.preloader,m=t?.manifest.core,p=ze(r,t);let $=4;const j=i*10;for(const b of p)if(typeof b=="string"){if($<j)break;if(b===_||b===m)continue;if(c.push(b),--a===0)break}else $=b}const y=M(e,d&&t?.manifest.preloader);let w=c.length?`${JSON.stringify(c)}.map((l,e)=>{e=document.createElement('link');e.rel='modulepreload';e.href=${JSON.stringify(e)}+l;document.head.appendChild(e)});`:"";return y&&(w+=`window.addEventListener('load',f=>{f=_=>import("${y}").then(({p})=>p(${JSON.stringify(r)}));try{requestIdleCallback(f,{timeout:2000})}catch(e){setTimeout(f,200)}})`),w&&l.push(f("script",{type:"module","q:type":"preload",async:!0,dangerouslySetInnerHTML:w,nonce:o})),l.length>0?f(U,{children:l}):null},Je=(e,t,n,r,o)=>{if(n.preloader!==!1){const s=He(t,n,r);if(s.length>0){const i=Ke(e,r,n.preloader,s,n.serverData?.nonce);i&&o.push(i)}}};function Ve(e){return{...We,...e}}var We={ssrPreloads:7,ssrPreloadProbability:.5,debug:!1,maxIdlePreloads:25,preloadProbability:.35},Ye='const t=document,e=window,n=new Set,o=new Set([t]);let r;const s=(t,e)=>Array.from(t.querySelectorAll(e)),a=t=>{const e=[];return o.forEach(n=>e.push(...s(n,t))),e},i=t=>{w(t),s(t,"[q\\\\:shadowroot]").forEach(t=>{const e=t.shadowRoot;e&&i(e)})},c=t=>t&&"function"==typeof t.then,l=(t,e,n=e.type)=>{a("[on"+t+"\\\\:"+n+"]").forEach(o=>{b(o,t,e,n)})},f=e=>{if(void 0===e._qwikjson_){let n=(e===t.documentElement?t.body:e).lastElementChild;for(;n;){if("SCRIPT"===n.tagName&&"qwik/json"===n.getAttribute("type")){e._qwikjson_=JSON.parse(n.textContent.replace(/\\\\x3C(\\/?script)/gi,"<$1"));break}n=n.previousElementSibling}}},p=(t,e)=>new CustomEvent(t,{detail:e}),b=async(e,n,o,r=o.type)=>{const s="on"+n+":"+r;e.hasAttribute("preventdefault:"+r)&&o.preventDefault(),e.hasAttribute("stoppropagation:"+r)&&o.stopPropagation();const a=e._qc_,i=a&&a.li.filter(t=>t[0]===s);if(i&&i.length>0){for(const t of i){const n=t[1].getFn([e,o],()=>e.isConnected)(o,e),r=o.cancelBubble;c(n)&&await n,r&&o.stopPropagation()}return}const l=e.getAttribute(s);if(l){const n=e.closest("[q\\\\:container]"),r=n.getAttribute("q:base"),s=n.getAttribute("q:version")||"unknown",a=n.getAttribute("q:manifest-hash")||"dev",i=new URL(r,t.baseURI);for(const p of l.split("\\n")){const l=new URL(p,i),b=l.href,h=l.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",q=performance.now();let _,d,y;const w=p.startsWith("#"),g={qBase:r,qManifest:a,qVersion:s,href:b,symbol:h,element:e,reqTime:q};if(w){const e=n.getAttribute("q:instance");_=(t["qFuncs_"+e]||[])[Number.parseInt(h)],_||(d="sync",y=Error("sym:"+h))}else{u("qsymbol",g);const t=l.href.split("#")[0];try{const e=import(t);f(n),_=(await e)[h],_||(d="no-symbol",y=Error(`${h} not in ${t}`))}catch(t){d||(d="async"),y=t}}if(!_){u("qerror",{importError:d,error:y,...g}),console.error(y);break}const m=t.__q_context__;if(e.isConnected)try{t.__q_context__=[e,o,l];const n=_(o,e);c(n)&&await n}catch(t){u("qerror",{error:t,...g})}finally{t.__q_context__=m}}}},u=(e,n)=>{t.dispatchEvent(p(e,n))},h=t=>t.replace(/([A-Z])/g,t=>"-"+t.toLowerCase()),q=async t=>{let e=h(t.type),n=t.target;for(l("-document",t,e);n&&n.getAttribute;){const o=b(n,"",t,e);let r=t.cancelBubble;c(o)&&await o,r||(r=r||t.cancelBubble||n.hasAttribute("stoppropagation:"+t.type)),n=t.bubbles&&!0!==r?n.parentElement:null}},_=t=>{l("-window",t,h(t.type))},d=()=>{const s=t.readyState;if(!r&&("interactive"==s||"complete"==s)&&(o.forEach(i),r=1,u("qinit"),(e.requestIdleCallback??e.setTimeout).bind(e)(()=>u("qidle")),n.has("qvisible"))){const t=a("[on\\\\:qvisible]"),e=new IntersectionObserver(t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),b(n.target,"",p("qvisible",n)))});t.forEach(t=>e.observe(t))}},y=(t,e,n,o=!1)=>{t.addEventListener(e,n,{capture:o,passive:!1})},w=(...t)=>{for(const r of t)"string"==typeof r?n.has(r)||(o.forEach(t=>y(t,r,q,!0)),y(e,r,_,!0),n.add(r)):o.has(r)||(n.forEach(t=>y(r,t,q,!0)),o.add(r))};if(!("__q_context__"in t)){t.__q_context__=0;const r=e.qwikevents;r&&(Array.isArray(r)?w(...r):w("click","input")),e.qwikevents={events:n,roots:o,push:w},y(t,"readystatechange",d),d()}',Ze=`const doc = document;
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
}`;function Xe(e={}){return e.debug?Ze:Ye}function B(){if(typeof performance>"u")return()=>0;const e=performance.now();return()=>(performance.now()-e)/1e6}function et(e){let t=e.base;return typeof e.base=="function"&&(t=e.base(e)),typeof t=="string"?(t.endsWith("/")||(t+="/"),t):"/build/"}var tt="<!DOCTYPE html>";async function nt(e,t){let n=t.stream,r=0,o=0,s=0,i=0,a="",l;const c=t.streaming?.inOrder??{strategy:"auto",maximunInitialChunk:5e4,maximunChunk:3e4},d=t.containerTagName??"html",y=t.containerAttributes??{},x=n,w=B(),_=et(t),m=ie(t.manifest),p=t.serverData?.nonce;function $(){a&&(x.write(a),a="",r=0,s++,s===1&&(i=w()))}function j(u){const h=u.length;r+=h,o+=h,a+=u}switch(c.strategy){case"disabled":n={write:j};break;case"direct":n=x;break;case"auto":let u=0,h=!1;const z=c.maximunChunk??0,I=c.maximunInitialChunk??0;n={write(g){g==="<!--qkssr-f-->"?h||(h=!0):g==="<!--qkssr-pu-->"?u++:g==="<!--qkssr-po-->"?u--:j(g),u===0&&(h||r>=(s===0?I:z))&&(h=!1,$())}};break}d==="html"?n.write(tt):n.write("<!--cq-->"),m||console.warn("Missing client manifest, loading symbols in the client might 404. Please ensure the client build has run and generated the manifest for the server build."),await je(t,m);const b=m?.manifest.injections,k=b?b.map(u=>f(u.tag,u.attributes??{})):[];let A=t.qwikLoader?typeof t.qwikLoader=="object"?t.qwikLoader.include==="never"?2:0:t.qwikLoader==="inline"?1:t.qwikLoader==="never"?2:0:0;const L=m?.manifest.qwikLoader;if(A===0&&!L&&(A=1),A===0)k.unshift(f("link",{rel:"modulepreload",href:`${_}${L}`,nonce:p}),f("script",{type:"module",async:!0,src:`${_}${L}`,nonce:p}));else if(A===1){const u=Xe({debug:t.debug});k.unshift(f("script",{id:"qwikloader",type:"module",async:!0,nonce:p,dangerouslySetInnerHTML:u}))}Ge(_,m,t.preloader,k,p);const ae=B(),le=[];let F=0,H=0;await fe(e,{stream:n,containerTagName:d,containerAttributes:y,serverData:t.serverData,base:_,beforeContent:k,beforeClose:async(u,h,z,I)=>{F=ae();const g=B();l=await de(u,h,void 0,I);const q=[];Je(_,l,t,m,q);const ue=JSON.stringify(l.state,void 0,void 0);if(q.push(f("script",{type:"qwik/json",dangerouslySetInnerHTML:st(ue),nonce:p})),l.funcs.length>0){const S=y[ke];q.push(f("script",{"q:func":"qwik/json",dangerouslySetInnerHTML:at(S,l.funcs),nonce:p}))}const G=Array.from(h.$events$,S=>JSON.stringify(S));if(G.length>0){const S=`(window.qwikevents||(window.qwikevents=[])).push(${G.join(",")})`;q.push(f("script",{dangerouslySetInnerHTML:S,nonce:p}))}return ot(le,u),H=g(),f(U,{children:q})},manifestHash:m?.manifest.manifestHash||"dev"+rt()}),d!=="html"&&n.write("<!--/cq-->"),$();const ce=l.resources.some(u=>u._cache!==1/0);return{prefetchResources:void 0,snapshotResult:l,flushes:s,manifest:m?.manifest,size:o,isStatic:!ce,timing:{render:F,snapshot:H,firstFlush:i}}}function rt(){return Math.random().toString(36).slice(2)}function ie(e){const t=e?{...V,...e}:V;if(!t||"mapper"in t)return t;if(t.mapping){const n={};return Object.entries(t.mapping).forEach(([r,o])=>{n[D(r)]=[r,o]}),{mapper:n,manifest:t,injections:t.injections||[]}}}var st=e=>e.replace(/<(\/?script)/gi,"\\x3C$1");function ot(e,t){for(const n of t){const r=n.$componentQrl$?.getSymbol();r&&!e.includes(r)&&e.push(r)}}var it='document["qFuncs_HASH"]=';function at(e,t){return it.replace("HASH",e)+`[${t.join(`,
`)}]`}async function vt(e){const t=ee({},ie(e));Y(t)}const lt=new Set(he.map(e=>e.code));function ct(e){if(!e)return K;const n=e.replace(/^\/+/,"").split("/",1)[0];return n&&lt.has(n)?n:K}const ut=()=>{const e=pe();return P(U,{children:[v("title",null,null,e.title,1,null),e.meta.map(t=>J("meta",{...t},null,0,JSON.stringify(t))),e.links.map(t=>J("link",{...t},null,0,JSON.stringify(t)))]},1,"Lt_0")},ft=Z(X(ut,"s_f1MYmRJyHhk")),dt=`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{background:#0d1117;color:#f0e8d8;font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased}
body{min-height:100dvh;display:flex;flex-direction:column}
h1,h2,h3{font-weight:400;line-height:1.1}
h1{font-size:clamp(2.5rem,8vw,5rem)}
a{color:#00e0ff;text-decoration:none}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.sr-only:focus{position:static;width:auto;height:auto;clip:auto;white-space:normal}`,mt=()=>P(ve,{children:[v("head",null,null,[v("meta",null,{charSet:"utf-8"},null,3,null),v("meta",null,{name:"viewport",content:"width=device-width, initial-scale=1.0"},null,3,null),v("title",null,null,"UniTeia v2",3,null),v("style",null,{dangerouslySetInnerHTML:{__html:dt}},null,3,null),v("link",null,{rel:"preconnect",href:"https://cdn.jsdelivr.net",crossOrigin:"anonymous"},null,3,null),P(ft,null,3,"Ou_0")],1,null),v("body",null,null,P(be,null,3,"Ou_1"),1,null)]},1,"Ou_2"),ht=Z(X(mt,"s_jeDrgOoTEGM"));function yt(e){const t=typeof e.serverData?.qwikcity?.params?.lang=="string"?e.serverData.qwikcity.params.lang:void 0,n=ct(t?`/${t}`:void 0);return nt(P(ht,null,3,"Er_0"),{...e,containerAttributes:{...e.containerAttributes,lang:n}})}export{V as m,yt as r,vt as s};
