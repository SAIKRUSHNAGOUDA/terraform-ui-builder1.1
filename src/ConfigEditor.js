// ConfigEditor.js
import React, { useState, useEffect } from "react";

const ConfigEditor = ({ nodeId, configMap, setConfigMap }) => {
  const [localConfig, setLocalConfig] = useState({});

  useEffect(() => {
    if (nodeId && configMap[nodeId]) {
      setLocalConfig(configMap[nodeId]);
    }
  }, [nodeId, configMap]);

  const handleChange = (key, value) => {
    setLocalConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    setConfigMap((prev) => ({
      ...prev,
      [nodeId]: localConfig,
    }));
  };

  if (!nodeId || !configMap[nodeId]) {
    return <p className="text-sm text-gray-500 italic">No node selected</p>;
  }

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
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white px-4 py-1 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default ConfigEditor;
