import { describe, expect, it } from "vitest";

import { normalizeOperatorIds, parseOperatorIdsCsv, validateOperatorIds } from "../shared/operator-ids";

describe("operator ids helpers", () => {
  it("parses and validates a valid operator-id CSV list", () => {
    expect(parseOperatorIdsCsv("5,6,7,8")).toEqual([5, 6, 7, 8]);
  });

  it("rejects duplicate operator IDs", () => {
    expect(() => parseOperatorIdsCsv("5,6,6,8")).toThrow("Operator IDs must be unique.");
  });

  it("rejects invalid operator count", () => {
    expect(() => validateOperatorIds([5, 6, 7])).toThrow(
      "Comma-separated list of operator IDs. Accepted counts: 4, 7, 10, 13."
    );
  });

  it("returns sorted operator IDs", () => {
    expect(normalizeOperatorIds([8, 6, 5, 7])).toEqual([5, 6, 7, 8]);
  });
});
