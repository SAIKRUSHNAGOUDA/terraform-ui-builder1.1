// S3Module.js
import React from "react";

export const S3Config = ({ config, onChange }) => (
  <>
    <label className="block text-sm">Bucket Name</label>
    <input
      type="text"
      name="bucket"
      className="w-full p-2 mb-2 border rounded"
      value={config?.bucket || ""}
      onChange={onChange}
      placeholder="my-custom-bucket"
    />

    <label className="block text-sm">ACL</label>
    <select
      name="acl"
      className="w-full p-2 mb-2 border rounded"
      value={config?.acl || "private"}
      onChange={onChange}
    >
      <option value="private">private</option>
      <option value="public-read">public-read</option>
      <option value="public-read-write">public-read-write</option>
    </select>
  </>
);

export function generateS3(id, config = {}) {
  return `resource "aws_s3_bucket" "${id}" {
  bucket = "${config.bucket || id}-bucket"
  acl    = "${config.acl || "private"}"
}\n\n`;
}
