
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

source "googlecompute" "custom-image" {
  credentials_json    = "${var.GCP_DEV_KEY}"
  disk_size           = "100"
  disk_type           = "pd-standard"
  image_family        = "custom-app-family"
  image_name          = "custom-app-image"
  project_id          = "devproj-414701"
  source_image_family = "centos-stream-8"
  ssh_username        = "centos"
  zone                = "us-east1-b"
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
    script = "dependencies.sh"
  }

}
