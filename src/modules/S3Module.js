const S3Module = (id) => {
  return `resource "aws_s3_bucket" "${id}" {
  bucket = "${id}-bucket"
  acl    = "private"
}`;
};

export default S3Module;
