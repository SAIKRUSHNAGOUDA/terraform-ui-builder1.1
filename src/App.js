import React, { useState, useCallback, useEffect } from "react";
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
import { generateTerraformCode } from "./generateCodeHandler";

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [code, setCode] = useState("");
  const [configMap, setConfigMap] = useState({});
  const [platform, setPlatform] = useState("aws");
  const [region, setRegion] = useState("us-east-1");

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const fullType = event.dataTransfer.getData("application/reactflow"); // e.g., "azure-vm"
      if (!fullType || !reactFlowInstance) return;

      const [platformFromDrag, typeFromDrag] = fullType.split("-");
      const id = `${fullType}-${Date.now()}`;
      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id,
        type: "default",
        position,
        data: {
          label: (
            <div className="flex items-center space-x-2">
              <img
                src={`/icons/${typeFromDrag}.png`}
                alt={typeFromDrag}
                className="w-5 h-5"
                onError={(e) => (e.target.style.display = "none")}
              />
              <span>{typeFromDrag.toUpperCase()}</span>
            </div>
          ),
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setConfigMap((prev) => ({
        ...prev,
        [id]: {
          platform: platformFromDrag.toLowerCase(),
          region,
        },
      }));
    },
    [reactFlowInstance, region]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const generateCode = () => {
    if (nodes.length === 0) {
      setCode("");
      return;
    }
    const tfCode = generateTerraformCode(nodes, configMap, platform, region);
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
        <div className="w-64 bg-gray-200 p-4">
          <Sidebar
            platform={platform}
            region={region}
            onPlatformChange={setPlatform}
            onRegionChange={(e) => setRegion(e.target.value)}
          />
        </div>

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

          <div className="absolute bottom-0 left-0 bg-white p-2 z-10 flex gap-2">
            <button
              onClick={generateCode}
              className="bg-blue-500 text-white px-4 py-2 rounded"
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
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default App;
