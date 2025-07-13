import { util, pki } from "node-forge";
import { OperatorPublicKeyError } from "@ssv-labs/ssv-sdk";

export const operatorPublicKeyValidator = (publicKey: string): boolean => {
  publicKey = publicKey.trim();

  const begin = "-----BEGIN RSA PUBLIC KEY-----";
  const end = "-----END RSA PUBLIC KEY-----";

  let decodedPublicKey = "";
  try {
    if (!publicKey.startsWith(begin)) {
      if (publicKey.length < 98) {
        throw new Error(
          "The length of the operator public key must be at least 98 characters."
        );
      }

      try {
        decodedPublicKey = util.decode64(publicKey).trim();
      } catch (error) {
        console.log("error:", error);
        throw new Error(
          "Failed to decode the operator public key. Ensure it's correctly base64 encoded."
        );
      }

      if (!decodedPublicKey.startsWith(begin)) {
        throw new Error(`Operator public key does not start with '${begin}'`);
      }
    } else {
      decodedPublicKey = publicKey;
    }

    if (!decodedPublicKey.endsWith(end)) {
      throw new Error(`Operator public key does not end with '${end}'`);
    }

    try {
      pki.publicKeyFromPem(decodedPublicKey);
    } catch {
      throw new Error(
        "Invalid operator key format, make sure the operator exists in the network."
      );
    }
  } catch (error: any) {
    throw new OperatorPublicKeyError(
      {
        rsa: decodedPublicKey,
        base64: publicKey,
      },
      error.message
    );
  }
  return true;
};
