import { FiUser, FiMessageCircle, FiActivity, FiBarChart2 } from 'react-icons/fi'
export default function ProductCard({ product, onSubscribe, onOpen }) {
  const { name, topic, owner, description, tags, type, window: windowSize, messagesPerSec, retentionDays } = product
  return (
    <div className="card" role="button" tabIndex={0} onClick={() => onOpen?.(product)} onKeyDown={(e) => e.key === 'Enter' && onOpen?.(product)} aria-label={`Product ${name}`}>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: '4px 0 8px' }}>{name}</h3>
          <div className="muted" style={{ fontSize: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              border: `1px solid ${type === 'analytics' ? 'rgba(16,161,75,0.25)' : 'rgba(0,177,79,0.30)'}`,
              padding: '1px 6px',
              borderRadius: 999,
              fontSize: 11,
              background: type === 'analytics' ? 'rgba(16,161,75,0.10)' : 'rgba(0,177,79,0.15)',
              color: 'var(--td-deep)'
            }}>
              {type === 'analytics' ? (<><FiBarChart2 style={{ verticalAlign: '-2px' }} /> Analytics</>) : (<><FiActivity style={{ verticalAlign: '-2px' }} /> Stream</>)}
            </span>
            {type === 'stream' && topic && (
              <span><FiMessageCircle style={{ verticalAlign: '-2px' }} /> {topic}</span>
            )}
            <span><FiUser style={{ verticalAlign: '-2px' }} /> {owner}</span>
            {type === 'analytics' ? (
              <span className="muted">Window: {windowSize || '—'}</span>
            ) : (
              <span className="muted">Retention: {retentionDays != null ? `${retentionDays}d` : '—'}</span>
            )}
          </div>
        </div>
        <div className="spacer" />
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); onSubscribe?.(product) }}>Subscribe</button>
        </div>
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
