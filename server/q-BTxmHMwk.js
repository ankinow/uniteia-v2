import{x as W,y as f,z as le,A as ce,F as z,B as ue,S as fe,D as J,e as de,i as me,n as I,f as E,R as pe,Q as he}from"./q-B1nRKqRt.js";const V={manifestHash:"xrpvqz",core:"q-BhSjnTVr.js",preloader:"q-BD-hIznX.js",qwikLoader:"q-naDMFAHy.js",bundleGraphAsset:"assets/CO_t44R6-bundle-graph.json",injections:[{tag:"link",location:"head",attributes:{rel:"stylesheet",href:"/assets/7cdFUnHZ-style.css"}}],mapping:{s_YByGWHHLVPs:"q-BYa0FE38.js",s_llnQlwdX8jU:"q-BeH8gXuf.js",s_h9T0gAewTXI:"q-DnrLwl_A.js",s_qRQxW9tw7Ho:"q-3LQJ9BEs.js",s_4kdgMIDr8zI:"q-CWARqkHV.js",s_Hu1ellmVtpM:"q-CBlgycHx.js",s_et5zHgnQjwQ:"q-B5ExEHmJ.js",s_rsWWvIAzdZo:"q-D-CB7EwK.js",s_vxAA92AhMlc:"q-DQUQKWU_.js",s_2cavOiSEMms:"q-urIDCQKd.js",s_2dI9iQpVSjA:"q-Dl5BhA-6.js",s_3yS1bGTvor0:"q-BeH8gXuf.js",s_8FCsNe5x1jU:"q-DSaNGJhG.js",s_A7KIDaLSTJA:"q-CwL60y_q.js",s_AklZPM550xo:"q-fIvWXeno.js",s_EXkKzyfS3Jk:"q-DhGawcXG.js",s_IejYp2MD03Y:"q-DnrLwl_A.js",s_JTKB0qYpmCg:"q-HHSgvriV.js",s_KQ9gfpR6bqk:"q-TJzgBuD0.js",s_M2URIJmkRto:"q-Ce252UmH.js",s_Q0OFQm9wvzI:"q-DUZO5U2l.js",s_SJ1dbc0zl9E:"q-C9rTEfPd.js",s_ZWviYXGAIAI:"q-8FgZ0HKp.js",s_dIePrpSunh8:"q-ym5ZGdFu.js",s_eYKJKZkUfVw:"q-7bVYtU6-.js",s_iWoP7R6KJDo:"q-C7Z07Y7b.js",s_iaZdhcsFI8A:"q-B5VWNqKC.js",s_jeDrgOoTEGM:"q-BQiWsH-i.js",s_oKAR0wLjPAg:"q-zl0lOk-r.js",s_pd3oE6BsFD4:"q-FUIrP5Mg.js",s_pyS9A9fhlQg:"q-C9UuOETq.js",s_q2GpPAk1CZo:"q-BYa0FE38.js",s_s0pW5QuB5EQ:"q-3LQJ9BEs.js",s_taKKq5ashNI:"q-VDX94gzT.js",s_voVe8lwVXks:"q-Ba9s2Shf.js",s_w9Qhd0yN6HQ:"q-Cq7qGb7w.js",s_A86VnE0LzSo:"q-DnrLwl_A.js",s_PwiuVu3QFoA:"q-e2DjShc5.js",s_VXOgUQQ4b5w:"q-CtJj8XwD.js",s_XQBUSfhWvPw:"q-BbEULbSo.js",s_zrQRMsdTV3k:"q-DUGDoTly.js",s_6wqeMsseDVA:"q-DnrLwl_A.js",s_7mSttZ6QGoo:"q-BeH8gXuf.js",s_BMv64B57vlY:"q-Cq7qGb7w.js",s_K4937JWDftg:"q-Ba9s2Shf.js",s_MvVoAWT0vlE:"q-8FgZ0HKp.js",s_PuNrOD4muH0:"q-HHSgvriV.js",s_Sw31kwBkwT8:"q-Ba9s2Shf.js",s_TZCVjT7SIAQ:"q-BeH8gXuf.js",s_X0kv0RnhaSA:"q-3LQJ9BEs.js",s_c8yAo756LJ0:"q-BeH8gXuf.js",s_gauDAg7bsGs:"q-8FgZ0HKp.js",s_pgddy5y5cuk:"q-DnrLwl_A.js",s_tjWdhfYC0ks:"q-Ba9s2Shf.js",s_uFGs40dtygQ:"q-BYa0FE38.js"}};/**
 * @license
 * @builder.io/qwik/server 1.19.2
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/QwikDev/qwik/blob/main/LICENSE
 */var be=!1,ve="",ye=(e,...t)=>{const n=ge(be,e,...t);debugger;return n},qe=e=>e,ge=(e,t,...n)=>{const r=t instanceof Error?t:new Error(t);return console.error("%cQWIK ERROR",ve,r.message,...qe(n),r.stack),r},_e=(e,...t)=>`Code(${e}) https://github.com/QwikDev/qwik/blob/main/packages/qwik/src/core/error/error.ts#L${8+e}`,we=11,$e=(e,...t)=>{const n=_e(e,...t);return ye(n,...t)},Ee="<sync>";function X(e,t){const n=t?.mapper,r=e.symbolMapper?e.symbolMapper:(s,a,i)=>{if(n){const l=A(s),c=n[l];if(!c){if(l===Ee)return[l,""];if(globalThis.__qwik_reg_symbols?.has(l))return[s,"_"];if(i)return[s,`${i}?qrl=${s}`];console.error("Cannot resolve symbol",s,"in",n,i)}return c}};return{isServer:!0,async importSymbol(s,a,i){const l=A(i),c=globalThis.__qwik_reg_symbols?.get(l);if(c)return c;throw $e(we,i)},raf:()=>(console.error("server can not rerender"),Promise.resolve()),nextTick:s=>new Promise(a=>{setTimeout(()=>{a(s())})}),chunkForSymbol(s,a,i){return r(s,n,i)}}}async function Se(e,t){const n=X(e,t);W(n)}var A=e=>{const t=e.lastIndexOf("_");return t>-1?e.slice(t+1):e},Pe="q:instance",N={$DEBUG$:!1,$invPreloadProbability$:.65},je=Date.now(),ke=/\.[mc]?js$/,Y=0,Ae=1,De=2,Be=3,x,O,Ce=(e,t)=>({$name$:e,$state$:ke.test(e)?Y:Be,$deps$:ee?t?.map(n=>({...n,$factor$:1})):t,$inverseProbability$:1,$createdTs$:Date.now(),$waitedMs$:0,$loadedMs$:0}),Le=e=>{const t=new Map;let n=0;for(;n<e.length;){const r=e[n++],o=[];let s,a=1;for(;s=e[n],typeof s=="number";)s<0?a=-s/10:o.push({$name$:e[s],$importProbability$:a,$factor$:1}),n++;t.set(r,o)}return t},Z=e=>{let t=R.get(e);if(!t){let n;if(O){if(n=O.get(e),!n)return;n.length||(n=void 0)}t=Ce(e,n),R.set(e,t)}return t},Te=(e,t)=>{t&&("debug"in t&&(N.$DEBUG$=!!t.debug),typeof t.preloadProbability=="number"&&(N.$invPreloadProbability$=1-t.preloadProbability)),!(x!=null||!e)&&(x="",O=Le(e))},R=new Map,ee,D,te=0,S=[],Ie=(...e)=>{console.log(`Preloader ${Date.now()-je}ms ${te}/${S.length} queued>`,...e)},Ne=()=>{R.clear(),D=!1,ee=!0,te=0,S.length=0},xe=()=>{D&&(S.sort((e,t)=>e.$inverseProbability$-t.$inverseProbability$),D=!1)},Oe=()=>{xe();let e=.4;const t=[];for(const n of S){const r=Math.round((1-n.$inverseProbability$)*10);r!==e&&(e=r,t.push(e)),t.push(n.$name$)}return t},ne=(e,t,n)=>{if(n?.has(e))return;const r=e.$inverseProbability$;if(e.$inverseProbability$=t,!(r-e.$inverseProbability$<.01)&&(x!=null&&e.$state$<De&&(e.$state$===Y&&(e.$state$=Ae,S.push(e),N.$DEBUG$&&Ie(`queued ${Math.round((1-e.$inverseProbability$)*100)}%`,e.$name$)),D=!0),e.$deps$)){n||(n=new Set),n.add(e);const o=1-e.$inverseProbability$;for(const s of e.$deps$){const a=Z(s.$name$);if(a.$inverseProbability$===0)continue;let i;if(o===1||o>=.99&&Q<100)Q++,i=Math.min(.01,1-s.$importProbability$);else{const l=1-s.$importProbability$*o,c=s.$factor$,d=l/c;i=Math.max(.02,a.$inverseProbability$*d),s.$factor$=d}ne(a,i,n)}}},K=(e,t)=>{const n=Z(e);n&&n.$inverseProbability$>t&&ne(n,t)},Q,Re=(e,t)=>{if(!e?.length)return;Q=0;let n=t?1-t:.4;if(Array.isArray(e))for(let r=e.length-1;r>=0;r--){const o=e[r];typeof o=="number"?n=1-o/10:K(o,n)}else K(e,n)};function Qe(e){const t=[],n=r=>{if(r)for(const o of r)t.includes(o.url)||(t.push(o.url),o.imports&&n(o.imports))};return n(e),t}var Fe=e=>{const t=ue(),n=e?.qrls?.map(r=>{const o=r.$refSymbol$||r.$symbol$,s=r.$chunk$,a=t.chunkForSymbol(o,s,r.dev?.file);return a?a[1]:s}).filter(Boolean);return[...new Set(n)]};function He(e,t,n){const r=t.prefetchStrategy;if(r===null)return[];if(!n?.manifest.bundleGraph)return Fe(e);if(typeof r?.symbolsToPrefetch=="function")try{const s=r.symbolsToPrefetch({manifest:n.manifest});return Qe(s)}catch(s){console.error("getPrefetchUrls, symbolsToPrefetch()",s)}const o=new Set;for(const s of e?.qrls||[]){const a=A(s.$refSymbol$||s.$symbol$);a&&a.length>=10&&o.add(a)}return[...o]}var Ue=(e,t)=>{if(!t?.manifest.bundleGraph)return[...new Set(e)];Ne();let n=.99;for(const r of e.slice(0,15))Re(r,n),n*=.85;return Oe()},F=(e,t)=>{if(t==null)return null;const n=`${e}${t}`.split("/"),r=[];for(const o of n)o===".."&&r.length>0?r.pop():r.push(o);return r.join("/")},Ge=(e,t,n,r,o)=>{const s=F(e,t?.manifest?.preloader),a="/"+t?.manifest.bundleGraphAsset;if(s&&a&&n!==!1){const l=typeof n=="object"?{debug:n.debug,preloadProbability:n.ssrPreloadProbability}:void 0;Te(t?.manifest.bundleGraph,l);const c=[];n?.debug&&c.push("d:1"),n?.maxIdlePreloads&&c.push(`P:${n.maxIdlePreloads}`),n?.preloadProbability&&c.push(`Q:${n.preloadProbability}`);const d=c.length?`,{${c.join(",")}}`:"",v=`let b=fetch("${a}");import("${s}").then(({l})=>l(${JSON.stringify(e)},b${d}));`;r.push(f("link",{rel:"modulepreload",href:s,nonce:o,crossorigin:"anonymous"}),f("link",{rel:"preload",href:a,as:"fetch",crossorigin:"anonymous",nonce:o}),f("script",{type:"module",async:!0,dangerouslySetInnerHTML:v,nonce:o}))}const i=F(e,t?.manifest.core);i&&r.push(f("link",{rel:"modulepreload",href:i,nonce:o}))},Me=(e,t,n,r,o)=>{if(r.length===0||n===!1)return null;const{ssrPreloads:s,ssrPreloadProbability:a}=Ve(typeof n=="boolean"?void 0:n);let i=s;const l=[],c=[],d=t?.manifest.manifestHash;if(i){const y=t?.manifest.preloader,m=t?.manifest.core,h=Ue(r,t);let w=4;const P=a*10;for(const b of h)if(typeof b=="string"){if(w<P)break;if(b===y||b===m)continue;if(c.push(b),--i===0)break}else w=b}const v=F(e,d&&t?.manifest.preloader);let _=c.length?`${JSON.stringify(c)}.map((l,e)=>{e=document.createElement('link');e.rel='modulepreload';e.href=${JSON.stringify(e)}+l;document.head.appendChild(e)});`:"";return v&&(_+=`window.addEventListener('load',f=>{f=_=>import("${v}").then(({p})=>p(${JSON.stringify(r)}));try{requestIdleCallback(f,{timeout:2000})}catch(e){setTimeout(f,200)}})`),_&&l.push(f("script",{type:"module","q:type":"preload",async:!0,dangerouslySetInnerHTML:_,nonce:o})),l.length>0?f(z,{children:l}):null},Je=(e,t,n,r,o)=>{if(n.preloader!==!1){const s=He(t,n,r);if(s.length>0){const a=Me(e,r,n.preloader,s,n.serverData?.nonce);a&&o.push(a)}}};function Ve(e){return{...Ke,...e}}var Ke={ssrPreloads:7,ssrPreloadProbability:.5,debug:!1,maxIdlePreloads:25,preloadProbability:.35},We='const t=document,e=window,n=new Set,o=new Set([t]);let r;const s=(t,e)=>Array.from(t.querySelectorAll(e)),a=t=>{const e=[];return o.forEach(n=>e.push(...s(n,t))),e},i=t=>{w(t),s(t,"[q\\\\:shadowroot]").forEach(t=>{const e=t.shadowRoot;e&&i(e)})},c=t=>t&&"function"==typeof t.then,l=(t,e,n=e.type)=>{a("[on"+t+"\\\\:"+n+"]").forEach(o=>{b(o,t,e,n)})},f=e=>{if(void 0===e._qwikjson_){let n=(e===t.documentElement?t.body:e).lastElementChild;for(;n;){if("SCRIPT"===n.tagName&&"qwik/json"===n.getAttribute("type")){e._qwikjson_=JSON.parse(n.textContent.replace(/\\\\x3C(\\/?script)/gi,"<$1"));break}n=n.previousElementSibling}}},p=(t,e)=>new CustomEvent(t,{detail:e}),b=async(e,n,o,r=o.type)=>{const s="on"+n+":"+r;e.hasAttribute("preventdefault:"+r)&&o.preventDefault(),e.hasAttribute("stoppropagation:"+r)&&o.stopPropagation();const a=e._qc_,i=a&&a.li.filter(t=>t[0]===s);if(i&&i.length>0){for(const t of i){const n=t[1].getFn([e,o],()=>e.isConnected)(o,e),r=o.cancelBubble;c(n)&&await n,r&&o.stopPropagation()}return}const l=e.getAttribute(s);if(l){const n=e.closest("[q\\\\:container]"),r=n.getAttribute("q:base"),s=n.getAttribute("q:version")||"unknown",a=n.getAttribute("q:manifest-hash")||"dev",i=new URL(r,t.baseURI);for(const p of l.split("\\n")){const l=new URL(p,i),b=l.href,h=l.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",q=performance.now();let _,d,y;const w=p.startsWith("#"),g={qBase:r,qManifest:a,qVersion:s,href:b,symbol:h,element:e,reqTime:q};if(w){const e=n.getAttribute("q:instance");_=(t["qFuncs_"+e]||[])[Number.parseInt(h)],_||(d="sync",y=Error("sym:"+h))}else{u("qsymbol",g);const t=l.href.split("#")[0];try{const e=import(t);f(n),_=(await e)[h],_||(d="no-symbol",y=Error(`${h} not in ${t}`))}catch(t){d||(d="async"),y=t}}if(!_){u("qerror",{importError:d,error:y,...g}),console.error(y);break}const m=t.__q_context__;if(e.isConnected)try{t.__q_context__=[e,o,l];const n=_(o,e);c(n)&&await n}catch(t){u("qerror",{error:t,...g})}finally{t.__q_context__=m}}}},u=(e,n)=>{t.dispatchEvent(p(e,n))},h=t=>t.replace(/([A-Z])/g,t=>"-"+t.toLowerCase()),q=async t=>{let e=h(t.type),n=t.target;for(l("-document",t,e);n&&n.getAttribute;){const o=b(n,"",t,e);let r=t.cancelBubble;c(o)&&await o,r||(r=r||t.cancelBubble||n.hasAttribute("stoppropagation:"+t.type)),n=t.bubbles&&!0!==r?n.parentElement:null}},_=t=>{l("-window",t,h(t.type))},d=()=>{const s=t.readyState;if(!r&&("interactive"==s||"complete"==s)&&(o.forEach(i),r=1,u("qinit"),(e.requestIdleCallback??e.setTimeout).bind(e)(()=>u("qidle")),n.has("qvisible"))){const t=a("[on\\\\:qvisible]"),e=new IntersectionObserver(t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),b(n.target,"",p("qvisible",n)))});t.forEach(t=>e.observe(t))}},y=(t,e,n,o=!1)=>{t.addEventListener(e,n,{capture:o,passive:!1})},w=(...t)=>{for(const r of t)"string"==typeof r?n.has(r)||(o.forEach(t=>y(t,r,q,!0)),y(e,r,_,!0),n.add(r)):o.has(r)||(n.forEach(t=>y(r,t,q,!0)),o.add(r))};if(!("__q_context__"in t)){t.__q_context__=0;const r=e.qwikevents;r&&(Array.isArray(r)?w(...r):w("click","input")),e.qwikevents={events:n,roots:o,push:w},y(t,"readystatechange",d),d()}',ze=`const doc = document;
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
}`;function Xe(e={}){return e.debug?ze:We}function T(){if(typeof performance>"u")return()=>0;const e=performance.now();return()=>(performance.now()-e)/1e6}function Ye(e){let t=e.base;return typeof e.base=="function"&&(t=e.base(e)),typeof t=="string"?(t.endsWith("/")||(t+="/"),t):"/build/"}var Ze="<!DOCTYPE html>";async function et(e,t){let n=t.stream,r=0,o=0,s=0,a=0,i="",l;const c=t.streaming?.inOrder??{strategy:"auto",maximunInitialChunk:5e4,maximunChunk:3e4},d=t.containerTagName??"html",v=t.containerAttributes??{},B=n,_=T(),y=Ye(t),m=re(t.manifest),h=t.serverData?.nonce;function w(){i&&(B.write(i),i="",r=0,s++,s===1&&(a=_()))}function P(u){const p=u.length;r+=p,o+=p,i+=u}switch(c.strategy){case"disabled":n={write:P};break;case"direct":n=B;break;case"auto":let u=0,p=!1;const G=c.maximunChunk??0,L=c.maximunInitialChunk??0;n={write(q){q==="<!--qkssr-f-->"?p||(p=!0):q==="<!--qkssr-pu-->"?u++:q==="<!--qkssr-po-->"?u--:P(q),u===0&&(p||r>=(s===0?L:G))&&(p=!1,w())}};break}d==="html"?n.write(Ze):n.write("<!--cq-->"),m||console.warn("Missing client manifest, loading symbols in the client might 404. Please ensure the client build has run and generated the manifest for the server build."),await Se(t,m);const b=m?.manifest.injections,j=b?b.map(u=>f(u.tag,u.attributes??{})):[];let k=t.qwikLoader?typeof t.qwikLoader=="object"?t.qwikLoader.include==="never"?2:0:t.qwikLoader==="inline"?1:t.qwikLoader==="never"?2:0:0;const C=m?.manifest.qwikLoader;if(k===0&&!C&&(k=1),k===0)j.unshift(f("link",{rel:"modulepreload",href:`${y}${C}`,nonce:h}),f("script",{type:"module",async:!0,src:`${y}${C}`,nonce:h}));else if(k===1){const u=Xe({debug:t.debug});j.unshift(f("script",{id:"qwikloader",type:"module",async:!0,nonce:h,dangerouslySetInnerHTML:u}))}Ge(y,m,t.preloader,j,h);const se=T(),oe=[];let H=0,U=0;await le(e,{stream:n,containerTagName:d,containerAttributes:v,serverData:t.serverData,base:y,beforeContent:j,beforeClose:async(u,p,G,L)=>{H=se();const q=T();l=await ce(u,p,void 0,L);const g=[];Je(y,l,t,m,g);const ie=JSON.stringify(l.state,void 0,void 0);if(g.push(f("script",{type:"qwik/json",dangerouslySetInnerHTML:nt(ie),nonce:h})),l.funcs.length>0){const $=v[Pe];g.push(f("script",{"q:func":"qwik/json",dangerouslySetInnerHTML:ot($,l.funcs),nonce:h}))}const M=Array.from(p.$events$,$=>JSON.stringify($));if(M.length>0){const $=`(window.qwikevents||(window.qwikevents=[])).push(${M.join(",")})`;g.push(f("script",{dangerouslySetInnerHTML:$,nonce:h}))}return rt(oe,u),U=q(),f(z,{children:g})},manifestHash:m?.manifest.manifestHash||"dev"+tt()}),d!=="html"&&n.write("<!--/cq-->"),w();const ae=l.resources.some(u=>u._cache!==1/0);return{prefetchResources:void 0,snapshotResult:l,flushes:s,manifest:m?.manifest,size:o,isStatic:!ae,timing:{render:H,snapshot:U,firstFlush:a}}}function tt(){return Math.random().toString(36).slice(2)}function re(e){const t=e?{...V,...e}:V;if(!t||"mapper"in t)return t;if(t.mapping){const n={};return Object.entries(t.mapping).forEach(([r,o])=>{n[A(r)]=[r,o]}),{mapper:n,manifest:t,injections:t.injections||[]}}}var nt=e=>e.replace(/<(\/?script)/gi,"\\x3C$1");function rt(e,t){for(const n of t){const r=n.$componentQrl$?.getSymbol();r&&!e.includes(r)&&e.push(r)}}var st='document["qFuncs_HASH"]=';function ot(e,t){return st.replace("HASH",e)+`[${t.join(`,
`)}]`}async function dt(e){const t=X({},re(e));W(t)}const at=new Set(fe.map(e=>e.code));function it(e){if(!e)return J;const n=e.replace(/^\/+/,"").split("/",1)[0];return n&&at.has(n)?n:J}const lt=()=>I(he,{children:[E("head",null,null,[E("meta",null,{charset:"utf-8"},null,3,null),E("meta",null,{name:"viewport",content:"width=device-width, initial-scale=1.0"},null,3,null),E("title",null,null,"UniTeia v2",3,null)],3,null),E("body",null,null,I(pe,null,3,"Ou_0"),1,null)]},1,"Ou_1"),ct=de(me(lt,"s_jeDrgOoTEGM"));function mt(e){const t=typeof e.serverData?.qwikcity?.params?.lang=="string"?e.serverData.qwikcity.params.lang:void 0,n=it(t?`/${t}`:void 0);return et(I(ct,null,3,"Er_0"),{...e,containerAttributes:{...e.containerAttributes,lang:n}})}export{V as m,mt as r,dt as s};
