// utils.js
import { generateEC2 } from "./modules/EC2Module";
import { generateS3 } from "./modules/S3Module";
import { generateVPC } from "./modules/VPCModule";

/**
 * Generates Terraform code for the current flow state.
 * @param {Array} elements - The nodes array from React Flow.
 * @param {Object} configMap - Configuration for each node.
 * @param {Object} globalSettings - Optional platform/region if needed globally.
 * @returns {string} Terraform code.
 */
export function generateTerraformCode(elements, configMap = {}, globalSettings = {}) {
  let code = "";

  elements.forEach((el) => {
    const config = configMap[el.id] || {};

    if (el.id.startsWith("ec2")) {
      code += generateEC2(el.id, config, globalSettings);
    } else if (el.id.startsWith("s3")) {
      code += generateS3(el.id, config, globalSettings);
    } else if (el.id.startsWith("vpc")) {
      code += generateVPC(el.id, config, globalSettings);
    }
  });

  return code;
}
