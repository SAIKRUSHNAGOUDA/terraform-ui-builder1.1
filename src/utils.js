import { generateEC2 } from "./modules/aws/EC2Module";
import { generateComputeInstance } from "./modules/gcp/ComputeEngineModule";
import { generateAzureVM } from "./modules/azure/VMModule";

export function generateTerraformCode(elements, configMap = {}, platform = "aws", region = "us-east-1") {
  platform = platform.toLowerCase();

  let code = "";

  // Add provider block based on selected platform
  switch (platform) {
    case "aws":
      code += `provider "aws" {\n  region = "${region}"\n}\n\n`;
      break;
    case "gcp":
      code += `provider "google" {\n  region = "${region}"\n}\n\n`;
      break;
    case "azure":
      code += `provider "azurerm" {\n  features = {}\n  location = "${region}"\n}\n\n`;
      break;
    default:
      code += `# Unsupported platform "${platform}"\n\n`;
      break;
  }

  elements.forEach((el) => {
    const config = configMap[el.id] || {};
    const elPlatform = (config.platform || platform).toLowerCase();
    const type = el.id.split("-")[0];

    switch (elPlatform) {
      case "aws":
        if (type === "ec2") code += generateEC2(el.id, { ...config, region });
        else code += `# Unsupported AWS resource type: ${type}\n\n`;
        break;

      case "gcp":
        if (type === "ec2") code += generateComputeInstance(el.id, { ...config, region });
        else code += `# Unsupported GCP resource type: ${type}\n\n`;
        break;

      case "azure":
        if (type === "ec2") code += generateAzureVM(el.id, { ...config, region });
        else code += `# Unsupported Azure resource type: ${type}\n\n`;
        break;

      default:
        code += `# Unknown platform: ${elPlatform}\n\n`;
        break;
    }
  });

  return code;
}
