import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

const nodes = [
  { id: 'n1', position: { x: 0, y: 50 }, data: { label: 'trades.raw (topic)' }, style: styleTopic },
  { id: 'n2', position: { x: 260, y: 30 }, data: { label: 'Trade Enricher (processor)' }, style: styleProc },
  { id: 'n3', position: { x: 520, y: 50 }, data: { label: 'trades.enriched (topic)' }, style: styleTopic },
  { id: 'n4', position: { x: 780, y: 30 }, data: { label: 'Risk Aggregator (processor)' }, style: styleProc },
  { id: 'n5', position: { x: 1040, y: 50 }, data: { label: 'risk.metrics (topic)' }, style: styleTopic },
]

const edges = [
  { id: 'e1-2', source: 'n1', target: 'n2', animated: true, style: { stroke: '#10a14b' } },
  { id: 'e2-3', source: 'n2', target: 'n3', animated: true, style: { stroke: '#10a14b' } },
  { id: 'e3-4', source: 'n3', target: 'n4', animated: true, style: { stroke: '#10a14b' } },
  { id: 'e4-5', source: 'n4', target: 'n5', animated: true, style: { stroke: '#10a14b' } },
]

function styleTopic() {}
function styleProc() {}

// Backfill style objects after function declarations to avoid redeclaration in Vite HMR
const topicStyle = { background: '#ffffff', border: '1px solid var(--td-border)', color: 'var(--td-text)', padding: 8, borderRadius: 8 }
const procStyle = { background: 'rgba(16,161,75,0.10)', border: '1px solid var(--td-border)', color: 'var(--td-text)', padding: 8, borderRadius: 8 }
nodes.forEach((n) => {
  if (n.data.label.includes('(topic)')) n.style = topicStyle
  if (n.data.label.includes('(processor)')) n.style = procStyle
})

export default function Lineage() {
  return (
    <div className="card" style={{ height: 520 }}>
      <h2 style={{ marginTop: 0 }}>Lineage</h2>
      <div style={{ width: '100%', height: 440 }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background color="#1f2a2d" gap={16} />
          <MiniMap pannable zoomable />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}
