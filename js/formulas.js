const g=9.80665;
export const area=D=>Math.PI*D*D/4;
export const velocity=(Q,D)=>Q/area(D);
export const reynolds=(Q,D,rho=998.2,mu=.001002)=>rho*velocity(Q,D)*D/mu;
export function frictionFactor(Re,eps,D){
  if(!(Re>0)) return NaN;
  if(Re<2300) return 64/Re;
  const rr=eps/D;
  // Swamee-Jain explicit approximation
  return .25/Math.pow(Math.log10(rr/3.7+5.74/Math.pow(Re,.9)),2);
}
export function colebrookIterative(Re,eps,D){
  if(Re<2300) return 64/Re;
  let f=.02;
  for(let i=0;i<30;i++){
    const next=1/Math.pow(-2*Math.log10(eps/(3.7*D)+2.51/(Re*Math.sqrt(f))),2);
    if(Math.abs(next-f)<1e-10) return next;
    f=next;
  }
  return f;
}
export function darcy(Q,D,L,eps,rho=998.2,mu=.001002){
  const v=velocity(Q,D),Re=reynolds(Q,D,rho,mu),f=colebrookIterative(Re,eps,D);
  const hf=f*(L/D)*(v*v/(2*g));
  return {v,Re,f,hf,dp:rho*g*hf};
}
export const hazenWilliams=(Q,D,L,C=150)=>10.67*L*Math.pow(Q,1.852)/(Math.pow(C,1.852)*Math.pow(D,4.87));
export const minorLoss=(Q,D,K)=>{const v=velocity(Q,D);return K*v*v/(2*g)};
export const pressureFromHead=(head,rho=998.2)=>rho*g*head;
export const headFromPressure=(P,rho=998.2)=>P/(rho*g);
export const hydrostatic=(rho,h)=>rho*g*h;
export const pumpPower=(Q,H,eta=.7,rho=998.2)=>rho*g*Q*H/eta;
export const hydraulicPower=(Q,H,rho=998.2)=>rho*g*Q*H;
export const thermalPower=(massFlow,cp,dT)=>massFlow*cp*dT;
export const slopeFromDelta=(dh,L)=>dh/L;
export const deltaFromSlope=(slope,L)=>slope*L;
export function waterHammerJoukowsky(rho, waveSpeed, deltaV){return rho*waveSpeed*deltaV}
export function waveSpeed({rho=998.2, Kfluid=2.2e9, D, E=3e9, e}){
  // Simplified elastic-pipe estimate. If Poisson ratio is unavailable, omit correction.
  const a0=Math.sqrt(Kfluid/rho);
  if(!D||!e||!E) return a0;
  return a0/Math.sqrt(1+(Kfluid*D)/(E*e));
}
export function npshAvailable({Patm=101325,Pv=2339,rho=998.2,zSurface=0,zPump=0,hf=0}){
  return (Patm-Pv)/(rho*g)+(zSurface-zPump)-hf;
}
export function pumpSystemHead({staticHead=0,lossHead=0,requiredPressureMca=0}){return staticHead+lossHead+requiredPressureMca}
export function fixtureDemand(units){
  // Approximation for preliminary sizing; must be replaced by jurisdiction-specific method.
  return 0.0631*Math.sqrt(Math.max(units,0)); // L/s
}
export function tankBalance(V,Qin,Qout,dtMinutes){
  return Math.max(0,V+(Qin-Qout)*dtMinutes);
}
