import React from "react";

export default function Facet({ label, items, selected, onToggle }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(items || {}).map(([k, v]) => (
          <button
            key={k}
            onClick={() => onToggle(k)}
            className={`px-2 py-1 rounded-full border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#00A859]/40 ${
              selected.has(k)
                ? "border-[#00653A] bg-[#E6F4EC] text-[#00653A]"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            {k}
            <span className="ml-1 text-slate-500">{v}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
