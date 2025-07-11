export const generateTerraformCode = (nodes, configMap, platform, region) => {
  let code = "";

  // Detect platforms
  const platformsUsed = new Set(
    nodes.map((node) => configMap[node.id]?.platform || platform)
  );

  platformsUsed.forEach((p) => {
    switch (p) {
      case "aws":
        code += `provider "aws" {\n  region = "${region}"\n}\n\n`;
        break;
      case "azure":
        code += `provider "azurerm" {\n  features = {}\n}\n\n`;
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
      code += `# Missing config for ${node.id}\n\n`;
      return;
    }

    switch (type) {
      case "azure-vm":
        code += `
resource "azurerm_virtual_network" "${node.id}_vnet" {
  name                = "my-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = "${config.region}"
  resource_group_name = "my-group"
}

resource "azurerm_subnet" "${node.id}_subnet" {
  name                 = "my-subnet"
  resource_group_name  = "my-group"
  virtual_network_name = azurerm_virtual_network.${node.id}_vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_interface" "${node.id}_nic" {
  name                = "vm-nic"
  location            = "${config.region}"
  resource_group_name = "my-group"

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.${node.id}_subnet.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_linux_virtual_machine" "${node.id}" {
  name                  = "my-vm"
  location              = "${config.region}"
  resource_group_name   = "my-group"
  vm_size                  = "Standard_B1s"
  admin_username        = "adminuser"

  network_interface_ids = [
    azurerm_network_interface.${node.id}_nic.id
  ]

  os_disk {
    name                 = "myosdisk"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}\n\n`;
        break;

      case "azure-storage":
        code += `resource "azurerm_storage_account" "${node.id}" {
  name                     = "mystorageacct"
  location                 = "${config.region}"
  resource_group_name      = "my-group"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}\n\n`;
        break;

      case "gcp-compute":
        code += `resource "google_compute_instance" "${node.id}" {
  name         = "my-instance"
  zone         = "${config.region}-a"
  machine_type = "f1-micro"
}\n\n`;
        break;

      case "gcp-bucket":
        code += `resource "google_storage_bucket" "${node.id}" {
  name     = "my-bucket"
  location = "${config.region}"
}\n\n`;
        break;

      case "gcp-network":
        code += `resource "google_compute_network" "${node.id}" {
  name = "my-network"
}\n\n`;
        break;

      case "aws-ec2":
        code += `resource "aws_instance" "${node.id}" {
  ami           = "ami-123456"
  instance_type = "t2.micro"
  region        = "${config.region}"
}\n\n`;
        break;

      case "aws-s3":
        code += `resource "aws_s3_bucket" "${node.id}" {
  bucket = "my-bucket"
  acl    = "private"
}\n\n`;
        break;

      case "aws-vpc":
        code += `resource "aws_vpc" "${node.id}" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}\n\n`;
        break;

      default:
        code += `# Unsupported resource type: ${type}\n\n`;
    }
  });

  return code.trim();
};
