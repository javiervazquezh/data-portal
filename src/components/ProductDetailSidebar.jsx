import { useEffect, useState } from 'react'
import { FiUser, FiMessageCircle, FiCode, FiActivity, FiGitBranch, FiX } from 'react-icons/fi'
import LiveMessagesModal from './LiveMessagesModal.jsx'
import LineageModal from './LineageModal.jsx'

export default function ProductDetailSidebar({ product, onClose, onSubscribe }) {
  const [showLive, setShowLive] = useState(false)
  const [showLineage, setShowLineage] = useState(false)
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!product) return null

  return (
    <div className="sidebar-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
        <button className="sidebar-close" onClick={onClose} aria-label="Close"><FiX /></button>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: 0 }}>{product.name}</h2>
            <div className="muted" style={{ fontSize: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              {product.type === 'stream' && product.topic && (
                <span><FiMessageCircle style={{ verticalAlign: '-2px' }} /> {product.topic}</span>
              )}
              <span><FiUser style={{ verticalAlign: '-2px' }} /> {product.owner}</span>
            </div>
          </div>
          <div className="spacer" />
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
          <strong className="muted" style={{ fontSize: 12 }}><FiCode style={{ verticalAlign: '-2px' }} /> Schema</strong>
          {product.type === 'analytics' && product.schema?.type === 'table' ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff', border: '1px solid var(--td-border)', borderRadius: 8 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--td-border)' }}>Column</th>
                    <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--td-border)' }}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {product.schema.columns?.map((c) => (
                    <tr key={c.name}>
                      <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--td-border)' }}>{c.name}</td>
                      <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--td-border)' }}>{c.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <pre style={{ background: '#ffffff', border: '1px solid var(--td-border)', padding: 8, borderRadius: 8, overflow: 'auto' }}>{JSON.stringify(product.schema, null, 2)}</pre>
          )}
        </div>

        {product.type === 'stream' && (
          <div className="row" style={{ marginTop: 16 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowLive(true) }}>
              <FiActivity style={{ verticalAlign: '-2px' }} /> View real-time messages
            </a>
          </div>
        )}
        <div className="row" style={{ marginTop: 8 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowLineage(true) }}>
            <FiGitBranch style={{ verticalAlign: '-2px' }} /> View lineage
          </a>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => onSubscribe?.(product)} style={{ alignSelf: 'flex-start' }}>Subscribe</button>
          {product.type === 'stream' && (
            <div className="muted">msg/s: ~{product.messagesPerSec}</div>
          )}
          {product.type === 'stream' && product.retentionDays != null && (
            <div className="muted">Retention: {product.retentionDays} days</div>
          )}
          {product.type === 'analytics' && product.window && (
            <div className="muted">Window: {product.window}</div>
          )}
        </div>
      </aside>
      {showLive && product.type === 'stream' && (
        <LiveMessagesModal product={product} onClose={() => setShowLive(false)} />
      )}
      {showLineage && (
        <LineageModal onClose={() => setShowLineage(false)} />
      )}
    </div>
  )
}
