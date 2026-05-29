import { parseOperatorIdsCsv } from "../../../shared/operator-ids";

export default {
  arg1: "-oids",
  arg2: "--operator-ids",
  options: {
    type: String,
    required: true,
    help: "Comma-separated list of operators IDs regarding the cluster that you want to query",
  },
  interactive: {
    options: {
      type: "text",
      message: "Provide comma-separated operator IDs",
      validate: (value: string) => {
        try {
          parseOperatorIdsCsv(value);
          return true;
        } catch (error: unknown) {
          return error instanceof Error ? error.message : String(error);
        }
      },
    },
  },
};
