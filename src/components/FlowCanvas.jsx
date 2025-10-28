import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState
} from "reactflow";
import "reactflow/dist/base.css";

const initialNodes = [
  { id: "1", position: { x: 250, y: 5 }, data: { label: "Start" }, type: "input" },
  { id: "2", position: { x: 250, y: 150 }, data: { label: "API Call" } },
  { id: "3", position: { x: 250, y: 300 }, data: { label: "End" }, type: "output" }
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="flow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
