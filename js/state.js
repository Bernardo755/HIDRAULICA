import {CONFIG} from "./config.js";

const defaultProject=()=>({name:"Proyecto hidráulico",nodes:[],edges:[],materials:[],calculations:[]});
const defaultSettings=()=>({unitSystem:"SI",fluid:CONFIG.defaultFluid,tempC:CONFIG.defaultTempC});

export const state={project:defaultProject(),settings:defaultSettings()};

function normalizeProject(project){
  const p=project&&typeof project==="object"?project:{};
  return {
    name:typeof p.name==="string"&&p.name.trim()?p.name:"Proyecto hidráulico",
    nodes:Array.isArray(p.nodes)?p.nodes:[],
    edges:Array.isArray(p.edges)?p.edges:[],
    materials:Array.isArray(p.materials)?p.materials:[],
    calculations:Array.isArray(p.calculations)?p.calculations:[]
  };
}

function normalizeSettings(settings){
  const s=settings&&typeof settings==="object"?settings:{};
  return {
    unitSystem:s.unitSystem||"SI",
    fluid:s.fluid||CONFIG.defaultFluid,
    tempC:Number.isFinite(Number(s.tempC))?Number(s.tempC):CONFIG.defaultTempC
  };
}

export function resetProject(){
  state.project=defaultProject();
  state.settings=defaultSettings();
}

export function saveState(){
  try{localStorage.setItem(CONFIG.storageKey,JSON.stringify(state));return true}
  catch(e){console.warn("No se pudo guardar el proyecto:",e);return false}
}

export function loadState(){
  try{
    const raw=localStorage.getItem(CONFIG.storageKey);
    if(!raw) return false;
    const x=JSON.parse(raw);
    state.project=normalizeProject(x?.project);
    state.settings=normalizeSettings(x?.settings);
    return true;
  }catch(e){
    console.warn("No se pudo cargar el proyecto guardado:",e);
    resetProject();
    return false;
  }
}

export function snapshot(){return JSON.parse(JSON.stringify(state))}
