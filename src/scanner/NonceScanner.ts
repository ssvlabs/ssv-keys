import { BaseScanner } from "./BaseScanner";

export class NonceScanner extends BaseScanner {
  async run(isCli?: boolean): Promise<number> {
    const sdk = this.createSdk();

    if (isCli) {
      console.log("\nScanning blockchain...");
      this.logScanContext(sdk);
    }

    const ownerNonce = await sdk.api.getOwnerNonce({
      owner: this.params.ownerAddress,
    });

    const parsedNonce = BigInt(ownerNonce);
    return this.toSafeNumber(parsedNonce, "Owner nonce");
  }
}
