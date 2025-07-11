export function generateEC2(id, config = {}) {
  const {
    instance_type = "t2.micro",
    ami = "ami-0c55b159cbfafe1f0", // default AMI
    region = "us-east-1",
    name = id.replace(/[^a-zA-Z0-9]/g, "_"),
  } = config;

  return `
resource "aws_instance" "${name}" {
  ami           = "${ami}"
  instance_type = "${instance_type}"
  tags = {
    Name = "${name}"
  }
}
`;
}
