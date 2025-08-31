import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSave, FiUser, FiCpu, FiTag, FiFileText } from 'react-icons/fi'
import useStore from '../store/useStore.js'
import ProductMultiSelect from '../components/ProductMultiSelect.jsx'

export default function RegisterApplication() {
  const addApplication = useStore((s) => s.addApplication)
  const subscribe = useStore((s) => s.subscribe)
  const products = useStore((s) => s.products)
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', team: '', owner: '', malcode: 'TRNPY', description: '', subscribesTo: [] })
  const onSubmit = (e) => {
    e.preventDefault()
    const payload = {
      id: crypto.randomUUID(),
      name: form.name || 'unnamed-app',
      team: form.team || '',
      owner: form.owner || '',
      malcode: form.malcode || 'TRNPY',
      description: form.description || '',
      createdAt: new Date().toISOString(),
    }
    addApplication(payload)
    // Build subscriptions
    for (const pid of form.subscribesTo || []) {
      subscribe({ fromType: 'application', fromId: payload.id, toProductId: pid })
    }
    navigate('/my-apps')
  }
  return (
    <div className="card" style={{ maxWidth: 960, marginInline: 'auto' }}>
      <h2 style={{ marginTop: 0 }}>Register Application</h2>
      <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
        Register a consuming application with basic ownership and the topics it uses.
      </div>
      <form onSubmit={onSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <label>
          <div className="muted"><FiCpu style={{ verticalAlign: '-2px' }} /> App Name</div>
          <input placeholder="e.g., risk-aggregator" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          <div className="muted">Subscribe to data products</div>
          <ProductMultiSelect products={products} value={form.subscribesTo} onChange={(ids) => setForm({ ...form, subscribesTo: ids })} />
        </label>
        <label>
          <div className="muted"><FiUser style={{ verticalAlign: '-2px' }} /> Owner</div>
          <input placeholder="e.g., cm-risk" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
        </label>
        <label>
          <div className="muted"><FiTag style={{ verticalAlign: '-2px' }} /> Team</div>
          <input placeholder="e.g., risk-platform" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} />
        </label>
        <label>
          <div className="muted">Malcode</div>
          <select value={form.malcode} onChange={(e) => setForm({ ...form, malcode: e.target.value })}>
            <option value="TRNPY">TRNPY</option>
            <option value="RCAPS">RCAPS</option>
            <option value="GED">GED</option>
            <option value="TDVDS">TDVDS</option>
          </select>
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          <div className="muted"><FiFileText style={{ verticalAlign: '-2px' }} /> Description</div>
          <textarea rows={4} placeholder="What does this app do?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
          <button type="submit"><FiSave style={{ verticalAlign: '-2px' }} /> Register</button>
        </div>
      </form>
    </div>
  )
}
