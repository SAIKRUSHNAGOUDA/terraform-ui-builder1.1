// VPCModule.js
import React from "react";

export const VPCConfig = ({ config, onChange }) => (
  <>
    <label className="block text-sm">CIDR Block</label>
    <input
      type="text"
      name="cidr_block"
      className="w-full p-2 mb-2 border rounded"
      value={config?.cidr_block || ""}
      onChange={onChange}
      placeholder="10.0.0.0/16"
    />
    <label className="block text-sm">DNS Support</label>
    <select
      name="enable_dns_support"
      className="w-full p-2 mb-2 border rounded"
      value={config?.enable_dns_support || "true"}
      onChange={onChange}
    >
      <option value="true">Enabled</option>
      <option value="false">Disabled</option>
    </select>
    <label className="block text-sm">DNS Hostnames</label>
    <select
      name="enable_dns_hostnames"
      className="w-full p-2 mb-2 border rounded"
      value={config?.enable_dns_hostnames || "true"}
      onChange={onChange}
    >
      <option value="true">Enabled</option>
      <option value="false">Disabled</option>
    </select>
  </>
);

export function generateVPC(id, config = {}) {
  return `resource "aws_vpc" "${id}" {
  cidr_block           = "${config.cidr_block || "10.0.0.0/16"}"
  enable_dns_support   = ${config.enable_dns_support || "true"}
  enable_dns_hostnames = ${config.enable_dns_hostnames || "true"}
}\n\n`;
}
