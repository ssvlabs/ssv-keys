import { chains } from "@ssv-labs/ssv-sdk";

export const SUPPORTED_SDK_NETWORKS = ["mainnet", "hoodi"] as const;
export type SupportedSdkNetwork = (typeof SUPPORTED_SDK_NETWORKS)[number];

type SdkChain = (typeof chains)[keyof typeof chains];

const SDK_NETWORK_CHAINS: Record<SupportedSdkNetwork, SdkChain> = {
  mainnet: chains.mainnet,
  hoodi: chains.hoodi,
};

export const isSupportedSdkNetwork = (
  network: string
): network is SupportedSdkNetwork => {
  return (SUPPORTED_SDK_NETWORKS as readonly string[]).includes(network);
};

export const getSdkChain = (network: SupportedSdkNetwork): SdkChain => {
  return SDK_NETWORK_CHAINS[network];
};
