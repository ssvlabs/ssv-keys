import { BaseAction } from "./BaseAction";
import {
  nodeUrlArgument,
  networkArgument,
  ownerAddressArgument,
  scannerOperatorIdsArgument,
} from "./arguments";
import { ClusterScanner } from "../../scanner";

const parseOperatorIds = (rawOperatorIds: string): number[] => {
  if (typeof rawOperatorIds !== "string" || !rawOperatorIds.trim()) {
    throw new Error("Operator IDs are required.");
  }

  return rawOperatorIds.split(",").map((value) => {
    const parsedValue = value.trim();
    if (!parsedValue) {
      throw new Error("Operator IDs must not include empty values.");
    }

    const operatorId = Number(parsedValue);
    if (!Number.isSafeInteger(operatorId) || operatorId <= 0) {
      throw new Error(
        `Invalid operator ID "${parsedValue}". Operator IDs must be positive integers.`
      );
    }

    return operatorId;
  });
};

export class ClusterAction extends BaseAction {
  static override get options(): any {
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
    const clusterScanner = new ClusterScanner({
      network: this.args.network,
      nodeUrl: this.args.node_url,
      ownerAddress: this.args.owner_address,
    });

    const operatorIds = parseOperatorIds(this.args.operator_ids);
    const result = await clusterScanner.run(operatorIds, true);

    console.table(result.payload);
    console.log("Cluster snapshot:");
    console.table(result.cluster);
    console.log(
      JSON.stringify(
        {
          block: result.payload.Block,
          "cluster snapshot": result.cluster,
          cluster: Object.values(result.cluster),
        },
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
        "  "
      )
    );
  }
}
