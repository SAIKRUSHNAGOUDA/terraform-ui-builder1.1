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
import { REGION_OPTIONS } from "./regionMap";

const ConfigEditor = ({ nodeId, configMap, setConfigMap, onClose, onSave }) => {
  const [localConfig, setLocalConfig] = useState({});

  useEffect(() => {
    if (nodeId && configMap[nodeId]) {
      setLocalConfig(configMap[nodeId]);
    }
  }, [nodeId, configMap]);

  const handleChange = (key, value) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setConfigMap((prev) => ({
      ...prev,
      [nodeId]: localConfig,
    }));
    if (onSave) onSave();
  };

  if (!nodeId || !configMap[nodeId]) {
    return <p className="text-sm text-gray-500 italic">No node selected</p>;
  }

  return (
    <div>
      {Object.entries(localConfig).map(([key, value]) => (
        <div key={key} className="mb-2">
          <label className="block text-sm font-medium mb-1">{key}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      ))}
      <div className="mt-2">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="ml-2 bg-gray-400 text-white px-4 py-1 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [nodes, setNodes, onNodesChangeRaw] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [code, setCode] = useState("");
  const [configMap, setConfigMap] = useState({});
  const [platform, setPlatform] = useState("aws");
  const [region, setRegion] = useState(REGION_OPTIONS["aws"][0].value);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const handlePlatformChange = (newPlatform) => {
    setPlatform(newPlatform);
    const defaultRegion = REGION_OPTIONS[newPlatform]?.[0]?.value || "";
    setRegion(defaultRegion);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const fullType = event.dataTransfer.getData("application/reactflow");
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
          instance_type: "t2.micro",
          ami: "ami-12345678",
          name: typeFromDrag.toLowerCase(),
        },
      }));
    },
    [reactFlowInstance, region]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onNodeClick = (event, node) => {
    setSelectedNodeId(node.id);
  };

  const onNodesChange = useCallback(
    (changes) => {
      onNodesChangeRaw(changes);
      const deletedNodes = changes
        .filter((change) => change.type === "remove")
        .map((change) => change.id);
      if (deletedNodes.length > 0) {
        setConfigMap((prev) => {
          const updated = { ...prev };
          deletedNodes.forEach((id) => delete updated[id]);
          return updated;
        });
      }
    },
    [onNodesChangeRaw]
  );

  const generateCode = useCallback(() => {
    if (nodes.length === 0) {
      setCode("");
      return;
    }
    const tfCode = generateTerraformCode(nodes, configMap, platform, region);
    setCode(tfCode);
  }, [nodes, configMap, platform, region]);

  useEffect(() => {
    generateCode();
  }, [configMap, nodes]);

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
            onPlatformChange={handlePlatformChange}
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
            onNodeClick={onNodeClick}
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
          {selectedNodeId && configMap[selectedNodeId] ? (
            <>
              <h2 className="text-lg font-bold mb-2">Edit Node Properties</h2>
              <ConfigEditor
                nodeId={selectedNodeId}
                configMap={configMap}
                setConfigMap={setConfigMap}
                onSave={generateCode}
              />
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">Click a node to edit its properties</p>
          )}

          <h2 className="text-lg font-bold mt-6 mb-2">Terraform Code</h2>
          <pre className="text-sm bg-white p-2 rounded max-h-60 overflow-auto">{code}</pre>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default App;
