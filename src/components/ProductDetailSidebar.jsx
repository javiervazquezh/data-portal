import { useEffect, useMemo, useState } from 'react'
import { FiUser, FiMessageCircle, FiCode, FiActivity, FiGitBranch, FiX } from 'react-icons/fi'
import LiveMessagesModal from './LiveMessagesModal.jsx'
import LineageModal from './LineageModal.jsx'
import useStore from '../store/useStore.js'

export default function ProductDetailSidebar({ product, onClose, onSubscribe }) {
  const [showLive, setShowLive] = useState(false)
  const [showLineage, setShowLineage] = useState(false)
  const subscribe = useStore((s) => s.subscribe)
  const apps = useStore((s) => s.applications)
  const products = useStore((s) => s.products)
  const subs = useStore((s) => s.subscriptions)
  const [subscriber, setSubscriber] = useState({ type: 'application', id: '' })
  useEffect(() => { if (apps?.length && !subscriber.id) setSubscriber({ type: 'application', id: apps[0]?.id }) }, [apps])
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
          {product.type === 'stream' && product.retentionDays != null && (
            <div className="muted">Retention: {product.retentionDays} days</div>
          )}
          {product.type === 'analytics' && (
            <div className="muted">Source: Databricks</div>
          )}
          <div style={{ height: 1, background: 'var(--td-border)', margin: '8px 0' }} />
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <select value={`${subscriber.type}:${subscriber.id}`} onChange={(e) => {
              const [t, id] = e.target.value.split(':')
              setSubscriber({ type: t, id })
            }}>
              {apps?.map((a) => (
                <option key={`app:${a.id}`} value={`application:${a.id}`}>App: {a.name}</option>
              ))}
              {products?.filter((p) => p.id !== product.id).map((p) => (
                <option key={`prod:${p.id}`} value={`product:${p.id}`}>Product: {p.name}</option>
              ))}
            </select>
            <button onClick={() => subscriber.id && subscribe({ fromType: subscriber.type, fromId: subscriber.id, toProductId: product.id })}>Subscribe</button>
          </div>
          <div className="muted" style={{ fontSize: 12 }}>
            Subscribers: {subs.filter((e) => e.to.id === product.id).length}
          </div>
        </div>
      </aside>
      {showLive && product.type === 'stream' && (
        <LiveMessagesModal product={product} onClose={() => setShowLive(false)} />
      )}
      {showLineage && (
        <LineageModal onClose={() => setShowLineage(false)} nodes={buildNodes(product, products, apps, subs)} edges={buildEdges(product, subs)} />
      )}
    </div>
  )
}

function buildNodes(targetProduct, products, apps, subs) {
  // Collect upstream (providers) and downstream (subscribers) entities connected to targetProduct
  const prodMap = Object.fromEntries(products.map((p) => [p.id, p]))
  const nodes = []
  const byId = new Map()
  function push(node) { if (!byId.has(node.id)) { byId.set(node.id, true); nodes.push(node) } }
  // Center target
  push({ id: `product:${targetProduct.id}`, position: { x: 300, y: 180 }, data: { label: targetProduct.name } })
  // Upstream: who this product subscribes to
  subs.filter((e) => e.from.type === 'product' && e.from.id === targetProduct.id).forEach((e, idx) => {
    const src = prodMap[e.to.id]
    if (src) push({ id: `product:${src.id}`, position: { x: 100, y: 80 + idx * 80 }, data: { label: src.name } })
  })
  // Downstream: who subscribes to this product
  subs.filter((e) => e.to.id === targetProduct.id).forEach((e, idx) => {
    if (e.from.type === 'product') {
      const dst = prodMap[e.from.id]
      if (dst) push({ id: `product:${dst.id}`, position: { x: 500, y: 80 + idx * 80 }, data: { label: dst.name } })
    } else if (e.from.type === 'application') {
      const app = apps.find((a) => a.id === e.from.id)
      if (app) push({ id: `application:${app.id}`, position: { x: 520, y: 80 + idx * 80 }, data: { label: `App: ${app.name}` } })
    }
  })
  return nodes
}

function buildEdges(targetProduct, subs) {
  const edges = []
  // Edges from upstream providers -> target
  subs.filter((e) => e.from.type === 'product' && e.from.id === targetProduct.id).forEach((e, i) => {
    edges.push({ id: `up-${i}`, source: `product:${e.to.id}`, target: `product:${targetProduct.id}`, animated: true, style: { stroke: '#10a14b' } })
  })
  // Edges from target -> downstream subscribers
  subs.filter((e) => e.to.id === targetProduct.id).forEach((e, i) => {
    edges.push({ id: `down-${i}`, source: `product:${targetProduct.id}`, target: `${e.from.type}:${e.from.id}`, animated: true, style: { stroke: '#10a14b' } })
  })
  return edges
}
