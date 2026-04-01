import { BaseAction } from "./BaseAction";
import {
  nodeUrlArgument,
  networkArgument,
  ownerAddressArgument,
  scannerOperatorIdsArgument,
} from "./arguments";
import { ClusterScanner } from "../../scanner";
import { parseOperatorIdsCsv } from "../../shared/operator-ids";

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
          cluster: Object.values(result.cluster),
        },
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
        "  "
      )
    );
  }
}
