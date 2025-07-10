// EC2Module.js
import React from "react";

export const EC2Config = ({ config, onChange }) => (
  <>
    <label className="block text-sm">AMI</label>
    <input
      type="text"
      name="ami"
      className="w-full p-2 mb-2 border rounded"
      value={config?.ami || ""}
      onChange={onChange}
      placeholder="ami-12345678"
    />

    <label className="block text-sm">Instance Type</label>
    <input
      type="text"
      name="instance_type"
      className="w-full p-2 mb-2 border rounded"
      value={config?.instance_type || ""}
      onChange={onChange}
      placeholder="t2.micro"
    />
  </>
);

export function generateEC2(id, config = {}) {
  return `resource "aws_instance" "${id}" {
  ami           = "${config.ami || "ami-12345678"}"
  instance_type = "${config.instance_type || "t2.micro"}"
}\n\n`;
}
