import { useMemo, useState } from 'react'
import useStore from '../store/useStore.js'
import ApplicationDetailSidebar from '../components/ApplicationDetailSidebar.jsx'

function AppCard({ app, onOpen }) {
  return (
    <div className="card" role="button" tabIndex={0} onClick={() => onOpen?.(app)} onKeyDown={(e) => e.key === 'Enter' && onOpen?.(app)}>
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
  const products = useStore((s) => s.products)
  const subs = useStore((s) => s.subscriptions)
  const subscribe = useStore((s) => s.subscribe)
  const updateApp = useStore((s) => s.updateApplication)
  const [selected, setSelected] = useState(null)
  const appSubs = useMemo(() => (appId) => (subs || []).filter((e) => e.from.type === 'application' && e.from.id === appId).map((e) => e.to.id), [subs])
  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>My Applications</h2>
        </div>
      </div>
      {(apps && apps.length ? apps : []).map((a) => (
        <AppCard key={a.id} app={a} onOpen={setSelected} />
      ))}
      {selected && (
        <ApplicationDetailSidebar app={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
