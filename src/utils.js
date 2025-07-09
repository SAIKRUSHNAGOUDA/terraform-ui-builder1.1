export function generateTerraformCode(elements) {
  let code = "";

  elements.forEach((el) => {
    if (el.id.startsWith("ec2")) {
      code += `resource "aws_instance" "${el.id}" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"
}\n\n`;
    } else if (el.id.startsWith("s3")) {
      code += `resource "aws_s3_bucket" "${el.id}" {
  bucket = "${el.id}-bucket"
  acl    = "private"
}\n\n`;
    }
  });

  return code;
}
