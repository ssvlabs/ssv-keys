import { BaseAction } from "./BaseAction";
import type { ActionOptions } from "../types";
import {
  nodeUrlArgument,
  networkArgument,
  ownerAddressArgument,
  scannerOperatorIdsArgument,
} from "./arguments";
import { ClusterScanner } from "../../scanner";
import { parseOperatorIdsCsv } from "../../shared/operator-ids";

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

export class ClusterAction extends BaseAction {
  static override get options(): ActionOptions {
    return {
      action: "cluster",
      description: "Resolve latest cluster snapshot using SSV SDK scanner flow",
      example: `Example:
  ssv-keys cluster \\
    -n "https://ethereum-hoodi-rpc.publicnode.com" \\
    -nw hoodi \\
    -oa "0x1111111111111111111111111111111111111111" \\
    -oids "5,6,7,8"`,
      arguments: [
        networkArgument,
        nodeUrlArgument,
        ownerAddressArgument,
        scannerOperatorIdsArgument,
      ],
    };
  }

  override async execute(): Promise<void> {
    try {
      const clusterScanner = new ClusterScanner({
        network: this.args.network,
        nodeUrl: this.args.node_url,
        ownerAddress: this.args.owner_address,
      });

      const operatorIds = parseOperatorIdsCsv(this.args.operator_ids);
      const result = await clusterScanner.run(operatorIds, true);

      console.table(result.payload);
      console.log("Cluster snapshot:");
      console.table(result.cluster);
      console.log(
        JSON.stringify(
          {
            block: result.payload.Block,
            "cluster snapshot": result.cluster,
            cluster: result.cluster,
          },
          (_, value) => (typeof value === "bigint" ? value.toString() : value),
          "  "
        )
      );
    } catch (error: unknown) {
      throw new Error(
        `Failed to resolve cluster snapshot: ${getScannerErrorMessage(error)}`
      );
    }
  }
}
