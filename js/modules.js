import {page,field,esc,num,toast,$} from "./ui.js";
import {U,convert,fmt} from "./units.js"; import {FLUIDS,fluid} from "./fluids.js"; import {PIPES} from "./pipes.js"; import {FITTINGS} from "./fittings.js";
import * as C from "./calculations.js"; import {state,saveState,resetProject} from "./state.js";

export const dashboard=()=>page("Panel hidráulico","Herramientas rápidas para tuberías, agua y fluidos.",`
<div class="grid grid-4 kpi-grid">
<div class="card"><div class="stat-icon">💧</div><div class="label">Caudal</div><div class="metric" id="kpiQ">—</div></div>
<div class="card"><div class="stat-icon">📏</div><div class="label">Velocidad</div><div class="metric" id="kpiV">—</div></div>
<div class="card"><div class="stat-icon">📉</div><div class="label">Pérdida</div><div class="metric" id="kpiH">—</div></div>
<div class="card"><div class="stat-icon">⚙️</div><div class="label">Proyecto</div><div class="metric">${state.project.nodes.length+state.project.edges.length}</div></div>
</div>
<div class="grid grid-3" style="margin-top:14px">
${["Calculadoras","Red hidráulica","Bombas","Tinacos y cisternas","Drenaje","Materiales"].map((x,i)=>`<div class="card cards-click" data-go="${["calculators","network","pumps","tanks","drainage","materials"][i]}"><h3>${x}</h3><div class="muted">Abrir módulo profesional →</div></div>`).join("")}
</div>
<div class="card" style="margin-top:14px"><h3>Modo de uso</h3><p class="muted">Introduce datos en unidades coherentes. La aplicación conserva internamente unidades SI y muestra las conversiones. Los resultados son cálculos técnicos preliminares y deben validarse para ejecución de obra.</p></div>`);

export const units=()=>page("Conversor de unidades","Convierte magnitudes hidráulicas sin mezclar unidades.",`
<div class="card"><div class="form-grid">
<div class="field"><label>Magnitud</label><select id="uType">${Object.keys(U).map(k=>`<option value="${k}">${k}</option>`).join("")}</select></div>
<div class="field"><label>Valor</label><input id="uVal" type="number" value="1" step="any"></div>
<div class="field"><label>De</label><select id="uFrom"></select></div>
<div class="field"><label>A</label><select id="uTo"></select></div></div>
<div class="result" id="uResult"></div></div><div class="card" style="margin-top:14px"><h3>Magnitudes disponibles</h3><div class="table-wrap"><table class="table"><tr><th>Tipo</th><th>Unidades</th></tr>${Object.entries(U).map(([k,v])=>`<tr><td>${k}</td><td>${Object.keys(v).join(", ")}</td></tr>`).join("")}</table></div></div>`);

export const fluids=()=>page("Propiedades de fluidos","Consulta y utiliza propiedades aproximadas para cálculos.",`
<div class="grid grid-3">${Object.entries(FLUIDS).map(([id,f])=>`<div class="card"><h3>${f.name}</h3><div class="mini-list"><div><span>Densidad</span><b>${f.density} kg/m³</b></div><div><span>Viscosidad</span><b>${f.mu} Pa·s</b></div><div><span>Cp</span><b>${f.cp} J/kg·K</b></div></div><button class="btn primary fluid-use" data-id="${id}" style="margin-top:10px">Usar</button></div>`).join("")}</div>`);

