import React from "react";

const Sidebar = () => {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-48 bg-gray-200 p-4 space-y-2">
      <div
        className="p-2 bg-white rounded shadow cursor-pointer flex items-center space-x-2"
        onDragStart={(e) => handleDragStart(e, "ec2")}
        draggable
      >
        {/* <img src="/icons/ec2.png" alt="EC2" className="w-5 h-5" /> */}
        <span>EC2</span>
      </div>

      <div
        className="p-2 bg-white rounded shadow cursor-pointer flex items-center space-x-2"
        onDragStart={(e) => handleDragStart(e, "s3")}
        draggable
      >
        {/* <img src="/icons/s3.png" alt="S3" className="w-5 h-5" /> */}
        <span>S3</span>
      </div>

      <div
        className="p-2 bg-white rounded shadow cursor-pointer flex items-center space-x-2"
        onDragStart={(e) => handleDragStart(e, "vpc")}
        draggable
      >
        {/* <img src="/icons/vpc.png" alt="VPC" className="w-5 h-5" /> */}
        <span>VPC</span>
      </div>
    </aside>
  );
};

export default Sidebar;
