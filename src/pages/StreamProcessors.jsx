import { useEffect, useMemo, useState } from 'react'
import { interval, map, scan, startWith } from 'rxjs'
import StreamChart from '../components/StreamChart.jsx'

const processors = [
  { id: 'sp1', name: 'Trade Enricher', input: 'trades.raw', output: 'trades.enriched', latencyMs: 12 },
  { id: 'sp2', name: 'Risk Aggregator', input: 'trades.enriched', output: 'risk.metrics', latencyMs: 24 },
]

export default function StreamProcessors() {
  const [rate, setRate] = useState(120)
  const [lag, setLag] = useState(1)

  // Simulate fluctuating throughput using RxJS
  useEffect(() => {
    // baseRate remains stable to avoid dependency loop; varying component uses previous rate
    const baseRate = 120
    const sub = interval(1000)
      .pipe(
        map((i) => (Math.sin(i / 5) + 1) * 0.5),
        scan((acc, v) => Math.round(baseRate * (0.8 + v * 0.4)), 0),
        startWith(baseRate)
      )
      .subscribe((v) => {
        setRate(v)
        setLag((prev) => (v > baseRate ? Math.max(0, prev - 0.1) : Math.min(5, prev + 0.1)))
      })
    return () => sub.unsubscribe()
  }, [])

  const totalLatency = useMemo(() => processors.reduce((s, p) => s + p.latencyMs, 0), [])

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <h2 style={{ marginTop: 0 }}>Stream Processors</h2>
        <div className="muted" style={{ fontSize: 13 }}>Demo of stream processor functionality and KPIs</div>
      </div>

      {processors.map((p) => (
        <div key={p.id} className="card">
          <h3 style={{ marginTop: 0 }}>{p.name}</h3>
          <div className="muted" style={{ fontSize: 13 }}>Input: {p.input} → Output: {p.output}</div>
          <div className="row" style={{ marginTop: 8 }}>
            <div>Latency: {p.latencyMs} ms</div>
            <div className="spacer" />
            <div>Lag: {lag}s</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <StreamChart value={rate} />
          </div>
        </div>
      ))}

      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="row">
          <strong>Total Pipeline Latency</strong>
          <div className="spacer" />
          <span>{totalLatency} ms</span>
        </div>
      </div>
    </div>
  )
}
