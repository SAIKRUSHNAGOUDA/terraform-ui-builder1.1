export function generateTerraformCode(elements, configMap = {}) {
  let code = "";

  elements.forEach((el) => {
    const config = configMap[el.id] || {};

    if (el.id.startsWith("ec2")) {
      code += `resource "aws_instance" "${el.id}" {
  ami           = "${config.ami || "ami-12345678"}"
  instance_type = "${config.instance_type || "t2.micro"}"
}\n\n`;
    } else if (el.id.startsWith("s3")) {
      code += `resource "aws_s3_bucket" "${el.id}" {
  bucket = "${el.id}-bucket"
  acl    = "private"
}\n\n`;
    } else if (el.id.startsWith("vpc")) {
      code += `resource "aws_vpc" "${el.id}" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}\n\n`;
    }
  });

  return code;
}
