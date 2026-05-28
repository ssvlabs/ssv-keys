import { beforeEach, describe, expect, it, vi } from "vitest";

const nonceRunMock = vi.fn();
const operatorRunMock = vi.fn();

vi.mock("../scanner", () => ({
  NonceScanner: vi.fn().mockImplementation(() => ({
    run: nonceRunMock,
  })),
  OperatorScanner: vi.fn().mockImplementation(() => ({
    run: operatorRunMock,
  })),
}));

describe("scanner action error handling", () => {
  beforeEach(() => {
    nonceRunMock.mockReset();
    operatorRunMock.mockReset();
  });

  it("wraps nonce scanner failures with a concise user-facing message", async () => {
    nonceRunMock.mockRejectedValue({
      details: "Failed to fetch owner nonce from the network.\nstack: ...",
      message: "raw viem error with extra context",
    });

    const { NonceAction } = await import("../commands/actions/NonceAction");

    await expect(
      new NonceAction()
        .setArgs({
          network: "hoodi",
          node_url: "http://localhost:8545",
          owner_address: "0x1111111111111111111111111111111111111111",
        })
        .execute()
    ).rejects.toThrow(
      "Failed to resolve owner nonce: Failed to fetch owner nonce from the network."
    );
  });

  it("wraps operator scanner failures with a concise user-facing message", async () => {
    operatorRunMock.mockRejectedValue(
      new Error("Operator scan failed unexpectedly.\nVerbose stack follows...")
    );

    const { OperatorAction } = await import("../commands/actions/OperatorAction");

    await expect(
      new OperatorAction()
        .setArgs({
          network: "hoodi",
          node_url: "http://localhost:8545",
          owner_address: "0x1111111111111111111111111111111111111111",
          output_path: "./data",
        })
        .execute()
    ).rejects.toThrow(
      "Failed to resolve owner operator data: Operator scan failed unexpectedly."
    );
  });
});
