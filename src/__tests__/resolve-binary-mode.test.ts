import { describe, expect, it } from "vitest";

import { resolveBinaryMode } from "../binary/resolve-binary-mode";

describe("resolveBinaryMode", () => {
  it("uses interactive mode when no user args are provided", () => {
    expect(resolveBinaryMode(["node", "ssv-keys"])).toEqual({
      interactive: true,
    });
  });

  it("uses non-interactive mode for explicit command invocation", () => {
    expect(resolveBinaryMode(["node", "ssv-keys", "nonce", "--help"])).toEqual({
      interactive: false,
    });
  });

  it("uses non-interactive mode for root help", () => {
    expect(resolveBinaryMode(["node", "ssv-keys", "--help"])).toEqual({
      interactive: false,
    });
  });

  it("injects shares command for legacy binary shares flags", () => {
    expect(
      resolveBinaryMode([
        "node",
        "ssv-keys",
        "--keystore=./validator_keys",
        "--password=test123",
      ])
    ).toEqual({
      interactive: false,
      injectedAction: "shares",
    });
  });

  it("keeps interactive mode for scanner flags when action is omitted", () => {
    expect(
      resolveBinaryMode([
        "node",
        "ssv-keys",
        "--network=hoodi",
        "--node-url=https://rpc.example",
        "--owner-address=0x1111111111111111111111111111111111111111",
      ])
    ).toEqual({
      interactive: true,
    });
  });

  it("uses non-interactive mode for unknown top-level flags", () => {
    expect(resolveBinaryMode(["node", "ssv-keys", "--some-typo"])).toEqual({
      interactive: false,
    });
  });
});
