import { useEffect } from 'react'
import StreamChart from './StreamChart.jsx'

export default function ProductDetailSidebar({ product, onClose, onSubscribe }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!product) return null

  return (
    <div className="sidebar-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: 0 }}>{product.name}</h2>
            <div className="muted" style={{ fontSize: 13 }}>Topic: {product.topic} • Owner: {product.owner}</div>
          </div>
          <div className="spacer" />
          <button onClick={onClose} aria-label="Close">Close</button>
        </div>

        <p style={{ marginTop: 12 }}>{product.description}</p>

        <div className="row" style={{ flexWrap: 'wrap' }}>
          {product.tags?.map((t) => (
            <span key={t} className="muted" style={{ border: '1px solid var(--td-border)', padding: '2px 8px', borderRadius: 999, fontSize: 12 }}>
              #{t}
            </span>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <strong className="muted" style={{ fontSize: 12 }}>Schema</strong>
          <pre style={{ background: '#ffffff', border: '1px solid var(--td-border)', padding: 8, borderRadius: 8, overflow: 'auto' }}>{JSON.stringify(product.schema, null, 2)}</pre>
        </div>

        <div style={{ marginTop: 16 }}>
          <strong className="muted" style={{ fontSize: 12 }}>Throughput</strong>
          <StreamChart value={product.messagesPerSec} />
        </div>

        <div className="row" style={{ marginTop: 16 }}>
          <button onClick={() => onSubscribe?.(product)}>Subscribe</button>
          <div className="muted">msg/s: ~{product.messagesPerSec}</div>
        </div>
      </aside>
    </div>
  )
}
