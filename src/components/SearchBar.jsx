import { FiSearch } from 'react-icons/fi'

export default function SearchBar({ value, onChange, placeholder = 'Search products, topics, owners…' }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <FiSearch style={{ position: 'absolute', left: 10, top: 10, color: 'var(--td-muted)' }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        style={{ width: '100%', paddingLeft: 32 }}
      />
    </div>
  )
}
