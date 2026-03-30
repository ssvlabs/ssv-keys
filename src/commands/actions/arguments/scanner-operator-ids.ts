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
      validate: (value: string) =>
        value && value.trim().length > 0
          ? true
          : "Operator IDs are required",
    },
  },
};
