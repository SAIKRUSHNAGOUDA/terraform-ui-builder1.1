// Sidebar.js
import React from "react";

const Sidebar = () => {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-48 bg-gray-200 p-4">
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
