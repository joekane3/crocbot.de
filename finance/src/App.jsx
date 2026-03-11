import { useState, useMemo, useCallback } from "react";import { BarChart, Bar, ComposedChart, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

const PASS="doughnut";
function PasswordGate({onUnlock}){
  const[pw,setPw]=useState("");const[err,setErr]=useState(false);
  const check=()=>{if(pw===PASS){localStorage.setItem("kane-auth","1");onUnlock();}else{setErr(true);setPw("");}};
  return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"Inter,sans-serif",background:"#f8fafc"}}>
    <div style={{textAlign:"center",padding:40,background:"#fff",borderRadius:16,boxShadow:"0 4px 24px rgba(0,0,0,0.08)",minWidth:320}}>
      <div style={{fontSize:32,marginBottom:8}}>🔒</div>
      <h2 style={{margin:"0 0 4px",fontSize:18,color:"#1e293b"}}>Kane Financial Model</h2>
      <p style={{margin:"0 0 20px",fontSize:13,color:"#64748b"}}>Enter password to continue</p>
      <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false);}} onKeyDown={e=>e.key==="Enter"&&check()}
        placeholder="Password" autoFocus
        style={{width:"100%",padding:"10px 14px",borderRadius:8,border:err?"2px solid #ef4444":"1px solid #cbd5e1",fontSize:15,boxSizing:"border-box",outline:"none",marginBottom:12}}/>
      <button onClick={check} style={{width:"100%",padding:"10px 0",borderRadius:8,border:"none",background:"#3b82f6",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>Unlock</button>
      {err&&<p style={{color:"#ef4444",fontSize:12,marginTop:8}}>Wrong password</p>}
    </div>
  </div>);
}

const PRINCIPAL=750000, RATE=0.0288/12, PMT=2825;
const START={y:2024,m:12}, NOW={y:2026,m:3};
const MO=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const BASE_FEES={K:4457.80,P:6129.55,S:8358.46};
const DEF_EX={K:5542,P:5500,S:4000};
const FEE_INF=0.05, FEE_BASE=2026;
const YEARS=Array.from({length:30},(_,i)=>2026+i);
const ALLIANZ1_GUARANTEED=204960, ALLIANZ2_GUARANTEED=102478;
const ALLIANZ1_CONTRIB=463.17*12, ALLIANZ2_CONTRIB=231.58*12;
const AVIVA_CURRENT_GBP=166604.84, AVIVA_RETIREMENT_YEAR=2048;
const C_S_START={1:2034,2:2037,3:2039};
const PKV_TIERS={
  premium: {label:"Premium / Komfort",disc:1.00,color:"#7c3aed",desc:"Single room, Chefarzt, 100% dental, no deductible"},
  standard:{label:"Standard",         disc:0.75,color:"#2563eb",desc:"Double room, senior doctor, ~80% dental, ~€500/yr deductible. ~25% cheaper"},
  basis:   {label:"Basistarif",        disc:0.55,color:"#059669",desc:"Legally mandated minimum, GKV-equivalent. Cannot be refused. ~45% cheaper"},
};

function range(a,b,v){const o={};for(let y=a;y<=b;y++)o[y]=v;return o;}
const C1={...range(2027,2028,"K"),...range(2029,2033,"P"),...range(2034,2040,"S")};
const C2={...range(2030,2031,"K"),...range(2032,2036,"P"),...range(2037,2043,"S")};
function mkC3(birthYm){const[by]=birthYm.split("-").map(Number);const k=by+4;return{...range(k,k+1,"K"),...range(k+2,k+6,"P"),...range(k+7,k+13,"S")};}
const C3s={...range(2032,2033,"K"),...range(2034,2038,"P"),...range(2039,2045,"S")};
const LR={S:3,P:2,K:1};

function extraMult(ch,lv,yr){if(lv==="K"||lv==="P")return 1;const sy=yr-(C_S_START[ch]||2034)+1;return sy<=3?0.5:0;}
function estg(z){z=Math.floor(z);if(z<=12084)return 0;if(z<=17430){const y=(z-12084)/10000;return Math.floor((922.98*y+1400)*y);}if(z<=66760){const y=(z-17430)/10000;return Math.floor((181.19*y+2397)*y+1025.38);}if(z<=277825)return Math.floor(0.42*z-10602.13);return Math.floor(0.45*z-18936.88);}
function soliCalc(t){if(t<=16956)return 0;if(t<=18130)return Math.round((t-16956)*0.119);return Math.round(t*0.055);}
function calcHH(g1,g2,es1,es2,splitting){
  const bbg=90600, rv=g=>Math.round(Math.min(g,bbg)*0.093), av=g=>Math.round(Math.min(g,bbg)*0.013);
  if(splitting){
    const z1=Math.max(0,g1-Math.min(1230,g1)-36),z2=Math.max(0,g2-Math.min(1230,g2)-36),zt=z1+z2;
    const st=estg(Math.floor(zt/2))*2,ss=soliCalc(st/2)*2,r=zt>0?z1/zt:0.5;
    const t1=Math.round(st*r),t2=st-t1,s1=Math.round(ss*r),s2=ss-s1;
    const n1=g1-t1-s1-rv(g1)-av(g1)+es1,n2=g2-t2-s2-rv(g2)-av(g2)+es2;
    return{p1:{gross:g1,tax:t1,soli:s1,rv:rv(g1),av:av(g1),es:es1,ded:t1+s1+rv(g1)+av(g1),net:n1},
           p2:{gross:g2,tax:t2,soli:s2,rv:rv(g2),av:av(g2),es:es2,ded:t2+s2+rv(g2)+av(g2),net:n2},totalNet:n1+n2};
  }
  const calc=(g,es)=>{const z=Math.max(0,g-Math.min(1230,g)-36),t=estg(z),s=soliCalc(t),r=rv(g),a=av(g);return{gross:g,tax:t,soli:s,rv:r,av:a,es,ded:t+s+r+a,net:g-t-s-r-a+es};};
  const p1=calc(g1,es1),p2=calc(g2,es2);
  return{p1,p2,totalNet:p1.net+p2.net};
}
function mk(y,m){return y*12+m;}
function addM(y,m,n){const t=y*12+(m-1)+n;return{y:Math.floor(t/12),m:(t%12)+1};}
function fmt(n,d=0){return new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:d}).format(n);}
function fmtGBP(n){return new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0}).format(n);}
function fmtD(y,m){return MO[m-1]+" "+y;}
function pct(n,d){return d>0?((n/d)*100).toFixed(1)+"%":"—";}
function buildSched(sfn){
  const rows=[];let bal=PRINCIPAL;
  for(let i=0;i<720;i++){
    if(bal<=0)break;
    const {y,m}=addM(START.y,START.m,i);
    const int=bal*RATE,pri=Math.min(PMT-int,bal),son=Math.min(sfn(y,m),bal-pri),end=Math.max(0,bal-pri-son);
    rows.push({i,y,m,interest:int,principal:pri,sonder:son,bal:end,startBal:bal});
    bal=end;
  }
  return rows;
}
function calcFees(yr,c3,ex,c3Birth){
  const sc=[C1,C2,...(c3?[mkC3(c3Birth||"2028-06")]:[])];
  const en=sc.map((s,i)=>({ch:i+1,lv:s[yr]||null})).filter(c=>c.lv);
  if(!en.length)return{tuition:0,extra:0,det:[]};
  en.sort((a,b)=>(LR[b.lv]||0)-(LR[a.lv]||0));
  const disc=[1,.8,.6];
  const det=en.map((c,i)=>({...c,disc:disc[i],fee:BASE_FEES[c.lv]*Math.pow(1+FEE_INF,yr-FEE_BASE)*disc[i],extra:ex[c.lv]*Math.pow(1+FEE_INF,yr-FEE_BASE)*extraMult(c.ch,c.lv,yr)}));
  return{tuition:det.reduce((s,c)=>s+c.fee,0),extra:det.reduce((s,c)=>s+c.extra,0),det};
}
function projectPension(val,contrib,gr,from,to){
  const out=[];
  for(let y=from;y<=to;y++){val=val*(1+gr)+contrib;out.push({year:y,value:Math.round(val)});}
  return out;
}
function calcElterngeld(netMonthly,plus){
  const basis=Math.min(Math.round(netMonthly*0.67),1800);
  return plus?Math.round(basis*0.5)*12:basis*12;
}

function toYaml(s){
  const sonLines=s.planned.length
    ? s.planned.map(p=>"    - {year: "+p.y+", month: "+p.m+", pct: "+p.pct+"}").join("\n")
    : "    []";
  return ["# Kane Family Financial Model — Scenario","# Generated: "+new Date().toISOString().slice(0,10),"",
    "scenario:","  label: \""+s.scenarioLabel+"\"","","income:",
    "  joe: "+s.joe,"  kali: "+s.kali,"  splitting: "+s.splitting,"","mortgage:",
    "  sondertilgung:",sonLines,"","school:","  extraCosts:",
    "    kindergarten: "+s.ex.K,"    primary: "+s.ex.P,"    secondary: "+s.ex.S,
    "  thirdChild: "+s.c3,"  thirdChildBirth: "+s.c3Birth,"","health:","  pkvTier: "+s.pkvTier,"  premiums:",
    "    joe: "+s.pkv.joe,"    kali: "+s.pkv.kali,"    mariAnna: "+s.pkv.c1,
    "    nicholas: "+s.pkv.c2,"    child3: "+s.pkv.c3,"  growthRate: "+s.pkv.grow,"",
    "pensions:","  allianzGrowthRate: "+s.penGrowth,"  avivaGrowthRate: "+s.avivaGrowth,
    "  futureContributions:","    allianzEmployer: "+s.futureContrib.al1,
    "    allianzSalarySacrifice: "+s.futureContrib.al2,"","investments:",
    "  growthRate: "+s.invGrowth,"  fx:","    gbpEur: "+s.gbpEur,"    usdEur: "+s.usdEur,
    "  joe:","    scalableCapital: "+s.inv.joeScalable,"    tradeRepublicStocks: "+s.inv.joeTRStocks,
    "    tradeRepublicCash: "+s.inv.joeTRCash,"    pltrShares: "+s.inv.pltrShares,
    "    pltrPriceUsd: "+s.inv.pltrPrice,"  kali:","    tradeRepublicStocks: "+s.inv.kaliTRStocks,
    "    tradeRepublicCash: "+s.inv.kaliTRCash,"  property:",
    "    currentValue: "+s.inv.houseValue,"    annualAppreciation: "+s.inv.houseAppreciation,
  ].join("\n");
}
function parseYaml(text){
  const lines=text.split("\n"),vals={};let sec="";
  lines.forEach(line=>{
    const tr=line.trim();
    if(!tr||tr.startsWith("#"))return;
    const indent=line.search(/\S/);
    if(indent===0&&tr.endsWith(":")){sec=tr.slice(0,-1);return;}
    const kv=tr.match(/^([\w]+):\s*(.+)$/);
    if(kv)vals[sec+"."+kv[1]]=kv[2].replace(/^"|"$/g,"").trim();
  });
  const num=(k,d)=>vals[k]!==undefined?Number(vals[k]):d;
  const bool=(k,d)=>vals[k]!==undefined?vals[k]==="true":d;
  const str=(k,d)=>vals[k]!==undefined?vals[k]:d;
  const planned=[];
  const re=/-\s*\{year:\s*(\d+),\s*month:\s*(\d+),\s*pct:\s*([\d.]+)\}/g;
  let m;
  while((m=re.exec(text))!==null)
    planned.push({id:Date.now()+planned.length,y:Number(m[1]),m:Number(m[2]),pct:Number(m[3])});
  return{
    scenarioLabel:str("scenario.label","Loaded"),joe:num("income.joe",138951),kali:num("income.kali",80000),
    splitting:bool("income.splitting",true),planned,
    ex:{K:num("school.kindergarten",5542),P:num("school.primary",5500),S:num("school.secondary",4000)},
    c3:bool("school.thirdChild",false),c3Birth:str("school.thirdChildBirth","2028-06"),pkvTier:str("health.pkvTier","premium"),
    pkv:{joe:num("health.joe",992),kali:num("health.kali",900),c1:num("health.mariAnna",280),c2:num("health.nicholas",283),c3:num("health.child3",270),grow:num("health.growthRate",5)},
    penGrowth:num("pensions.allianzGrowthRate",4),avivaGrowth:num("pensions.avivaGrowthRate",6.2),
    futureContrib:{al1:num("pensions.allianzEmployer",0),al2:num("pensions.allianzSalarySacrifice",0)},
    invGrowth:num("investments.growthRate",7),gbpEur:num("investments.gbpEur",1.18),usdEur:num("investments.usdEur",0.92),
    inv:{joeScalable:num("investments.scalableCapital",820000),joeTRStocks:num("investments.tradeRepublicStocks",160000),
      joeTRCash:num("investments.tradeRepublicCash",20000),pltrShares:num("investments.pltrShares",300),
      pltrPrice:num("investments.pltrPriceUsd",156.20),kaliTRStocks:num("investments.tradeRepublicStocks",100000),
      kaliTRCash:num("investments.tradeRepublicCash",40000),houseValue:num("investments.currentValue",1600000),
      houseAppreciation:num("investments.annualAppreciation",2)},
  };
}

