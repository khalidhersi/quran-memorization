variable "location" {
  default = "westeurope" 
}

variable "acr_name" {
  default = "quranacr123" 
}

variable "image_name" {
  description = "The image name including tag"
  type        = string
}
