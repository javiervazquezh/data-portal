import { useEffect, useRef, useState } from 'react'
import { FiSearch, FiDatabase, FiServer, FiUser, FiTag } from 'react-icons/fi'

export default function SearchBar({ value, onChange, placeholder = 'Search data products, topics, owners…', suggestions = [], onSelect }) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  const flat = suggestions.map((s) => (typeof s === 'string' ? { label: s, value: s } : s))
  const show = open && flat.length > 0

  useEffect(() => {
    // Close on outside click
    const onDoc = (e) => {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    // Reset highlight when suggestions change (no default selection)
    setHighlight(-1)
  }, [flat.length])

  const handleKeyDown = (e) => {
    if (!show) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => (h + 1) % flat.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => (h - 1 + flat.length) % flat.length)
    } else if (e.key === 'Enter') {
      // Do not force a suggestion selection; allow Enter to search typed keywords
      setOpen(false)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const renderIcon = (kind) => {
    // name -> data product: database icon
    if (kind === 'name') return <FiDatabase aria-hidden="true" />
    // topic -> switch to server icon
    if (kind === 'topic') return <FiServer aria-hidden="true" />
    if (kind === 'owner') return <FiUser aria-hidden="true" />
    if (kind === 'tag') return <FiTag aria-hidden="true" />
    return null
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
      <FiSearch style={{ position: 'absolute', left: 10, top: 10, color: 'var(--td-muted)' }} />
      <input
        ref={inputRef}
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search"
        aria-autocomplete="list"
        aria-expanded={show}
        aria-controls="search-typeahead-list"
        style={{ width: '100%', paddingLeft: 32 }}
      />
      {show && (
        <div
          id="search-typeahead-list"
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 6,
            background: '#ffffff',
            border: '1px solid var(--td-border)',
            borderRadius: 8,
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            maxHeight: 240,
            overflowY: 'auto',
            zIndex: 1500,
          }}
        >
          {flat.map((s, i) => (
            <div
              key={s.value + i}
              role="option"
              aria-selected={i === highlight}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange?.(s.value); onSelect?.(s); setOpen(false) }}
              style={{
                padding: '8px 10px',
                cursor: 'pointer',
                background: i === highlight ? '#f1f6f3' : '#ffffff',
                color: 'var(--td-text)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--td-muted)' }}>
                  {renderIcon(s.kind)}
                </span>
                <span>{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
