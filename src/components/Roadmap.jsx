import React, { useMemo } from 'react';
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

const Roadmap = ({ job }) => {
    const { nodes, edges } = useMemo(() => {
        if (!job || !job.roadmap) return { nodes: [], edges: [] };

        const nodes = job.roadmap.map((step, index) => ({
            id: `node-${index}`,
            data: { label: step },
            position: { x: 250, y: index * 100 },
            style: {
                background: index === 0 ? '#4f46e5' : '#1e293b',
                color: '#fff',
                border: '1px solid #4f46e5',
                borderRadius: '8px',
                padding: '10px',
                width: 200,
                fontSize: '12px',
                fontWeight: 'bold',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            }
        }));

        const edges = job.roadmap.slice(0, -1).map((_, index) => ({
            id: `edge-${index}`,
            source: `node-${index}`,
            target: `node-${index + 1}`,
            animated: true,
            style: { stroke: '#4f46e5' },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#4f46e5',
            },
        }));

        return { nodes, edges };
    }, [job]);

    return (
        <div style={{ width: '100%', height: '400px', background: '#0f172a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                attributionPosition="bottom-right"
            >
                <Background color="#334155" gap={20} />
                <Controls />
                <MiniMap 
                    nodeColor={(n) => n.style?.background || '#eee'}
                    maskColor="rgba(15, 23, 42, 0.6)"
                />
            </ReactFlow>
        </div>
    );
};

export default Roadmap;
