export default {
  arg1: "-o",
  arg2: "--output-path",
  options: {
    required: false,
    type: String,
    help: "The output path for the operator data",
  },
  interactive: {
    options: {
      type: "text",
      message: "Optional output path for operator data (leave blank for default)",
      required: false,
    },
  },
};
