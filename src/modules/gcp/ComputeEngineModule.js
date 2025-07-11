export function generateComputeInstance(id, config = {}) {
  const {
    machine_type = "e2-medium",
    zone = "us-central1-a",
    name = id.replace(/[^a-zA-Z0-9]/g, "_"),
  } = config;

  return `
resource "google_compute_instance" "${name}" {
  name         = "${name}"
  machine_type = "${machine_type}"
  zone         = "${zone}"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }
}
`;
}
