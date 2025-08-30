import { useState } from 'react'
import useStore from '../store/useStore.js'

export default function AddProduct() {
  const addProduct = useStore((s) => s.addProduct)
  const [form, setForm] = useState({ name: '', topic: '', owner: '', description: '', tags: '' })

  const onSubmit = (e) => {
    e.preventDefault()
    const payload = {
      id: crypto.randomUUID(),
      name: form.name || 'Untitled',
      topic: form.topic || 'topic.new',
      owner: form.owner || 'cm-data',
      description: form.description || 'New product',
      tags: form.tags ? form.tags.split(',').map((s) => s.trim()) : [],
      schema: { type: 'record', fields: [{ name: 'id', type: 'string' }] },
      messagesPerSec: 50 + Math.round(Math.random() * 200),
    }
    addProduct(payload)
    setForm({ name: '', topic: '', owner: '', description: '', tags: '' })
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Add Data Product</h2>
      <form onSubmit={onSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <label>
          <div className="muted">Name</div>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label>
          <div className="muted">Topic</div>
          <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
        </label>
        <label>
          <div className="muted">Owner</div>
          <input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
        </label>
        <label>
          <div className="muted">Tags (comma-separated)</div>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          <div className="muted">Description</div>
          <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit">Add Product</button>
        </div>
      </form>
    </div>
  )
}
