export const U={
  length:{m:1,mm:.001,cm:.01,in:0.0254,ft:.3048},
  pressure:{Pa:1,kPa:1000,bar:100000,psi:6894.757293168,mca:9806.65},
  flow:{m3s:1,lps:.001,lpm:.001/60,m3h:1/3600,gpm:0.0000630901964},
  area:{m2:1,cm2:.0001,in2:.00064516,ft2:.09290304},
  volume:{m3:1,L:.001,galUS:.003785411784},
  power:{W:1,kW:1000,hp:745.699872}
};
export function convert(value,from,to,type){return Number(value)*U[type][from]/U[type][to]}
export const fmt=(x,d=3)=>Number.isFinite(x)?Number(x).toLocaleString("es-MX",{maximumFractionDigits:d}):"—";