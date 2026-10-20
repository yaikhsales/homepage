export const QMS_SECTION_ROWS = [
 {id:"sample", area:"0",leader:"Sample Room Quality Leader",teams:[{label:"Sample Room",unknown:true}]},
 {id:"fabric",area:"1",leader:"Warehouse · Fabric Quality Leader",teams:[{label:"Fabric Warehouse",unknown:true}]},
 {id:"accessory",area:"2",leader:"Warehouse · Accessory Quality Leader",teams:[{label:"Accessory Warehouse",unknown:true}]},
 {id:"cutting",area:"3",leader:"Fabric Inspection & Cutting Quality Leader",teams:[{label:"Cutting checkers",min:5,max:10},{label:"Fabric inspection",unknown:true}]},
 {id:"print",area:"4",leader:"Printing & Embroidery Quality Leader",teams:[{label:"Printing / Embroidery",unknown:true}]},
 ...Array.from({length:6},(_,g)=>({id:"sewing-"+g,area:"5",leader:`Sewing Quality Leader · L${String(g*5+1).padStart(2,"0")}–L${String(g*5+5).padStart(2,"0")}`,supervisor:"Senior Quality Supervisor · Internal",note:"Target 15–20 checkers per leader. Five lines at 2–3 gives 10–15; extra coverage to reconcile.",teams:Array.from({length:5},(_,l)=>({label:"Line "+String(g*5+l+1).padStart(2,"0"),min:2,max:3}))})),
 ...Array.from({length:4},(_,g)=>({id:"finishing-"+g,area:"6",leader:`Finishing Quality Leader · ${g+1}`,note:"One leader per three finishing lines; last group covers line 10.",teams:[{label:`Finishing lines ${g*3+1}–${Math.min(10,g*3+3)}`,min:15,max:20}]})),
 ...Array.from({length:2},(_,i)=>({id:"packing-"+i,area:"7",leader:`Packaging Quality Leader · ${i+1}`,teams:[{label:"Assigned packing checkers",unknown:true}],note:"Two packaging leaders share a 5–10 checker team; the split is not assigned. Brand QOs follow final quality here."})),
 {id:"packing-pool",area:"7",shared:true,leader:"Packaging · shared checker pool",teams:[{label:"Packing checkers · 5–10 total across both leaders",min:5,max:10}],note:"Counted once, not 5–10 per packaging leader."},
 {id:"loading",area:"8",leader:"Loading Quality Leader",teams:[{label:"Loading",unknown:true}]},
 {id:"qa",area:"qa",leader:"QA auditors · department pool",teams:[{label:"QA · about 10 total",min:10,max:10}],note:"Allocate under area leaders; do not count ten again in every section."},
 ...Array.from({length:5},(_,i)=>({id:"qo-"+i,area:"qo",leader:`Brand QO · ${i+1}`,note:"Brand representative · warehouse / packaging / final quality. Brand name and reporting assignment to confirm.",teams:[{label:"QO support workers",min:1,max:2}]}))
];

export const QMS_LEADERS = QMS_SECTION_ROWS.filter(row => !["qa", "qo"].includes(row.area) && !row.shared).map(row => ({
  id: row.id,
  title: row.leader,
  area: row.area,
  coverage: row.id.startsWith("sewing-") ? "5 sewing lines · 2–3 checkers per line" : row.id.startsWith("finishing-") ? `${row.teams[0].label} · 15–20 checkers` : row.id.startsWith("packing-") ? "2 leaders share 5–10 checkers" : row.id === "cutting" ? "Cutting · 5–10 checkers" : row.id === "loading" ? "1 loading quality leader" : "Area quality coverage",
}));

export const QMS_PLANNING = {
  manager: 1, seniorSupervisors: "1–2", areaLeaders: 18,
  qaAuditors: 10, brandQos: 5, qoHelpers: "5–10",
  sewingLines: 30, sewingLeaders: 6, finishingLines: 10,
  finishingLeaders: 4, packagingLeaders: 2, loadingLeaders: 1,
};
