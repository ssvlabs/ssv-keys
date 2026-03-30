import { SSVSDK } from "@ssv-labs/ssv-sdk";
import fs from "fs";
import path from "path";

import { BaseScanner } from "./BaseScanner";

export interface OperatorEntry {
  id: number;
  pubkey: string;
}

export class OperatorScanner extends BaseScanner {
  async run(outputPath?: string, isCli?: boolean): Promise<string | null> {
    const sdk = this.createSdk();

    if (isCli) {
      console.log("\nScanning blockchain...");
      this.logScanContext(sdk);
    }

    const entries = await this.getOwnerOperators(sdk);
    if (entries.length === 0) {
      return null;
    }

    return this.writeOperatorsFile(entries, outputPath);
  }

  async getOwnerOperators(sdk: SSVSDK): Promise<OperatorEntry[]> {
    const clusters = await sdk.api.getClusters({
      owner: this.params.ownerAddress.toLowerCase(),
    });

    const operatorIdSet = new Set<string>();
    for (const cluster of clusters) {
      for (const operatorId of cluster.operatorIds) {
        operatorIdSet.add(String(operatorId));
      }
    }

    const uniqueOperatorIds = Array.from(operatorIdSet).sort(
      (a, b) => Number(a) - Number(b)
    );

    if (uniqueOperatorIds.length === 0) {
      return [];
    }

    const operators = await sdk.api.getOperators({
      operatorIds: uniqueOperatorIds,
    });

    const operatorEntries: OperatorEntry[] = operators.map((operator) => ({
      id: Number(operator.id),
      pubkey: operator.publicKey,
    }));

    return operatorEntries.sort((a, b) => a.id - b.id);
  }

  private writeOperatorsFile(entries: OperatorEntry[], outputPath?: string): string {
    const dirPath = outputPath ? outputPath : path.join(process.cwd(), "data");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(
      dirPath,
      `operator-pubkeys-${this.params.network}.json`
    );

    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));
    return filePath;
  }
}
