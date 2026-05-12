import { BaseScanner } from "./BaseScanner";

export class NonceScanner extends BaseScanner {
  async run(isCli?: boolean): Promise<number> {
    const sdk = this.createSdk();

    if (isCli) {
      console.log("\nScanning blockchain...");
      this.logScanContext(sdk);
    }

    const { nonce } = await sdk.api.getOwnerNonce({
      owner: this.params.ownerAddress,
    });

    return nonce;
  }
}
