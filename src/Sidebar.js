import React from "react";

const Sidebar = ({ region, onRegionChange }) => {
  const awsModules = [
    { label: "EC2", type: "aws-ec2", icon: "/icons/ec2.png" },
    { label: "S3", type: "aws-s3", icon: "/icons/s3.png" },
    { label: "VPC", type: "aws-vpc", icon: "/icons/vpc.png" },
  ];

  const azureModules = [
    { label: "VM", type: "azure-vm", icon: "/icons/vm.png" },
    { label: "Storage", type: "azure-storage", icon: "/icons/storage.png" },
  ];

  const gcpModules = [
    { label: "Compute", type: "gcp-compute", icon: "/icons/compute.png" },
    { label: "Bucket", type: "gcp-bucket", icon: "/icons/bucket.png" },
    { label: "Network", type: "gcp-network", icon: "/icons/network.png" },
  ];

  const renderButton = (mod) => (
    <div
      key={mod.type}
      draggable
      onDragStart={(e) =>
        e.dataTransfer.setData("application/reactflow", mod.type)
      }
      className="p-2 my-2 bg-white rounded shadow cursor-pointer flex items-center"
    >
      {mod.icon && (
        <img src={mod.icon} alt={mod.label} className="w-5 h-5 mr-2" />
      )}
      {mod.label}
    </div>
  );

  return (
    <div>
      <select
        className="mb-2 p-2 w-full"
        value={region}
        onChange={onRegionChange}
      >
        <option value="us-east-1">US East (N. Virginia)</option>
        <option value="us-west-1">US West (N. California)</option>
        <option value="asia-south1">Mumbai</option>
      </select>

      <h2 className="font-bold mt-4">AWS</h2>
      {awsModules.map(renderButton)}

      <h2 className="font-bold mt-4">Azure</h2>
      {azureModules.map(renderButton)}

      <h2 className="font-bold mt-4">GCP</h2>
      {gcpModules.map(renderButton)}
    </div>
  );
};

export default Sidebar;
