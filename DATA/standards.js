export const STANDARDS={
  none:{name:"Criterio de proyecto / sin norma automática"},
  mx:{name:"México · criterio configurable (verificar norma vigente)"},
  custom:{name:"Criterio personalizado"}
};
export const CRITERIA={
  conservative:{name:"Conservador",maxVelocity:2.0,minPressureMca:10,maxHeadlossPct:10},
  balanced:{name:"Equilibrado",maxVelocity:2.5,minPressureMca:7,maxHeadlossPct:15},
  custom:{name:"Personalizado",maxVelocity:3,minPressureMca:5,maxHeadlossPct:20}
};
