// Sidebar.js
import React from "react";

const Sidebar = ({ platform, region, onPlatformChange, onRegionChange }) => {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-60 bg-gray-200 p-4">
      <h2 className="text-lg font-bold mb-4">Settings</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Platform</label>
        <select
          value={platform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="aws">AWS</option>
          <option value="azure">Azure</option>
          <option value="gcp">GCP</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Region</label>
        <select
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="us-east-1">US East (N. Virginia)</option>
          <option value="us-west-1">US West (N. California)</option>
          <option value="eu-west-1">EU (Ireland)</option>
          <option value="ap-south-1">Asia Pacific (Mumbai)</option>
        </select>
      </div>

      <h2 className="text-lg font-bold mb-4">Components</h2>

      <div
        className="p-2 mb-2 bg-white rounded shadow cursor-pointer flex items-center space-x-2"
        onDragStart={(e) => handleDragStart(e, "ec2")}
        draggable
      >
        <img src="/icons/ec2.png" alt="EC2" className="w-6 h-6" />
        <span>EC2</span>
      </div>

      <div
        className="p-2 mb-2 bg-white rounded shadow cursor-pointer flex items-center space-x-2"
        onDragStart={(e) => handleDragStart(e, "s3")}
        draggable
      >
        <img src="/icons/s3.png" alt="S3" className="w-6 h-6" />
        <span>S3</span>
      </div>

      <div
        className="p-2 mb-2 bg-white rounded shadow cursor-pointer flex items-center space-x-2"
        onDragStart={(e) => handleDragStart(e, "vpc")}
        draggable
      >
        <img src="/icons/vpc.png" alt="VPC" className="w-6 h-6" />
        <span>VPC</span>
      </div>

      {/* Add more module components here */}
    </aside>
  );
};

export default Sidebar;
