variable region {
  default = "eu-west-2"
}
variable availability_zone {
  default = "eu-west-2a"
}

variable "instance_type" {
  default = "t2.micto"
}

variable "app_port" {
  default = 80
}

variable "ami" {
  type = string
  default = "ami-044415bb13eee2391"
}

variable "bucket_name" {
  type = string
  default = "quran-memorizing-app-2025"
}



