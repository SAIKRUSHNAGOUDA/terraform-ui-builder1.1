import { EC2Config, generateEC2 } from "./EC2Module";
import { S3Config, generateS3 } from "./S3Module";
import { VPCConfig, generateVPC } from "./VPCModule";

export const moduleUIMap = {
  ec2: EC2Config,
  s3: S3Config,
  vpc: VPCConfig,
};

export const moduleCodeGenerators = {
  ec2: generateEC2,
  s3: generateS3,
  vpc: generateVPC,
};
