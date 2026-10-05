import {page,field,num,$,toast,fmt} from "./ui.js";
import * as F from "./formulas.js";
import {PIPES} from "./pipes.js";
import {FLUIDS,fluid} from "./fluids.js";
import {FIXTURES} from "../data/fixtures.js";
import {CRITERIA,STANDARDS} from "../data/standards.js";
import {state,saveState} from "./state.js";

export const advanced=()=>page("Ingeniería avanzada","Dimensionamiento, NPSH, golpe de ariete, unidades de gasto, perfil y diagnóstico.",`
<div class="tabbar">
<button class="tab active" data-at="sizing">Diámetros</button><button class="tab" data-at="npsh">NPSH</button>
<button class="tab" data-at="waterhammer">Golpe de ariete</button><button class="tab" data-at="fixtures">Unidades de gasto</button>
<button class="tab" data-at="profile">Perfil hidráulico</button><button class="tab" data-at="diagnostics">Diagnóstico</button>
</div>
<div id="advancedBody"></div>`);

export function bindAdvanced(){
  const tabs=[...document.querySelectorAll("[data-at]")];
  tabs.forEach(t=>t.onclick=()=>{tabs.forEach(x=>x.classList.remove("active"));t.classList.add("active");renderAdvanced(t.dataset.at)});
  renderAdvanced("sizing");
}
function renderAdvanced(mode){
 const b=$("#advancedBody");
 if(mode==="sizing") b.innerHTML=`<div class="card"><h3>Comparador automático de diámetros</h3><div class="form-grid">${field("Caudal (L/min)","szQ",30)}${field("Longitud (m)","szL",30)}${field("K total","szK",2)}${field("Criterio","szCrit","","text")}</div><div class="actions"><button class="btn primary" id="runSizing">Analizar candidatos</button></div><div id="szOut"></div></div>`;
 if(mode==="npsh") b.innerHTML=`<div class="card"><h3>NPSH disponible</h3><div class="form-grid">${field("Presión atmosférica (kPa)","npPa",101.325)}${field("Presión vapor (kPa)","npPv",2.34)}${field("Cota superficie (m)","npZs",0)}${field("Cota bomba (m)","npZp",0)}${field("Pérdidas succión (m)","npHf",1)}</div><button class="btn primary" id="runNpsh">Calcular</button><div id="npOut" class="result"></div></div>`;
 if(mode==="waterhammer") b.innerHTML=`<div class="card"><h3>Golpe de ariete · Joukowsky</h3><div class="form-grid">${field("Densidad (kg/m³)","whR",998.2)}${field("Velocidad de onda (m/s)","whA",1000)}${field("Cambio de velocidad (m/s)","whDV",2)}</div><button class="btn primary" id="runWh">Calcular</button><div id="whOut" class="result"></div><div class="warning" style="margin-top:12px">Estimación simplificada. Para cierres rápidos, redes complejas o transitorios importantes se requiere análisis específico.</div></div>`;
 if(mode==="fixtures") b.innerHTML=`<div class="card"><h3>Unidades de gasto · predimensionamiento</h3><div class="table-wrap"><table class="table"><tr><th>Aparato</th><th>Fría</th><th>Caliente</th><th>Drenaje</th><th>Cantidad</th></tr>${FIXTURES.map((f,i)=>`<tr><td>${f.name}</td><td>${f.cold}</td><td>${f.hot}</td><td>${f.drain}</td><td><input class="fxQty" data-i="${i}" type="number" value="0" min="0"></td></tr>`).join("")}</table></div><button class="btn primary" id="runFx">Calcular demanda</button><div id="fxOut" class="result"></div></div>`;
 if(mode==="profile") b.innerHTML=`<div class="card"><h3>Perfil hidráulico</h3><div class="form-grid">${field("Cota inicial (m)","pfZ",100)}${field("Presión inicial (m.c.a.)","pfP",20)}${field("Pérdida por tramo (m)","pfLoss",1)}${field("Longitud total (m)","pfL",50)}${field("Tramos","pfN",5)}</div><button class="btn primary" id="runPf">Generar perfil</button><canvas id="profileCanvas" width="900" height="340" style="width:100%;margin-top:12px"></canvas></div>`;
 if(mode==="diagnostics") b.innerHTML=`<div class="card"><h3>Diagnóstico del proyecto</h3><button class="btn primary" id="runDiag">Analizar proyecto</button><div id="diagOut" style="margin-top:12px"></div></div>`;
 if(mode==="sizing") $("#runSizing").onclick=runSizing;
 if(mode==="npsh") $("#runNpsh").onclick=()=>{const r=F.npshAvailable({Patm:num($("#npPa").value)*1000,Pv:num($("#npPv").value)*1000,zSurface:num($("#npZs").value),zPump:num($("#npZp").value),hf:num($("#npHf").value)});$("#npOut").innerHTML=`NPSH disponible: <strong>${fmt(r,3)} m</strong><br><span class="${r>3?"ok":"warn"}">${r>3?"Margen preliminar razonable":"Revisar margen, temperatura, succión y NPSH requerido de la bomba."}</span>`};
 if(mode==="waterhammer") $("#runWh").onclick=()=>{$("#whOut").innerHTML=`Sobrepresión: <strong>${fmt(F.waterHammerJoukowsky(num($("#whR").value),num($("#whA").value),num($("#whDV").value))/1000,2)} kPa</strong>`};
 if(mode==="fixtures") $("#runFx").onclick=()=>{let u=0,d=0;document.querySelectorAll(".fxQty").forEach(e=>{const f=FIXTURES[+e.dataset.i],q=num(e.value);u+=(f.cold+f.hot)*q;d+=f.drain*q});$("#fxOut").innerHTML=`Unidades de suministro: <strong>${fmt(u,0)}</strong><br>Unidades de drenaje: <strong>${fmt(d,0)}</strong><br>Caudal preliminar estimado: <strong>${fmt(F.fixtureDemand(u)*1000,2)} L/s</strong>`};
 if(mode==="profile") $("#runPf").onclick=drawProfile;
 if(mode==="diagnostics") $("#runDiag").onclick=diagnostics;
}
function runSizing(){
 const Q=num($("#szQ").value)/60000,L=num($("#szL").value),K=num($("#szK").value);
 const rows=PIPES.map(p=>{const D=p.di/1000,z=F.darcy(Q,D,L,p.rough,998.2,.001002),hm=F.minorLoss(Q,D,K);return {...p,v:z.v,loss:z.hf+hm}});
 const crit=CRITERIA.balanced;
 $("#szOut").innerHTML=`<div class="table-wrap" style="margin-top:12px"><table class="table"><tr><th>Diámetro</th><th>Material</th><th>Velocidad</th><th>Pérdida total</th><th>Evaluación</th></tr>${rows.map(r=>{const ok=r.v<=crit.maxVelocity&&r.loss<=L*crit.maxHeadlossPct/100;return `<tr><td>${r.nom}"</td><td>${r.material}</td><td>${fmt(r.v,2)} m/s</td><td>${fmt(r.loss,3)} m.c.a.</td><td class="${ok?"ok":"warn"}">${ok?"Recomendable":"Revisar"}</td></tr>`}).join("")}</table></div>`;
}
function drawProfile(){
 const c=$("#profileCanvas"),x=c.getContext("2d"),z0=num($("#pfZ").value),p0=num($("#pfP").value),loss=num($("#pfLoss").value),n=Math.max(2,num($("#pfN").value));x.clearRect(0,0,c.width,c.height);x.strokeStyle="#2563eb";x.lineWidth=3;x.beginPath();for(let i=0;i<n;i++){const xx=50+i*(800/(n-1)),zz=z0-i*0.4,yy=280-(zz-z0+10)*12;if(i===0)x.moveTo(xx,yy);else x.lineTo(xx,yy)}x.stroke();x.strokeStyle="#14b8a6";x.beginPath();for(let i=0;i<n;i++){const xx=50+i*(800/(n-1)),yy=120+i*loss*15;if(i===0)x.moveTo(xx,yy);else x.lineTo(xx,yy)}x.stroke();x.fillStyle="#475569";x.fillText("Azul: perfil de tubería · Verde: tendencia de energía/presión",50,25)}
function diagnostics(){
 const out=[]; if(!state.project.nodes.length)out.push(["warn","No hay nodos en la red."]); if(state.project.nodes.length&&!state.project.edges.length)out.push(["warn","Hay nodos pero no existen conexiones."]);
 state.project.edges.forEach((e,i)=>{if(!e.length&&e.length!==0)out.push(["warn",`Tramo ${i+1}: longitud no definida.`]);if(!e.di)out.push(["warn",`Tramo ${i+1}: diámetro no definido; se usará 25 mm en cálculos preliminares.`])});
 if(!out.length)out.push(["ok","No se detectaron problemas estructurales básicos."]);
 $("#diagOut").innerHTML=out.map(x=>`<div class="${x[0]==="ok"?"notice":"warning"}" style="margin-bottom:7px">${x[1]}</div>`).join("");
}
