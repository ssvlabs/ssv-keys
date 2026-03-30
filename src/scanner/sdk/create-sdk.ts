import { SSVSDK } from "@ssv-labs/ssv-sdk";
import { createPublicClient, http } from "viem";

import { getSdkChain, SupportedSdkNetwork } from "./networks";

interface CreateSdkForNetworkParams {
  network: SupportedSdkNetwork;
  nodeUrl: string;
}

const sdkCache = new Map<string, SSVSDK>();
const SUBGRAPH_API_KEY_ENV = "SSV_SUBGRAPH_API_KEY";

const getSubgraphApiKey = (): string | undefined => {
  const value = process.env[SUBGRAPH_API_KEY_ENV]?.trim();
  return value ? value : undefined;
};

export const createSdkForNetwork = ({
  network,
  nodeUrl,
}: CreateSdkForNetworkParams): SSVSDK => {
  const normalizedNodeUrl = nodeUrl.trim();
  const subgraphApiKey = getSubgraphApiKey();
  const cacheKey = `${network}:${normalizedNodeUrl}:${
    subgraphApiKey ? "with-key" : "without-key"
  }`;

  const cachedSdk = sdkCache.get(cacheKey);
  if (cachedSdk) {
    return cachedSdk;
  }

  const publicClient = createPublicClient({
    chain: getSdkChain(network),
    transport: http(normalizedNodeUrl),
  });

  const sdk = new SSVSDK({
    publicClient,
    ...(subgraphApiKey
      ? {
          extendedConfig: {
            subgraph: {
              apiKey: subgraphApiKey,
            },
          },
        }
      : {}),
  });

  sdkCache.set(cacheKey, sdk);
  return sdk;
};
