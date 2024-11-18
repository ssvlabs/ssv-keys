import bls from '../BLS';

import { SecretKeyType } from 'bls-eth-wasm';

import { SSVKeysException } from '../exceptions/base';
import { PrivateKeyFormatError } from '../exceptions/keystore';
import { isOperatorsLengthValid } from '../../commands/actions/validators';

export interface IShares {
  privateKey: string,
  publicKey: string,
  id?: any
}

export interface ISharesKeyPairs {
  privateKey: string,
  publicKey: string,
  shares: IShares[]
}

export class ThresholdInvalidOperatorsLengthError extends SSVKeysException {
  public operators: number[];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(operators: number[], message: string) {
    super(message);
    this.operators = operators;
  }
}

export class ThresholdInvalidOperatorIdError extends SSVKeysException {
  public operator: any;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(operator: any, message: string) {
    super(message);
    this.operator = operator;
  }
}

/**
 * Building threshold for list of operator IDs
 */
class Threshold {
  protected publicKey: any;
  protected privateKey: any;
  protected shares: Array<any> = [];

  static get DEFAULT_THRESHOLD_NUMBER(): number {
    return 3;
  }

  /**
   * Receives list of operators IDs.
   *  len(operator IDs) := 3 * F + 1
   *
   * If F calculated from this formula is not integer number - it will raise exception.
   * Generate keys and return promise
   */
  async create(privateKeyString: string, operatorIds: number[]): Promise<ISharesKeyPairs> {
    if (!privateKeyString.startsWith('0x')) {
      throw new PrivateKeyFormatError(privateKeyString, 'The private key must be provided in the 0x format.')
    }
    // Validation
    operatorIds.map(operatorId => {
      if (!Number.isInteger(operatorId)) {
        throw new ThresholdInvalidOperatorIdError(
          operatorId,
          `Operator must be integer. Got: ${operatorId}`
        );
      }
    });

    if (!isOperatorsLengthValid(operatorIds.length)) {
      throw new ThresholdInvalidOperatorsLengthError(
        operatorIds,
        'Invalid operators amount. Enter an 3f+1 compatible amount of operator ids.'
      );
    }

    const msk = [];
    const mpk = [];

    if (!bls.deserializeHexStrToSecretKey) {
      await bls.init(bls.BLS12_381);
    }
    // Master key Polynomial
    this.privateKey = bls.deserializeHexStrToSecretKey(privateKeyString.replace('0x', ''));
    this.publicKey = this.privateKey.getPublicKey();

    msk.push(this.privateKey);
    mpk.push(this.publicKey);

    const F = (operatorIds.length - 1) / 3;
    // Construct poly
    for (let i = 1; i < operatorIds.length - F; i += 1) {
      const sk: SecretKeyType = new bls.SecretKey();
      sk.setByCSPRNG();
      msk.push(sk);
      const pk = sk.getPublicKey();
      mpk.push(pk);
    }

    // Evaluate shares - starting from 1 because 0 is master key
    for (const operatorId of operatorIds) {
      const id = new bls.Id();
      id.setInt(operatorId);
      const shareSecretKey = new bls.SecretKey();
      shareSecretKey.share(msk, id);

      const sharePublicKey = new bls.PublicKey();
      sharePublicKey.share(mpk, id);

      this.shares.push({
        privateKey: `0x${shareSecretKey.serializeToHexStr()}`,
        publicKey: `0x${sharePublicKey.serializeToHexStr()}`,
        id,
      });
    }

    const response: ISharesKeyPairs = {
      privateKey: `0x${this.privateKey.serializeToHexStr()}`,
      publicKey: `0x${this.publicKey.serializeToHexStr()}`,
      shares: this.shares,
    };

    return response;
  }
}

export default Threshold;
