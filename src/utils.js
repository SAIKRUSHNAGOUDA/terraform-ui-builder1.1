import EC2Module from "./modules/EC2Module";
import S3Module from "./modules/S3Module";
import VPCModule from "./modules/VPCModule";

export function generateTerraformCode(elements, configMap = {}) {
  let code = "";

  elements.forEach((el) => {
    const id = el.id;
    const config = configMap[id] || {};

    if (id.startsWith("ec2")) {
      code += EC2Module(id, config) + "\n\n";
    } else if (id.startsWith("s3")) {
      code += S3Module(id, config) + "\n\n";
    } else if (id.startsWith("vpc")) {
      code += VPCModule(id, config) + "\n\n";
    }
  });

  return code;
}
