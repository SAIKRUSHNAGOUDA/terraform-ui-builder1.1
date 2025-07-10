export function generateS3(id, config) {
  return `resource "aws_s3_bucket" "${id}" {
  bucket = "${config.bucket || `${id}-bucket`}"
  acl    = "${config.acl || "private"}"
}\n\n`;
}
