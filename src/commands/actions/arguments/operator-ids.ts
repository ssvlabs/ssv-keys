import { SSVKeysException } from "@ssv-labs/ssv-sdk";
import { isOperatorsLengthValid } from "../validators";

export default {
  arg1: "-oids",
  arg2: "--operator-ids",
  options: {
    type: String,
    required: true,
    help: "Comma-separated list of operator IDs. The amount must be 3f+1 compatible",
  },
  interactive: {
    repeat: "Input another operator?",
    repeatWith: ["--operator-keys"],
    options: {
      type: "number",
      message: "Enter operator ID for {{index}} operator",
      validate: (operatorId: number): boolean | string => {
        return !(Number.isSafeInteger(operatorId) && operatorId > 0)
          ? "Invalid operator ID format"
          : true;
      },
    },
    validateList: (items: unknown[]) => {
      const normalizedIds = items.map((item) => Number(item));

      if (normalizedIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
        throw new SSVKeysException("Invalid operator ID format");
      }

      if (new Set(normalizedIds).size !== normalizedIds.length) {
        throw new SSVKeysException("This operator ID is already used");
      }

      if (!isOperatorsLengthValid(normalizedIds.length)) {
        throw new SSVKeysException(
          "Invalid operators amount. Enter an 3f+1 compatible amount of operator ids"
        );
      }
    },
  },
};
