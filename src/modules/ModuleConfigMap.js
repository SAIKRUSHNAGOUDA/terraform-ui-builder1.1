// AWS Modules
import { EC2Config as AwsEC2Config, generateEC2 as generateAwsEC2 } from "./aws/EC2Module";
import { S3Config as AwsS3Config, generateS3 as generateAwsS3 } from "./aws/S3Module";
import { VPCConfig as AwsVPCConfig, generateVPC as generateAwsVPC } from "./aws/VPCModule";

// GCP Modules
import { ComputeConfig as GcpComputeConfig, generateCompute as generateGcpCompute } from "./gcp/ComputeModule";
import { BucketConfig as GcpBucketConfig, generateBucket as generateGcpBucket } from "./gcp/BucketModule";
import { NetworkConfig as GcpNetworkConfig, generateNetwork as generateGcpNetwork } from "./gcp/NetworkModule";

// Azure Modules
import { VMConfig as AzureVMConfig, generateVM as generateAzureVM } from "./azure/VMModule";
import { StorageConfig as AzureStorageConfig, generateStorage as generateAzureStorage } from "./azure/StorageModule";
import { VNetConfig as AzureVNetConfig, generateVNet as generateAzureVNet } from "./azure/VNetModule";

// UI Config Map (for rendering configuration UIs)
export const moduleUIMap = {
  "aws-ec2": AwsEC2Config,
  "aws-s3": AwsS3Config,
  "aws-vpc": AwsVPCConfig,

  "gcp-compute": GcpComputeConfig,
  "gcp-bucket": GcpBucketConfig,
  "gcp-network": GcpNetworkConfig,

  "azure-vm": AzureVMConfig,
  "azure-storage": AzureStorageConfig,
  "azure-vnet": AzureVNetConfig,
};

// Code Generator Map (for generating Terraform code)
export const moduleCodeGenerators = {
  "aws-ec2": generateAwsEC2,
  "aws-s3": generateAwsS3,
  "aws-vpc": generateAwsVPC,

  "gcp-compute": generateGcpCompute,
  "gcp-bucket": generateGcpBucket,
  "gcp-network": generateGcpNetwork,

  "azure-vm": generateAzureVM,
  "azure-storage": generateAzureStorage,
  "azure-vnet": generateAzureVNet,
};
