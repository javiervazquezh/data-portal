export default function SearchBar({ value, onChange, placeholder = 'Search products, topics, owners…' }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label="Search"
      style={{ width: '100%' }}
    />
  )
}
