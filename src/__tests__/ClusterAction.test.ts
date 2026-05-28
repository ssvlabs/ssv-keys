import { beforeEach, describe, expect, it, vi } from "vitest";

const runMock = vi.fn();

vi.mock("../scanner", () => ({
  ClusterScanner: vi.fn().mockImplementation(() => ({
    run: runMock,
  })),
}));

describe("ClusterAction", () => {
  beforeEach(() => {
    runMock.mockReset();
  });

  it("logs cluster JSON with keyed cluster fields intact", async () => {
    runMock.mockResolvedValue({
      payload: {
        Block: 123456,
        Owner: "0x1111111111111111111111111111111111111111",
        Operators: "5,6,7,8",
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

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const tableSpy = vi.spyOn(console, "table").mockImplementation(() => {});

    const { ClusterAction } = await import("../commands/actions/ClusterAction");

    await new ClusterAction()
      .setArgs({
        network: "hoodi",
        node_url: "http://localhost:8545",
        owner_address: "0x1111111111111111111111111111111111111111",
        operator_ids: "5,6,7,8",
      })
      .execute();

    expect(tableSpy).toHaveBeenCalledTimes(2);

    const jsonOutput = logSpy.mock.calls.at(-1)?.[0];
    expect(typeof jsonOutput).toBe("string");

    expect(JSON.parse(jsonOutput as string)).toEqual({
      block: 123456,
      "cluster snapshot": {
        validatorCount: 1,
        networkFeeIndex: "2",
        index: "3",
        active: true,
        balance: "4",
      },
      cluster: {
        validatorCount: 1,
        networkFeeIndex: "2",
        index: "3",
        active: true,
        balance: "4",
      },
    });
    expect(JSON.parse(jsonOutput as string).cluster).not.toEqual([
      1,
      "2",
      "3",
      true,
      "4",
    ]);

    logSpy.mockRestore();
    tableSpy.mockRestore();
  });

  it("wraps scanner failures in a cleaner cluster-specific message", async () => {
    runMock.mockRejectedValue({
      shortMessage: "The cluster contract call reverted.",
      details: "Execution reverted while reading cluster state.\nRaw stack trace...",
      message: "Very long raw SDK message",
    });

    const { ClusterAction } = await import("../commands/actions/ClusterAction");

    await expect(
      new ClusterAction()
        .setArgs({
          network: "hoodi",
          node_url: "http://localhost:8545",
          owner_address: "0x1111111111111111111111111111111111111111",
          operator_ids: "5,6,7,8",
        })
        .execute()
    ).rejects.toThrow(
      "Failed to resolve cluster snapshot: The cluster contract call reverted."
    );
  });
});
