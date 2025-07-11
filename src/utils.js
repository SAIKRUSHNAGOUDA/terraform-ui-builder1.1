import { generateEC2 } from "./modules/aws/EC2Module";
import { generateS3 } from "./modules/aws/S3Module";
import { generateVPC } from "./modules/aws/VPCModule";

import { generateVM } from "./modules/azure/VMModule";
import { generateStorage } from "./modules/azure/StorageModule";
import { generateVNet } from "./modules/azure/VNetModule";

import { generateCompute } from "./modules/gcp/ComputeModule";
import { generateBucket } from "./modules/gcp/BucketModule";
import { generateNetwork } from "./modules/gcp/NetworkModule";

export function generateTerraformCode(elements, configMap = {}, platform = "aws", region = "us-east-1") {
  if (!elements || elements.length === 0) return "";

  let code = "";

  // Detect actual platforms used in elements
  const platformsUsed = new Set(
    elements.map((el) => (configMap[el.id]?.platform || el.id.split("-")[0] || platform).toLowerCase())
  );

  platformsUsed.forEach((p) => {
    switch (p) {
      case "aws":
        code += `provider "aws" {\n  region = "${region}"\n}\n\n`;
        break;
      case "azure":
        code += `provider "azurerm" {\n  features = {}\n  location = "${region}"\n}\n\n`;
        break;
      case "gcp":
        code += `provider "google" {\n  region = "${region}"\n}\n\n`;
        break;
      default:
        code += `# Unsupported platform "${p}"\n\n`;
    }
  });

  // Generate resource blocks
  elements.forEach((el) => {
    const config = configMap[el.id] || {};
    const [elPlatform, type] = el.id.split("-").slice(0, 2); // <- fix here

    switch (elPlatform.toLowerCase()) {
      case "aws":
        switch (type) {
          case "ec2":
            code += generateEC2(el.id, { ...config, region }) + "\n\n";
            break;
          case "s3":
            code += generateS3(el.id, { ...config, region }) + "\n\n";
            break;
          case "vpc":
            code += generateVPC(el.id, { ...config, region }) + "\n\n";
            break;
          default:
            code += `# Unsupported AWS resource type: ${type}\n\n`;
        }
        break;

      case "azure":
        switch (type) {
          case "vm":
            code += generateVM(el.id, { ...config, region }) + "\n\n";
            break;
          case "storage":
            code += generateStorage(el.id, { ...config, region }) + "\n\n";
            break;
          case "vnet":
            code += generateVNet(el.id, { ...config, region }) + "\n\n";
            break;
          default:
            code += `# Unsupported Azure resource type: ${type}\n\n`;
        }
        break;

      case "gcp":
        switch (type) {
          case "compute":
            code += generateCompute(el.id, { ...config, region }) + "\n\n";
            break;
          case "bucket":
            code += generateBucket(el.id, { ...config, region }) + "\n\n";
            break;
          case "network":
            code += generateNetwork(el.id, { ...config, region }) + "\n\n";
            break;
          default:
            code += `# Unsupported GCP resource type: ${type}\n\n`;
        }
        break;

      default:
        code += `# Unknown platform: ${elPlatform}\n\n`;
    }
  });

  return code.trim();
}
