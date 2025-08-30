import React, { useState } from "react";
import { cls } from "../helpers";
import { metrics } from "../helpers";

export default function CreateWizard({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("Trading");
  const [type, setType] = useState("STREAM");
  const [tags, setTags] = useState("");
  const [topic, setTopic] = useState("domain.product");
  const valid = name.trim().length > 3;
  const submit = () => {
    const p = {
      id: name.toLowerCase().replace(/\s+/g, "."),
      name,
      description: "Demo product",
      domain,
      type,
      owners: [{ team: "Demo", email: "demo@td.com", role: "OWNER" }],
      lifecycle: "ACTIVE",
      confidentiality: "INTERNAL",
      topics:
        type !== "REFERENCE"
          ? [{ clusterId: "cc-us", topicName: topic, env: "PROD", partitions: 3, throughput_mps: 100 }]
          : [],
      schemas: [{ subject: `${topic}-value`, format: "JSON", version: 1, definition: "{...}" }],
      lineage: { inputs: [], outputs: [], processors: [] },
      tags: tags ? tags.split(",").map((s) => s.trim()) : [],
      metrics: metrics(),
      created_at: Date.now(),
    };
    onCreate(p);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className={`${cls.card} w-[680px]`}>
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create / Register Data Product</h3>
          <button onClick={onClose} className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50">Close</button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A859]" placeholder="FX.Trades.Enriched.v1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Domain</label>
            <select value={domain} onChange={(e) => setDomain(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-[#00A859]">
              {["Trading", "Risk", "Compliance", "Reference Data"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-[#00A859]">
              {["STREAM", "ANALYTICS", "REFERENCE"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Kafka Subject / Topic</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-[#00A859]" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Tags (comma separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-[#00A859]" placeholder="FX, Trades, MiFID" />
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className={`px-4 py-2 rounded-xl ${cls.secondaryBtn}`}>Cancel</button>
          <button disabled={!valid} onClick={submit} className={`px-4 py-2 rounded-xl ${cls.primaryBtn} disabled:opacity-40`}>Publish</button>
        </div>
      </div>
    </div>
  );
}