function AppInner(){
  const [tab,setTab]=useState("overview");
  const [scenarioLabel,setScenarioLabel]=useState("Base case 2026");
  const [c3,setC3]=useState(false);
  const [c3Birth,setC3Birth]=useState("2028-06");
  const [joe,setJoe]=useState(138951);
  const [kali,setKali]=useState(80000);
  const [splitting,setSplitting]=useState(true);
  const [hiddenSeries,setHiddenSeries]=useState({});
  const [planned,setPlanned]=useState([]);
  const [nid,setNid]=useState(1);
  const [showRows,setShowRows]=useState(48);
  const [ex,setEx]=useState(DEF_EX);
  const [pkv,setPkv]=useState({joe:992,kali:900,c1:280,c2:283,c3:270,grow:5});
  const [pkvTier,setPkvTier]=useState("premium");
  const [penGrowth,setPenGrowth]=useState(4);
  const [avivaGrowth,setAvivaGrowth]=useState(6.2);
  const [gbpEur,setGbpEur]=useState(1.18);
  const [usdEur,setUsdEur]=useState(0.92);
  const [futureContrib,setFutureContrib]=useState({al1:0,al2:0});
  const [inv,setInv]=useState({joeScalable:820000,joeTRStocks:160000,joeTRCash:20000,pltrShares:300,pltrPrice:156.20,kaliTRStocks:100000,kaliTRCash:40000,houseValue:1600000,houseAppreciation:2});
  const [invGrowth,setInvGrowth]=useState(7);
  const [loadMsg,setLoadMsg]=useState("");
  const [joeGrowth,setJoeGrowth]=useState(3);
  const [kaliGrowth,setKaliGrowth]=useState(3);
  const [workPlan,setWorkPlan]=useState([{id:1,person:"kali",startYear:2026,endYear:2027,mode:"part",pct:60,elterngeldPlus:false}]);
  const [wpNid,setWpNid]=useState(2);

  const getState=useCallback(()=>({scenarioLabel,joe,kali,splitting,planned,ex,c3,c3Birth,pkvTier,pkv,penGrowth,avivaGrowth,gbpEur,usdEur,futureContrib,inv,invGrowth}),[scenarioLabel,joe,kali,splitting,planned,ex,c3,c3Birth,pkvTier,pkv,penGrowth,avivaGrowth,gbpEur,usdEur,futureContrib,inv,invGrowth]);
  const handleSave=useCallback(()=>{
    const yaml=toYaml(getState());
    const blob=new Blob([yaml],{type:"text/yaml"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="kane-model-"+scenarioLabel.replace(/\s+/g,"-").toLowerCase()+".yml";
    a.click();URL.revokeObjectURL(a.href);
  },[getState,scenarioLabel]);
  const handleLoad=useCallback((e)=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      try{
        const p=parseYaml(ev.target.result);
        setScenarioLabel(p.scenarioLabel);setJoe(p.joe);setKali(p.kali);setSplitting(p.splitting);
        setPlanned(p.planned);setEx(p.ex);setC3(p.c3);if(p.c3Birth)setC3Birth(p.c3Birth);setPkvTier(p.pkvTier);setPkv(p.pkv);
        setPenGrowth(p.penGrowth);setAvivaGrowth(p.avivaGrowth);setGbpEur(p.gbpEur);setUsdEur(p.usdEur);
        setFutureContrib(p.futureContrib);setInv(p.inv);setInvGrowth(p.invGrowth);
        setLoadMsg("Loaded: "+p.scenarioLabel);
      }catch(err){setLoadMsg("Error: "+err.message);}
    };
    reader.readAsText(file);e.target.value="";
  },[]);

  const es1=useMemo(()=>540.59*12,[]);
  const es2=useMemo(()=>(pkv.kali/2)*12,[pkv.kali]);
  const tax=useMemo(()=>calcHH(joe,kali,es1,es2,splitting),[joe,kali,es1,es2,splitting]);

  const fxSon=useMemo(()=>({[mk(2025,12)]:PRINCIPAL*.05,[mk(2026,1)]:PRINCIPAL*.05}),[]);
  const sonMap=useMemo(()=>{const m={...fxSon};planned.forEach(s=>{const k=mk(s.y,s.m);m[k]=(m[k]||0)+PRINCIPAL*s.pct/100;});return m;},[planned,fxSon]);
  const withS=useMemo(()=>buildSched((y,m)=>sonMap[mk(y,m)]||0),[sonMap]);
  const noS=useMemo(()=>buildSched(()=>0),[]);
  const mStats=useMemo(()=>{
    const iW=withS.reduce((s,r)=>s+r.interest,0),iN=noS.reduce((s,r)=>s+r.interest,0);
    const lW=withS[withS.length-1],lN=noS[noS.length-1];
    const ci=withS.findIndex(r=>r.y===NOW.y&&r.m===NOW.m);
    return{saved:iN-iW,moSaved:noS.length-withS.length,payW:lW?fmtD(lW.y,lW.m):"—",payN:lN?fmtD(lN.y,lN.m):"—",curBal:withS[ci]?.bal??null,curBalNo:noS[ci]?.bal??null};
  },[withS,noS]);
  const noSM=useMemo(()=>{const m={};noS.forEach(r=>{m[r.y*12+r.m]=r;});return m;},[noS]);
  const rows=useMemo(()=>{let cs=0;return withS.map(r=>{const ns=noSM[r.y*12+r.m],d=(ns?.interest??0)-r.interest;cs+=d;return{...r,nsInt:ns?.interest??0,nsBal:ns?.bal??0,intD:d,cumS:cs};});},[withS,noSM]);
  const mByY=useMemo(()=>{const m={};withS.forEach(r=>{if(!m[r.y])m[r.y]={int:0,rep:0};m[r.y].int+=r.interest;m[r.y].rep+=r.principal+r.sonder;});return m;},[withS]);

  const pltrEur=useMemo(()=>inv.pltrShares*inv.pltrPrice*usdEur,[inv,usdEur]);
  const totalJoeInv=useMemo(()=>inv.joeScalable+inv.joeTRStocks+inv.joeTRCash+pltrEur,[inv,pltrEur]);
  const totalKaliInv=useMemo(()=>inv.kaliTRStocks+inv.kaliTRCash,[inv]);
  const totalHHInv=useMemo(()=>totalJoeInv+totalKaliInv,[totalJoeInv,totalKaliInv]);
  const invYears=useMemo(()=>{
    const gr=invGrowth/100,hgr=(inv.houseAppreciation||0)/100;
    return YEARS.map((y,i)=>{
      const houseVal=Math.round(inv.houseValue*Math.pow(1+hgr,i+1));
      const mortgageRemaining=withS.find(r=>r.y===y&&r.m===1)?.bal??(withS[withS.length-1]?.y<y?0:withS[0]?.bal??0);
      const equity=Math.max(0,houseVal-mortgageRemaining);
      const liquid=Math.round((totalHHInv-inv.joeTRCash-inv.kaliTRCash)*Math.pow(1+gr,i+1)+inv.joeTRCash+inv.kaliTRCash);
      return{year:y,joeScalable:Math.round(inv.joeScalable*Math.pow(1+gr,i+1)),joeTR:Math.round(inv.joeTRStocks*Math.pow(1+gr,i+1)),kaliTR:Math.round(inv.kaliTRStocks*Math.pow(1+gr,i+1)),pltr:Math.round(pltrEur*Math.pow(1+gr,i+1)),cash:inv.joeTRCash+inv.kaliTRCash,houseVal,mortgage:mortgageRemaining,equity,totalLiquid:liquid,totalWithHouse:liquid+equity};
    });
  },[inv,invGrowth,pltrEur,totalHHInv,withS]);

  const feeY=useMemo(()=>{const d=[];for(let y=2027;y<=2051;y++){const f2=calcFees(y,false,ex,c3Birth),f3=calcFees(y,true,ex,c3Birth);d.push({year:y,t2:f2.tuition,e2:f2.extra,tot2:f2.tuition+f2.extra,det2:f2.det,t3:f3.tuition,e3:f3.extra,tot3:f3.tuition+f3.extra,det3:f3.det});}return d;},[ex,c3Birth]);
  const feeSum=useMemo(()=>{const ct2=feeY.reduce((s,r)=>s+r.t2,0),ce2=feeY.reduce((s,r)=>s+r.e2,0),ct3=feeY.reduce((s,r)=>s+r.t3,0),ce3=feeY.reduce((s,r)=>s+r.e3,0);return{ct2,ce2,cum2:ct2+ce2,ct3,ce3,cum3:ct3+ce3};},[feeY]);
  const hlthY=useMemo(()=>{
    const m={},td=PKV_TIERS[pkvTier].disc;
    const c3by=parseInt(c3Birth.split("-")[0])||2028;
    YEARS.forEach(y=>{const gf=Math.pow(1+pkv.grow/100,y-2026);const j=pkv.joe*td*12*gf,k=pkv.kali*td*12*gf;const c1v=y<=2047?pkv.c1*td*12*gf:0,c2v=y<=2050?pkv.c2*td*12*gf:0,c3v=c3&&y>=c3by&&y<=c3by+25?pkv.c3*td*12*gf:0;m[y]={joe:j,kali:k,c1:c1v,c2:c2v,c3:c3v,total:j+k+c1v+c2v+(c3?c3v:0)};});
    return m;
  },[pkv,c3,c3Birth,pkvTier]);
  const penYears=useMemo(()=>{
    const gr=penGrowth/100,agr=avivaGrowth/100;
    const al1=projectPension(52000,futureContrib.al1,gr,2027,2057);
    const al2=projectPension(26000,futureContrib.al2,gr,2027,2057);
    const aviva=projectPension(AVIVA_CURRENT_GBP*gbpEur,0,agr,2027,AVIVA_RETIREMENT_YEAR);
    const avivaFull=[...aviva];const lastAviva=aviva[aviva.length-1]?.value||0;
    for(let y=AVIVA_RETIREMENT_YEAR+1;y<=2057;y++)avivaFull.push({year:y,value:lastAviva});
    return al1.map((r,i)=>({year:r.year,allianz1:r.value,allianz2:al2[i]?.value||0,aviva:avivaFull[i]?.value||0,total:r.value+(al2[i]?.value||0)+(avivaFull[i]?.value||0)}));
  },[penGrowth,avivaGrowth,gbpEur,futureContrib]);

  const workIncomeByYear=useMemo(()=>{
    return YEARS.map((y,i)=>{
      const joeGross=Math.round(joe*Math.pow(1+joeGrowth/100,i));
      const kaliGross=Math.round(kali*Math.pow(1+kaliGrowth/100,i));
      const joeEntry=[...workPlan].reverse().find(e=>e.person==="joe"&&y>=e.startYear&&y<=e.endYear);
      const kaliEntry=[...workPlan].reverse().find(e=>e.person==="kali"&&y>=e.startYear&&y<=e.endYear);
      const applyEntry=(gross,entry,baseNetMo)=>{
        if(!entry)return{gross,netAnnual:null,elterngeld:0,mode:"full",label:"Full work"};
        if(entry.mode==="off")return{gross:0,netAnnual:0,elterngeld:0,mode:"off",label:"Not working"};
        if(entry.mode==="leave"){const eg=calcElterngeld(baseNetMo,entry.elterngeldPlus||false);return{gross:0,netAnnual:eg,elterngeld:eg,mode:"leave",label:"Parental leave"};}
        if(entry.mode==="part"){const p=(entry.pct||50)/100;return{gross:Math.round(gross*p),netAnnual:null,elterngeld:0,mode:"part",label:"Part-time "+(entry.pct||50)+"%"};}
        return{gross,netAnnual:null,elterngeld:0,mode:"full",label:"Full work"};
      };
      const jW=applyEntry(joeGross,joeEntry,tax.p1.net/12);
      const kW=applyEntry(kaliGross,kaliEntry,tax.p2.net/12);
      const joeNet=jW.netAnnual!==null?jW.netAnnual:calcHH(jW.gross,0,es1,0,false).p1.net;
      const kaliNet=kW.netAnnual!==null?kW.netAnnual:calcHH(0,kW.gross,0,es2,false).p2.net;
      return{year:y,joeGross,kaliGross,joeMode:jW.mode,joeLabel:jW.label,kaliMode:kW.mode,kaliLabel:kW.label,joeNet:Math.round(joeNet),kaliNet:Math.round(kaliNet),totalNet:Math.round(joeNet+kaliNet),joeElterngeld:jW.elterngeld,kaliElterngeld:kW.elterngeld};
    });
  },[joe,kali,joeGrowth,kaliGrowth,workPlan,tax,es1,es2]);

  const workCashflow=useMemo(()=>YEARS.map((y,i)=>{
    const f=feeY.find(r=>r.year===y)||{t2:0,e2:0,t3:0,e3:0};
    const mo=mByY[y]||{int:0,rep:0};const hl=hlthY[y]||{total:0};
    const tu=c3?f.t3:f.t2,ex2=c3?f.e3:f.e2;
    const out=Math.round(mo.rep+mo.int+tu+ex2+hl.total);
    const wi=workIncomeByYear[i];
    return{year:y,out,inc:wi.totalNet,surplus:wi.totalNet-out,joeMode:wi.joeMode,kaliMode:wi.kaliMode,joeLabel:wi.joeLabel,kaliLabel:wi.kaliLabel,joeNet:wi.joeNet,kaliNet:wi.kaliNet};
  }),[feeY,mByY,hlthY,c3,c3Birth,workIncomeByYear]);

  const minJoeIncome=useMemo(()=>YEARS.map((y,i)=>{
    const f=feeY.find(r=>r.year===y)||{t2:0,e2:0,t3:0,e3:0};
    const mo=mByY[y]||{int:0,rep:0};const hl=hlthY[y]||{total:0};
    const tu=c3?f.t3:f.t2,ex2=c3?f.e3:f.e2;
    const out=Math.round(mo.rep+mo.int+tu+ex2+hl.total);
    const kaliNet=workIncomeByYear[i].kaliNet;
    const needed=Math.max(0,out-kaliNet);
    return{year:y,minGross:Math.round(needed/0.65),needed,kaliCoversAll:kaliNet>=out};
  }),[feeY,mByY,hlthY,c3,c3Birth,workIncomeByYear]);

  const cData=useMemo(()=>YEARS.map((y,i)=>{
    const f=feeY.find(r=>r.year===y)||{t2:0,e2:0,t3:0,e3:0};
    const mo=mByY[y]||{int:0,rep:0};const hl=hlthY[y]||{total:0};
    const tu=c3?f.t3:f.t2,ex2=c3?f.e3:f.e2;
    const out=Math.round(mo.rep+mo.int+tu+ex2+hl.total);
    const inc=workIncomeByYear[i]?.totalNet??Math.round(tax.totalNet);
    const totalLiquid=invYears[i]?.totalLiquid||0,houseEquity=invYears[i]?.equity||0,totalPension=penYears[i]?.total||0;
    return{year:y,rep:Math.round(mo.rep),int:Math.round(mo.int),tuition:Math.round(tu),extra:Math.round(ex2),health:Math.round(hl.total),out,inc,surplus:inc-out,totalLiquid,houseEquity,totalPension,totalWealth:totalLiquid+houseEquity+totalPension};
  }),[feeY,mByY,hlthY,c3,c3Birth,invYears,penYears,workIncomeByYear,tax]);

  const card=(l,v,col,sub)=>(<div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"11px 13px",flex:1,minWidth:140}}><div style={{fontSize:11,color:"#64748b",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.04em"}}>{l}</div><div style={{fontSize:16,fontWeight:700,color:col}}>{v}</div>{sub&&<div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{sub}</div>}</div>);
  const TH=(x={})=>({padding:"7px 9px",textAlign:"right",fontWeight:600,whiteSpace:"nowrap",position:"sticky",top:0,background:"#1e3a5f",color:"#fff",fontSize:11,...x});
  const TD=(x={})=>({padding:"5px 9px",textAlign:"right",borderBottom:"1px solid #f1f5f9",fontSize:11,...x});
  const TabBtn=(k,l)=>(<button key={k} onClick={()=>setTab(k)} style={{padding:"6px 12px",borderRadius:"7px 7px 0 0",border:"1px solid #e2e8f0",borderBottom:tab===k?"none":"1px solid #e2e8f0",background:tab===k?"#fff":"#f1f5f9",fontWeight:tab===k?700:400,color:tab===k?"#1e3a5f":"#64748b",cursor:"pointer",fontSize:12,marginRight:3}}>{l}</button>);
  const addSonRow=()=>{const lY=planned.length?Math.max(...planned.map(p=>p.y))+1:2027;setPlanned(p=>[...p,{id:nid,y:lY,m:12,pct:5}]);setNid(n=>n+1);};
  const updSon=(id,f,v)=>setPlanned(p=>p.map(s=>s.id===id?{...s,[f]:Number(v)}:s));
  const delSon=(id)=>setPlanned(p=>p.filter(s=>s.id!==id));
  const addWorkEntry=()=>{setWorkPlan(p=>[...p,{id:wpNid,person:"joe",startYear:2028,endYear:2030,mode:"part",pct:60,elterngeldPlus:false}]);setWpNid(n=>n+1);};
  const updWork=(id,f,v)=>setWorkPlan(p=>p.map(e=>e.id===id?{...e,[f]:v}:e));
  const delWork=(id)=>setWorkPlan(p=>p.filter(e=>e.id!==id));
  const SBar=({x,y,width,height,value})=>value?<rect x={x} y={y} width={width} height={height} fill={value>=0?"#059669":"#dc2626"} fillOpacity={0.8}/>:null;
  const legendClick=(data)=>{const k=data?.dataKey??data?.value;if(k)setHiddenSeries(h=>({...h,[k]:!h[k]}));};
  const legendFmt=(value,entry)=>{const k=entry?.dataKey??entry?.value;return <span style={{color:hiddenSeries[k]?"#94a3b8":"#374151",textDecoration:hiddenSeries[k]?"line-through":"none",cursor:"pointer"}}>{value}</span>;};
  const TaxCard=({lbl,col,r,pkvMo})=>(<div style={{flex:1,minWidth:220,background:"#fff",border:"2px solid "+col+"30",borderRadius:12,overflow:"hidden"}}><div style={{background:col,padding:"10px 14px",color:"#fff",fontWeight:700,fontSize:13}}>{lbl}</div>{[{l:"Gross",v:fmt(r.gross),b:true},{l:"Income tax",v:"−"+fmt(r.tax),c:"#dc2626"},{l:"Soli",v:r.soli>0?"−"+fmt(r.soli):"€0",c:r.soli>0?"#dc2626":"#059669"},{l:"RV",v:"−"+fmt(r.rv),c:"#ea580c"},{l:"AV",v:"−"+fmt(r.av),c:"#ea580c"},{l:"+ Employer PKV",v:"+"+fmt(r.es),c:"#059669"},{l:"Net annual",v:fmt(r.net),b:true,c:"#059669",big:true},{l:"Net monthly",v:fmt(r.net/12),b:true,c:"#1e40af",big:true}].map((it,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 14px",borderBottom:"1px solid #f1f5f9",background:it.big?"#f0fdf4":"#fff"}}><span style={{fontSize:12,color:"#64748b",fontWeight:it.b?600:400}}>{it.l}</span><span style={{fontSize:it.big?13:12,fontWeight:it.b?700:400,color:it.c||"#374151"}}>{it.v}</span></div>))}<div style={{padding:"7px 14px",background:"#fef3c7",fontSize:11,color:"#78350f"}}>PKV: {fmt(pkvMo*12)}/yr outgoing</div></div>);
  const invInput=(label,field,prefix,step)=>(<div key={field} style={{display:"flex",flexDirection:"column",gap:3,minWidth:140}}><label style={{fontSize:11,color:"#64748b",fontWeight:600}}>{label}</label><div style={{display:"flex",alignItems:"center",gap:4,background:"#fff",border:"1px solid #d1d5db",borderRadius:6,overflow:"hidden"}}><span style={{padding:"4px 6px",background:"#f8fafc",fontSize:12,color:"#64748b"}}>{prefix||"€"}</span><input type="number" value={inv[field]} step={step||1000} min={0} onChange={e=>setInv(v=>({...v,[field]:Number(e.target.value)}))} style={{flex:1,padding:"4px 7px",border:"none",fontSize:13,fontWeight:600,outline:"none",width:90}}/></div></div>);
  const modeLabel=(m,p)=>m==="full"?"Full-time":m==="part"?"Part-time "+(p||60)+"%":m==="leave"?"Unpaid leave":"Not working";

  return (
<div style={{fontFamily:"'Inter',sans-serif",padding:18,background:"#f8fafc",minHeight:"100vh"}}>
      <div style={{marginBottom:10}}>
        <h1 style={{margin:0,fontSize:21,color:"#1e3a5f"}}>🏠 Kane Family Financial Model</h1>
        <p style={{margin:"3px 0 0",color:"#64748b",fontSize:13}}>Munich · Mortgage · ESM · PKV · Pensions · Investments</p>
      </div>

      <div style={{background:"#1e3a5f",borderRadius:10,padding:"10px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
        <span style={{color:"#94a3b8",fontSize:11,fontWeight:600,textTransform:"uppercase"}}>Global</span>
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
          <div style={{position:"relative",width:36,height:18}}>
            <input type="checkbox" checked={c3} onChange={e=>setC3(e.target.checked)} style={{opacity:0,width:0,height:0,position:"absolute"}}/>
            <div onClick={()=>setC3(v=>!v)} style={{position:"absolute",inset:0,borderRadius:9,background:c3?"#10b981":"#475569",cursor:"pointer"}}><div style={{position:"absolute",width:12,height:12,borderRadius:"50%",background:"#fff",top:3,left:c3?21:3,transition:"left .2s"}}/></div>
          </div>
          <span style={{color:"#fff",fontSize:13,fontWeight:600}}>3rd child</span>
        </label>
        {c3&&<div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{color:"#94a3b8",fontSize:12}}>Born</span>
          <input type="month" value={c3Birth} onChange={e=>setC3Birth(e.target.value)} style={{background:"#fff",border:"1px solid #475569",borderRadius:6,padding:"2px 6px",fontSize:12,color:"#1e293b"}}/>
        </div>}
        <div style={{display:"flex",gap:10,marginLeft:"auto",flexWrap:"wrap"}}>
          {[["Joe",joe,setJoe],["Kali",kali,setKali]].map(([l,v,s])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{color:"#94a3b8",fontSize:12}}>{l}</span>
              <div style={{display:"flex",alignItems:"center",background:"#fff",borderRadius:6,overflow:"hidden",border:"1px solid #475569"}}>
                <span style={{padding:"4px 6px",fontSize:12,color:"#64748b",background:"#f8fafc"}}>€</span>
                <input type="number" value={v} min={0} step={1000} onChange={e=>s(Number(e.target.value))} style={{width:85,padding:"4px 7px",border:"none",fontSize:13,fontWeight:600,outline:"none"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <span style={{fontSize:11,color:"#64748b",fontWeight:600,textTransform:"uppercase"}}>Scenario</span>
        <input value={scenarioLabel} onChange={e=>setScenarioLabel(e.target.value)} style={{padding:"5px 10px",borderRadius:7,border:"1px solid #d1d5db",fontSize:13,fontWeight:600,color:"#1e3a5f",width:220}} placeholder="Scenario name..."/>
        <button onClick={handleSave} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #3b82f6",background:"#eff6ff",color:"#1e40af",fontWeight:700,fontSize:13,cursor:"pointer"}}>💾 Save .yml</button>
        <label style={{padding:"6px 14px",borderRadius:8,border:"1px solid #059669",background:"#f0fdf4",color:"#166534",fontWeight:700,fontSize:13,cursor:"pointer"}}>
          📂 Load .yml<input type="file" accept=".yml,.yaml" onChange={handleLoad} style={{display:"none"}}/>
        </label>
        {loadMsg&&<span style={{fontSize:12,color:loadMsg.startsWith("Loaded")?"#166534":"#dc2626",fontWeight:600}}>{loadMsg}</span>}
      </div>

      <div style={{marginBottom:0,display:"flex",flexWrap:"wrap"}}>
        {TabBtn("overview","📊 Overview")}
        {TabBtn("work","👶 Work & Life")}
        {TabBtn("income","💶 Income & Tax")}
        {TabBtn("mortgage","🏠 Mortgage")}
        {TabBtn("school","🎒 School")}
        {TabBtn("health","🏥 Health")}
        {TabBtn("pensions","🧓 Pensions")}
        {TabBtn("investments","📈 Investments")}
      </div>

      <div style={{background:"#fff",borderRadius:"0 8px 8px 8px",border:"1px solid #e2e8f0",padding:18}}>

      {tab==="work"&&<>
        <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:12}}>Salary growth assumptions</div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
            {[["Joe annual growth",joeGrowth,setJoeGrowth,joe],["Kali annual growth",kaliGrowth,setKaliGrowth,kali]].map(([l,v,s,base])=>(
              <div key={l} style={{display:"flex",flexDirection:"column",gap:3,minWidth:220}}>
                <label style={{fontSize:12,fontWeight:600,color:"#374151"}}>{l}</label>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <input type="number" value={v} min={0} max={20} step={0.5} onChange={e=>s(Number(e.target.value))} style={{width:60,padding:"5px 8px",borderRadius:6,border:"1px solid #d1d5db",fontSize:14,fontWeight:600}}/>
                  <span style={{fontSize:13,color:"#64748b"}}>%/yr</span>
                </div>
                <div style={{fontSize:11,color:"#94a3b8"}}>{"Now: "+fmt(base)+" → 2036: "+fmt(Math.round(base*Math.pow(1+v/100,10)))}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"#9a3412",marginBottom:4}}>📅 Work & leave planner</div>
          <div style={{fontSize:11,color:"#92400e",marginBottom:12}}>Model periods of reduced hours or career breaks. Use part-time to model a 3-day week (60%), compressed hours, or phased return after a child.</div>
          {workPlan.map(e=>(
            <div key={e.id} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:10,flexWrap:"wrap",background:"#fef9f0",borderRadius:8,padding:"10px 12px",border:"1px solid #fde68a"}}>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <label style={{fontSize:11,color:"#92400e",fontWeight:600}}>Person</label>
                <select value={e.person} onChange={ev=>updWork(e.id,"person",ev.target.value)} style={{padding:"4px 7px",borderRadius:6,border:"1px solid #d1d5db",fontSize:13}}>
                  <option value="joe">Joe</option>
                  <option value="kali">Kali</option>
                </select>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <label style={{fontSize:11,color:"#92400e",fontWeight:600}}>From</label>
                <input type="number" value={e.startYear} min={2026} max={2055} onChange={ev=>updWork(e.id,"startYear",Number(ev.target.value))} style={{width:68,padding:"4px 7px",borderRadius:6,border:"1px solid #d1d5db",fontSize:13}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <label style={{fontSize:11,color:"#92400e",fontWeight:600}}>To</label>
                <input type="number" value={e.endYear} min={e.startYear} max={2055} onChange={ev=>updWork(e.id,"endYear",Number(ev.target.value))} style={{width:68,padding:"4px 7px",borderRadius:6,border:"1px solid #d1d5db",fontSize:13}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <label style={{fontSize:11,color:"#92400e",fontWeight:600}}>Mode</label>
                <select value={e.mode} onChange={ev=>updWork(e.id,"mode",ev.target.value)} style={{padding:"4px 7px",borderRadius:6,border:"1px solid #d1d5db",fontSize:13}}>
                  <option value="full">Full-time (5 days)</option>
                  <option value="part">Reduced hours / part-time</option>
                  <option value="leave">Unpaid leave / sabbatical</option>
                  <option value="off">Not working</option>
                </select>
              </div>
              {e.mode==="part"&&(
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  <label style={{fontSize:11,color:"#92400e",fontWeight:600}}>% of salary</label>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <input type="number" value={e.pct||60} min={10} max={90} step={10} onChange={ev=>updWork(e.id,"pct",Number(ev.target.value))} style={{width:52,padding:"4px 7px",borderRadius:6,border:"1px solid #d1d5db",fontSize:13}}/>
                    <span style={{fontSize:12,color:"#64748b"}}>%</span>
                    <span style={{fontSize:11,color:"#94a3b8"}}>{e.pct===60?"≈ 3 days/wk":e.pct===80?"≈ 4 days/wk":e.pct===40?"≈ 2 days/wk":""}</span>
                  </div>
                </div>
              )}
              {e.mode==="leave"&&(
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  <label style={{fontSize:11,color:"#92400e",fontWeight:600}}>Elterngeld</label>
                  <div style={{padding:"5px 9px",background:"#fef2f2",borderRadius:6,fontSize:11,color:"#dc2626",maxWidth:200}}>
                    Not available — joint income exceeds €200k threshold (since Apr 2024)
                  </div>
                </div>
              )}
              <div style={{display:"flex",flexDirection:"column",gap:2,justifyContent:"flex-end"}}>
                <label style={{fontSize:11,color:"transparent"}}>x</label>
                <button onClick={()=>delWork(e.id)} style={{background:"#fee2e2",border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",color:"#dc2626",fontSize:13}}>✕</button>
              </div>
            </div>
          ))}
          <button onClick={addWorkEntry} style={{background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:6,padding:"5px 13px",cursor:"pointer",fontSize:13,color:"#92400e",fontWeight:600}}>+ Add period</button>
          <p style={{fontSize:11,color:"#92400e",margin:"8px 0 0"}}>60% = ~3 days/wk · 80% = ~4 days/wk · 40% = ~2 days/wk. Elterngeld not modelled — joint income exceeds €200k threshold. Unpaid leave = €0 income for that period.</p>
        </div>

        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
          {card("Deficit years (work plan)",workCashflow.filter(r=>r.surplus<0&&r.out>0).length+" yrs","#dc2626","With leave periods")}
          {card("Worst surplus",fmt(Math.min(...workCashflow.filter(r=>r.out>0).map(r=>r.surplus))),"#ea580c","Annual")}
        </div>

        <div style={{background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",padding:14,marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:8}}>Annual surplus / deficit under your work plan</div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={workCashflow} margin={{top:4,right:10,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="year" tick={{fontSize:10}} interval={2}/>
              <YAxis tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"} tick={{fontSize:10}} width={52}/>
              <Tooltip formatter={(v,n)=>[fmt(v),n]} labelFormatter={y=>{const r=workCashflow.find(d=>d.year===y);return y+(r?" — Joe: "+r.joeLabel+", Kali: "+r.kaliLabel:"");}}/>
              <ReferenceLine y={0} stroke="#374151" strokeWidth={2}/>
              <Bar dataKey="out" name="Total outgoings" fill="#ef4444" opacity={0.7} isAnimationActive={false}/>
              <Line type="monotone" dataKey="inc" name="Household income" stroke="#059669" strokeWidth={2.5} dot={false} isAnimationActive={false}/>
              <Line type="monotone" dataKey="surplus" name="Surplus/Deficit" stroke="#0369a1" strokeWidth={2} dot={false} strokeDasharray="4 2" isAnimationActive={false}/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",overflow:"hidden"}}>
          <div style={{overflowX:"auto",maxHeight:380,overflowY:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                <th style={TH({textAlign:"left"})}>Year</th>
                <th style={TH({color:"#bfdbfe"})}>Joe status</th>
                <th style={TH({color:"#fde68a"})}>Kali status</th>
                <th style={TH()}>Joe net</th>
                <th style={TH()}>Kali net</th>
                <th style={TH({background:"#065f46"})}>HH income</th>
                <th style={TH({background:"#1e40af"})}>Outgoings</th>
                <th style={TH({background:"#065f46"})}>Surplus</th>
              </tr></thead>
              <tbody>{workCashflow.map((r,i)=>{
                const neg=r.surplus<0&&r.out>0;
                const mc=(m)=>m==="leave"?"#7c3aed":m==="off"?"#dc2626":m==="part"?"#b45309":"#059669";
                return (
                  <tr key={r.year} style={{background:neg?"#fef2f2":i%2===0?"#fff":"#f8fafc"}}>
                    <td style={{...TD({textAlign:"left"}),fontWeight:600}}>{r.year}</td>
                    <td style={TD({color:mc(r.joeMode),fontWeight:600})}>{r.joeLabel}</td>
                    <td style={TD({color:mc(r.kaliMode),fontWeight:600})}>{r.kaliLabel}</td>
                    <td style={TD({color:"#3b82f6"})}>{fmt(r.joeNet)}</td>
                    <td style={TD({color:"#f59e0b"})}>{fmt(r.kaliNet)}</td>
                    <td style={TD({color:"#059669",fontWeight:700})}>{fmt(r.inc)}</td>
                    <td style={TD({color:"#1e40af"})}>{fmt(r.out)}</td>
                    <td style={TD({color:neg?"#dc2626":"#059669",fontWeight:700})}>{fmt(r.surplus)}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </div>
        <p style={{fontSize:11,color:"#94a3b8",marginTop:8}}>Part-time uses simplified tax recalculation. Elterngeld not available at this household income (joint taxable income exceeds €200k threshold since Apr 2024). Not financial/legal advice.</p>
      </>}

      {tab==="overview"&&<>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
          {card("Net income/mo",fmt(tax.totalNet/12),"#059669",fmt(tax.totalNet)+"/yr")}
          {card("Total net worth",fmt(inv.houseValue-(mStats.curBal||0)+totalHHInv),"#1e40af","Property equity + liquid")}
          {card("Pension pot est.",fmt(52000+26000+AVIVA_CURRENT_GBP*gbpEur),"#7c3aed","Allianz + Aviva today")}
          {card("Tightest surplus",fmt(Math.min(...cData.filter(r=>r.out>0).map(r=>r.surplus))),"#dc2626","Annual worst year")}
          {card("Deficit years",cData.filter(r=>r.out>0&&r.surplus<0).length+" yrs","#ea580c","")}
        </div>
        <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,padding:14,marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:14,color:"#9a3412",marginBottom:10}}>🧓 Retirement thresholds</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:10}}>
            <div style={{background:"#fff",border:"1px solid #fde68a",borderRadius:8,padding:10}}>
              <div style={{fontSize:11,color:"#92400e",fontWeight:600,marginBottom:3}}>2047 • Age 57</div>
              <div style={{fontSize:12,color:"#78350f",lineHeight:"1.4"}}>UK pension minimum age<br/><span style={{fontSize:11,color:"#a16207"}}>Aviva accessible from Apr 2028</span></div>
            </div>
            <div style={{background:"#fff",border:"1px solid #fde68a",borderRadius:8,padding:10}}>
              <div style={{fontSize:11,color:"#92400e",fontWeight:600,marginBottom:3}}>2048 • Age 58</div>
              <div style={{fontSize:12,color:"#78350f",lineHeight:"1.4"}}>Aviva retirement year<br/><span style={{fontSize:11,color:"#a16207"}}>12 July 2048 • UK pension</span></div>
            </div>
            <div style={{background:"#fff",border:"1px solid #bfdbfe",borderRadius:8,padding:10}}>
              <div style={{fontSize:11,color:"#1e40af",fontWeight:600,marginBottom:3}}>2052 • Age 62</div>
              <div style={{fontSize:12,color:"#1e3a8a",lineHeight:"1.4"}}>BAV early access<br/><span style={{fontSize:11,color:"#3730a3"}}>Allianz pensions accessible</span></div>
            </div>
            <div style={{background:"#fff",border:"1px solid #bfdbfe",borderRadius:8,padding:10}}>
              <div style={{fontSize:11,color:"#1e40af",fontWeight:600,marginBottom:3}}>2057 • Age 67</div>
              <div style={{fontSize:12,color:"#1e3a8a",lineHeight:"1.4"}}>German state pension age<br/><span style={{fontSize:11,color:"#3730a3"}}>Allianz contracts mature</span></div>
            </div>
          </div>
          <div style={{marginTop:8,fontSize:11,color:"#92400e",fontStyle:"italic"}}>Joe's birth year: 1990 • BAV = Betriebliche Altersversorgung (occupational pension)</div>
        </div>
        <div style={{background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",padding:14,marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:8}}>Annual outgoings vs net salary income</div>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={cData} margin={{top:4,right:10,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="year" tick={{fontSize:10}} interval={2}/>
              <YAxis tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"} tick={{fontSize:10}} width={52}/>
              <Tooltip formatter={(v,n)=>[fmt(v),n]}/>
              <Legend wrapperStyle={{fontSize:11}} onClick={legendClick} formatter={legendFmt}/>
              <Bar dataKey="rep"     name="Mortgage repayment" fill="#3b82f6" stackId="a" hide={!!hiddenSeries["rep"]}     isAnimationActive={false}/>
              <Bar dataKey="int"     name="Mortgage interest"  fill="#93c5fd" stackId="a" hide={!!hiddenSeries["int"]}     isAnimationActive={false}/>
              <Bar dataKey="tuition" name="Tuition"            fill="#f59e0b" stackId="a" hide={!!hiddenSeries["tuition"]} isAnimationActive={false}/>
              <Bar dataKey="extra"   name="School extras"      fill="#ea580c" stackId="a" hide={!!hiddenSeries["extra"]}   isAnimationActive={false}/>
              <Bar dataKey="health"  name="PKV"                fill="#a855f7" stackId="a" hide={!!hiddenSeries["health"]}  isAnimationActive={false} radius={[3,3,0,0]}/>
              <Line type="monotone" dataKey="inc" name="Net salary income" stroke="#059669" strokeWidth={2} dot={false} strokeDasharray="5 3" hide={!!hiddenSeries["inc"]} isAnimationActive={false}/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",padding:14,marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:6}}>Annual surplus / deficit</div>
          <ResponsiveContainer width="100%" height={110}>
            <ComposedChart data={cData} margin={{top:4,right:10,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="year" tick={{fontSize:10}} interval={2}/>
              <YAxis tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"} tick={{fontSize:10}} width={52}/>
              <Tooltip formatter={(v)=>[fmt(v),"Surplus"]}/>
              <ReferenceLine y={0} stroke="#374151" strokeWidth={2}/>
              <Bar dataKey="surplus" shape={SBar} isAnimationActive={false}/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",padding:14,marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:8}}>Total wealth over time</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cData} margin={{top:4,right:10,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="year" tick={{fontSize:10}} interval={2}/>
              <YAxis tickFormatter={v=>"€"+(v/1e6).toFixed(1)+"M"} tick={{fontSize:10}} width={52}/>
              <Tooltip formatter={(v,n)=>[fmt(v),n]}/>
              <Legend wrapperStyle={{fontSize:11}} onClick={legendClick} formatter={legendFmt}/>
              <Line type="monotone" dataKey="houseEquity"  name="House equity"       stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="4 2" hide={!!hiddenSeries["houseEquity"]}  isAnimationActive={false}/>
              <Line type="monotone" dataKey="totalLiquid"  name="Liquid investments" stroke="#0ea5e9" strokeWidth={2} dot={false} strokeDasharray="4 2" hide={!!hiddenSeries["totalLiquid"]}  isAnimationActive={false}/>
              <Line type="monotone" dataKey="totalPension" name="Pension pot"         stroke="#a855f7" strokeWidth={2} dot={false} strokeDasharray="4 2" hide={!!hiddenSeries["totalPension"]} isAnimationActive={false}/>
              <Line type="monotone" dataKey="totalWealth"  name="Total wealth"        stroke="#0369a1" strokeWidth={2.5} dot={false}                     hide={!!hiddenSeries["totalWealth"]}  isAnimationActive={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",overflow:"hidden"}}>
          <div style={{overflowX:"auto",maxHeight:340,overflowY:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                <th style={TH({textAlign:"left"})}>Year</th><th style={TH()}>Repayment</th><th style={TH({color:"#bfdbfe"})}>Int.</th>
                <th style={TH({color:"#fde68a"})}>Tuition</th><th style={TH({color:"#fed7aa"})}>Extras</th><th style={TH({color:"#e9d5ff"})}>PKV</th>
                <th style={TH({background:"#1e40af"})}>Out</th><th style={TH({background:"#065f46"})}>Salary</th><th style={TH({background:"#065f46"})}>Surplus</th>
                <th style={TH({background:"#0369a1",color:"#6ee7b7"})}>House eq.</th><th style={TH({background:"#0369a1",color:"#bae6fd"})}>Liquid</th>
                <th style={TH({background:"#0369a1",color:"#e9d5ff"})}>Pensions</th><th style={TH({background:"#0369a1"})}>Total wealth</th>
              </tr></thead>
              <tbody>{cData.map((r,i)=>{const neg=r.surplus<0&&r.out>0;return(<tr key={r.year} style={{background:neg?"#fef2f2":i%2===0?"#fff":"#f8fafc"}}>
                <td style={{...TD({textAlign:"left"}),fontWeight:600}}>{r.year}</td>
                <td style={TD({color:"#3b82f6",fontWeight:600})}>{r.rep>0?fmt(r.rep):"—"}</td>
                <td style={TD({color:"#93c5fd"})}>{r.int>0?fmt(r.int):"—"}</td>
                <td style={TD({color:"#b45309"})}>{r.tuition>0?fmt(r.tuition):"—"}</td>
                <td style={TD({color:"#ea580c"})}>{r.extra>0?fmt(r.extra):"—"}</td>
                <td style={TD({color:"#a855f7"})}>{r.health>0?fmt(r.health):"—"}</td>
                <td style={TD({color:"#1e40af",fontWeight:700})}>{r.out>0?fmt(r.out):"—"}</td>
                <td style={TD({color:"#059669",fontWeight:600})}>{fmt(r.inc)}</td>
                <td style={TD({color:neg?"#dc2626":"#059669",fontWeight:700})}>{fmt(r.surplus)}</td>
                <td style={TD({color:"#10b981"})}>{fmt(r.houseEquity)}</td>
                <td style={TD({color:"#0ea5e9"})}>{fmt(r.totalLiquid)}</td>
                <td style={TD({color:"#a855f7"})}>{fmt(r.totalPension)}</td>
                <td style={TD({color:"#0369a1",fontWeight:700})}>{fmt(r.totalWealth)}</td>
              </tr>);})}</tbody>
            </table>
          </div>
        </div>
      </>}

      {tab==="income"&&<>
        <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:8,padding:"9px 14px",marginBottom:14,fontSize:12,color:"#0369a1"}}>Salaries set in the <strong>Global Settings bar</strong> above.</div>
        <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:10}}>Tax assessment</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[["true","Zusammenveranlagung (Splitting)"],["false","Einzelveranlagung (IV/IV)"]].map(([v,l])=>(
              <button key={v} onClick={()=>setSplitting(v==="true")} style={{padding:"6px 13px",borderRadius:8,border:"1px solid",fontSize:13,cursor:"pointer",borderColor:(splitting===(v==="true"))?"#3b82f6":"#d1d5db",background:(splitting===(v==="true"))?"#eff6ff":"#fff",color:(splitting===(v==="true"))?"#1e40af":"#374151",fontWeight:(splitting===(v==="true"))?700:400}}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
          {card("Household gross",fmt(joe+kali),"#374151",fmt(joe)+" + "+fmt(kali))}
          {card("Household net",fmt(tax.totalNet),"#059669","Post-tax incl. employer PKV sub")}
          {card("Monthly net",fmt(tax.totalNet/12),"#1e40af","Before own PKV")}
          {card("Effective rate",pct((joe+kali)-tax.totalNet+(es1+es2),joe+kali),"#64748b","Deductions/gross")}
        </div>
        <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:14}}>
          <TaxCard lbl={"Joe — "+fmt(joe)} col="#3b82f6" r={tax.p1} pkvMo={pkv.joe}/>
          <TaxCard lbl={"Kali — "+fmt(kali)} col="#f59e0b" r={tax.p2} pkvMo={pkv.kali}/>
        </div>
        {splitting&&(()=>{const ns=calcHH(joe,kali,es1,es2,false),b=tax.totalNet-ns.totalNet;return b>0?(<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:12,fontSize:13,color:"#166534"}}>Ehegattensplitting saves {fmt(b)}/yr ({fmt(b/12)}/mo)</div>):null;})()}
      </>}

      {tab==="mortgage"&&<>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
          {card("Balance Mar 2026",fmt(mStats.curBal),"#1e40af")}
          {card("Balance w/o Sonder.",fmt(mStats.curBalNo),"#64748b","Diff: "+fmt((mStats.curBalNo??0)-(mStats.curBal??0)))}
          {card("Interest Saved",fmt(mStats.saved),"#059669",mStats.moSaved+" months earlier")}
          {card("Payoff",mStats.payW,"#7c3aed","vs "+mStats.payN+" without")}
        </div>
        <div style={{display:"flex",gap:14,marginBottom:14,flexWrap:"wrap"}}>
          <div style={{flex:2,minWidth:280,background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",padding:14}}>
            <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:8}}>Balance</div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={rows.filter((_,i)=>i%3===0)} margin={{top:4,right:8,left:0,bottom:0}}>
                <defs><linearGradient id="gW" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient><linearGradient id="gN" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/><stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="y" tick={{fontSize:10}} interval={15}/><YAxis tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"} tick={{fontSize:10}} width={52}/>
                <Tooltip formatter={(v,n)=>[fmt(v),n]} labelFormatter={(_,p)=>p[0]?fmtD(p[0].payload.y,p[0].payload.m):""}/>
                <Legend wrapperStyle={{fontSize:11}}/><ReferenceLine x={NOW.y} stroke="#f59e0b" strokeDasharray="4 3" label={{value:"Now",fontSize:10,fill:"#f59e0b"}}/>
                <Area type="monotone" dataKey="nsBal" name="Without Sonder." stroke="#94a3b8" fill="url(#gN)" strokeWidth={2} dot={false}/>
                <Area type="monotone" dataKey="bal"   name="With Sonder."    stroke="#3b82f6" fill="url(#gW)" strokeWidth={2} dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{flex:1,minWidth:220,background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",padding:14}}>
            <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:8}}>Monthly Interest</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={rows.filter((_,i)=>i%3===0)} margin={{top:4,right:8,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="y" tick={{fontSize:10}} interval={15}/><YAxis tickFormatter={v=>"€"+(v/1000).toFixed(1)+"k"} tick={{fontSize:10}} width={50}/>
                <Tooltip formatter={(v,n)=>[fmt(v,0),n]} labelFormatter={(_,p)=>p[0]?fmtD(p[0].payload.y,p[0].payload.m):""}/>
                <Legend wrapperStyle={{fontSize:11}}/>
                <Line type="monotone" dataKey="nsInt"    name="Without"      stroke="#94a3b8" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="interest" name="With Sonder." stroke="#ef4444" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"#92400e",marginBottom:10}}>Sondertilgung Planner</div>
          <div style={{display:"flex",gap:10,marginBottom:10,flexWrap:"wrap"}}>
            {[{l:"Dec 2025",a:37500},{l:"Jan 2026",a:37500}].map(s=>(<div key={s.l} style={{background:"#fef3c7",borderRadius:6,padding:"5px 11px",fontSize:12,color:"#78350f"}}>✅ <strong>{s.l}</strong> — {fmt(s.a)} paid</div>))}
          </div>
          {planned.map(s=>(<div key={s.id} style={{display:"flex",alignItems:"center",gap:7,marginBottom:7,flexWrap:"wrap"}}>
            <span style={{fontSize:12,color:"#78350f",minWidth:52}}>Planned:</span>
            <select value={s.m} onChange={e=>updSon(s.id,"m",e.target.value)} style={{padding:"3px 6px",borderRadius:6,border:"1px solid #d1d5db",fontSize:13}}>{MO.map((n,i)=><option key={i} value={i+1}>{n}</option>)}</select>
            <input type="number" value={s.y} min={2026} max={2060} onChange={e=>updSon(s.id,"y",e.target.value)} style={{width:68,padding:"3px 6px",borderRadius:6,border:"1px solid #d1d5db",fontSize:13}}/>
            <input type="number" value={s.pct} min={0.5} max={10} step={0.5} onChange={e=>updSon(s.id,"pct",e.target.value)} style={{width:52,padding:"3px 6px",borderRadius:6,border:"1px solid #d1d5db",fontSize:13}}/>
            <span style={{fontSize:12,color:"#78350f"}}>% = <strong>{fmt(PRINCIPAL*s.pct/100)}</strong></span>
            <button onClick={()=>delSon(s.id)} style={{background:"#fee2e2",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",color:"#dc2626",fontSize:13}}>✕</button>
          </div>))}
          <button onClick={addSonRow} style={{marginTop:4,background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:6,padding:"5px 13px",cursor:"pointer",fontSize:13,color:"#92400e",fontWeight:600}}>+ Add Sondertilgung</button>
        </div>
        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",overflow:"hidden"}}>
          <div style={{overflowX:"auto",maxHeight:440,overflowY:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["Month","Opening","Interest","Principal","Sondert.","Closing","Bal(noS)","Int Saved","Cum Saved"].map((h,i)=>(<th key={i} style={TH({textAlign:i===0?"left":"right"})}>{h}</th>))}</tr></thead>
              <tbody>{rows.slice(0,showRows).map(r=>{
                const isCur=r.y===NOW.y&&r.m===NOW.m,isSon=r.sonder>0;
                return(<tr key={r.i} style={{background:isCur?"#dbeafe":isSon?"#fefce8":r.i%2===0?"#fff":"#f8fafc",fontWeight:isCur?700:"normal"}}>
                  <td style={{...TD({textAlign:"left"}),color:isCur?"#1e40af":"#374151"}}>{fmtD(r.y,r.m)}{isCur?" ◀":""}</td>
                  <td style={TD()}>{fmt(r.startBal)}</td><td style={TD({color:"#dc2626"})}>{fmt(r.interest,0)}</td>
                  <td style={TD()}>{fmt(r.principal,0)}</td>
                  <td style={TD({color:isSon?"#b45309":"#cbd5e1",fontWeight:isSon?700:"normal"})}>{isSon?fmt(r.sonder):"—"}</td>
                  <td style={TD({fontWeight:600})}>{fmt(r.bal)}</td><td style={TD({color:"#64748b"})}>{fmt(r.nsBal)}</td>
                  <td style={TD({color:r.intD>0?"#059669":"#94a3b8"})}>{r.intD>0.01?fmt(r.intD,0):"—"}</td>
                  <td style={TD({color:r.cumS>0?"#059669":"#94a3b8",fontWeight:600})}>{r.cumS>0.01?fmt(r.cumS):"—"}</td>
                </tr>);
              })}</tbody>
            </table>
          </div>
          <div style={{padding:"9px 14px",borderTop:"1px solid #e2e8f0",display:"flex",gap:7,alignItems:"center"}}>
            <span style={{fontSize:11,color:"#64748b"}}>Showing {Math.min(showRows,rows.length)} of {rows.length} months</span>
            {showRows<rows.length&&<button onClick={()=>setShowRows(r=>r+48)} style={{padding:"3px 9px",borderRadius:6,border:"1px solid #d1d5db",background:"#f8fafc",cursor:"pointer",fontSize:11}}>+4 yrs</button>}
            {showRows<rows.length&&<button onClick={()=>setShowRows(rows.length)} style={{padding:"3px 9px",borderRadius:6,border:"1px solid #d1d5db",background:"#f8fafc",cursor:"pointer",fontSize:11}}>All</button>}
            {showRows>48&&<button onClick={()=>setShowRows(48)} style={{padding:"3px 9px",borderRadius:6,border:"1px solid #d1d5db",background:"#f8fafc",cursor:"pointer",fontSize:11}}>Reset</button>}
          </div>
        </div>
      </>}

      {tab==="school"&&<>
        <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:8,padding:"9px 14px",marginBottom:14,fontSize:12,color:"#0369a1"}}>3rd child toggle in <strong>Global Settings bar</strong> — currently <strong>{c3?"ON":"OFF"}</strong>.</div>
        <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"#9a3412",marginBottom:10}}>Extra costs (hort, food, travel) — 2026 base</div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
            {[["K","Kindergarten"],["P","Primary"],["S","Secondary S1-S3 only"]].map(([k,l])=>(
              <div key={k} style={{display:"flex",flexDirection:"column",gap:3}}>
                <label style={{fontSize:11,color:"#64748b",textTransform:"uppercase"}}>{l}</label>
                <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:13}}>€</span>
                  <input type="number" value={ex[k]} min={0} step={100} onChange={e=>setEx(x=>({...x,[k]:Number(e.target.value)}))} style={{width:85,padding:"4px 7px",borderRadius:6,border:"1px solid #d1d5db",fontSize:13}}/>
                </div>
                <div style={{fontSize:11,color:"#94a3b8"}}>{"Total: "+fmt(BASE_FEES[k]+ex[k])}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
          {card("Tuition (2 kids)",fmt(feeSum.ct2),"#1e40af")}
          {card("Extras",fmt(feeSum.ce2),"#ea580c")}
          {card("Grand total (2 kids)",fmt(feeSum.cum2),"#7c3aed")}
          {c3&&card("Grand total (3 kids)",fmt(feeSum.cum3),"#dc2626","+"+fmt(feeSum.cum3-feeSum.cum2))}
        </div>
        <div style={{background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",padding:14}}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={feeY} margin={{top:4,right:8,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="year" tick={{fontSize:10}}/><YAxis tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"} tick={{fontSize:10}} width={52}/>
              <Tooltip formatter={(v,n)=>[fmt(v),n]} labelFormatter={y=>y+"/"+(y+1)}/><Legend wrapperStyle={{fontSize:11}}/>
              <Bar dataKey={c3?"t3":"t2"} name="Tuition" fill="#f59e0b" stackId="a"/>
              <Bar dataKey={c3?"e3":"e2"} name="Extras"  fill="#ea580c" stackId="a" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>}

      {tab==="health"&&<>
        <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:8,padding:"9px 14px",marginBottom:14,fontSize:12,color:"#0369a1"}}>3rd child in <strong>Global Settings bar</strong> — currently <strong>{c3?"ON":"OFF"}</strong>.</div>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:10}}>Coverage level</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            {Object.entries(PKV_TIERS).map(([k,t])=>(
              <button key={k} onClick={()=>setPkvTier(k)} style={{flex:1,minWidth:160,padding:"10px 12px",borderRadius:10,border:"2px solid "+(pkvTier===k?t.color:"#e2e8f0"),background:pkvTier===k?t.color+"12":"#fff",cursor:"pointer",textAlign:"left"}}>
                <div style={{fontWeight:700,fontSize:13,color:pkvTier===k?t.color:"#374151",marginBottom:3}}>{t.label}</div>
                <div style={{fontSize:11,color:"#64748b",lineHeight:1.4}}>{t.desc}</div>
                <div style={{marginTop:6,fontSize:13,fontWeight:700,color:pkvTier===k?t.color:"#94a3b8"}}>{t.disc===1?"Current rates":Math.round((1-t.disc)*100)+"% cheaper"}</div>
              </button>
            ))}
          </div>
          {pkvTier!=="premium"&&(<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#166534"}}>{"Saves "+fmt((hlthY[2026]?.total||0)/PKV_TIERS[pkvTier].disc-(hlthY[2026]?.total||0))+"/yr today."+(pkvTier==="basis"?" · Basistarif significantly reduces coverage.":"")}</div>)}
        </div>
        <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"#4c1d95",marginBottom:12}}>Signal Iduna PKV — monthly base premiums</div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            {[["Joe",pkv.joe,"joe","€540.59/mo employer subsidy"],["Kali",pkv.kali,"kali","Employer pays 50%"],["Mari Anna",pkv.c1,"c1","Leaves 2047"],["Nicholas",pkv.c2,"c2","Leaves 2050"],...(c3?[["Child 3",pkv.c3,"c3","est. leaves 2053"]]:[]),["Growth %",pkv.grow,"grow","Hist. avg 4-8%/yr"]].map(([l,v,k,sub])=>{
              const disc=PKV_TIERS[pkvTier].disc,eff=k!=="grow"?Math.round(v*disc):null;
              return(<div key={k} style={{display:"flex",flexDirection:"column",gap:3,minWidth:130}}>
                <label style={{fontSize:12,fontWeight:600,color:"#374151"}}>{l}</label>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:13,color:"#64748b"}}>{k==="grow"?"%":"€"}</span>
                  <input type="number" value={v} min={0} step={k==="grow"?0.5:5} onChange={e=>setPkv(p=>({...p,[k]:Number(e.target.value)}))} style={{width:70,padding:"4px 7px",borderRadius:6,border:"1px solid #d1d5db",fontSize:14,fontWeight:600}}/>
                  {k!=="grow"&&<span style={{fontSize:11,color:"#94a3b8"}}>/mo</span>}
                </div>
                {eff!==null&&pkvTier!=="premium"?<div style={{fontSize:12,fontWeight:700,color:PKV_TIERS[pkvTier].color}}>{"→ €"+eff+"/mo"}</div>:<div style={{fontSize:11,color:"#7c3aed"}}>{sub}</div>}
              </div>);
            })}
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
          {card("Family PKV 2026",fmt(hlthY[2026]?.total||0)+"/yr","#7c3aed",fmt((hlthY[2026]?.total||0)/12)+"/mo")}
          {card("Family PKV 2035",fmt(hlthY[2035]?.total||0)+"/yr","#a855f7","After "+pkv.grow+"%/yr")}
          {card("Cumulative 30yr",fmt(YEARS.reduce((s,y)=>s+(hlthY[y]?.total||0),0)),"#4c1d95","2026-2055")}
        </div>
        <div style={{background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",padding:14}}>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={YEARS.map(y=>({year:y,...hlthY[y]}))} margin={{top:4,right:8,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="year" tick={{fontSize:10}} interval={2}/><YAxis tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"} tick={{fontSize:10}} width={52}/>
              <Tooltip formatter={(v,n)=>[fmt(v),n]}/><Legend wrapperStyle={{fontSize:11}}/>
              <Bar dataKey="joe"  name="Joe"       fill="#3b82f6" stackId="a"/>
              <Bar dataKey="kali" name="Kali"      fill="#f59e0b" stackId="a"/>
              <Bar dataKey="c1"   name="Mari Anna" fill="#10b981" stackId="a"/>
              <Bar dataKey="c2"   name="Nicholas"  fill="#6ee7b7" stackId="a"/>
              {c3&&<Bar dataKey="c3" name="Child 3" fill="#a7f3d0" stackId="a" radius={[3,3,0,0]}/>}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>}

      {tab==="pensions"&&<>
        <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:14,marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:12}}>Growth and FX assumptions</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:16}}>
            {[["Allianz growth",penGrowth,setPenGrowth,"%",0.5,"% p.a."],["Aviva UK growth",avivaGrowth,setAvivaGrowth,"%",0.5,"Aviva proj: 6.2%"],["GBP/EUR",gbpEur,setGbpEur,"£1=",0.01,"For Aviva"],["USD/EUR",usdEur,setUsdEur,"$1=",0.01,"For PLTR"]].map(([l,v,s,pre,step,sub])=>(
              <div key={l} style={{display:"flex",flexDirection:"column",gap:3,minWidth:130}}>
                <label style={{fontSize:12,fontWeight:600,color:"#374151"}}>{l}</label>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:12,color:"#64748b"}}>{pre}</span>
                  <input type="number" value={v} step={step} min={0} onChange={e=>s(Number(e.target.value))} style={{width:68,padding:"4px 7px",borderRadius:6,border:"1px solid #d1d5db",fontSize:14,fontWeight:600}}/>
                </div>
                <div style={{fontSize:11,color:"#94a3b8"}}>{sub}</div>
              </div>
            ))}
          </div>
          <div style={{borderTop:"1px solid #e2e8f0",paddingTop:12}}>
            <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:6}}>Future pension contributions <span style={{fontWeight:400,fontSize:12,color:"#64748b"}}>— set to 0 if left Palantir</span></div>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              {[["Allianz employer/yr",futureContrib.al1,"al1","Was €"+ALLIANZ1_CONTRIB.toFixed(0)+"/yr"],["Allianz salary sac./yr",futureContrib.al2,"al2","Was €"+ALLIANZ2_CONTRIB.toFixed(0)+"/yr"]].map(([l,v,k,sub])=>(
                <div key={k} style={{display:"flex",flexDirection:"column",gap:3,minWidth:200}}>
                  <label style={{fontSize:12,fontWeight:600,color:"#374151"}}>{l}</label>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={{fontSize:12,color:"#64748b"}}>€</span>
                    <input type="number" value={v} step={100} min={0} onChange={e=>setFutureContrib(f=>({...f,[k]:Number(e.target.value)}))} style={{width:90,padding:"4px 7px",borderRadius:6,border:"1px solid "+(v===0?"#fca5a5":"#d1d5db"),fontSize:14,fontWeight:600,background:v===0?"#fef2f2":"#fff"}}/>
                    <span style={{fontSize:12,color:"#94a3b8"}}>/yr</span>
                  </div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>{sub}</div>
                </div>
              ))}
            </div>
            {futureContrib.al1===0&&futureContrib.al2===0&&(<div style={{marginTop:8,fontSize:12,color:"#92400e",background:"#fef3c7",borderRadius:6,padding:"6px 10px"}}>{"Both 0 — pots grow on existing value only. Guarantees (€"+(ALLIANZ1_GUARANTEED+ALLIANZ2_GUARANTEED).toLocaleString("de-DE")+") still apply at 2057."}</div>)}
          </div>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
          {[["Allianz Employer (6/719682/00042)","#eff6ff","#bfdbfe","#1e40af",[["Employer contrib",fmt(ALLIANZ1_CONTRIB)+"/yr"],["Guaranteed 2057",fmt(ALLIANZ1_GUARANTEED)],["Or pension",fmt(509.94)+"/mo"]]],
            ["Allianz Salary Sac. (6/719682/00043)","#f0fdf4","#bbf7d0","#166534",[["Your contrib",fmt(ALLIANZ2_CONTRIB)+"/yr"],["Guaranteed 2057",fmt(ALLIANZ2_GUARANTEED)],["Or pension",fmt(254.97)+"/mo"]]],
            ["Aviva (TK11116442)","#fefce8","#fde68a","#92400e",[["Value Jan 2026",fmtGBP(AVIVA_CURRENT_GBP)+" = "+fmt(AVIVA_CURRENT_GBP*gbpEur)],["Retirement","12 July 2048"],["Aviva proj.",fmtGBP(339000)],["Annuity",fmtGBP(20500)+"/yr"]]]
          ].map(([title,bg,border,col,items])=>(
            <div key={title} style={{flex:1,minWidth:200,background:bg,border:"1px solid "+border,borderRadius:10,padding:14}}>
              <div style={{fontWeight:700,fontSize:12,color:col,marginBottom:8}}>{title}</div>
              {items.map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+border,fontSize:12}}><span style={{color:"#64748b"}}>{l}</span><span style={{fontWeight:600,color:col}}>{v}</span></div>))}
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
          {card("Guaranteed at 2057",fmt(ALLIANZ1_GUARANTEED+ALLIANZ2_GUARANTEED),"#1e40af","Allianz minimums")}
          {card("Projected total 2057",fmt(penYears[penYears.length-1]?.total||0),"#7c3aed",penGrowth+"%/"+avivaGrowth+"%")}
          {card("All pots at 2048",fmt(penYears.find(r=>r.year===2048)?.total||0),"#059669","Age 58")}
        </div>
        <div style={{background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",padding:14}}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={penYears} margin={{top:4,right:10,left:0,bottom:0}}>
              <defs>
                {[["gA1","#3b82f6"],["gA2","#10b981"],["gAv","#f59e0b"]].map(([id,c])=>(
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={c} stopOpacity={0.4}/><stop offset="95%" stopColor={c} stopOpacity={0}/></linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="year" tick={{fontSize:10}} interval={4}/>
              <YAxis tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"} tick={{fontSize:10}} width={58}/>
              <Tooltip formatter={(v,n)=>[fmt(v),n]}/><Legend wrapperStyle={{fontSize:11}}/>
              <ReferenceLine x={2048} stroke="#f59e0b" strokeDasharray="4 3" label={{value:"Aviva ret.",fontSize:9,fill:"#b45309"}}/>
              <ReferenceLine x={2057} stroke="#3b82f6" strokeDasharray="4 3" label={{value:"Allianz ret.",fontSize:9,fill:"#1e40af"}}/>
              <Area type="monotone" dataKey="allianz1" name="Allianz (employer)"    stroke="#3b82f6" fill="url(#gA1)" strokeWidth={2} dot={false}/>
              <Area type="monotone" dataKey="allianz2" name="Allianz (salary sac.)" stroke="#10b981" fill="url(#gA2)" strokeWidth={2} dot={false}/>
              <Area type="monotone" dataKey="aviva"    name="Aviva UK"              stroke="#f59e0b" fill="url(#gAv)" strokeWidth={2} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </>}

      {tab==="investments"&&<>
        <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:14,marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:12}}>Current holdings and assumptions</div>
          <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:12,marginBottom:12}}>
            <div style={{fontWeight:700,fontSize:12,color:"#166534",marginBottom:8}}>Primary Residence — Munich</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div style={{display:"flex",flexDirection:"column",gap:3,minWidth:150}}><label style={{fontSize:11,color:"#64748b",fontWeight:600}}>Purchase price (2024)</label><div style={{padding:"5px 9px",background:"#dcfce7",borderRadius:6,fontSize:13,fontWeight:700,color:"#166534"}}>€1,600,000</div></div>
              <div style={{display:"flex",flexDirection:"column",gap:3,minWidth:160}}><label style={{fontSize:11,color:"#64748b",fontWeight:600}}>Current estimated value</label><div style={{display:"flex",alignItems:"center",gap:4,background:"#fff",border:"1px solid #d1d5db",borderRadius:6,overflow:"hidden"}}><span style={{padding:"4px 6px",background:"#f8fafc",fontSize:12,color:"#64748b"}}>€</span><input type="number" value={inv.houseValue} step={10000} min={0} onChange={e=>setInv(x=>({...x,houseValue:Number(e.target.value)}))} style={{flex:1,padding:"4px 7px",border:"none",fontSize:13,fontWeight:600,outline:"none",width:110}}/></div></div>
              <div style={{display:"flex",flexDirection:"column",gap:3,minWidth:130}}><label style={{fontSize:11,color:"#64748b",fontWeight:600}}>Annual appreciation</label><div style={{display:"flex",alignItems:"center",gap:4,background:"#fff",border:"1px solid #d1d5db",borderRadius:6,overflow:"hidden"}}><input type="number" value={inv.houseAppreciation} step={0.5} min={0} onChange={e=>setInv(x=>({...x,houseAppreciation:Number(e.target.value)}))} style={{flex:1,padding:"4px 7px",border:"none",fontSize:13,fontWeight:600,outline:"none",width:50}}/><span style={{padding:"4px 6px",background:"#f8fafc",fontSize:12,color:"#64748b"}}>%/yr</span></div></div>
              <div style={{display:"flex",flexDirection:"column",gap:3,minWidth:150}}><label style={{fontSize:11,color:"#64748b",fontWeight:600}}>Current mortgage balance</label><div style={{padding:"5px 9px",background:"#fee2e2",borderRadius:6,fontSize:13,fontWeight:700,color:"#dc2626"}}>{"−"+fmt(mStats.curBal)}</div></div>
              <div style={{display:"flex",flexDirection:"column",gap:3,minWidth:150}}><label style={{fontSize:11,color:"#64748b",fontWeight:600}}>Current equity</label><div style={{padding:"5px 9px",background:"#dbeafe",borderRadius:6,fontSize:13,fontWeight:700,color:"#1e40af"}}>{fmt(inv.houseValue-(mStats.curBal||0))}</div></div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            <div style={{flex:1,minWidth:240,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:12}}>
              <div style={{fontWeight:700,fontSize:12,color:"#1e40af",marginBottom:8}}>Joe — liquid investments</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{invInput("Scalable Capital","joeScalable")}{invInput("TR stocks","joeTRStocks")}{invInput("TR cash","joeTRCash")}</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:10}}>
                {invInput("PLTR shares","pltrShares","#",1)}{invInput("PLTR price (USD)","pltrPrice","$",1)}
                <div style={{display:"flex",flexDirection:"column",gap:3,justifyContent:"flex-end"}}><label style={{fontSize:11,color:"#64748b"}}>PLTR value (EUR)</label><div style={{padding:"8px 10px",background:"#dbeafe",borderRadius:6,fontSize:13,fontWeight:700,color:"#1e40af"}}>{fmt(pltrEur)}</div></div>
              </div>
            </div>
            <div style={{flex:1,minWidth:200,background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:12}}>
              <div style={{fontWeight:700,fontSize:12,color:"#92400e",marginBottom:8}}>Kali — liquid investments</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{invInput("TR stocks","kaliTRStocks")}{invInput("TR cash","kaliTRCash")}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"flex-end"}}>
            <div style={{display:"flex",flexDirection:"column",gap:3}}><label style={{fontSize:12,fontWeight:600,color:"#374151"}}>Liquid growth</label><div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" value={invGrowth} min={0} max={20} step={0.5} onChange={e=>setInvGrowth(Number(e.target.value))} style={{width:60,padding:"5px 8px",borderRadius:6,border:"1px solid #d1d5db",fontSize:14,fontWeight:600}}/><span style={{fontSize:13,color:"#64748b"}}>%/yr</span></div></div>
            <div style={{display:"flex",flexDirection:"column",gap:3}}><label style={{fontSize:12,fontWeight:600,color:"#374151"}}>USD/EUR</label><input type="number" value={usdEur} step={0.01} min={0} onChange={e=>setUsdEur(Number(e.target.value))} style={{width:68,padding:"5px 8px",borderRadius:6,border:"1px solid #d1d5db",fontSize:13,fontWeight:600}}/></div>
            <div style={{display:"flex",flexDirection:"column",gap:3}}><label style={{fontSize:12,fontWeight:600,color:"#374151"}}>GBP/EUR</label><input type="number" value={gbpEur} step={0.01} min={0} onChange={e=>setGbpEur(Number(e.target.value))} style={{width:68,padding:"5px 8px",borderRadius:6,border:"1px solid #d1d5db",fontSize:13,fontWeight:600}}/></div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
          {card("House equity today",fmt(inv.houseValue-(mStats.curBal||0)),"#166534","Value minus mortgage")}
          {card("Liquid investments",fmt(totalHHInv),"#1e40af","Excl. property")}
          {card("Total net worth today",fmt(inv.houseValue-(mStats.curBal||0)+totalHHInv),"#7c3aed","Property equity + liquid")}
          {card("Liquid 2036",fmt(invYears[9]?.totalLiquid||0),"#3b82f6",invGrowth+"%/yr")}
          {card("Total net worth 2036",fmt(invYears[9]?.totalWithHouse||0),"#059669","Incl. house equity")}
        </div>
        <div style={{background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",padding:14,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"#1e3a5f",marginBottom:8}}>{"Net worth projection — stacked ("+inv.houseAppreciation+"% house / "+invGrowth+"% liquid)"}</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={invYears} margin={{top:4,right:10,left:0,bottom:0}}>
              <defs>
                {[["gHouse","#10b981"],["gIS","#3b82f6"],["gIT","#6366f1"],["gIK","#f59e0b"],["gPL","#dc2626"],["gCA","#94a3b8"]].map(([id,c])=>(
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={c} stopOpacity={0.8}/><stop offset="95%" stopColor={c} stopOpacity={0.5}/></linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="year" tick={{fontSize:10}} interval={2}/>
              <YAxis tickFormatter={v=>"€"+(v/1e6).toFixed(1)+"M"} tick={{fontSize:10}} width={58}/>
              <Tooltip formatter={(v,n)=>[fmt(v),n]}/><Legend wrapperStyle={{fontSize:11}}/>
              <Area type="monotone" dataKey="equity"      name="House equity"    stroke="#10b981" fill="url(#gHouse)" strokeWidth={1.5} dot={false} stackId="1"/>
              <Area type="monotone" dataKey="joeScalable" name="Joe Scalable"    stroke="#3b82f6" fill="url(#gIS)"   strokeWidth={1.5} dot={false} stackId="1"/>
              <Area type="monotone" dataKey="joeTR"       name="Joe TR stocks"   stroke="#6366f1" fill="url(#gIT)"   strokeWidth={1.5} dot={false} stackId="1"/>
              <Area type="monotone" dataKey="kaliTR"      name="Kali TR"         stroke="#f59e0b" fill="url(#gIK)"   strokeWidth={1.5} dot={false} stackId="1"/>
              <Area type="monotone" dataKey="pltr"        name="PLTR"            stroke="#dc2626" fill="url(#gPL)"   strokeWidth={1.5} dot={false} stackId="1"/>
              <Area type="monotone" dataKey="cash"        name="Cash"            stroke="#94a3b8" fill="url(#gCA)"   strokeWidth={1.5} dot={false} stackId="1"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",overflow:"hidden"}}>
          <div style={{overflowX:"auto",maxHeight:360,overflowY:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                <th style={TH({textAlign:"left"})}>Year</th>
                <th style={TH({color:"#6ee7b7"})}>House</th><th style={TH({color:"#fca5a5"})}>Mortgage</th><th style={TH({color:"#6ee7b7"})}>Equity</th>
                <th style={TH({color:"#bfdbfe"})}>Scalable</th><th style={TH({color:"#c7d2fe"})}>Joe TR</th><th style={TH({color:"#fde68a"})}>Kali TR</th>
                <th style={TH({color:"#fca5a5"})}>PLTR</th><th style={TH()}>Cash</th>
                <th style={TH({background:"#1e40af"})}>Liquid</th><th style={TH({background:"#065f46"})}>Net worth</th>
              </tr></thead>
              <tbody>{invYears.map((r,i)=>(
                <tr key={r.year} style={{background:i%2===0?"#fff":"#f8fafc"}}>
                  <td style={{...TD({textAlign:"left"}),fontWeight:600}}>{r.year}</td>
                  <td style={TD({color:"#059669"})}>{fmt(r.houseVal)}</td>
                  <td style={TD({color:"#dc2626"})}>{r.mortgage>0?"−"+fmt(r.mortgage):"—"}</td>
                  <td style={TD({color:"#166534",fontWeight:600})}>{fmt(r.equity)}</td>
                  <td style={TD({color:"#3b82f6"})}>{fmt(r.joeScalable)}</td>
                  <td style={TD({color:"#6366f1"})}>{fmt(r.joeTR)}</td>
                  <td style={TD({color:"#b45309"})}>{fmt(r.kaliTR)}</td>
                  <td style={TD({color:"#dc2626"})}>{fmt(r.pltr)}</td>
                  <td style={TD({color:"#64748b"})}>{fmt(r.cash)}</td>
                  <td style={TD({color:"#1e40af",fontWeight:700})}>{fmt(r.totalLiquid)}</td>
                  <td style={TD({color:"#059669",fontWeight:700})}>{fmt(r.totalWithHouse)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <p style={{fontSize:11,color:"#94a3b8",marginTop:8}}>PLTR $156.20 (10 Mar 2026). Cash held flat. Not financial advice.</p>
      </>}

      </div>
    </div>
  );
}

export default function App(){
  const[ok,setOk]=useState(()=>localStorage.getItem("kane-auth")==="1");
  if(!ok) return <PasswordGate onUnlock={()=>setOk(true)}/>;
  return <AppInner/>;
}
