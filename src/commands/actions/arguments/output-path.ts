export default {
  arg1: "-o",
  arg2: "--output-path",
  options: {
    required: false,
    type: String,
    help: "Output directory for the operator data file",
  },
  interactive: {
    options: {
      type: "text",
      message: "Optional output directory for operator data (leave blank for default)",
      required: false,
    },
  },
};
