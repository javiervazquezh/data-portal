export default function ProductCard({ product, onSubscribe, onOpen }) {
  const { name, topic, owner, description, tags } = product
  return (
    <div className="card" role="button" tabIndex={0} onClick={() => onOpen?.(product)} onKeyDown={(e) => e.key === 'Enter' && onOpen?.(product)} aria-label={`Product ${name}`}>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: '4px 0 8px' }}>{name}</h3>
          <div className="muted" style={{ fontSize: 13 }}>Topic: {topic} • Owner: {owner}</div>
        </div>
        <div className="spacer" />
        <button onClick={(e) => { e.stopPropagation(); onSubscribe?.(product) }}>Subscribe</button>
      </div>
      <p style={{ marginTop: 8 }}>{description}</p>
      <div className="row" style={{ flexWrap: 'wrap' }}>
        {tags?.map((t) => (
          <span key={t} className="muted" style={{ border: '1px solid var(--td-border)', padding: '2px 8px', borderRadius: 999, fontSize: 12 }}>
            #{t}
          </span>
        ))}
      </div>
    </div>
  )
}