export const pipes=()=>page("Tuberías y accesorios","Base inicial editable de materiales, diámetros y accesorios.",`
<div class="card"><h3>Tuberías</h3><div class="table-wrap"><table class="table"><tr><th>Nominal</th><th>DN</th><th>Ø interior</th><th>Material</th><th>Rugosidad</th></tr>${PIPES.map(p=>`<tr><td>${p.nom}"</td><td>${p.DN} mm</td><td>${p.di} mm</td><td>${p.material}</td><td>${p.rough} mm</td></tr>`).join("")}</table></div></div>
<div class="card" style="margin-top:14px"><h3>Accesorios · coeficiente K</h3><div class="table-wrap"><table class="table"><tr><th>Accesorio</th><th>K</th></tr>${FITTINGS.map(f=>`<tr><td>${f.name}</td><td>${f.K}</td></tr>`).join("")}</table></div></div>`);

export const calculators=()=>page("Calculadoras hidráulicas","Caudal, velocidad, presión, Reynolds, pérdidas, diámetro y bomba.",`
<div class="calc-grid">
<div class="calc-card"><h3>1 · Caudal y velocidad</h3><div class="form-grid">${field("Diámetro interior (mm)","qD",25)}${field("Caudal (L/min)","qQ",20)}</div><button class="btn primary calc" data-calc="qv">Calcular</button><div class="result" id="r-qv"></div></div>
<div class="calc-card"><h3>2 · Reynolds y fricción</h3><div class="form-grid">${field("Diámetro (mm)","rD",25)}${field("Caudal (L/min)","rQ",20)}${field("Rugosidad (mm)","rE",.0015)}</div><button class="btn primary calc" data-calc="re">Calcular</button><div class="result" id="r-re"></div></div>
<div class="calc-card"><h3>3 · Darcy-Weisbach</h3><div class="form-grid">${field("Diámetro (mm)","dD",25)}${field("Caudal (L/min)","dQ",20)}${field("Longitud (m)","dL",30)}${field("Rugosidad (mm)","dE",.0015)}${field("K total","dK",2)}</div><button class="btn primary calc" data-calc="darcy">Calcular</button><div class="result" id="r-darcy"></div></div>
<div class="calc-card"><h3>4 · Hazen-Williams</h3><div class="form-grid">${field("Diámetro (mm)","hD",25)}${field("Caudal (L/min)","hQ",20)}${field("Longitud (m)","hL",30)}${field("C","hC",150)}</div><button class="btn primary calc" data-calc="hazen">Calcular</button><div class="result" id="r-hazen"></div></div>
<div class="calc-card"><h3>5 · Presión hidrostática</h3><div class="form-grid">${field("Altura (m)","pH",10)}${field("Densidad (kg/m³)","pR",998.2)}</div><button class="btn primary calc" data-calc="pressure">Calcular</button><div class="result" id="r-pressure"></div></div>
<div class="calc-card"><h3>6 · Potencia de bomba</h3><div class="form-grid">${field("Caudal (L/s)","bQ",1)}${field("Altura total (m)","bH",20)}${field("Eficiencia (0-1)","bE",.7,"number",".01")}</div><button class="btn primary calc" data-calc="pump">Calcular</button><div class="result" id="r-pump"></div></div>
<div class="calc-card"><h3>7 · Potencia térmica</h3><div class="form-grid">${field("Flujo másico (kg/s)","tM",.2)}${field("Cp (J/kgK)","tCp",4182)}${field("ΔT (°C)","tDT",25)}</div><button class="btn primary calc" data-calc="thermal">Calcular</button><div class="result" id="r-thermal"></div></div>
<div class="calc-card"><h3>8 · Pendiente</h3><div class="form-grid">${field("Desnivel (m)","sH",.2)}${field("Longitud (m)","sL",10)}</div><button class="btn primary calc" data-calc="slope">Calcular</button><div class="result" id="r-slope"></div></div>
</div>
<div class="warning" style="margin-top:14px">Los límites de velocidad, presión, diámetro y pendientes dependen del sistema, material, normativa y criterio de diseño. No se presentan como valores universales.</div>`);

export const network=()=>page("Red hidráulica","Diseñador 2D simplificado: coloca nodos y calcula tramos.",`
<div class="split"><div class="card"><div class="actions"><button class="btn" id="addSource">＋ Fuente</button><button class="btn" id="addTank">＋ Tanque</button><button class="btn" id="addPump">＋ Bomba</button><button class="btn" id="addOutlet">＋ Salida</button><button class="btn danger" id="clearNet">Limpiar</button></div><div class="canvas-wrap" style="margin-top:10px"><canvas id="netCanvas" class="network-canvas"></canvas></div><div class="legend">Arrastra nodos · selecciona para ver propiedades · doble clic para conectar dos nodos</div></div>
<div class="card" id="nodePanel"><h3>Propiedades</h3><div class="empty">Selecciona un nodo.</div></div></div>`);

export const pumps=()=>page("Bombas","Altura dinámica, potencia y punto de operación preliminar.",`
<div class="card"><div class="form-grid">${field("Caudal (L/s)","pbQ",1)}${field("Altura estática (m)","pbHs",10)}${field("Longitud tubería (m)","pbL",50)}${field("Pérdida adicional (m)","pbHl",5)}${field("Eficiencia","pbEta",.7)}</div><div class="actions"><button class="btn primary" id="calcPump">Calcular</button></div><div id="pumpResult" class="result"></div></div>
<div class="card" style="margin-top:14px"><h3>Curva conceptual</h3><p class="muted">La app puede comparar la curva de una bomba si introduces datos reales del fabricante. No se inventan curvas de marca.</p><canvas id="pumpChart" width="900" height="300" style="width:100%;max-width:900px"></canvas></div>`);

export const tanks=()=>page("Tinacos y cisternas","Volumen, autonomía, llenado y vaciado.",`
<div class="card"><div class="form-grid">${field("Volumen (L)","tkV",1100)}${field("Caudal entrada (L/min)","tkIn",10)}${field("Caudal salida (L/min)","tkOut",5)}</div><button class="btn primary" id="calcTank">Calcular</button><div id="tankResult" class="result"></div><div style="height:120px;background:#f1f5f9;border-radius:10px;margin-top:12px;position:relative;overflow:hidden"><div id="waterLevel" style="position:absolute;bottom:0;width:100%;height:65%;background:#60a5fa55;border-top:3px solid #2563eb"></div></div></div>`);

export const drainage=()=>page("Drenaje y pendientes","Calcula desniveles, pendientes y cotas.",`
<div class="card"><div class="form-grid">${field("Cota inicial (m)","drZi",100)}${field("Longitud (m)","drL",12)}${field("Pendiente (%)","drS",2)}</div><button class="btn primary" id="calcDrain">Calcular</button><div id="drainResult" class="result"></div></div>
<div class="card" style="margin-top:14px"><h3>Concepto</h3><div class="formula">Pendiente = Δh / L</div><p class="muted">Para una pendiente del 2% se requiere un desnivel de 0.02 m por cada metro horizontal.</p></div>`);

export const hotwater=()=>page("Agua caliente","Potencia térmica para calentamiento de agua.",`
<div class="card"><div class="form-grid">${field("Caudal (L/min)","hwQ",10)}${field("Temperatura entrada (°C)","hwTi",20)}${field("Temperatura salida (°C)","hwTo",45)}</div><button class="btn primary" id="calcHot">Calcular</button><div id="hotResult" class="result"></div></div>`);

export const materials=()=>page("Materiales y presupuesto","Lista inicial de materiales y cálculo de costos.",`
<div class="card"><div class="actions"><button class="btn primary" id="addMaterial">＋ Agregar</button><button class="btn" id="clearMaterials">Vaciar</button></div><div class="table-wrap"><table class="table" id="matTable"><tr><th>Descripción</th><th>Cantidad</th><th>Unidad</th><th>Precio</th><th>Importe</th><th></th></tr></table></div><div class="result"><strong>Total: $<span id="matTotal">0.00</span></strong></div></div>`);

export const reports=()=>page("Reportes y proyecto","Guarda, exporta e inspecciona la información del proyecto.",`
<div class="card"><div class="form-grid">${field("Nombre del proyecto","rpName",state.project.name,"text")}${field("Descripción","rpDesc","","text")}</div><div class="actions"><button class="btn primary" id="saveProject">Guardar localmente</button><button class="btn" id="downloadJson">Descargar JSON</button><button class="btn" id="printReport">Imprimir reporte</button></div><pre id="projectPreview" class="formula" style="margin-top:12px;max-height:400px;overflow:auto"></pre></div>`);

export const learn=()=>page("Aprender","Conceptos clave para plomero, técnico e ingeniería.",`
<div class="grid grid-2">${[
["Continuidad","Q = A·v","El caudal se conserva en un tramo sin almacenamiento."],
["Darcy-Weisbach","hf = f(L/D)(v²/2g)","Permite calcular pérdida de carga distribuida."],
["Reynolds","Re = ρvD/μ","Ayuda a identificar el régimen del flujo."],
["Bernoulli","P/ρg + v²/2g + z + H = pérdidas","Relaciona presión, velocidad, elevación, bombas y pérdidas."],
["Hidrostática","P = ρgh","La presión aumenta con la profundidad o altura de columna."],
["Potencia hidráulica","P = ρgQH/η","Estimación de potencia necesaria para bombeo."]
].map(x=>`<div class="card"><h3>${x[0]}</h3><div class="formula">${x[1]}</div><p class="muted">${x[2]}</p></div>`).join("")}</div>
<div class="notice" style="margin-top:14px">Consejo: usa siempre unidades consistentes y verifica condiciones reales, normativa y datos del fabricante antes de ejecutar una instalación.</div>`);

export function bindModule(name){
 if(name==="units") initUnits();
 if(name==="fluids") document.querySelectorAll(".fluid-use").forEach(b=>b.onclick=()=>toast("Fluido seleccionado: "+FLUIDS[b.dataset.id].name));
 if(name==="calculators") initCalcs();
 if(name==="network") initNetwork();
 if(name==="pumps") initPumps();
 if(name==="tanks") initTanks();
 if(name==="drainage") initDrainage();
 if(name==="hotwater") initHot();
 if(name==="materials") initMaterials();
 if(name==="reports") initReports();
 document.querySelectorAll("[data-go]").forEach(e=>e.onclick=()=>window.dispatchEvent(new CustomEvent("navigate",{detail:e.dataset.go})));
}
function initUnits(){const t=$("#uType"),f=$("#uFrom"),to=$("#uTo"),v=$("#uVal"),r=$("#uResult");function load(){f.innerHTML=Object.keys(U[t.value]).map(x=>`<option>${x}</option>`).join("");to.innerHTML=Object.keys(U[t.value]).map(x=>`<option>${x}</option>`).join("");to.selectedIndex=1;calc()}function calc(){try{r.innerHTML=`<strong>${fmt(convert(num(v.value),f.value,to.value,t.value),6)}</strong> ${to.value}`}catch(e){r.textContent="Conversión no disponible"}}t.onchange=load;[f,to,v].forEach(e=>e.oninput=calc);load()}
function initCalcs(){document.querySelectorAll(".calc").forEach(b=>b.onclick=()=>{let x,y,r;if(b.dataset.calc==="qv"){x=num($("#qD").value)/1000;y=num($("#qQ").value)/1000/60;r=$("#r-qv");const z=C.quickFlow(x,y);r.innerHTML=`Área: ${fmt(z.A,6)} m²<br><strong>Velocidad: ${fmt(z.v,3)} m/s</strong>`}
else if(b.dataset.calc==="re"){x=num($("#rD").value)/1000;y=num($("#rQ").value)/1000/60;r=$("#r-re");const z=C.reynolds(y,x);r.innerHTML=`Re = <strong>${fmt(z,0)}</strong><br>${z<2300?"Laminar":z<4000?"Transición":"Turbulento"}`}
else if(b.dataset.calc==="darcy"){x=num($("#dD").value)/1000;y=num($("#dQ").value)/1000/60;r=$("#r-darcy");const z=C.pipeCheck({Q:y,D:x,L:num($("#dL").value),rough:num($("#dE").value)/1000,rho:998.2,mu:.001002,K:num($("#dK").value)});r.innerHTML=`v = ${fmt(z.v,3)} m/s · Re = ${fmt(z.Re,0)} · f = ${fmt(z.f,5)}<br>Pérdida distribuida: ${fmt(z.hf,3)} m<br>Pérdida accesorios: ${fmt(z.hm,3)} m<br><strong>Pérdida total: ${fmt(z.ht,3)} m.c.a.</strong>`}
else if(b.dataset.calc==="hazen"){x=num($("#hD").value)/1000;y=num($("#hQ").value)/1000/60;r=$("#r-hazen");r.innerHTML=`<strong>${fmt(C.hazenWilliams(y,x,num($("#hL").value),num($("#hC").value)),3)} m.c.a.</strong>`}
else if(b.dataset.calc==="pressure"){r=$("#r-pressure");const z=C.hydrostatic(num($("#pR").value),num($("#pH").value));r.innerHTML=`<strong>${fmt(z/1000,3)} kPa</strong> · ${fmt(z/6894.757,3)} psi`}
else if(b.dataset.calc==="pump"){r=$("#r-pump");const z=C.pumpPower(num($("#bQ").value)/1000,num($("#bH").value),num($("#bE").value));r.innerHTML=`<strong>${fmt(z/1000,3)} kW</strong> · ${fmt(z/745.699872,3)} HP`}
else if(b.dataset.calc==="thermal"){r=$("#r-thermal");r.innerHTML=`<strong>${fmt(C.thermalPower(num($("#tM").value),num($("#tCp").value),num($("#tDT").value))/1000,3)} kW</strong>`}
else if(b.dataset.calc==="slope"){r=$("#r-slope");const z=num($("#sH").value)/num($("#sL").value)*100;r.innerHTML=`Pendiente: <strong>${fmt(z,3)}%</strong> · 1:${fmt(100/z,2)}`}})}
function initPumps(){$("#calcPump").onclick=()=>{const Q=num($("#pbQ").value)/1000,Hs=num($("#pbHs").value),Hl=num($("#pbHl").value),eta=num($("#pbEta").value),H=Hs+Hl,P=C.pumpPower(Q,H,eta);$("#pumpResult").innerHTML=`Altura total: <strong>${fmt(H,3)} m</strong><br>Potencia aproximada: <strong>${fmt(P/1000,3)} kW</strong> · ${fmt(P/745.699872,3)} HP`;drawPump(H,Q)}}function drawPump(H,Q){const c=$("#pumpChart"),x=c.getContext("2d");x.clearRect(0,0,c.width,c.height);x.strokeStyle="#2563eb";x.lineWidth=3;x.beginPath();for(let i=0;i<=100;i++){const xx=60+i*8.2,yy=40+((i/100)*220);const q=1-i/130;const y=40+Math.min(220,180*q);if(i===0)x.moveTo(xx,y);else x.lineTo(xx,y)}x.stroke();x.fillStyle="#475569";x.fillText("Curva conceptual — sustituir por datos del fabricante",60,285)}
function initTanks(){$("#calcTank").onclick=()=>{const V=num($("#tkV").value),qin=num($("#tkIn").value),qout=num($("#tkOut").value),net=qin-qout;$("#tankResult").innerHTML=net>0?`Tiempo para llenar desde vacío: <strong>${fmt(V/net,1)} min</strong>`:net<0?`Tiempo para vaciar: <strong>${fmt(V/Math.abs(net),1)} min</strong>`:`El balance neto es 0 L/min.`;$("#waterLevel").style.height=Math.min(100,Math.max(5,V/2000*100))+"%"}}function initDrainage(){$("#calcDrain").onclick=()=>{const z=num($("#drZi").value),L=num($("#drL").value),s=num($("#drS").value)/100,d=L*s;$("#drainResult").innerHTML=`Desnivel: <strong>${fmt(d,3)} m</strong><br>Cota final: <strong>${fmt(z-d,3)} m</strong>`}}function initHot(){$("#calcHot").onclick=()=>{const q=num($("#hwQ").value)/60/1000,r=fluid("water"),m=q*r.density,p=C.thermalPower(m,r.cp,num($("#hwTo").value)-num($("#hwTi").value));$("#hotResult").innerHTML=`Potencia térmica: <strong>${fmt(p/1000,3)} kW</strong><br>Flujo másico: ${fmt(m,4)} kg/s`}}
function initMaterials(){const table=$("#matTable");function total(){let t=0;table.querySelectorAll("tbody tr").forEach(tr=>t+=num(tr.querySelector(".qty")?.value)*num(tr.querySelector(".price")?.value));$("#matTotal").textContent=t.toFixed(2)}function add(){const tb=table.querySelector("tbody")||table.appendChild(document.createElement("tbody"));const tr=document.createElement("tr");tr.innerHTML=`<td><input value="Tubería PVC"></td><td><input class="qty" type="number" value="1"></td><td>pza</td><td><input class="price" type="number" value="0" step="0.01"></td><td class="imp">0.00</td><td><button class="btn danger">×</button></td>`;tr.querySelector("button").onclick=()=>{tr.remove();total()};tr.querySelectorAll("input").forEach(i=>i.oninput=()=>{tr.querySelector(".imp").textContent=(num(tr.querySelector(".qty").value)*num(tr.querySelector(".price").value)).toFixed(2);total()})}$("#addMaterial").onclick=add;$("#clearMaterials").onclick=()=>{table.querySelector("tbody")?.remove();$("#matTotal").textContent="0.00"};add()}
function initReports(){const p=$("#projectPreview");function render(){p.textContent=JSON.stringify(state.project,null,2)}$("#rpName").oninput=e=>{state.project.name=e.target.value;render()};$("#saveProject").onclick=()=>{saveState();toast("Proyecto guardado en este dispositivo")};$("#downloadJson").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}));a.download=(state.project.name||"proyecto")+".json";a.click();URL.revokeObjectURL(a.href)};$("#printReport").onclick=()=>window.print();render()}
function initNetwork(){const c=$("#netCanvas"),ctx=c.getContext("2d");let selected=null,drag=null;function resize(){c.width=c.clientWidth*devicePixelRatio;c.height=c.clientHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);draw()}function add(type){state.project.nodes.push({id:crypto.randomUUID(),type,x:100+Math.random()*500,y:100+Math.random()*300,label:{source:"Fuente",tank:"Tanque",pump:"Bomba",outlet:"Salida"}[type]});draw()}function draw(){ctx.clearRect(0,0,c.clientWidth,c.clientHeight);for(const e of state.project.edges){const a=state.project.nodes.find(n=>n.id===e.from),b=state.project.nodes.find(n=>n.id===e.to);if(a&&b){ctx.strokeStyle="#2563eb";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(a.x+44,a.y+22);ctx.lineTo(b.x+44,b.y+22);ctx.stroke()}}for(const n of state.project.nodes){ctx.fillStyle="#fff";ctx.strokeStyle=n===selected?"#2563eb":"#93c5fd";ctx.lineWidth=n===selected?3:1;ctx.beginPath();ctx.roundRect(n.x,n.y,88,44,9);ctx.fill();ctx.stroke();ctx.fillStyle="#172033";ctx.font="11px system-ui";ctx.textAlign="center";ctx.fillText(n.label,n.x+44,n.y+27)}}function hit(x,y){return [...state.project.nodes].reverse().find(n=>x>=n.x&&x<=n.x+88&&y>=n.y&&y<=n.y+44)}function select(n){selected=n;const p=$("#nodePanel");p.innerHTML=n?`<h3>${n.label}</h3><div class="form-grid">${field("Etiqueta","nLabel",n.label,"text")}${field("Elevación (m)","nZ",n.z||0)}</div><div class="actions"><button class="btn primary" id="saveNode">Aplicar</button><button class="btn danger" id="delNode">Eliminar</button></div>`:`<div class="empty">Selecciona un nodo.</div>`;if(n){$("#saveNode").onclick=()=>{n.label=$("#nLabel").value;n.z=num($("#nZ").value);draw()};$("#delNode").onclick=()=>{state.project.nodes=state.project.nodes.filter(x=>x!==n);state.project.edges=state.project.edges.filter(e=>e.from!==n.id&&e.to!==n.id);selected=null;select(null);draw()}}}
c.addEventListener("pointerdown",e=>{const r=c.getBoundingClientRect(),n=hit(e.clientX-r.left,e.clientY-r.top);if(n){drag={n,dx:e.clientX-r.left-n.x,dy:e.clientY-r.top-n.y};select(n)}});c.addEventListener("pointermove",e=>{if(drag){const r=c.getBoundingClientRect();drag.n.x=e.clientX-r.left-drag.dx;drag.n.y=e.clientY-r.top-drag.dy;draw()}});c.addEventListener("pointerup",()=>drag=null);c.addEventListener("dblclick",e=>{const r=c.getBoundingClientRect(),n=hit(e.clientX-r.left,e.clientY-r.top);if(n){if(!selected)select(n);else if(selected!==n){state.project.edges.push({id:crypto.randomUUID(),from:selected.id,to:n.id});draw();toast("Tramo conectado");}}});$("#addSource").onclick=()=>add("source");$("#addTank").onclick=()=>add("tank");$("#addPump").onclick=()=>add("pump");$("#addOutlet").onclick=()=>add("outlet");$("#clearNet").onclick=()=>{state.project.nodes=[];state.project.edges=[];selected=null;select(null);draw()};window.addEventListener("resize",resize);resize()}
