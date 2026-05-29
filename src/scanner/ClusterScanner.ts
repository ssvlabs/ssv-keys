import { SSVSDK } from "@ssv-labs/ssv-sdk";
import { createClusterId } from "@ssv-labs/ssv-sdk/utils";

import { BaseScanner } from "./BaseScanner";
import { normalizeOperatorIds, validateOperatorIds } from "../shared/operator-ids";

type SdkClusterSnapshotResponse = Awaited<
  ReturnType<SSVSDK["api"]["getClusterSnapshot"]>
>;

type SdkClusterSnapshot = NonNullable<SdkClusterSnapshotResponse["cluster"]>;

type ClusterSnapshotData = Pick<
  SdkClusterSnapshot,
  "validatorCount" | "networkFeeIndex" | "index" | "active" | "balance"
>;

interface ClusterPayload {
  Owner: string;
  Operators: string;
  Block: number;
  Data: string;
}

interface ClusterView {
  validatorCount: number;
  networkFeeIndex: string;
  index: string;
  active: boolean;
  balance: string;
}

export interface ClusterData {
  payload: ClusterPayload;
  cluster: ClusterView;
}

const DEFAULT_CLUSTER_SNAPSHOT: ClusterSnapshotData = {
  validatorCount: "0",
  networkFeeIndex: "0",
  index: "0",
  active: true,
  balance: "0",
};

export class ClusterScanner extends BaseScanner {
  async run(operatorIds: number[], isCli?: boolean): Promise<ClusterData> {
    validateOperatorIds(operatorIds);
    const normalizedOperatorIds = normalizeOperatorIds(operatorIds);

    if (isCli) {
      console.log("\nScanning blockchain...");
    }

    return this.getClusterSnapshot(normalizedOperatorIds, isCli);
  }

  private async getClusterSnapshot(
    operatorIds: number[],
    isCli?: boolean
  ): Promise<ClusterData> {
    const sdk = this.createSdk();

    if (isCli) {
      console.log("");
      this.logScanContext(sdk, [`Operator IDs: ${operatorIds.join(",")}`]);
    }

    const { blockNumber, clusterData } = await this.queryClusterSnapshot(
      sdk,
      operatorIds
    );

    return {
      payload: {
        Owner: this.params.ownerAddress,
        Operators: operatorIds.join(","),
        Block: blockNumber,
        Data: [
          clusterData.validatorCount,
          clusterData.networkFeeIndex,
          clusterData.index,
          clusterData.active,
          clusterData.balance,
        ].join(","),
      },
      cluster: {
        validatorCount: Number(clusterData.validatorCount),
        networkFeeIndex: clusterData.networkFeeIndex.toString(),
        index: clusterData.index.toString(),
        active: clusterData.active,
        balance: clusterData.balance.toString(),
      },
    };
  }

  private async queryClusterSnapshot(
    sdk: SSVSDK,
    operatorIds: number[]
  ): Promise<{ blockNumber: number; clusterData: ClusterSnapshotData }> {
    const clusterId = createClusterId(this.params.ownerAddress, operatorIds);
    const { blockNumber, cluster } = await sdk.api.getClusterSnapshot({
      id: clusterId,
    });

    if (!cluster) {
      return { blockNumber, clusterData: DEFAULT_CLUSTER_SNAPSHOT };
    }

    const { validatorCount, networkFeeIndex, index, active, balance } = cluster;

    return {
      blockNumber,
      clusterData: {
        validatorCount,
        networkFeeIndex,
        index,
        active,
        balance,
      },
    };
  }
}
