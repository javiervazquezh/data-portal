import { FiUser, FiMessageCircle, FiTrash2, FiActivity, FiBarChart2 } from 'react-icons/fi'
export default function ProductCard({ product, onSubscribe, onOpen, onDelete }) {
  const { name, topic, owner, description, tags, type, window: windowSize, messagesPerSec, retentionDays } = product
  return (
    <div className="card" role="button" tabIndex={0} onClick={() => onOpen?.(product)} onKeyDown={(e) => e.key === 'Enter' && onOpen?.(product)} aria-label={`Product ${name}`}>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: '4px 0 8px' }}>{name}</h3>
          <div className="muted" style={{ fontSize: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ border: '1px solid var(--td-border)', padding: '1px 6px', borderRadius: 999, fontSize: 11, background: type === 'analytics' ? 'rgba(16,161,75,0.10)' : '#fff' }}>
              {type === 'analytics' ? (<><FiBarChart2 style={{ verticalAlign: '-2px' }} /> Analytics</>) : (<><FiActivity style={{ verticalAlign: '-2px' }} /> Stream</>)}
            </span>
            <span><FiMessageCircle style={{ verticalAlign: '-2px' }} /> {topic}</span>
            <span><FiUser style={{ verticalAlign: '-2px' }} /> {owner}</span>
            {type === 'analytics' ? (
              <span className="muted">Window: {windowSize}</span>
            ) : (
              <>
                <span className="muted">~{messagesPerSec} msg/s</span>
                {retentionDays != null && <span className="muted">Retention: {retentionDays}d</span>}
              </>
            )}
          </div>
        </div>
        <div className="spacer" />
        <div className="row" style={{ gap: 8 }}>
          <button onClick={(e) => { e.stopPropagation(); onSubscribe?.(product) }}>Subscribe</button>
          <button
            title="Delete"
            aria-label={`Delete ${name}`}
            onClick={(e) => { e.stopPropagation(); onDelete?.(product) }}
            style={{ background: 'transparent', color: '#b21b1b', border: '1px solid var(--td-border)' }}>
            <FiTrash2 />
          </button>
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
