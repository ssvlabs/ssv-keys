import { decode } from 'js-base64';
import JSEncrypt from '../../../lib/JSEncrypt';
import { InvalidOperatorKeyException } from '../../../lib/Encryption/Encryption';

export const operatorPublicKeyValidator = (publicKey: string): string | boolean => {
  try {
    const errorMessage = 'Invalid operator key format, make sure the operator exists in the network';
    const decodedOperator = decode(publicKey);
    if (publicKey.length < 98) {
      throw Error('The length of the operator public key must be at least 98 characters.');
    }
    if (!decodedOperator.startsWith('-----BEGIN RSA PUBLIC KEY-----')) {
      throw Error(errorMessage);
    }
    const encrypt = new JSEncrypt({});
    try {
      encrypt.setPublicKey(decodedOperator);
    } catch (error) {
      throw new InvalidOperatorKeyException(
        {
          rsa: decodedOperator,
          base64: publicKey,
        },
        errorMessage,
      );
    }
    return true;
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { message } = e;
    return message;
  }
}
