import { decode } from 'js-base64';
import JSEncrypt from '../../../lib/JSEncrypt';
import { OperatorPublicKeyError } from '../../../lib/exceptions/operator';

export const operatorPublicKeyValidator = (publicKey: string): boolean => {
  publicKey = publicKey.trim();

  const begin = '-----BEGIN RSA PUBLIC KEY-----';
  const end = '-----END RSA PUBLIC KEY-----';

  const encrypt = new JSEncrypt({});
  let decodedOperator = '';
  try {
    let decodedPublicKey = '';

    if (!publicKey.startsWith(begin)) {
      if (publicKey.length < 98) {
        throw new Error('The length of the operator public key must be at least 98 characters.');
      }

      try {
        decodedPublicKey = decode(publicKey).trim();
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
      // Get the content without the header and footer
      const content = decodedPublicKey.slice(begin.length, publicKey.length - end.length).trim();
      decodedOperator = decode(content);
    } catch (error) {
      throw new Error("Failed to decode the RSA public key. Ensure it's correctly base64 encoded.");
    }

    try {
      encrypt.setPublicKey(decodedOperator);
    } catch (error: any) {
      throw new Error("Invalid operator key format, make sure the operator exists in the network.");
    }
  } catch (error: any) {
    throw new OperatorPublicKeyError(
      {
        rsa: decodedOperator,
        base64: publicKey,
      },
      error.message,
    );
  }
  return true;
}
