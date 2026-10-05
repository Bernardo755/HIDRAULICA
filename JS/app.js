import {loadState,saveState,resetProject,state} from "./state.js";
import {dashboard,units,fluids,pipes,calculators,network,pumps,tanks,drainage,hotwater,materials,reports,learn,bindModule} from "./modules.js";
import {advanced,bindAdvanced} from "./advanced.js";
import {toast,$,$$} from "./ui.js";
loadState();
const routes={dashboard,units,fluids,pipes,calculators,network,pumps,tanks,drainage,hotwater,materials,advanced,reports,learn};
let current="dashboard";
function navigate(name){current=name;$$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.module===name));document.querySelector("#main").innerHTML=routes[name]();bindModule(name);if(name==="advanced")bindAdvanced()}
$$(".nav").forEach(n=>n.onclick=()=>navigate(n.dataset.module));
window.addEventListener("navigate",e=>navigate(e.detail));
$("#btnNew").onclick=()=>{if(confirm("¿Crear un proyecto nuevo?")){resetProject();saveState();navigate("dashboard");toast("Proyecto nuevo creado")}};
$("#btnSave").onclick=()=>{saveState();toast("Proyecto guardado en este dispositivo")};
$("#btnExport").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}));a.download="hidropro-proyecto.json";a.click();URL.revokeObjectURL(a.href)};
navigate(current);