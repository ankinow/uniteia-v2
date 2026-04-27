import{h as n,K as i,C as s}from"./q-KxNN2JpW.js";const o={title:"Missing Schema Fields Fixture",meta:[],styles:[],links:[],scripts:[],frontmatter:{slug:"test-invalid-schema",lang:"en"}},l={slug:"test-invalid-schema",lang:"en",title:"Missing Schema Fields Fixture"};function a(e){const t={p:"p",...e.components};return s(t.p,{children:`This article intentionally omits required frontmatter fields such as subjects and referral_links.
Runtime schema validation IS enforced — validateContent() and validateMarkdownFrontmatter() will
reject this fixture. It exists solely to verify that the build-time content:check gate and unit
tests correctly detect invalid frontmatter schemas. The content:check script intentionally skips
this file (and other test fixtures) so the production gate passes while still allowing the fixture
to exist for testing purposes.`})}const c=(e={})=>{const t=n(i,{children:n(a,e,3,null)},3,"vnfIZMXG");return typeof MDXLayout=="function"?s(MDXLayout,{children:t}):t};export{c as default,l as frontmatter,o as head};
