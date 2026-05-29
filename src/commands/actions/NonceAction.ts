import { BaseAction } from "./BaseAction";
import type { ActionOptions } from "../types";
import { nodeUrlArgument, networkArgument, ownerAddressArgument } from "./arguments";
import { getScannerErrorMessage } from "./scanner-error";
import { NonceScanner } from "../../scanner";

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
