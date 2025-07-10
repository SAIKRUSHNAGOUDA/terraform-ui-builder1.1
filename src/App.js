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
import { generateTerraformCode } from "./utils";

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [code, setCode] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodeConfigs, setNodeConfigs] = useState({});
  const [tempConfig, setTempConfig] = useState({
    instance_type: "",
    ami: "",
  });

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
        selectable: true,
        data: {
          label: (
            <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow border border-gray-300 w-32">
              <img
                src={`/icons/${type}.png`}
                alt={type}
                className="w-8 h-8 mb-1"
                onError={(e) => (e.target.style.display = "none")}
              />
              <span className="text-xs font-medium text-gray-700">
                {type.toUpperCase()}
              </span>
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

  const onNodeClick = (_, node) => {
    setSelectedNodeId(node.id);
    const current = nodeConfigs[node.id] || {};
    setTempConfig({
      instance_type: current.instance_type || "",
      ami: current.ami || "",
    });
  };

  const handleSave = () => {
    if (!selectedNodeId) return;

    const updatedConfigs = {
      ...nodeConfigs,
      [selectedNodeId]: tempConfig,
    };

    setNodeConfigs(updatedConfigs);
    const tfCode = generateTerraformCode(nodes, updatedConfigs); // ✅ live update
    setCode(tfCode);
  };

  const generateCode = () => {
    const tfCode = generateTerraformCode(nodes, nodeConfigs);
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
        setSelectedNodeId(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setNodes, setEdges]);

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
            snapToGrid={true}
            snapGrid={[20, 20]}
            onNodeClick={onNodeClick}
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
          {selectedNodeId ? (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Edit Node</h2>

              <input
                className="w-full p-2 mb-2 border"
                placeholder="Instance Type (e.g. t2.micro)"
                value={tempConfig.instance_type}
                onChange={(e) =>
                  setTempConfig((prev) => ({
                    ...prev,
                    instance_type: e.target.value,
                  }))
                }
              />

              <input
                className="w-full p-2 border mb-2"
                placeholder="AMI ID (e.g. ami-12345678)"
                value={tempConfig.ami}
                onChange={(e) =>
                  setTempConfig((prev) => ({
                    ...prev,
                    ami: e.target.value,
                  }))
                }
              />

              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <p className="text-gray-500">Select a node to edit properties</p>
          )}

          <pre className="text-sm whitespace-pre-wrap">{code}</pre>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default App;
