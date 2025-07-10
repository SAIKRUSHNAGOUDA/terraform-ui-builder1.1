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

      const id = `${type}-${+new Date()}`;

      const newNode = {
        id,
        type: "default",
        position,
        data: {
          label: (
            <div className="p-2 rounded-md shadow-md border bg-white flex items-center space-x-2">
              <img
                src={`/icons/${type}.png`}
                alt={type}
                className="w-6 h-6"
                onError={(e) => (e.target.style.display = "none")}
              />
              <span className="font-semibold">{type.toUpperCase()}</span>
            </div>
          ),
        },
        style: {
          borderRadius: 12,
          padding: 10,
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

  const onNodeClick = (_event, node) => {
    setSelectedNode(node);
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

  const renderConfigPanel = () => {
    if (!selectedNode) return null;
    const id = selectedNode.id;
    const type = id.split("-")[0];
    const config = configMap[id] || {};

    return (
      <div className="p-4 border-l border-gray-300 bg-white h-full">
        <h2 className="text-lg font-semibold mb-4">Edit {type.toUpperCase()} Config</h2>
        {type === "ec2" && (
          <>
            <label className="block mb-2">
              AMI:
              <input
                type="text"
                name="ami"
                value={config.ami || ""}
                onChange={handleConfigChange}
                className="w-full p-2 border rounded"
              />
            </label>
            <label className="block mb-2">
              Instance Type:
              <input
                type="text"
                name="instance_type"
                value={config.instance_type || ""}
                onChange={handleConfigChange}
                className="w-full p-2 border rounded"
              />
            </label>
          </>
        )}
        {type === "s3" && (
          <label className="block mb-2">
            ACL:
            <input
              type="text"
              name="acl"
              value={config.acl || ""}
              onChange={handleConfigChange}
              className="w-full p-2 border rounded"
            />
          </label>
        )}
        {type === "vpc" && (
          <label className="block mb-2">
            CIDR Block:
            <input
              type="text"
              name="cidr_block"
              value={config.cidr_block || ""}
              onChange={handleConfigChange}
              className="w-full p-2 border rounded"
            />
          </label>
        )}
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setSelectedNode(null)}
        >
          Save Changes
        </button>
      </div>
    );
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
            onNodeClick={onNodeClick}
            fitView
          >
            <MiniMap />
            <Controls showInteractive={true} />
            <Background
              variant="dots"
              gap={20}
              size={1}
              color="#D3D3D3"
            />
          </ReactFlow>

          <div className="absolute bottom-0 left-0 bg-white p-2 z-10 flex space-x-2">
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
            <button
              onClick={() => reactFlowInstance?.zoomTo(1)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Reset Zoom
            </button>
          </div>
        </div>

        <div className="w-1/3 p-4 bg-gray-100 overflow-auto">
          <pre>{code}</pre>
        </div>

        {renderConfigPanel()}
      </div>
    </ReactFlowProvider>
  );
};

export default App;
