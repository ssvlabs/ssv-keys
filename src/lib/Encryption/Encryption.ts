import JSEncrypt from '../JSEncrypt';

import { IShares } from '../Threshold';

import { operatorPublicKeyValidator } from '../../commands/actions/validators';
import { OperatorPublicKeyError } from '../exceptions/operator';

export interface EncryptShare {
    operatorPublicKey: string,
    privateKey: string,
    publicKey: string
}

export default class Encryption {
  private readonly operatorPublicKeys: string[];
  private readonly shares: IShares[];


  constructor(operatorPublicKeys: string[], shares: IShares[]) {
    this.operatorPublicKeys = [...operatorPublicKeys];
    this.shares = shares;
  }

  encrypt(): EncryptShare[] {
    const encryptedShares: EncryptShare[] = [];
    for (const [idx, operatorPublicKey] of this.operatorPublicKeys.entries()) {
      operatorPublicKeyValidator(operatorPublicKey);
      const jsEncrypt = new JSEncrypt({});
      jsEncrypt.setPublicKey(operatorPublicKey)
      const encryptedPrivateKey = jsEncrypt.encrypt(this.shares[idx].privateKey);
      if (!encryptedPrivateKey) {
        throw new OperatorPublicKeyError(
          {
            rsa: operatorPublicKey,
            base64: encryptedPrivateKey,
          },
          'Private key encryption failed.',
        );
      }
      const encryptedShare: EncryptShare = {
          operatorPublicKey,
          privateKey: encryptedPrivateKey,
          publicKey: this.shares[idx].publicKey,
      };
      encryptedShares.push(encryptedShare);
    }
    return encryptedShares;
  }
}
