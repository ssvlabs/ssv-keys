const MIN_OPERATORS_COUNT = 4;
const MAX_OPERATORS_COUNT = 13;

const hasValidOperatorCount = (length: number): boolean =>
  !(length < MIN_OPERATORS_COUNT || length > MAX_OPERATORS_COUNT || length % 3 !== 1);

export const validateOperatorIds = (operatorIds: number[]): void => {
  if (!Array.isArray(operatorIds)) {
    throw new Error("Operator IDs must be provided as a comma-separated list.");
  }

  if (operatorIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
    throw new Error("Operator IDs must be positive integers.");
  }

  if (new Set(operatorIds).size !== operatorIds.length) {
    throw new Error("Operator IDs must be unique.");
  }

  if (!hasValidOperatorCount(operatorIds.length)) {
    throw new Error(
      "Comma-separated list of operator IDs. The amount must be 3f+1 compatible."
    );
  }
};

export const parseOperatorIdsCsv = (rawOperatorIds: string): number[] => {
  if (typeof rawOperatorIds !== "string" || !rawOperatorIds.trim()) {
    throw new Error("Operator IDs are required.");
  }

  const operatorIds = rawOperatorIds.split(",").map((value) => {
    const parsedValue = value.trim();
    if (!parsedValue) {
      throw new Error("Operator IDs must not include empty values.");
    }

    const operatorId = Number(parsedValue);
    if (!Number.isSafeInteger(operatorId) || operatorId <= 0) {
      throw new Error(
        `Invalid operator ID "${parsedValue}". Operator IDs must be positive integers.`
      );
    }

    return operatorId;
  });

  validateOperatorIds(operatorIds);
  return operatorIds;
};

export const normalizeOperatorIds = (operatorIds: number[]): number[] =>
  [...operatorIds].sort((a, b) => a - b);

