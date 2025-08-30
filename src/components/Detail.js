import React from "react";
import { badge, cls } from "../helpers";
import MetricsChart from "./MetricsChart";

export default function Detail({ p, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-auto">
      <div className="max-w-5xl w-full m-6">
        <div className={`${cls.card}`}>
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">{p.domain}</div>
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <div className="flex gap-2 mt-2">
                <span className={badge(p.type)}>{p.type}</span>
                <span className={badge(p.lifecycle)}>{p.lifecycle}</span>
              </div>
            </div>
            <button onClick={onClose} className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50">Close</button>
          </div>
          <div className="grid md:grid-cols-3 gap-4 p-6">
            <div className="md:col-span-2 space-y-4">
              <div className={`${cls.card} p-4`}>
                <div className="font-medium mb-1">Overview</div>
                <p className="text-slate-700">{p.description}</p>
                <div className="mt-2 text-sm text-slate-600">Owners: {p.owners.map((o) => o.team).join(", ")}</div>
              </div>
              <div className={`${cls.card} p-4`}>
                <div className="font-medium mb-2">Schema (latest)</div>
                <pre className="whitespace-pre-wrap text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 overflow-auto max-h-48">{p.schemas[p.schemas.length - 1]?.definition}</pre>
                <div className="text-xs text-slate-500 mt-1">Subject: {p.schemas[0]?.subject} • Versions: {p.schemas.length}</div>
              </div>
              <MetricsChart data={p.metrics} />
            </div>
            <div className="space-y-4">
              <div className={`${cls.card} p-4`}>
                <div className="font-medium mb-2">Topics</div>
                {p.topics.length ? (
                  p.topics.map((t) => (
                    <div key={t.topicName} className="text-sm border-b last:border-0 border-slate-200 py-1 flex justify-between">
                      <div>
                        <div className="font-mono">{t.topicName}</div>
                        <div className="text-slate-500">{t.env} • {t.clusterId}</div>
                      </div>
                      {t.throughput_mps ? (
                        <div className="text-right">
                          <div>{t.throughput_mps} mps</div>
                          <div className="text-slate-500">partitions {t.partitions ?? "-"}</div>
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">None</div>
                )}
              </div>
              <div className={`${cls.card} p-4`}>
                <div className="font-medium mb-2">Lineage</div>
                <div className="text-sm">Inputs: {p.lineage.inputs.join(", ") || "—"}</div>
                <div className="text-sm">Outputs: {p.lineage.outputs.join(", ") || "—"}</div>
                <div className="text-sm">Processors: {p.lineage.processors.join(", ") || "—"}</div>
              </div>
              <div className={`${cls.card} p-4`}>
                <div className="font-medium mb-2">Tags</div>
                <div className="flex gap-2 flex-wrap">
                  {p.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
