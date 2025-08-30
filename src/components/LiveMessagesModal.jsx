import { useEffect, useMemo, useRef, useState } from 'react'
import { interval } from 'rxjs'
import { FiX } from 'react-icons/fi'
import StreamChart from './StreamChart.jsx'

export default function LiveMessagesModal({ product, onClose }) {
  const [messages, setMessages] = useState([])
  const stopRef = useRef(false)
  const [paused, setPaused] = useState(false)
  const initialSpeed = 5
  const [speed, setSpeed] = useState(initialSpeed)

  const fields = useMemo(() => {
    // Support both record.fields and table.columns shapes
    if (product?.schema?.fields) return product.schema.fields
    if (product?.schema?.columns) return product.schema.columns
    return []
  }, [product])

  useEffect(() => {
    stopRef.current = false
    if (paused) return
  const period = Math.max(1000 / clamp(speed, 1, 10), 50)
    let cancelled = false
  const sub = interval(period).subscribe(() => {
      if (cancelled || stopRef.current) return
      const msg = generateMessage(fields)
      setMessages((prev) => {
    const next = [msg, ...prev]
    return next.length > 200 ? next.slice(0, 200) : next
      })
    })
    return () => { cancelled = true; sub.unsubscribe() }
  }, [fields, paused, speed])

  // Newest messages are added to the top; keep scroll position unchanged

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Live messages"
      onClick={(e) => { e.stopPropagation(); if (e.target === e.currentTarget) onClose?.() }}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="modal-close icon" onClick={onClose} aria-label="Close"><FiX /></button>
        <div className="row" style={{ alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Live messages — {product?.topic}</h3>
          <div className="spacer" />
        </div>
        <div style={{ marginTop: 8, marginBottom: 6 }}>
          <strong className="muted" style={{ fontSize: 12, display: 'inline-block', marginBottom: 4 }}>Throughput</strong>
          <StreamChart value={product?.messagesPerSec} />
        </div>
        <div className="row" style={{ gap: 8, alignItems: 'center', marginTop: 10 }}>
          <button onClick={() => setPaused((p) => !p)}>{paused ? 'Resume' : 'Pause'}</button>
          <label className="muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Speed</span>
            <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
            <strong style={{ fontSize: 12 }}>{speed} msg/s</strong>
          </label>
          <div className="spacer" />
        </div>
    <div
          style={{
            marginTop: 12,
            border: '1px solid var(--td-border)',
            borderRadius: 8,
            background: '#ffffff',
            overflowY: 'auto',
            // Fixed row height so we can size viewport to exactly 20 rows + header
            '--lm-row-h': '28px',
      // 15 data rows + 1 header row
      height: 'calc(var(--lm-row-h) * 16)'
          }}
        >
          {fields.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: 12 }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f7faf8' }}>
                <tr style={{ height: 'var(--lm-row-h)' }}>
                  {fields.map((f) => (
                    <th key={f.name} style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid var(--td-border)', position: 'sticky', top: 0, background: '#f7faf8', zIndex: 1 }}>{f.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map((m, i) => (
                  <tr key={i} style={{ height: 'var(--lm-row-h)' }}>
                    {fields.map((f) => (
                      <td key={f.name} style={{ padding: '4px 8px', borderBottom: '1px solid var(--td-border)', whiteSpace: 'nowrap' }}>
                        {formatCell(m[f.name])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: 8 }}>
              {messages.map((m, i) => (
                <pre key={i} style={{ margin: 0, padding: 8, borderBottom: '1px solid var(--td-border)' }}>{JSON.stringify(m, null, 2)}</pre>
              ))}
            </div>
          )}
          {/* Newest messages appear at the top; no autoscroll to bottom */}
        </div>
      </div>
    </div>
  )
}

function generateMessage(fields) {
  const obj = {}
  for (const f of fields) {
    const name = f.name || 'field'
    const type = (f.type || 'string').toLowerCase()
    obj[name] = genValue(name, type)
  }
  return obj
}

function genValue(name, type) {
  switch (type) {
    case 'int':
    case 'integer':
      return Math.floor(Math.random() * 1000)
    case 'double':
    case 'float':
      return parseFloat((Math.random() * 1000).toFixed(2))
    case 'boolean':
      return Math.random() < 0.5
    case 'timestamp':
    case 'datetime':
      return new Date().toISOString()
    case 'string':
    default:
      return genStringByName(name)
  }
}

function formatCell(v) {
  if (v == null) return ''
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  if (typeof v === 'number') return String(v)
  return String(v)
}

function genStringByName(name) {
  const lower = name.toLowerCase()
  if (lower.includes('trade') && lower.includes('id')) return randId()
  if (lower.includes('id')) return randId()
  if (lower.includes('symbol')) return pick(['TD', 'RY', 'BNS', 'BMO', 'CM', 'GS', 'AAPL', 'MSFT'])
  if (lower.includes('ccypair') || lower.includes('pair')) return pick(['USD/CAD', 'EUR/USD', 'GBP/USD', 'USD/JPY'])
  if (lower.includes('portfolio') || lower.includes('desk')) return pick(['Delta-1', 'Options', 'FX', 'Rates', 'Credit'])
  if (lower.includes('venue')) return pick(['NYSE', 'NASDAQ', 'TSX', 'LSE'])
  if (lower.includes('service')) return pick(['pricing-svc', 'enricher-svc', 'aggregator-svc'])
  return pick(['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot'])
}

function randId() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6)
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function clamp(n, min, max) { return Math.min(Math.max(n, min), max) }
