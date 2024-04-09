packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1"
    }
  }
}

variable "GCP_DEV_KEY" {
  type = string
}

variable "disk_size" {
  description = "The size of the disk"
  default     = "100"
}

variable "disk_type" {
  description = "The type of the disk"
  default     = "pd-standard"
}

variable "image_family" {
  description = "The image family"
  default     = "custom-app-family"
}

variable "image_name" {
  description = "The name of the image"
  default     = "custom-app-image"
}

variable "PROJECT_ID" {
  type    = string
  default = "devproj-414701"
}

variable "source_image_family" {
  description = "The source image family"
  default     = "centos-stream-8"
}

variable "ssh_username" {
  description = "The SSH username"
  default     = "centos"
}

variable "zone" {
  description = "The zone"
  default     = "us-east1-b"
}

source "googlecompute" "custom-image" {
  credentials_json = " ${var.GCP_DEV_KEY}"
  //credentials_file    = "./Packer/devproj-414701-286fc87f422e.json"
  disk_size           = var.disk_size
  disk_type           = var.disk_type
  image_family        = var.image_family
  // image_name          = var.image_name
  project_id          = var.PROJECT_ID
  source_image_family = var.source_image_family
  ssh_username        = var.ssh_username
  zone                = var.zone

}

build {
  sources = ["googlecompute.custom-image"]

  provisioner "shell" {
    inline = ["mkdir -p /home/centos"]
  }

  provisioner "file" {
    destination = "/home/centos/webapp.zip"
    source      = "webapp.zip"
  }

  provisioner "file" {
    destination = "/home/centos/app.service"
    source      = "./Packer/app.service"
  }

  provisioner "shell" {
    script = "./Packer/dependencies.sh"
  }

}
