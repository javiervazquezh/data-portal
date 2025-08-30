import React, { useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import Catalog from "./components/Catalog.jsx";
import Detail from "./components/Detail.jsx";
import CreateWizard from "./components/CreateWizard.jsx";
import Facet from "./components/Facet.jsx";
import { TD, cls, useFacets, metrics, minsAgo } from "./helpers";

/*****************************
 * TD BANK DEMO (NO BACKEND)
 * - In‑memory catalog
 * - TD color palette
 * - Browse, facets, details, create/register
 *****************************/

// --- Seed Data (uses helpers) ----------------------------------------
const now = Date.now();

const SEED = [
  { id:"fx.raw", name:"FX.Trades.Raw", description:"Raw FX trades as captured from OMS.", domain:"Trading", type:"STREAM",
    owners:[{team:"FX Core",email:"fx-core@td.com",role:"OWNER"}], lifecycle:"ACTIVE", confidentiality:"INTERNAL",
    topics:[{clusterId:"cc-us",topicName:"fx.trades.raw",env:"PROD",partitions:12,retention_ms:604800000}],
    schemas:[{subject:"fx.trades.raw-value",format:"AVRO",version:1,compatibility:"BACKWARD",definition:"{...avro...}"}],
    lineage:{inputs:[],outputs:["fx.norm"],processors:["flink.fx.raw2norm"]},
    quality:{SLA_ms:1000,SLO_availability:99.9,freshness_secs:5},
    observability:{lag:120,e2e_p95:420,error_rate:0.0003,last_publish_ts:now-15000},
    tags:["FX","Trades"], metadata:{pii:false,tier:"Tier1"}, sampleRecords:[{id:"T123",pair:"EURUSD",side:"BUY"}],
    versioning:{semver:"1.0.0",changelog:[{note:"Initial",ts:minsAgo(240)}]}, metrics:metrics(), created_at:minsAgo(1440)
  },
  { id:"fx.norm", name:"FX.Trades.Normalized.v1", description:"Normalized FX trades for downstream consumption.", domain:"Trading", type:"STREAM",
    owners:[{team:"FX Core",email:"fx-core@td.com",role:"OWNER"}], lifecycle:"ACTIVE", confidentiality:"INTERNAL",
    topics:[{clusterId:"cc-us",topicName:"fx.trades.normalized",env:"PROD",partitions:12,throughput_mps:1350}],
    schemas:[{subject:"fx.trades.normalized-value",format:"AVRO",version:1,definition:"{...}"},{subject:"fx.trades.normalized-value",format:"AVRO",version:2,definition:"{...+notional}"}],
    lineage:{inputs:["fx.raw"],outputs:["eq.vwap"],processors:["flink.fx.raw2norm"]},
    quality:{SLA_ms:800,SLO_availability:99.9,freshness_secs:3},
    observability:{lag:90,e2e_p95:350,error_rate:0.0002,last_publish_ts:now-8000},
    tags:["FX","Trades","MiFID"], metadata:{pii:false,tier:"Tier1"}, sampleRecords:[{tradeId:"T123",pair:"EURUSD"}],
    versioning:{semver:"1.2.0",changelog:[{note:"Add optional notional",ts:minsAgo(60)}]}, metrics:metrics(), created_at:minsAgo(1000)
  },
  { id:"rates.tob", name:"Rates.MarketData.TopOfBook", description:"Best bid/ask quotes for rates.", domain:"Trading", type:"STREAM",
    owners:[{team:"Rates MD",email:"rates@td.com",role:"OWNER"}], lifecycle:"ACTIVE", confidentiality:"INTERNAL",
    topics:[{clusterId:"cc-us",topicName:"rates.mktdata.tob",env:"PROD",partitions:6}],
    schemas:[{subject:"rates.tob-value",format:"AVRO",version:3,definition:"{...}"}],
    lineage:{inputs:[],outputs:[],processors:[]}, quality:{SLA_ms:500,SLO_availability:99.95},
    observability:{lag:30,e2e_p95:120,error_rate:0.00005,last_publish_ts:now-5000}, tags:["Rates","MarketData"],
    versioning:{semver:"3.1.0",changelog:[{note:"Model tweak",ts:minsAgo(300)}]}, metrics:metrics(), created_at:minsAgo(500)
  },
  { id:"eq.vwap", name:"EQ.VWAP.Daily", description:"Daily VWAP aggregates derived from intraday prints.", domain:"Risk", type:"ANALYTICS",
    owners:[{team:"EQ Quant",email:"eq-quant@td.com",role:"OWNER"}], lifecycle:"ACTIVE", confidentiality:"INTERNAL",
    topics:[{clusterId:"cc-us",topicName:"eq.vwap.daily",env:"PROD",partitions:3}],
    schemas:[{subject:"eq.vwap.daily-value",format:"JSON",version:1,definition:"{symbol, vwap, date}"}],
    lineage:{inputs:["rates.tob"],outputs:[],processors:["flink.eq.vwap"]}, quality:{SLA_ms:300000,SLO_availability:99.0},
    observability:{lag:0,e2e_p95:5000,error_rate:0.0001,last_publish_ts:now-60000}, tags:["EQ","Analytics"],
    versioning:{semver:"0.9.0",changelog:[{note:"Initial analytics",ts:minsAgo(720)}]}, metrics:metrics(), created_at:minsAgo(800)
  },
  { id:"ref.inst", name:"RefData.Instruments", description:"Reference data for instruments used in joins.", domain:"Reference Data", type:"REFERENCE",
    owners:[{team:"RefData",email:"refdata@td.com",role:"OWNER"}], lifecycle:"ACTIVE", confidentiality:"INTERNAL",
    topics:[], schemas:[{subject:"ref.instrument-value",format:"JSON",version:4,definition:"{id, symbol}"}],
    lineage:{inputs:[],outputs:["eq.vwap"],processors:[]}, quality:{SLA_ms:86400000,SLO_availability:99.5},
    observability:{lag:0,e2e_p95:0,error_rate:0,last_publish_ts:now-10000}, tags:["Reference","Static"],
    versioning:{semver:"4.2.1",changelog:[{note:"Monthly refresh",ts:minsAgo(2000)}]}, metrics:metrics(), created_at:minsAgo(5000)
  },
];

export default function App(){
  const [all,setAll]=useState(SEED);
  const [q,setQ]=useState("");
  const [sel,setSel]=useState(null);
  const [showCreate,setShowCreate]=useState(false);
  const selected = all.find(p=>p.id===sel)||null;
  const facets=useFacets(all);
  const [fDomain,setFDomain]=useState(new Set());
  const [fType,setFType]=useState(new Set());
  const [fLife,setFLife]=useState(new Set());
  const [fTag,setFTag]=useState(new Set());

  const results = useMemo(()=>{
    const txt=q.toLowerCase();
    return all.filter(p=>{
      const matchesTxt = !txt || [p.name,p.description,JSON.stringify(p.metadata),p.schemas.map(s=>s.definition).join(" ")].some(x=>x?.toLowerCase().includes(txt));
      const inDomain = fDomain.size? fDomain.has(p.domain):true;
      const inType = fType.size? fType.has(p.type):true;
      const inLife = fLife.size? fLife.has(p.lifecycle):true;
      const inTags = fTag.size? p.tags.some(t=>fTag.has(t)):true;
      return matchesTxt && inDomain && inType && inLife && inTags;
    }).sort((a,b)=> (b.created_at||0)-(a.created_at||0));
  },[all,q,fDomain,fType,fLife,fTag]);

  return (
    <div className="min-h-screen" style={{background:TD.surface,color:TD.text}}>
      <Header onCreate={()=>setShowCreate(true)} />
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <div className={`${cls.card} p-4 md:w-80 h-fit`}>
            <div className="text-sm font-medium mb-2">Filters</div>
            <Facet label="Domain" items={facets.domains} selected={fDomain} onToggle={(k)=>setFDomain(s=>new Set(s.has(k)?([...s].filter(x=>x!==k)):[...s,k]))} />
            <div className="h-4"/>
            <Facet label="Type" items={facets.types} selected={fType} onToggle={(k)=>setFType(s=>new Set(s.has(k)?([...s].filter(x=>x!==k)):[...s,k]))} />
            <div className="h-4"/>
            <Facet label="Lifecycle" items={facets.lifecycles} selected={fLife} onToggle={(k)=>setFLife(s=>new Set(s.has(k)?([...s].filter(x=>x!==k)):[...s,k]))} />
            <div className="h-4"/>
            <Facet label="Tags" items={facets.tags} selected={fTag} onToggle={(k)=>setFTag(s=>new Set(s.has(k)?([...s].filter(x=>x!==k)):[...s,k]))} />
          </div>
          <div className="flex-1 space-y-4">
            <div className={`${cls.card} p-4 flex items-center gap-3`}>
              <input className="flex-1 rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A859]" placeholder="Search name, description, schema, metadata..." value={q} onChange={e=>setQ(e.target.value)} />
              <button onClick={()=>{setQ("");setFDomain(new Set());setFType(new Set());setFLife(new Set());setFTag(new Set());}} className={`px-3 py-2 rounded-xl ${cls.secondaryBtn}`}>Clear</button>
            </div>
            <Catalog items={results} onOpen={(id)=>setSel(id)} />
          </div>
        </div>
      </main>
      {selected && <Detail p={selected} onClose={()=>setSel(null)} />}
      {showCreate && <CreateWizard onClose={()=>setShowCreate(false)} onCreate={(p)=>setAll(a=>[p,...a])} />}
    </div>
  );
}
