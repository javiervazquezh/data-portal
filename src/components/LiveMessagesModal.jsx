import { useEffect, useMemo, useRef, useState } from 'react'
import { interval } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { FiX } from 'react-icons/fi'

export default function LiveMessagesModal({ product, onClose }) {
  const [messages, setMessages] = useState([])
  const stopRef = useRef(false)
  const bottomRef = useRef(null)

  const fields = useMemo(() => {
    // Support both record.fields and table.columns shapes
    if (product?.schema?.fields) return product.schema.fields
    if (product?.schema?.columns) return product.schema.columns
    return []
  }, [product])

  useEffect(() => {
    stopRef.current = false
    const intervalPerSec = Math.min(Math.max(product?.messagesPerSec || 5, 1), 10)
    const period = Math.max(1000 / intervalPerSec, 100)
    const destroy = { closed: false }

    const sub = interval(period)
      .pipe(takeUntil({ subscribe: (observer) => ({ unsubscribe: () => (destroy.closed = true) }) }))
      .subscribe(() => {
        if (destroy.closed || stopRef.current) return
        const msg = generateMessage(fields)
        setMessages((prev) => {
          const next = [...prev, msg]
          // keep last 200
          return next.length > 200 ? next.slice(-200) : next
        })
      })

    return () => {
      destroy.closed = true
      sub.unsubscribe()
    }
  }, [fields, product?.messagesPerSec])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Live messages">
      <div className="modal">
        <div className="row" style={{ alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Live messages — {product?.topic}</h3>
          <div className="spacer" />
          <button className="icon" onClick={onClose} aria-label="Close live messages"><FiX /></button>
        </div>
        <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
          Simulated at up to {Math.min(Math.max(product?.messagesPerSec || 5, 1), 10)} msg/s. Messages reflect the product schema.
        </div>
        <div style={{ marginTop: 12, border: '1px solid var(--td-border)', borderRadius: 8, background: '#ffffff', maxHeight: '50vh', overflow: 'auto', padding: 8 }}>
          {messages.map((m, i) => (
            <pre key={i} style={{ margin: 0, padding: 8, borderBottom: '1px solid var(--td-border)' }}>{JSON.stringify(m, null, 2)}</pre>
          ))}
          <div ref={bottomRef} />
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
