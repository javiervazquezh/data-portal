import { FiX } from 'react-icons/fi'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

export default function LineageModal({ onClose, nodes = [], edges = [] }) {
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
