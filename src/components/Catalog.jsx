import React from "react";
import { cls, badge } from "../helpers";
import { 
  HiArrowRight, 
  HiTemplate, 
  HiChartBar, 
  HiArchive,
  HiTag,
  HiBadgeCheck
} from "react-icons/hi";

const getTypeIcon = (type) => {
  switch (type) {
    case 'STREAM':
      return <HiTemplate className="w-4 h-4" />;
    case 'ANALYTICS':
      return <HiChartBar className="w-4 h-4" />;
    case 'REFERENCE':
      return <HiArchive className="w-4 h-4" />;
    default:
      return <HiTemplate className="w-4 h-4" />;
  }
};

export default function Catalog({ items, onOpen }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {(items || []).map((p) => (
        <div key={p.id} className={`${cls.card} p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 will-change-transform border-l-4 border-l-transparent hover:border-l-[#00A859] group`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {getTypeIcon(p.type)}
              <h3 className="font-semibold text-slate-900 truncate text-base">
                {p.name}
              </h3>
            </div>
            <span className={`${badge(p.type)} flex items-center gap-1 whitespace-nowrap`}>
              {p.type}
            </span>
          </div>
          
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {p.description}
          </p>
          
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className={`${badge(p.lifecycle)} text-xs`}>{p.lifecycle}</span>
            {p.tags.slice(0, 2).map((t) => (
              <span key={t} className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs flex items-center gap-1">
                <HiTag className="w-3 h-3" />
                {t}
              </span>
            ))}
            {p.tags.length > 2 && (
              <span className="px-2 py-1 rounded-md bg-slate-50 text-slate-500 text-xs">
                +{p.tags.length - 2} more
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-slate-600">
              <HiBadgeCheck className="w-4 h-4" />
              <span className="font-medium text-slate-800">{p.domain}</span>
            </div>
            <button 
              onClick={() => onOpen(p.id)} 
              className="text-[#00653A] hover:text-[#00A859] hover:bg-[#E6F4EC] px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 font-medium text-sm group-hover:shadow-sm"
            >
              Open
              <HiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
