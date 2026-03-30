export default {
  arg1: "-n",
  arg2: "--node-url",
  options: {
    required: true,
    type: String,
    help: "ETH1 (execution client) node endpoint url",
  },
  interactive: {
    options: {
      type: "text",
      message: "Provide ETH1 (execution client) node endpoint url",
      validate: (value: string) =>
        value && value.trim().length > 0 ? true : "Node URL is required",
    },
  },
};
