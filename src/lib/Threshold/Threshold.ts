import { SecretKeyType } from 'bls-eth-wasm';
import bls from '../BLS';

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

export class ThresholdInvalidOperatorsLengthError extends Error {
  public operators: number[];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(operators: number[], message: string) {
    super(message);
    this.operators = operators;
  }
}

export class ThresholdInvalidOperatorIdError extends Error {
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
  async create(privateKey: string, operators: number[]): Promise<ISharesKeyPairs> {
    // Validation
    operators.map(operator => {
      if (!Number.isInteger(operator)) {
        throw new ThresholdInvalidOperatorIdError(
          operator,
          `Operator must be integer. Got: ${String(operator)}`
        );
      }
    });

    const F = (operators.length - 1) / 3;
    if (!Number.isInteger(F)) {
      throw new ThresholdInvalidOperatorsLengthError(
        operators,
        'Invalid operators length. It should satisfy conditions: ‖ Operators ‖ := 3 * F + 1 ; F ∈ ℕ'
      );
    }

    await bls.init(bls.BLS12_381);

    const msk = [];
    const mpk = [];

    // Master key Polynomial
    this.privateKey = bls.deserializeHexStrToSecretKey(privateKey);
    this.publicKey = this.privateKey.getPublicKey();

    msk.push(this.privateKey);
    mpk.push(this.publicKey);

    // Construct poly
    for (let i = 1; i < operators.length - F; i += 1) {
        const sk: SecretKeyType = new bls.SecretKey();
        sk.setByCSPRNG();
        msk.push(sk);
        const pk = sk.getPublicKey();
        mpk.push(pk);
    }

    // Evaluate shares - starting from 1 because 0 is master key
    for (const operatorId of operators) {
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
