import React from "react";

const Sidebar = () => {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-48 bg-gray-200 p-4">
      <div
        className="p-2 mb-2 bg-white rounded shadow cursor-pointer"
        onDragStart={(e) => handleDragStart(e, "ec2")}
        draggable
      >
        EC2
      </div>
      <div
        className="p-2 bg-white rounded shadow cursor-pointer"
        onDragStart={(e) => handleDragStart(e, "s3")}
        draggable
      >
        S3
      </div>
    </aside>
  );
};

export default Sidebar;
