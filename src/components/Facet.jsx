import React from "react";
import { HiAdjustments } from "react-icons/hi";

export default function Facet({ label, items, selected, onToggle }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <HiAdjustments className="w-4 h-4 text-slate-500" />
        <div className="text-sm font-medium text-slate-700 uppercase tracking-wider">
          {label}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(items || {}).map(([k, v]) => (
          <button
            key={k}
            onClick={() => onToggle(k)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A859]/40 hover:shadow-sm ${
              selected.has(k)
                ? "border-[#00653A] bg-[#E6F4EC] text-[#00653A] shadow-sm"
                : "border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600"
            }`}
          >
            <span>{k}</span>
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
              selected.has(k) 
                ? "bg-[#00653A]/10 text-[#00653A]" 
                : "bg-slate-100 text-slate-500"
            }`}>
              {v}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
