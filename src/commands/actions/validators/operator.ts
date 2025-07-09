import * as nForge from 'node-forge';
import { OperatorPublicKeyError } from '../../../main';

export const operatorPublicKeyValidator = (publicKey: string): boolean => {
  publicKey = publicKey.trim();

  const begin = '-----BEGIN RSA PUBLIC KEY-----';
  const end = '-----END RSA PUBLIC KEY-----';

  let decodedPublicKey = '';
  try {
    if (!publicKey.startsWith(begin)) {
      if (publicKey.length < 98) {
        throw new Error('The length of the operator public key must be at least 98 characters.');
      }

      try {
        decodedPublicKey = nForge.util.decode64(publicKey).trim();
      } catch (error) {
        throw new Error("Failed to decode the operator public key. Ensure it's correctly base64 encoded.");
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
      nForge.pki.publicKeyFromPem(decodedPublicKey);
    } catch (error: any) {
      throw new Error("Invalid operator key format, make sure the operator exists in the network.");
    }
  } catch (error: any) {
    throw new OperatorPublicKeyError(
      {
        rsa: decodedPublicKey,
        base64: publicKey,
      },
      error.message,
    );
  }
  return true;
}
