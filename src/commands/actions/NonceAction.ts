import { BaseAction } from "./BaseAction";
import type { ActionOptions } from "../types";
import { nodeUrlArgument, networkArgument, ownerAddressArgument } from "./arguments";
import { NonceScanner } from "../../scanner";

function getScannerErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const shortMessage = Reflect.get(error, "shortMessage");
    if (typeof shortMessage === "string" && shortMessage.trim().length > 0) {
      return shortMessage.trim();
    }

    const details = Reflect.get(error, "details");
    if (typeof details === "string" && details.trim().length > 0) {
      return details.trim().split("\n")[0] ?? details.trim();
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.trim().split("\n")[0] ?? error.message.trim();
  }

  return "Unknown scanner error.";
}

export class NonceAction extends BaseAction {
  static override get options(): ActionOptions {
    return {
      action: "nonce",
      description: "Resolve owner nonce using SSV SDK scanner flow",
      example: `Example:
  ssv-keys nonce \\
    -n "https://ethereum-hoodi-rpc.publicnode.com" \\
    -nw hoodi \\
    -oa "0x1111111111111111111111111111111111111111"`,
      arguments: [networkArgument, nodeUrlArgument, ownerAddressArgument],
    };
  }

  override async execute(): Promise<void> {
    try {
      const nonceScanner = new NonceScanner({
        network: this.args.network,
        nodeUrl: this.args.node_url,
        ownerAddress: this.args.owner_address,
      });

      const result = await nonceScanner.run(true);
      console.log("Next Nonce:", result);
    } catch (error: unknown) {
      throw new Error(
        `Failed to resolve owner nonce: ${getScannerErrorMessage(error)}`
      );
    }
  }
}
