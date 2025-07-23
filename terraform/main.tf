resource "azurerm_container_app" "app" {
  name                         = "quran-memorization-app"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    container {
      name   = "quran-container"
      image  = "${azurerm_container_registry.acr.login_server}/${var.image_name}"
      cpu    = 0.5
      memory = "1.0Gi"

    #   ports {
    #     port     = 3000
    #     protocol = "TCP"
    #   }
    }

    # ingress {
    #   external_enabled = true
    #   target_port      = 3000
    # }
  }

#   registry {
#     server   = azurerm_container_registry.acr.login_server
#     username = azurerm_container_registry.acr.admin_username
#     password = azurerm_container_registry.acr.admin_password
#   }
}
