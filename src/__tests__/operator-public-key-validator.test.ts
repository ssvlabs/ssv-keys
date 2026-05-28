import { describe, expect, it } from "vitest";
import { OperatorPublicKeyError } from "@ssv-labs/ssv-sdk";

import { operatorPublicKeyValidator } from "../commands/actions/validators";

describe("operatorPublicKeyValidator", () => {
  it("wraps base64 decode failures in OperatorPublicKeyError with the existing message", () => {
    try {
      operatorPublicKeyValidator("a".repeat(98));
      throw new Error("Expected validator to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(OperatorPublicKeyError);
      expect(error).toMatchObject({
        message:
          "Failed to decode the operator public key. Ensure it's correctly base64 encoded.",
      });
    }
  });
});
