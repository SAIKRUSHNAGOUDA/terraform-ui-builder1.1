import React, { useState } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "react-flow-renderer";
import Sidebar from "./Sidebar";
import { generateTerraformCode } from "./utils";

function App() {
  const [elements, setElements] = useState([]);
  const [code, setCode] = useState("");

  const onDrop = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");
    const position = { x: event.clientX - 200, y: event.clientY };

    const newNode = {
      id: `${type}-${+new Date()}`,
      type: "default",
      position,
      data: { label: `${type.toUpperCase()} Node` },
    };

    setElements((els) => [...els, newNode]);
  };

  const generateCode = () => {
    const tfCode = generateTerraformCode(elements);
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
    <div className="flex h-screen">
      <Sidebar />
      <div
        className="flex-1 relative"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <ReactFlow elements={elements}>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
        <div className="absolute bottom-0 left-0 bg-white p-2 z-10">
          <button onClick={generateCode} className="mr-2 bg-blue-500 text-white p-2 rounded">
            Generate Code
          </button>
          <button onClick={downloadCode} className="bg-green-500 text-white p-2 rounded">
            Download TF
          </button>
        </div>
      </div>
      <div className="w-1/3 p-4 bg-gray-100 overflow-auto">
        <pre>{code}</pre>
      </div>
    </div>
  );
}

export default App;
