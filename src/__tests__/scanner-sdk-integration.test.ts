import fs from "fs";
import os from "os";
import path from "path";
import { describe, expect, it, vi } from "vitest";
import { SSVSDK } from "@ssv-labs/ssv-sdk";

import { ClusterScanner } from "../scanner/ClusterScanner";
import { NonceScanner } from "../scanner/NonceScanner";
import { OperatorScanner } from "../scanner/OperatorScanner";
import { BaseScanner, ScannerParams } from "../scanner/BaseScanner";

const scannerParams: ScannerParams = {
  network: "hoodi",
  nodeUrl: "http://localhost:8545",
  ownerAddress: "0x0c7C715F6E2dCEE6EAC0Af01EE23661e67885339",
};

class TestClusterScanner extends ClusterScanner {
  constructor(private readonly sdk: SSVSDK) {
    super(scannerParams);
  }

  protected override createSdk(): SSVSDK {
    return this.sdk;
  }
}

class TestNonceScanner extends NonceScanner {
  constructor(private readonly sdk: SSVSDK) {
    super(scannerParams);
  }

  protected override createSdk(): SSVSDK {
    return this.sdk;
  }
}

class TestOperatorScanner extends OperatorScanner {
  constructor(private readonly sdk: SSVSDK) {
    super(scannerParams);
  }

  protected override createSdk(): SSVSDK {
    return this.sdk;
  }
}

class TestBaseScanner extends BaseScanner {
  getOwnerAddress(): string {
    return this.params.ownerAddress;
  }
}

describe("scanner SDK adapters", () => {
  it("normalizes owner addresses through canonical parsing", () => {
    const scanner = new TestBaseScanner({
      ...scannerParams,
      ownerAddress: "0x0c7c715f6e2dcee6eac0af01ee23661e67885339",
    });

    expect(scanner.getOwnerAddress()).toBe(scannerParams.ownerAddress);
  });

  it.each([
    "0x1234",
    "0c7C715F6E2dCEE6EAC0Af01EE23661e67885339",
    "not-an-address",
  ])("rejects invalid owner addresses at scanner construction: %s", (ownerAddress) => {
    expect(
      () =>
        new TestBaseScanner({
          ...scannerParams,
          ownerAddress,
        })
    ).toThrowError("Invalid owner address.");
  });

  it("uses the SDK snapshot block number for cluster payloads", async () => {
    const scanner = new TestClusterScanner({
      api: {
        getClusterSnapshot: async () => ({
          blockNumber: 123456,
          cluster: {
            validatorCount: "1",
            networkFeeIndex: "2",
            index: "3",
            active: true,
            balance: "4",
          },
        }),
      },
    } as SSVSDK);

    await expect(scanner.run([301, 170, 108, 131])).resolves.toEqual({
      payload: {
        Owner: scannerParams.ownerAddress,
        Operators: "108,131,170,301",
        Block: 123456,
        Data: "1,2,3,true,4",
      },
      cluster: {
        validatorCount: 1,
        networkFeeIndex: "2",
        index: "3",
        active: true,
        balance: "4",
      },
    });
  });

  it("falls back to the default cluster snapshot when the SDK returns no cluster", async () => {
    const scanner = new TestClusterScanner({
      api: {
        getClusterSnapshot: async () => ({
          blockNumber: 123456,
          cluster: null,
        }),
      },
    } as SSVSDK);

    await expect(scanner.run([301, 170, 108, 131])).resolves.toEqual({
      payload: {
        Owner: scannerParams.ownerAddress,
        Operators: "108,131,170,301",
        Block: 123456,
        Data: "0,0,0,true,0",
      },
      cluster: {
        validatorCount: 0,
        networkFeeIndex: "0",
        index: "0",
        active: true,
        balance: "0",
      },
    });
  });

  it("returns the numeric nonce provided by the SDK", async () => {
    const scanner = new TestNonceScanner({
      api: {
        getOwnerNonce: async () => ({
          blockNumber: 123456,
          nonce: 7,
        }),
      },
    } as SSVSDK);

    await expect(scanner.run()).resolves.toBe(7);
  });

  it("writes deduplicated sorted operator entries from the SDK response", async () => {
    const getClusters = vi.fn(async () => ({
      blockNumber: 123456,
      clusters: [
        {
          operatorIds: ["301", "170", "108", "131"],
        },
        {
          operatorIds: ["131", "301"],
        },
      ],
    }));
    const sdk = {
      api: {
        getClusters,
        getOperators: async () => ({
          blockNumber: 123456,
          operators: [
            { id: "301", publicKey: "pk-301" },
            { id: "170", publicKey: "pk-170" },
            { id: "108", publicKey: "pk-108" },
            { id: "131", publicKey: "pk-131" },
          ],
        }),
      },
    } as SSVSDK;
    const scanner = new TestOperatorScanner(sdk);
    const outputDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "ssv-keys-operators-")
    );

    const filePath = await scanner.run(outputDir);

    expect(getClusters).toHaveBeenCalledWith({
      owner: scannerParams.ownerAddress.toLowerCase(),
    });
    expect(filePath).toBeTruthy();
    expect(JSON.parse(fs.readFileSync(filePath!, "utf8"))).toEqual([
      { id: 108, pubkey: "pk-108" },
      { id: 131, pubkey: "pk-131" },
      { id: 170, pubkey: "pk-170" },
      { id: 301, pubkey: "pk-301" },
    ]);
  });

  it("writes operator output files with the owner address in the filename", async () => {
    const sdk = {
      api: {
        getClusters: async () => ({
          blockNumber: 123456,
          clusters: [
            {
              operatorIds: ["301"],
            },
          ],
        }),
        getOperators: async () => ({
          blockNumber: 123456,
          operators: [{ id: "301", publicKey: "pk-301" }],
        }),
      },
    } as SSVSDK;
    const scanner = new TestOperatorScanner(sdk);
    const outputDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "ssv-keys-operators-")
    );

    const filePath = await scanner.run(outputDir);

    expect(filePath).toBe(
      path.join(
        outputDir,
        "operator-pubkeys-hoodi-0x0c7c715f6e2dcee6eac0af01ee23661e67885339.json"
      )
    );
    expect(fs.existsSync(filePath!)).toBe(true);
  });
});
