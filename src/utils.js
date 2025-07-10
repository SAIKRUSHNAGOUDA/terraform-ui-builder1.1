import { generateEC2 } from "./modules/EC2Module";
import { generateS3 } from "./modules/S3Module";
import { generateVPC } from "./modules/VPCModule";

export function generateTerraformCode(elements, configMap = {}) {
  let code = "";

  elements.forEach((el) => {
    const config = configMap[el.id] || {};

    if (el.id.startsWith("ec2")) {
      code += generateEC2(el.id, config);
    } else if (el.id.startsWith("s3")) {
      code += generateS3(el.id, config);
    } else if (el.id.startsWith("vpc")) {
      code += generateVPC(el.id, config);
    }
  });

  return code;
}
