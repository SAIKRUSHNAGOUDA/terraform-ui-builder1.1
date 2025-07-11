export const generateTerraformCode = (nodes, configMap, platform, region) => {
  let code = "";

  // Detect platform(s) used
  const platformsUsed = new Set(
    nodes.map((node) => configMap[node.id]?.platform || platform)
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
        code += `# Unsupported platform: ${p}\n\n`;
    }
  });

  nodes.forEach((node) => {
    const type = node.id.split("-").slice(0, 2).join("-");
    const config = configMap[node.id];

    if (!type || !config) {
      code += `# Missing config for ${node.id}\n`;
      return;
    }

    switch (type) {
      case "azure-vm":
        code += `resource "azurerm_linux_virtual_machine" "${node.id}" {\n  name = "my-vm"\n  location = "${config.region}"\n  resource_group_name = "my-group"\n  size = "Standard_B1s"\n}\n\n`;
        break;

      case "azure-storage":
        code += `resource "azurerm_storage_account" "${node.id}" {\n  name = "mystorageacct"\n  location = "${config.region}"\n  resource_group_name = "my-group"\n  account_tier = "Standard"\n  account_replication_type = "LRS"\n}\n\n`;
        break;

      case "gcp-compute":
        code += `resource "google_compute_instance" "${node.id}" {\n  name = "my-instance"\n  zone = "${config.region}-a"\n  machine_type = "f1-micro"\n}\n\n`;
        break;

      case "gcp-bucket":
        code += `resource "google_storage_bucket" "${node.id}" {\n  name = "my-bucket"\n  location = "${config.region}"\n}\n\n`;
        break;

      case "gcp-network":
        code += `resource "google_compute_network" "${node.id}" {\n  name = "my-network"\n}\n\n`;
        break;

      case "aws-ec2":
        code += `resource "aws_instance" "${node.id}" {\n  ami = "ami-123456"\n  instance_type = "t2.micro"\n  region = "${config.region}"\n}\n\n`;
        break;

      case "aws-s3":
        code += `resource "aws_s3_bucket" "${node.id}" {\n  bucket = "my-bucket"\n  acl    = "private"\n}\n\n`;
        break;

      case "aws-vpc":
        code += `resource "aws_vpc" "${node.id}" {\n  cidr_block = "10.0.0.0/16"\n  enable_dns_support = true\n  enable_dns_hostnames = true\n}\n\n`;
        break;

      default:
        code += `# Unsupported resource type: ${type}\n\n`;
    }
  });

  return code.trim();
};
