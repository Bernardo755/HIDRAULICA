export const FLUIDS={
 water:{name:"Agua",density:998.2,mu:.001002,cp:4182,vaporPa:2339},
 water40:{name:"Agua 40 °C",density:992.2,mu:.000653,cp:4179,vaporPa:7375},
 water60:{name:"Agua 60 °C",density:983.2,mu:.000466,cp:4184,vaporPa:19920},
 air:{name:"Aire (aprox.)",density:1.204,mu:1.825e-5,cp:1006,vaporPa:0},
 oil:{name:"Aceite genérico",density:850,mu:.029,cp:2000,vaporPa:100}
};
export function fluid(id){return FLUIDS[id]||FLUIDS.water}