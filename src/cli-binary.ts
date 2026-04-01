import main from "./cli-shared";
import { resolveBinaryMode } from "./binary/resolve-binary-mode";

const resolution = resolveBinaryMode(process.argv);

if (resolution.injectedAction) {
  process.argv.splice(2, 0, resolution.injectedAction);
}

void main(resolution.interactive);

