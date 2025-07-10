// App.js
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
import { moduleUIMap as ConfigComponents } from "./modules/ModuleConfigMap";


const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [code, setCode] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [configMap, setConfigMap] = useState({});

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
    const tfCode = generateTerraformCode(nodes, configMap);
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

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfigMap((prev) => ({
      ...prev,
      [selectedNode.id]: {
        ...prev[selectedNode.id],
        [name]: value,
      },
    }));
  };

  const saveChanges = () => {
    const tfCode = generateTerraformCode(nodes, configMap);
    setCode(tfCode);
  };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 relative" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onNodeClick={(event, node) => setSelectedNode(node)}
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
          <h2 className="text-lg font-bold mb-2">Terraform Code</h2>
          <pre>{code}</pre>

          {selectedNode && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Edit Configuration</h3>
              {(() => {
                const type = selectedNode.id.split("-")[0];
                const Component = ConfigComponents[type];
                return Component ? (
                  <Component
                    config={configMap[selectedNode.id] || {}}
                    onChange={handleConfigChange}
                  />
                ) : (
                  <p className="text-sm text-red-500">No config UI for {type}</p>
                );
              })()}
              <button
                onClick={saveChanges}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default App;
