import React, { useState, useCallback } from 'react';
import { 
  Network, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges, 
  NodeChange,
  EdgeChange,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { 
    id: '1', 
    position: { x: 250, y: 50 }, 
    data: { label: 'Basic Math & Logic (95%)' }, 
    style: { background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#064e3b', fontWeight: 'bold' }
  },
  { 
    id: '2', 
    position: { x: 250, y: 150 }, 
    data: { label: '⚠️ Recursion & Call Stack (52%)' },
    style: { background: '#fef2f2', border: '2px solid #ef4444', color: '#7f1d1d', fontWeight: 'bold' }
  },
  { 
    id: '3', 
    position: { x: 100, y: 250 }, 
    data: { label: 'Memoization (68%)' },
    style: { background: '#fff', border: '1px solid #e5e7eb', color: '#1f2937', fontWeight: '500' }
  },
  { 
    id: '4', 
    position: { x: 400, y: 250 }, 
    data: { label: 'Dynamic Programming (45%)' },
    style: { background: '#eef2ff', border: '1px solid #c7d2fe', color: '#312e81', fontWeight: 'bold' }
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4', animated: true },
];

export const KnowledgeGraph: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNodeData(node);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto transition-colors">
      
      {/* Header */}
      <div className="saas-panel p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>Interactive Flowchart & Mind Maps</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Concept Dependency Graph</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Auto-generated explorable node-based mind maps from uploaded PDFs.
          </p>
        </div>

        <button className="btn-secondary text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 px-4 py-2">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-generate Map</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph Canvas */}
        <div className="lg:col-span-2 saas-card bg-white dark:bg-gray-800 dark:border-gray-700 p-0 overflow-hidden relative h-[500px] flex flex-col rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Map Explorer
            </h3>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Mastered</span>
              <span className="flex items-center gap-1.5 text-red-600"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Gap</span>
            </div>
          </div>
          <div className="flex-1 w-full h-full">
            <ReactFlow 
              nodes={nodes} 
              edges={edges} 
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              fitView
              className="bg-gray-50 dark:bg-gray-900"
            >
              <Controls />
              <Background gap={12} size={1} />
            </ReactFlow>
          </div>
        </div>

        {/* Inspector */}
        <div className="space-y-6">
          <div className="saas-card p-6 bg-white dark:bg-gray-800 dark:border-gray-700 space-y-4 rounded-xl shadow-sm h-[500px]">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="badge-accent">Node Inspector</span>
            </div>

            {selectedNodeData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{selectedNodeData.data.label.replace('⚠️ ', '')}</h3>
                  <p className="text-xs text-gray-500 mt-1">Cognitive Twin gap score & roadmap status</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Concept Benchmark</span>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full w-[52%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 pt-1">
                      <span>52% Mastery</span>
                      <span className="text-red-500 font-semibold">Needs Review</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-900 dark:text-red-300 space-y-2">
                    <p className="font-bold flex items-center gap-1.5 text-red-700 dark:text-red-400">
                      <AlertTriangle className="w-4 h-4" /> AI Recommendation
                    </p>
                    <p className="text-xs leading-relaxed opacity-90">
                      Before tackling Dynamic Programming, complete 3 practice quizzes on Recursion call stack frames.
                    </p>
                  </div>
                </div>

                <button className="btn-primary w-full text-sm py-2.5 mt-2">
                  Generate Flashcards ▶
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-2">
                <Info className="w-8 h-8" />
                <p className="text-sm font-medium">Click any node to inspect details</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
