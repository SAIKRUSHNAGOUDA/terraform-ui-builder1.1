import React from "react";

const COMPONENTS = {
  aws: [
    { type: "aws-ec2", label: "EC2", icon: "ec2.png" },
    { type: "aws-s3", label: "S3", icon: "s3.png" },
    { type: "aws-vpc", label: "VPC", icon: "vpc.png" },
  ],
  azure: [
    { type: "azure-vm", label: "VM", icon: "vm.png" },
    { type: "azure-storage", label: "Storage", icon: "storage.png" },
  ],
  gcp: [
    { type: "gcp-compute", label: "Compute", icon: "compute.png" },
    { type: "gcp-bucket", label: "Bucket", icon: "bucket.png" },
    { type: "gcp-network", label: "Network", icon: "network.png" },
  ],
};

const Sidebar = ({ platform, region, onPlatformChange, onRegionChange }) => {
  const onDragStart = (event, type) => {
    event.dataTransfer.setData("application/reactflow", type); // Only string!
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Platform:</label>
        <select
          value={platform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1"
        >
          <option value="aws">AWS</option>
          <option value="azure">Azure</option>
          <option value="gcp">GCP</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Region:</label>
        <select
          value={region}
          onChange={onRegionChange}
          className="w-full border border-gray-300 rounded px-2 py-1"
        >
          {COMPONENTS[platform].map((item, index) => (
            <option key={index} value={item.region || region}>
              {item.region || region}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-sm font-medium">Resources:</p>
        <div className="space-y-2">
          {COMPONENTS[platform].map((item) => (
            <div
              key={item.type}
              className="flex items-center space-x-2 bg-white p-2 border rounded cursor-move"
              draggable
              onDragStart={(e) => onDragStart(e, item.type)}
            >
              <img
                src={`/icons/${item.icon}`}
                alt={item.label}
                className="w-5 h-5"
                onError={(e) => (e.target.style.display = "none")}
              />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
