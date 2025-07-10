const VPCModule = (id) => {
  return `resource "aws_vpc" "${id}" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}`;
};

export default VPCModule;
