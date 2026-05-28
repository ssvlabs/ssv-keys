import { BaseAction } from "./BaseAction";
import type { ActionOptions } from "../types";
import {
  nodeUrlArgument,
  outputPathArgument,
  networkArgument,
  ownerAddressArgument,
} from "./arguments";
import { OperatorScanner } from "../../scanner";

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

export class OperatorAction extends BaseAction {
  static override get options(): ActionOptions {
    return {
      action: "operator",
      description: "Resolve owner operator public keys using SSV SDK scanner flow",
      example: `Example:
  ssv-keys operator \\
    -n "https://ethereum-hoodi-rpc.publicnode.com" \\
    -nw hoodi \\
    -oa "0x1111111111111111111111111111111111111111" \\
    -o "./data"`,
      arguments: [
        networkArgument,
        nodeUrlArgument,
        ownerAddressArgument,
        outputPathArgument,
      ],
    };
  }

  override async execute(): Promise<void> {
    try {
      const operatorScanner = new OperatorScanner({
        network: this.args.network,
        nodeUrl: this.args.node_url,
        ownerAddress: this.args.owner_address,
      });

      const result = await operatorScanner.run(this.args.output_path, true);
      if (result) {
        console.log(`\nOperator data has been saved to:\n ${result}`);
        return;
      }

      console.log("\nNo operator data found for this owner. No output file was created.");
    } catch (error: unknown) {
      throw new Error(
        `Failed to resolve owner operator data: ${getScannerErrorMessage(error)}`
      );
    }
  }
}
