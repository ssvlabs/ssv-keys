import { SUPPORTED_SDK_NETWORKS } from "../../../scanner/sdk/networks";

const SUPPORTED_NETWORKS_TEXT = SUPPORTED_SDK_NETWORKS.join(", ");

export default {
  arg1: "-nw",
  arg2: "--network",
  options: {
    type: String,
    required: true,
    metavar: "NETWORK",
    choices: [...SUPPORTED_SDK_NETWORKS],
    help: `The network (${SUPPORTED_NETWORKS_TEXT})`,
  },
  interactive: {
    options: {
      type: "select",
      message: "Select network",
      choices: SUPPORTED_SDK_NETWORKS.map((network) => ({
        title: network,
        value: network,
      })),
    },
  },
};
