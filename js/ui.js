export const $=s=>document.querySelector(s);
export const $$=s=>[...document.querySelectorAll(s)];
export function esc(x){return String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
export function toast(msg){const e=document.createElement("div");e.className="toast";e.textContent=msg;document.querySelector("#toast").append(e);setTimeout(()=>e.remove(),2600)}
export function num(v,d=0){const n=Number(v);return Number.isFinite(n)?n:d}
export function field(label,id,value="",type="number",step="any"){return `<div class="field"><label>${label}</label><input id="${id}" type="${type}" value="${value}" ${type==="number"?`step="${step}"`:""}></div>`}
export function page(title,sub,body){return `<div class="content"><div class="page-head"><div><h1>${title}</h1><div class="muted">${sub}</div></div></div>${body}</div>`}