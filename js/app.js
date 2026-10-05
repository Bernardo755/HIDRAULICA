import {loadState,saveState,resetProject,state} from "./state.js";
import {dashboard,units,fluids,pipes,calculators,network,pumps,tanks,drainage,hotwater,materials,reports,learn,bindModule} from "./modules.js";
import {advanced,bindAdvanced} from "./advanced.js";
import {toast,$,$$} from "./ui.js";

loadState();

const routes={dashboard,units,fluids,pipes,calculators,network,pumps,tanks,drainage,hotwater,materials,advanced,reports,learn};
let current="dashboard";

function showModuleError(name,error){
  console.error(`HidroPro / módulo ${name}:`,error);
  const main=$("#main");
  if(!main) return;
  const message=error?.message||String(error);
  const stack=error?.stack||message;
  main.innerHTML=`<div class="content"><div class="card">
    <h1>No se pudo cargar este módulo</h1>
    <p class="muted">${message}</p>
    <div class="actions">
      <button class="btn primary" id="retryModule">Reintentar</button>
      <button class="btn" id="goHome">Ir a Inicio</button>
    </div>
    <details style="margin-top:14px">
      <summary>Detalle técnico</summary>
      <pre style="white-space:pre-wrap;overflow:auto">${stack}</pre>
    </details>
  </div></div>`;
  $("#retryModule")?.addEventListener("click",()=>navigate(name));
  $("#goHome")?.addEventListener("click",()=>navigate("dashboard"));
}

function navigate(name){
  try{
    if(!routes[name]) throw new Error(`Módulo no encontrado: ${name}`);
    current=name;
    $$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.module===name));
    $("#main").innerHTML=routes[name]();
    bindModule(name);
    if(name==="advanced") bindAdvanced();
  }catch(error){
    showModuleError(name,error);
  }
}

$$(".nav").forEach(n=>n.onclick=()=>navigate(n.dataset.module));
window.addEventListener("navigate",e=>navigate(e.detail));

$("#btnNew").onclick=()=>{
  if(confirm("¿Crear un proyecto nuevo?")){
    resetProject();
    saveState();
    navigate("dashboard");
    toast("Proyecto nuevo creado");
  }
};

$("#btnSave").onclick=()=>{
  saveState();
  toast("Proyecto guardado en este dispositivo");
};

$("#btnExport").onclick=()=>{
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}));
  a.download="hidropro-proyecto.json";
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),0);
};

window.addEventListener("error",e=>console.error("HidroPro / error global:",e.error||e.message));
window.addEventListener("unhandledrejection",e=>console.error("HidroPro / promesa rechazada:",e.reason));

navigate(current);
