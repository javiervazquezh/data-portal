import { FiX } from 'react-icons/fi'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

const nodes = [
  { id: 'n1', position: { x: 0, y: 50 }, data: { label: 'trades.raw (topic)' } },
  { id: 'n2', position: { x: 260, y: 30 }, data: { label: 'Trade Enricher (processor)' } },
  { id: 'n3', position: { x: 520, y: 50 }, data: { label: 'trades.enriched (topic)' } },
  { id: 'n4', position: { x: 780, y: 30 }, data: { label: 'Risk Aggregator (processor)' } },
  { id: 'n5', position: { x: 1040, y: 50 }, data: { label: 'risk.metrics (topic)' } },
]

const edges = [
  { id: 'e1-2', source: 'n1', target: 'n2', animated: true, style: { stroke: '#10a14b' } },
  { id: 'e2-3', source: 'n2', target: 'n3', animated: true, style: { stroke: '#10a14b' } },
  { id: 'e3-4', source: 'n3', target: 'n4', animated: true, style: { stroke: '#10a14b' } },
  { id: 'e4-5', source: 'n4', target: 'n5', animated: true, style: { stroke: '#10a14b' } },
]

export default function LineageModal({ onClose }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Lineage" onClick={(e) => { e.stopPropagation(); if (e.target === e.currentTarget) onClose?.() }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: 'min(1000px, 95vw)' }}>
        <button className="modal-close icon" onClick={onClose} aria-label="Close"><FiX /></button>
        <h3 style={{ marginTop: 0, marginBottom: 10 }}>Lineage</h3>
        <div style={{ width: '100%', height: 520 }}>
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background color="#1f2a2d" gap={16} />
            <MiniMap pannable zoomable />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}
