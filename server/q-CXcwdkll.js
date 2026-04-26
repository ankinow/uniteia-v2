import{h as s,K as i,C as e,G as a}from"./q-KxNN2JpW.js";const c=[{text:"Malicious Content",id:"malicious-content",level:1}],l={title:"Malicious Article",meta:[],styles:[],links:[],scripts:[],frontmatter:{slug:"test-xss",lang:"en",subjects:["security"],referral_links:[]}},d={title:"Malicious Article",slug:"test-xss",lang:"en",subjects:["security"],referral_links:[]};function r(n){const t={a:"a",h1:"h1",p:"p",span:"span",...n.components};return e(a,{children:[e(t.h1,{id:"malicious-content",children:[e(t.a,{"aria-hidden":"true",tabindex:"-1",href:"#malicious-content",children:e(t.span,{class:"icon icon-link"})}),"Malicious Content"]}),`
`,`
`,e(t.p,{children:`This is a test article designed to verify that the markdown renderer correctly sanitizes
malicious HTML tags and other potentially dangerous content. We need to ensure that the
rendered output does not execute any scripts and instead encodes the tags safely.
This paragraph exists to satisfy the minimum character count requirement of 100 characters
for the content field in our strict schema validation.`})]})}const u=(n={})=>{const t=s(i,{children:s(r,n,3,null)},3,"mxkjYhdk");return typeof MDXLayout=="function"?e(MDXLayout,{children:t}):t};export{u as default,d as frontmatter,l as head,c as headings};
