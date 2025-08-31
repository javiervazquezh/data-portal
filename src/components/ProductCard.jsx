import { FiUser, FiMessageCircle, FiActivity, FiBarChart2, FiDatabase } from 'react-icons/fi'
export default function ProductCard({ product, onOpen }) {
  const { name, topic, owner, description, tags, type, messagesPerSec, retentionDays } = product
  return (
  <div className="card" role="button" tabIndex={0} onClick={() => onOpen?.(product)} onKeyDown={(e) => e.key === 'Enter' && onOpen?.(product)} aria-label={`Product ${name}`} style={{ cursor: 'pointer' }}>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: '4px 0 8px' }}>{name}</h3>
          <div className="muted" style={{ fontSize: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              border: type === 'analytics' ? '1px solid rgba(0,102,204,0.35)' : '1px solid rgba(0,177,79,0.35)',
              padding: '1px 6px',
              borderRadius: 999,
              fontSize: 11,
              background: type === 'analytics' ? 'rgba(0,102,204,0.12)' : 'rgba(0,177,79,0.15)',
              color: type === 'analytics' ? '#0b3d91' : 'var(--td-deep)'
            }}>
              {type === 'analytics' ? (<><FiBarChart2 style={{ verticalAlign: '-2px' }} /> Analytics</>) : (<><FiActivity style={{ verticalAlign: '-2px' }} /> Stream</>)}
            </span>
            {type === 'stream' && topic && (
              <span><FiMessageCircle style={{ verticalAlign: '-2px' }} /> {topic}</span>
            )}
            <span><FiUser style={{ verticalAlign: '-2px' }} /> {owner}</span>
            {type === 'analytics' ? (
              <span className="muted"><FiDatabase style={{ verticalAlign: '-2px' }} /> Databricks</span>
            ) : (
              <span className="muted">Retention: {retentionDays != null ? `${retentionDays}d` : '—'}</span>
            )}
          </div>
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
