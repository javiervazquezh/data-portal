import { useMemo } from "react";

// TD Brand Tokens (approximate)
export const TD = {
  primary: "#00653A", // Deep Green
  primaryBright: "#00A859", // Emerald
  onPrimary: "#FFFFFF",
  surface: "#F5F7F6",
  text: "#0F172A",
  blue: "#174EA6",
  amber: "#8B5E00",
  danger: "#B3261E",
};

export const cls = {
  header: "sticky top-0 z-40 bg-gradient-to-r from-[#00653A] via-[#00A859] to-[#00924E] text-white",
  primaryBtn: "bg-[#00A859] hover:bg-[#00924E] text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50",
  secondaryBtn: "bg-white text-[#00653A] border border-[#00A859] hover:bg-[#E6F4EC] transition-all duration-200 shadow-sm",
  card: "bg-white shadow-lg rounded-2xl border border-slate-200/80 backdrop-blur-sm",
  chip: "px-3 py-1 rounded-full text-xs font-medium transition-colors",
};

export const badge = (t) => {
  const map = {
    STREAM: "bg-[#E6F4EC] text-[#00653A]",
    ANALYTICS: "bg-[#E8F0FE] text-[#174EA6]",
    REFERENCE: "bg-[#FFF4E5] text-[#8B5E00]",
    ACTIVE: "bg-[#D7F2E3] text-[#00653A]",
    DRAFT: "bg-slate-100 text-slate-800",
    DEPRECATED: "bg-[#FDECEA] text-[#B3261E]",
  };
  return `${cls.chip} ${map[t] || "bg-slate-100 text-slate-800"}`;
};

export function useFacets(items) {
  return useMemo(() => {
    const f = { domains: {}, types: {}, lifecycles: {}, conf: {}, tags: {} };
    for (const p of items || []) {
      if (!p) continue;
      f.domains[p.domain] = (f.domains[p.domain] || 0) + 1;
      f.types[p.type] = (f.types[p.type] || 0) + 1;
      f.lifecycles[p.lifecycle] = (f.lifecycles[p.lifecycle] || 0) + 1;
      f.conf[p.confidentiality] = (f.conf[p.confidentiality] || 0) + 1;
      for (const t of p.tags || []) f.tags[t] = (f.tags[t] || 0) + 1;
    }
    return f;
  }, [items]);
}

// Utilities for demo metrics/time series
function series(base, j = 100, n = 30) {
  let v = base;
  return Array.from({ length: n }, () => {
    v = Math.max(0, v + (Math.random() * 2 - 1) * j);
    return Number(v.toFixed(1));
  });
}

export function metrics(n = 30) {
  const now = Date.now();
  const t0 = now - n * 60_000;
  const a = series(1200, 120, n);
  const b = series(150, 40, n);
  const c = series(320, 60, n);
  return a.map((_, i) => ({ ts: t0 + i * 60_000, throughput: a[i], lag: b[i], p95: c[i] }));
}

export function minsAgo(m) {
  return Date.now() - m * 60_000;
}