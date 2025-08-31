import { useMemo, useRef, useState, useEffect } from 'react'

export default function ProductMultiSelect({ products = [], value = [], onChange, placeholder = 'Search products…' }) {
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const selected = useMemo(() => new Set(value), [value])
  const suggestions = useMemo(() => {
    const t = term.trim().toLowerCase()
    if (!t) return []
    const max = 20
    const out = []
    for (const p of products) {
      const hay = [p.name, p.topic, p.owner, ...(p.tags || [])].filter(Boolean).join(' ').toLowerCase()
      if (hay.includes(t)) out.push(p)
      if (out.length >= max) break
    }
    // De-emphasize already-selected ones by ordering them last
    return out.sort((a, b) => (selected.has(a.id) === selected.has(b.id) ? 0 : selected.has(a.id) ? 1 : -1))
  }, [products, term, selected])

  const add = (id) => { if (!selected.has(id)) onChange?.([...value, id]) }
  const remove = (id) => { if (selected.has(id)) onChange?.(value.filter((x) => x !== id)) }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        placeholder={placeholder}
        value={term}
        onFocus={() => setOpen(true)}
        onChange={(e) => { setTerm(e.target.value); setOpen(true) }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
        {value.map((id) => {
          const p = products.find((x) => x.id === id)
          if (!p) return null
          return (
            <span key={id} className="muted" style={{ border: '1px solid var(--td-border)', padding: '2px 8px', borderRadius: 999, fontSize: 12 }}>
              {p.name} <button className="btn-outline" style={{ marginLeft: 6, padding: '0 6px' }} onClick={() => remove(id)}>×</button>
            </span>
          )
        })}
      </div>
      {open && suggestions.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid var(--td-border)', borderRadius: 8, marginTop: 6, maxHeight: 280, overflowY: 'auto', zIndex: 2000, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
          {suggestions.map((p) => {
            const isSel = selected.has(p.id)
            return (
              <div key={p.id} onMouseDown={(e) => e.preventDefault()} onClick={() => { isSel ? remove(p.id) : add(p.id); inputRef.current?.focus() }} style={{ padding: '8px 10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', background: isSel ? '#f1f6f3' : '#fff' }}>
                <div>
                  <div>{p.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{p.owner}{p.topic ? ` · ${p.topic}` : ''}</div>
                </div>
                <div style={{ color: 'var(--td-muted)', fontSize: 12 }}>{isSel ? 'Selected' : 'Add'}</div>
              </div>
            )
          })}
        </div>
      )}
      {!term && (
        <small className="muted">Type to search. Selected: {value.length}</small>
      )}
    </div>
  )}
