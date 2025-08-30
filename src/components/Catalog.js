import React from "react";
import { cls, badge } from "../helpers";

export default function Catalog({ items, onOpen }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {(items || []).map((p) => (
        <div key={p.id} className={`${cls.card} p-4`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 truncate">{p.name}</h3>
            <span className={badge(p.type)}>{p.type}</span>
          </div>
          <p className="text-slate-600 mt-1 line-clamp-2">{p.description}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className={badge(p.lifecycle)}>{p.lifecycle}</span>
            {p.tags.slice(0, 3).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
            <div>
              Domain: <span className="font-medium">{p.domain}</span>
            </div>
            <button onClick={() => onOpen(p.id)} className="text-[#00653A] hover:underline">
              Open
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
