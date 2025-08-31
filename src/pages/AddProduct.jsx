import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiType, FiMessageCircle, FiUser, FiTag, FiFileText, FiClock, FiSave } from 'react-icons/fi'
import useStore from '../store/useStore.js'

export default function AddProduct() {
  const addProduct = useStore((s) => s.addProduct)
  const subscribe = useStore((s) => s.subscribe)
  const products = useStore((s) => s.products)
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', topic: '', owner: '', description: '', tags: '', type: 'stream', retentionDays: '', derivesFrom: [] })

  const onSubmit = (e) => {
    e.preventDefault()
  const isAnalytics = form.type === 'analytics'
  const payload = {
      id: crypto.randomUUID(),
      type: form.type,
      name: form.name || 'Untitled',
      owner: form.owner || 'cm-data',
      description: form.description || 'New product',
      tags: form.tags ? form.tags.split(',').map((s) => s.trim()) : [],
      schema: isAnalytics
        ? { type: 'table', columns: [{ name: 'id', type: 'string' }] }
  : { type: 'record', fields: [{ name: 'timestamp', type: 'timestamp' }, { name: 'id', type: 'string' }] },
      messagesPerSec: 50 + Math.round(Math.random() * 200),
    }
    if (!isAnalytics) payload.topic = form.topic || 'topic.new'
  if (form.type === 'stream' && form.retentionDays) payload.retentionDays = Number(form.retentionDays)
    addProduct(payload)
    // Create lineage edges for derived-from selections
    for (const pid of form.derivesFrom || []) {
      subscribe({ fromType: 'product', fromId: payload.id, toProductId: pid })
    }
  setForm({ name: '', topic: '', owner: '', description: '', tags: '', type: 'stream', retentionDays: '', derivesFrom: [] })
  }

  return (
    <div className="card" style={{ maxWidth: 960, marginInline: 'auto' }}>
      <div className="row" style={{ alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} aria-label="Back" style={{ background: 'transparent', border: '1px solid var(--td-border)' }}>
          <FiChevronLeft />
        </button>
        <h2 style={{ margin: '0 0 0 8px' }}>Register Data Product</h2>
        <div className="spacer" />
      </div>
      <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
        Create a new unified data product. Choose Stream for raw/derived streaming data or Analytics for historical datasets stored in Databricks.
      </div>
  <form onSubmit={onSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <div>
          <div className="muted"><FiType style={{ verticalAlign: '-2px' }} /> Type</div>
          <div className="row" role="group" aria-label="Product type" style={{ gap: 8 }}>
            <button type="button" onClick={() => setForm({ ...form, type: 'stream' })} aria-pressed={form.type === 'stream'}
              style={{ background: form.type === 'stream' ? 'var(--td-green)' : 'transparent', border: '1px solid var(--td-border)' }}>
              Stream
            </button>
            <button type="button" onClick={() => setForm({ ...form, type: 'analytics' })} aria-pressed={form.type === 'analytics'}
              style={{ background: form.type === 'analytics' ? 'var(--td-green)' : 'transparent', border: '1px solid var(--td-border)' }}>
              Analytics
            </button>
          </div>
          <small className="muted">Determines metadata and how it’s shown.</small>
        </div>
        <label>
          <div className="muted"><FiFileText style={{ verticalAlign: '-2px' }} /> Name</div>
          <input placeholder="e.g., Trades (Enriched)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        {form.type === 'stream' && (
          <label>
            <div className="muted"><FiMessageCircle style={{ verticalAlign: '-2px' }} /> Topic</div>
            <input placeholder="e.g., trades.enriched" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
            <small className="muted">Kafka topic name in Confluent Cloud.</small>
          </label>
        )}
        <label>
          <div className="muted"><FiUser style={{ verticalAlign: '-2px' }} /> Owner</div>
          <input placeholder="e.g., cm-trading" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
        </label>
  {/* Analytics products represent historical data; no window field */}
        {form.type === 'stream' && (
          <label>
            <div className="muted"><FiClock style={{ verticalAlign: '-2px' }} /> Retention (days)</div>
            <input type="number" min="1" placeholder="e.g., 7" value={form.retentionDays} onChange={(e) => setForm({ ...form, retentionDays: e.target.value })} />
            <small className="muted">Kafka topic retention policy in days.</small>
          </label>
        )}
        {/* For derived data products, select source products to establish lineage */}
        <label style={{ gridColumn: '1 / -1' }}>
          <div className="muted">Derives from</div>
          <select multiple value={form.derivesFrom} onChange={(e) => {
            const opts = Array.from(e.target.selectedOptions).map(o => o.value)
            setForm({ ...form, derivesFrom: opts })
          }}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <small className="muted">Choose existing products this one is derived from. This builds lineage via subscriptions.</small>
        </label>
        <label>
          <div className="muted"><FiTag style={{ verticalAlign: '-2px' }} /> Tags</div>
          <input placeholder="comma,separated,tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          <div className="muted"><FiFileText style={{ verticalAlign: '-2px' }} /> Description</div>
          <textarea rows={4} placeholder="What’s this product about?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => navigate(-1)} style={{ background: 'transparent', border: '1px solid var(--td-border)' }}>Cancel</button>
          <button type="submit"><FiSave style={{ verticalAlign: '-2px' }} /> Add Product</button>
        </div>
      </form>
    </div>
  )
}
