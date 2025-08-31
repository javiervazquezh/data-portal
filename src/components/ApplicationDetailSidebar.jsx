import { useEffect, useMemo, useState } from 'react'
import { FiX, FiGitBranch } from 'react-icons/fi'
import useStore from '../store/useStore.js'
import LineageModal from './LineageModal.jsx'
import ProductMultiSelect from './ProductMultiSelect.jsx'

export default function ApplicationDetailSidebar({ app, onClose }) {
  const products = useStore((s) => s.products)
  const subs = useStore((s) => s.subscriptions)
  const subscribe = useStore((s) => s.subscribe)
  const removeSubscription = useStore((s) => s.removeSubscription)
  const updateApp = useStore((s) => s.updateApplication)
  const [local, setLocal] = useState(app)
  const [showLineage, setShowLineage] = useState(false)
  const [selectedPids, setSelectedPids] = useState([])
  const [initialPids, setInitialPids] = useState([])

  useEffect(() => { setLocal(app) }, [app])

  const appProductIds = useMemo(() => (subs || []).filter((e) => e.from.type === 'application' && e.from.id === app.id).map((e) => e.to.id), [subs, app?.id])
  useEffect(() => { setSelectedPids(appProductIds); setInitialPids(appProductIds) }, [appProductIds])

  if (!app) return null

  return (
    <div className="sidebar-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
        <button className="sidebar-close" onClick={onClose} aria-label="Close"><FiX /></button>
        <h2 style={{ marginTop: 0 }}>{local.name}</h2>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <label>
            <div className="muted">Owner</div>
            <input value={local.owner || ''} onChange={(e) => setLocal({ ...local, owner: e.target.value })} />
          </label>
          <label>
            <div className="muted">Team</div>
            <input value={local.team || ''} onChange={(e) => setLocal({ ...local, team: e.target.value })} />
          </label>
          <label>
            <div className="muted">Malcode</div>
            <input value={local.malcode || ''} onChange={(e) => setLocal({ ...local, malcode: e.target.value })} />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            <div className="muted">Description</div>
            <textarea rows={3} value={local.description || ''} onChange={(e) => setLocal({ ...local, description: e.target.value })} />
          </label>
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="muted">Subscriptions</div>
            <ProductMultiSelect products={products} value={selectedPids} onChange={setSelectedPids} />
            <small className="muted">Manage product subscriptions to build lineage.</small>
          </div>
          <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowLineage(true) }}>
              <FiGitBranch style={{ verticalAlign: '-2px' }} /> View lineage
            </a>
          </div>
        </div>
        <div className="row" style={{ marginTop: 12, gap: 8 }}>
          <button className="btn-outline" onClick={onClose}>Close</button>
          <button onClick={() => {
            // Apply subscription diffs
            const prev = new Set(initialPids)
            const next = new Set(selectedPids)
            // Removes
            prev.forEach((pid) => { if (!next.has(pid)) removeSubscription({ fromType: 'application', fromId: app.id, toProductId: pid }) })
            // Adds
            next.forEach((pid) => { if (!prev.has(pid)) subscribe({ fromType: 'application', fromId: app.id, toProductId: pid }) })
            updateApp(local)
            onClose?.()
          }}>Save</button>
        </div>
      </aside>
      {showLineage && (
        <LineageModal onClose={() => setShowLineage(false)} nodes={buildAppNodes(app, products, subs)} edges={buildAppEdges(app, subs)} />
      )}
    </div>
  )
}

function buildAppNodes(app, products, subs) {
  const nodes = [{ id: `application:${app.id}`, position: { x: 300, y: 180 }, data: { label: `App: ${app.name}` }, style: styleForApplication() }]
  const prodMap = Object.fromEntries(products.map((p) => [p.id, p]))
  subs.filter((e) => e.from.type === 'application' && e.from.id === app.id).forEach((e, idx) => {
    const p = prodMap[e.to.id]
    if (p) nodes.push({ id: `product:${p.id}`, position: { x: 120, y: 80 + idx * 80 }, data: { label: p.name }, style: styleForProduct(p) })
  })
  return nodes
}

function buildAppEdges(app, subs) {
  const edges = []
  subs.filter((e) => e.from.type === 'application' && e.from.id === app.id).forEach((e, idx) => {
    edges.push({ id: `e-${idx}`, source: `product:${e.to.id}`, target: `application:${app.id}`, animated: true, style: { stroke: '#10a14b' } })
  })
  return edges
}

function styleForProduct(p) {
  if (!p) return undefined
  if (p.type === 'analytics') {
    return {
      background: 'rgba(0,102,204,0.12)',
      border: '1px solid rgba(0,102,204,0.35)',
      color: '#0b3d91',
      borderRadius: 8,
      padding: 6,
    }
  }
  return {
    background: 'rgba(0,177,79,0.15)',
    border: '1px solid rgba(0,177,79,0.35)',
    color: 'var(--td-deep)',
    borderRadius: 8,
    padding: 6,
  }
}

function styleForApplication() {
  // Distinct application color (purple hue)
  return {
    background: 'rgba(128, 0, 128, 0.10)',
    border: '1px solid rgba(128, 0, 128, 0.35)',
    color: '#4b0082',
    borderRadius: 8,
    padding: 6,
  }
}
