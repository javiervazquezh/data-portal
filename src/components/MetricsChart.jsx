import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TD, cls } from "../helpers";

export default function MetricsChart({ data }) {
  if (!data || !data.length) return null;
  const latest = data[data.length - 1];
  return (
    <div className={`${cls.card} p-4`}>
      <div className="font-medium mb-2">Metrics</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-3 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Throughput</div>
          <div className="text-lg font-semibold">{latest.throughput?.toFixed(1) || '0'} mps</div>
        </div>
        <div className="p-3 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Consumer Lag</div>
          <div className="text-lg font-semibold">{latest.lag || '0'}</div>
        </div>
        <div className="p-3 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">p95 Latency</div>
          <div className="text-lg font-semibold">{latest.p95 || '0'} ms</div>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorT" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={TD.blue} stopOpacity={0.4} />
                <stop offset="95%" stopColor={TD.blue} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorL" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={TD.primaryBright} stopOpacity={0.4} />
                <stop offset="95%" stopColor={TD.primaryBright} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={TD.amber} stopOpacity={0.4} />
                <stop offset="95%" stopColor={TD.amber} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ts" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
            <YAxis />
            <Tooltip labelFormatter={(t) => new Date(t).toLocaleString()} />
            <Legend />
            <Area
              type="monotone"
              dataKey="throughput"
              name="Throughput (mps)"
              stroke={TD.blue}
              fillOpacity={1}
              fill="url(#colorT)"
            />
            <Area
              type="monotone"
              dataKey="lag"
              name="Consumer Lag"
              stroke={TD.primaryBright}
              fillOpacity={1}
              fill="url(#colorL)"
            />
            <Area
              type="monotone"
              dataKey="p95"
              name="p95 Latency (ms)"
              stroke={TD.amber}
              fillOpacity={1}
              fill="url(#colorP)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
