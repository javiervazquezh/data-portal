import { useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import ProductCard from '../components/ProductCard.jsx'
import ProductDetailSidebar from '../components/ProductDetailSidebar.jsx'
import SearchBar from '../components/SearchBar.jsx'
import useStore from '../store/useStore.js'

export default function Products() {
  const { products, subscribeToProduct } = useStore()
  const [selected, setSelected] = useState(null)
  const [q, setQ] = useState('')

  const fuse = useMemo(() => new Fuse(products, { threshold: 0.35, keys: ['name', 'topic', 'owner', 'tags'] }), [products])
  const owners = useMemo(() => Array.from(new Set(products.map((p) => p.owner))).sort(), [products])
  const normalized = q.trim().toLowerCase()
  const matchedOwner = useMemo(() => owners.find((o) => o.toLowerCase() === normalized), [owners, normalized])
  const list = matchedOwner
    ? products.filter((p) => p.owner.toLowerCase() === normalized)
    : (q ? fuse.search(q).map((r) => r.item) : products)

  // Build typeahead suggestions from product names, topics (streams only), owners, and tags
  const pool = useMemo(() => {
    const rows = []
    for (const p of products) {
      rows.push({ kind: 'name', label: p.name, value: p.name })
      if (p.type === 'stream' && p.topic) rows.push({ kind: 'topic', label: `Topic: ${p.topic}`, value: p.topic })
      rows.push({ kind: 'owner', label: `Owner: ${p.owner}`, value: p.owner })
      if (Array.isArray(p.tags)) for (const t of p.tags) rows.push({ kind: 'tag', label: `#${t}`, value: t })
    }
    return rows
  }, [products])

  const suggestions = useMemo(() => {
    const term = normalized
    if (!term) return []
    const seen = new Set()
    const out = []
    const starts = []
    const contains = []
    for (const s of pool) {
      const v = String(s.value).toLowerCase()
      if (v.startsWith(term)) {
        const key = s.kind + ':' + v
        if (!seen.has(key)) { seen.add(key); starts.push(s) }
      } else if (v.includes(term)) {
        const key = s.kind + ':' + v
        if (!seen.has(key)) { seen.add(key); contains.push(s) }
      }
    }
    const order = { name: 0, topic: 1, owner: 2, tag: 3 }
    starts.sort((a, b) => (order[a.kind] - order[b.kind]) || a.label.localeCompare(b.label))
    contains.sort((a, b) => (order[a.kind] - order[b.kind]) || a.label.localeCompare(b.label))
    out.push(...starts, ...contains)
    return out.slice(0, 8)
  }, [pool, normalized])

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <div className="spacer" />
          <SearchBar value={q} onChange={setQ} suggestions={suggestions} onSelect={(s) => setQ(s.value)} />
        </div>
      </div>

      {list.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onOpen={setSelected}
        />
      ))}

      <ProductDetailSidebar product={selected} onClose={() => setSelected(null)} onSubscribe={subscribeToProduct} />
    </div>
  )
}
