import useStore from '../store/useStore.js'

function AppCard({ app }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{app.name}</h3>
      <div className="muted" style={{ fontSize: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>Owner: {app.owner || '—'}</span>
        <span>Team: {app.team || '—'}</span>
        <span>Malcode: {app.malcode || '—'}</span>
      </div>
      {app.description && <p style={{ marginTop: 8 }}>{app.description}</p>}
    </div>
  )
}

export default function MyApps() {
  const apps = useStore((s) => s.applications)
  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>My Applications</h2>
        </div>
      </div>
      {(apps && apps.length ? apps : []).map((a) => (
        <AppCard key={a.id} app={a} />
      ))}
    </div>
  )
}
