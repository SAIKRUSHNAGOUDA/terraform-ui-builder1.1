export function generateEC2(id, config) {
  return `resource "aws_instance" "${id}" {
  ami           = "${config.ami || "ami-12345678"}"
  instance_type = "${config.instance_type || "t2.micro"}"
}\n\n`;
}
