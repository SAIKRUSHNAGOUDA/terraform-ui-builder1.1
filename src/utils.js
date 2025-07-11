import { generateEC2 } from "./modules/EC2Module";
import { generateS3 } from "./modules/S3Module";
import { generateVPC } from "./modules/VPCModule";

// Placeholder for future cloud platform generators
// import { generateAzureVM } from "./modules/AzureVMModule";
// import { generateGCPInstance } from "./modules/GCPInstanceModule";

export function generateTerraformCode(elements, configMap = {}) {
  let code = "";

  elements.forEach((el) => {
    const config = configMap[el.id] || {};
    const platform = config.platform || "aws"; // Default to AWS

    switch (platform) {
      case "aws":
        if (el.id.startsWith("ec2")) {
          code += generateEC2(el.id, config);
        } else if (el.id.startsWith("s3")) {
          code += generateS3(el.id, config);
        } else if (el.id.startsWith("vpc")) {
          code += generateVPC(el.id, config);
        }
        break;

      case "azure":
        // Future Azure module support
        code += `# Azure support for ${el.id} not implemented yet\n\n`;
        break;

      case "gcp":
        // Future GCP module support
        code += `# GCP support for ${el.id} not implemented yet\n\n`;
        break;

      default:
        code += `# Unsupported platform "${platform}" for ${el.id}\n\n`;
        break;
    }
  });

  return code;
}
