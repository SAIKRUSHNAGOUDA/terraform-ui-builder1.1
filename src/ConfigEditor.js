import React, { useEffect } from "react";

const ConfigEditor = ({ nodeId, configMap, setConfigMap }) => {
  if (!nodeId || !configMap[nodeId]) {
    return <p className="text-sm text-gray-500 italic">No node selected</p>;
  }

  const localConfig = configMap[nodeId];

  const handleChange = (key, value) => {
    setConfigMap((prev) => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        [key]: value,
      },
    }));
  };

  return (
    <div>
      <div className="space-y-2">
        {Object.entries(localConfig).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium">{key}</label>
            <input
              className="p-1 border rounded"
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigEditor;
