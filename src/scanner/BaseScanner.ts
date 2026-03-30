import { SSVSDK } from "@ssv-labs/ssv-sdk";
import { getAddress } from "viem";

import { createSdkForNetwork } from "./sdk/create-sdk";
import {
  isSupportedSdkNetwork,
  SUPPORTED_SDK_NETWORKS,
  SupportedSdkNetwork,
} from "./sdk/networks";

export interface ScannerParams {
  network: string;
  nodeUrl: string;
  ownerAddress: string;
}

export abstract class BaseScanner {
  protected params: ScannerParams;

  constructor(scannerParams: ScannerParams) {
    if (!scannerParams.nodeUrl) {
      throw Error("ETH1 node is required");
    }
    if (!scannerParams.network) {
      throw Error("Network is required");
    }
    if (!scannerParams.ownerAddress) {
      throw Error("Cluster owner address is required");
    }
    if (scannerParams.ownerAddress.length !== 42) {
      throw Error("Invalid owner address length.");
    }
    if (!scannerParams.ownerAddress.startsWith("0x")) {
      throw Error("Invalid owner address.");
    }

    this.params = scannerParams;
    this.params.ownerAddress = getAddress(this.params.ownerAddress);
  }

  protected createSdk(): SSVSDK {
    const network = this.getSupportedNetworkOrThrow();
    return createSdkForNetwork({
      network,
      nodeUrl: this.params.nodeUrl,
    });
  }

  protected logScanContext(sdk: SSVSDK, additionalLines: string[] = []): void {
    const contractAddress = sdk.config.contractAddresses.setter;
    if (contractAddress) {
      console.log(`Using contract address: ${contractAddress}`);
    }

    console.log(`Network: ${this.params.network}`);
    console.log(`Owner address: ${this.params.ownerAddress}`);

    for (const line of additionalLines) {
      console.log(line);
    }
  }

  protected toSafeNumber(value: bigint, valueName: string): number {
    if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new Error(`${valueName} is larger than MAX_SAFE_INTEGER.`);
    }

    return Number(value);
  }

  private getSupportedNetworkOrThrow(): SupportedSdkNetwork {
    const network = this.params.network;
    if (!isSupportedSdkNetwork(network)) {
      const supportedNetworks = SUPPORTED_SDK_NETWORKS.join(", ");
      throw new Error(
        `Network "${network}" is not supported. Supported networks: ${supportedNetworks}.`
      );
    }

    return network;
  }
}
