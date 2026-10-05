import {CONFIG} from "./config.js";
export const state={project:{name:"Proyecto hidráulico",nodes:[],edges:[],materials:[],calculations:[]},settings:{unitSystem:"SI",fluid:CONFIG.defaultFluid,tempC:CONFIG.defaultTempC}};
export function resetProject(){state.project={name:"Proyecto hidráulico",nodes:[],edges:[],materials:[],calculations:[]}}
export function saveState(){localStorage.setItem(CONFIG.storageKey,JSON.stringify(state))}
export function loadState(){try{const x=JSON.parse(localStorage.getItem(CONFIG.storageKey));if(x){Object.assign(state,x)}}catch(e){console.warn(e)}}
export function snapshot(){return JSON.parse(JSON.stringify(state))}