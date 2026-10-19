// Demo job records shared by the Cutting Form and its order-quality dashboard.
export const fourPointScore = roll => roll.points * 3600 / (roll.yards * roll.width);
const definitions = [
  ['YAIDD11','Customer BB','6261340003','220 WINDWARD BLUE ACID WASH','LAT14653A',150,50,'T 4',11,11,55,'K3',5.48,74.59,50,20,2],
  ['YAIBB24','Customer BB','STY-5227','Black','PO-BB-5227',360,120,'T 6',24,24,120,'K8',6.2,153.2,120,40,0],
  ['YAIAA32','Customer AA','STY-7168','White','PO-AA-7168',255,85,'T 2',17,0,0,'K6',5.1,0,0,0,0],
  ['YAICC18','Customer CC','STY-7731','Green','PO-CC-7731',600,200,'T 8',40,40,200,'K9',5.7,235.8,200,50,1],
];
export const CUTTING_ORDERS = definitions.map((d,i) => {
  const [mo,buyer,style,colour,po,orderQty,allocation,table,planLayers,actualLayers,cutQty,marker,markerLength,spreadYards,numbered,inspected,rejected]=d;
  const held=i===2;
  const rolls=Array.from({length:4},(_,r)=>({id:`${mo}-R0${r+1}`,lot:`LOT-${mo}-01`,shade:r<2?'A':'B',yards:[110,120,115,125][r],width:60,points:held&&r===2?92:[12,18,15,20][r],defects:held&&r===2?'Running crease / holes':'Slub / yarn knot',disposition:held&&r===2?'HOLD':'RELEASED'}));
  const pass=inspected-rejected;
  return {mo,buyer,style,colour,po,orderQty,allocation,table,planLayers,actualLayers,cutQty,marker,markerLength,spreadYards,numbered,inspected,rejected,pass,rolls,date:'03/11/2026',fabric:'AF=MK1500 RP(FS-Solid)',fabricType:'A',gross:38.43,net:37.75,ratio:[1,2,1,1],limit:40,
    bundles:Math.ceil(numbered/10),numberRange:numbered?`0001-${String(numbered).padStart(4,'0')}`:'Not started',
    stages:[
      {key:'fabric',name:'Fabric inspection',status:held?'HOLD':'COMPLETE',owner:'Fabric QA / warehouse',time:'08:10',summary:held?'One roll exceeds the demo 4-point limit; the lot is blocked.':'Four rolls inspected and released by Fabric QA.',checks:['Roll barcode and lot identity','Usable width, shade and 4-point score','Written lot disposition before issue'],record:`FI-${mo}-01`},
      {key:'spreading',name:'Spreading',status:held?'BLOCKED':'COMPLETE',owner:'Spreading Supervisor',time:held?'Not started':'09:05',summary:held?'Do not spread while the material hold is open.':`${actualLayers}/${planLayers} plies; ${spreadYards} yards spread by shade group.`,checks:['Relaxation and released-roll status','Face direction, tension and shade segregation','Ply count, lay length and marker alignment'],record:`SP-${mo}-01`},
      {key:'cutting',name:'Cutting',status:held?'BLOCKED':'COMPLETE',owner:'Cutting Supervisor / cutting QC',time:held?'Not started':'10:20',summary:held?'Cutting is blocked by the incoming-material decision.':`${cutQty} pieces cut using marker ${marker}; first-cut panel checked.`,checks:['Current marker and pattern revision','Notches, drill points and panel dimensions','Top / middle / bottom lay checks'],record:`CT-${mo}-01`},
      {key:'numbering',name:'Numbering / bundling',status:held?'BLOCKED':numbered<cutQty?'IN PROGRESS':'COMPLETE',owner:'Numbering / bundle clerk',time:held?'Not started':'10:45',summary:held?'No cut output available for numbering.':`${numbered}/${cutQty} pieces numbered; ${Math.max(0,cutQty-numbered)} awaiting numbering.`,checks:['Component pairs share size, shade and number','Bundle QR matches lay / roll / marker','Bundle quantities reconciled with cut pieces'],record:`BN-${mo}-01`},
      {key:'qc',name:'Cut-panel QC',status:held?'BLOCKED':rejected?'RECHECK':'IN PROGRESS',owner:'Cutting QC / QA leader',time:held?'Not started':'11:10',summary:held?'No inspected panels: upstream material release is pending.':`${inspected} checked; ${pass} passed, ${rejected} held for correction; ${numbered-inspected} numbered pieces not yet checked.`,checks:['Check dimensions and workmanship to order specification','Identify measurement and fabric defects separately','QA review and reinspection before release'],record:`QC-${mo}-01`},
    ],
    actions:held?[{issue:'Running crease / holes on roll R03',owner:'Fabric QA leader',next:'Segregate lot; obtain supplier disposition and reinspect replacement.',state:'OPEN',due:'11:30'}]:rejected?[{issue:i===0?'Two panels outside the measurement tolerance':'One panel with a damaged notch',owner:'Cutting Supervisor',next:'Keep affected panels on HOLD; replace or correct and return to QC.',state:'OPEN',due:'12:00'}]:[{issue:'Complete remaining panel-QC checks',owner:'Cutting QC',next:'Inspect remaining numbered output and submit the lot decision to QA.',state:'OPEN',due:'12:30'}],
  };
});

CUTTING_ORDERS[0].actions.push({issue: 'Cut output exceeds this table allocation by 5 pieces', owner: 'Cutting planner / QA leader', next: 'Reconcile 55 cut pieces against the 50-piece allocation; keep the extra 5 off the line until disposition is recorded.', state: 'OPEN', due: '12:00'});
