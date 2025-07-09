import React, { useState, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./Sidebar";
import { generateTerraformCode } from "./utils";

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [code, setCode] = useState("");

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");

      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${+new Date()}`,
        type: "default",
        position,
        data: {
          label: (
            <div className="flex items-center space-x-2">
              <img
                src={`/icons/${type}.png`}
                alt={type}
                className="w-5 h-5"
                onError={(e) => (e.target.style.display = "none")}
              />
              <span>{type.toUpperCase()}</span>
            </div>
          ),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const generateCode = () => {
    const tfCode = generateTerraformCode(nodes);
    setCode(tfCode);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "main.tf";
    a.click();
  };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div
          className="flex-1 relative"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>

          <div className="absolute bottom-0 left-0 bg-white p-2 z-10">
            <button
              onClick={generateCode}
              className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Generate Code
            </button>
            <button
              onClick={downloadCode}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Download TF
            </button>
          </div>
        </div>

        <div className="w-1/3 p-4 bg-gray-100 overflow-auto">
          <pre>{code}</pre>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default App;
