resource "azurerm_container_app" "quran_app" {
  name                         = "quran-memorization-aca"
  resource_group_name          = azurerm_resource_group.main.name
  container_app_environment_id = azurerm_container_app_environment.env.id
  revision_mode                = "Single"

  template {
    container {
      name   = "quran"
      image  = "youracr.azurecr.io/quran-app:latest"
      cpu    = 0.25
      memory = "0.5Gi"
#       ports {
#         port     = 3000
#         protocol = "TCP"
#       }
#     }

#     scale {
#       min_replicas = 0
#       max_replicas = 1
#     }
   }

#   ingress {
#     external_enabled = true
#     target_port      = 3000
#     transport        = "auto"
   }
}
