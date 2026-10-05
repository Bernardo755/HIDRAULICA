import * as F from "./formulas.js";
export function pipeCheck({Q,D,L,rough,rho,mu,C=150,K=0}){
 const d=F.darcy(Q,D,L,rough,rho,mu), hm=F.minorLoss(Q,D,K);
 return {...d,hm,ht:d.hf+hm,pressureLoss:(d.hf+hm)*rho*9.80665,hazen:F.hazenWilliams(Q,D,L,C)};
}
export function diameterCandidates({Q,L,rough,rho=998.2,mu=.001002,C=150,K=0,candidates}){
 return candidates.map(p=>{
   const D=p.di/1000, z=pipeCheck({Q,D,L,rough:p.rough||rough,rho,mu,C,K});
   return {...p,...z};
 });
}
export function networkSolve(nodes,edges,fluid){
  const out=edges.map(e=>{
    const from=nodes.find(n=>n.id===e.from),to=nodes.find(n=>n.id===e.to);
    const D=(e.di||25)/1000, Q=e.Q||0.0002;
    const L=e.length||10, rough=e.rough||0.0015;
    const z=F.darcy(Q,D,L,rough,fluid.density,fluid.mu);
    const hm=F.minorLoss(Q,D,e.K||0);
    return {...e,fromLabel:from?.label||e.from,toLabel:to?.label||e.to,velocity:z.v,Re:z.Re,f:z.f,lossHead:z.hf+hm,pressureLoss:fluid.density*9.80665*(z.hf+hm)};
  });
  return out;
}
export {F};
