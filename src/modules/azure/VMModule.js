export function generateAzureVM(id, config = {}) {
  const {
    location = "East US",
    name = id.replace(/[^a-zA-Z0-9]/g, "_"),
    size = "Standard_B1s",
    admin_username = "azureuser",
  } = config;

  return `
resource "azurerm_virtual_machine" "${name}" {
  name                  = "${name}"
  location              = "${location}"
  resource_group_name   = "example-resources"
  network_interface_ids = [azurerm_network_interface.${name}_nic.id]
  vm_size               = "${size}"

  storage_os_disk {
    name              = "${name}_os_disk"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }

  storage_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }

  os_profile {
    computer_name  = "${name}"
    admin_username = "${admin_username}"
    admin_password = "ChangeMe1234!"
  }

  os_profile_linux_config {
    disable_password_authentication = false
  }
}
`;
}
