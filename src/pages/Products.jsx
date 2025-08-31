import { useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import ProductCard from '../components/ProductCard.jsx'
import ProductDetailSidebar from '../components/ProductDetailSidebar.jsx'
import SearchBar from '../components/SearchBar.jsx'
import useStore from '../store/useStore.js'

export default function Products() {
  const { products, subscribeToProduct, deleteProduct } = useStore()
  const [selected, setSelected] = useState(null)
  const [q, setQ] = useState('')

  const fuse = useMemo(() => new Fuse(products, { threshold: 0.35, keys: ['name', 'topic', 'owner', 'tags'] }), [products])
  const owners = useMemo(() => Array.from(new Set(products.map((p) => p.owner))).sort(), [products])
  const normalized = q.trim().toLowerCase()
  const matchedOwner = useMemo(() => owners.find((o) => o.toLowerCase() === normalized), [owners, normalized])
  const list = matchedOwner
    ? products.filter((p) => p.owner.toLowerCase() === normalized)
    : (q ? fuse.search(q).map((r) => r.item) : products)

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
  <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Data Products</h2>
          <div className="spacer" />
          <SearchBar value={q} onChange={setQ} />
        </div>
  {/* Removed simulated streaming subtitle */}
      </div>

      {list.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onSubscribe={subscribeToProduct}
          onOpen={setSelected}
        />
      ))}

      <ProductDetailSidebar product={selected} onClose={() => setSelected(null)} onSubscribe={subscribeToProduct} />
    </div>
  )
}
