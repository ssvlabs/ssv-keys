import Web3 from 'web3';
import { decode } from 'js-base64';
import {
  IsArray,
  MinLength,
  IsInt,
  IsString,
  Length,
  ValidateNested, IsOptional
} from 'class-validator';
import bls from '../../BLS';
import { EncryptShare } from '../../Encryption/Encryption';
import { operatorValidator } from '../../../commands/actions/validators/operator';

const web3 = new Web3();

// ---------------------------------------------------------------
// Structure interfaces
// ---------------------------------------------------------------

export interface IOperatorV2 {
  id: number,
  publicKey: string
}

export interface ISharesV2 {
  publicKeys: string[],
  encryptedKeys: string[]
}

export interface IKeySharesParamsV2 {
  operators: IOperatorV2[],
  shares: ISharesV2,
  publicKey: string,
}

// ---------------------------------------------------------------
// Structure classes
// ---------------------------------------------------------------

export class KeySharesKeysV2 {
  @IsArray()
  @MinLength(98, {
    each: true,
  })
  publicKeys: string[];

  @IsArray()
  @MinLength(98, {
    each: true,
  })
  encryptedKeys: string[];

  constructor(publicKeys: string[], encryptedKeys: string[]) {
    this.publicKeys = publicKeys;
    this.encryptedKeys = encryptedKeys;
  }

  /**
   * Build encrypted shares that can be used for encryption flow.
   * @param operatorPublicKeys
   */
  toEncryptedShares(operatorPublicKeys: string[]): EncryptShare[] {
    if (this.publicKeys.length !== this.encryptedKeys.length
      || this.publicKeys.length !== operatorPublicKeys.length
      || this.encryptedKeys.length !== operatorPublicKeys.length) {
      throw Error('Operator public keys and shares public/encrypted keys length does not match.');
    }
    const encryptedShares: EncryptShare[] = [];
    for (let i = 0; i < operatorPublicKeys.length; i += 1) {
      const operatorPublicKey = operatorPublicKeys[i];
      const privateKey = this.encryptedKeys[i];
      const publicKey = this.publicKeys[i];
      encryptedShares.push({
        operatorPublicKey,
        privateKey,
        publicKey,
      });
    }
    return encryptedShares;
  }
}

export class OperatorV2 {
  @IsInt()
  public id: number;

  @IsString()
  @MinLength(98)
  public publicKey: string;

  constructor(id: number, publicKey: string) {
    this.id = id;
    this.publicKey = publicKey;
  }
}

export class KeySharesDataV2 {
  @IsString()
  @Length(98, 98)
  public publicKey: string;

  @ValidateNested()
  public operators: OperatorV2[];

  @IsOptional()
  @ValidateNested()
  public shares?: KeySharesKeysV2 | null;

  constructor(data: IKeySharesParamsV2) {
    this.publicKey = data.publicKey;
    this.operators = data.operators.map(
      (operator) => new OperatorV2(operator.id, operator.publicKey)
    );
    this.shares = new KeySharesKeysV2(data.shares.publicKeys, data.shares.encryptedKeys);
  }

  /**
   * Get the list of shares public keys.
   */
  get sharesPublicKeys(): string[] | null {
    return this.shares?.publicKeys || null;
  }

  /**
   * Get the list of encrypted shares.
   */
  get sharesEncryptedKeys(): string[] | null {
    return this.shares?.encryptedKeys || null;
  }

  /**
   * Get the list of operators IDs.
   */
  get operatorIds(): number[] {
    return this.operators.map(operator => operator.id);
  }

  /**
   * Get the list of operators public keys.
   */
  get operatorPublicKeys(): string[] {
    return this.operators.map(operator => operator.publicKey);
  }

  /**
   * Try to BLS deserialize validator public key.
   */
  async validateValidatorPublicKey(): Promise<any> {
    try {
      bls.deserializeHexStrToPublicKey(this.publicKey.replace('0x', ''));
    } catch (e) {
      throw Error(`Can not BLS deserialize validator public key: ${this.publicKey}. Error: ${String(e)}`);
    }
  }

  /**
   * Try to BLS deserialize shares public keys.
   */
  async validateSharesPublicKeys(): Promise<any> {
    if (!this.sharesPublicKeys?.length) {
      return;
    }
    let publicKeyWithError = '';
    try {
      for (const publicKey of this.sharesPublicKeys) {
        publicKeyWithError = publicKey;
        bls.deserializeHexStrToPublicKey(publicKey.replace('0x', ''));
      }
    } catch (e) {
      throw Error(`Can not BLS deserialize shares public key: ${publicKeyWithError}. Error: ${String(e)}`);
    }
  }

  /**
   * If shares encrypted keys are ABI encoded - try to decode them.
   */
  async validateSharesEncryptedKeys(): Promise<any> {
    if (!this.sharesEncryptedKeys?.length) {
      return;
    }
    let encryptedKeyWithError = '';
    try {
      this.sharesEncryptedKeys.map(encryptedKey => {
        let key: any = encryptedKey;
        // If the key is ABI encoded - decode it.
        if (key.startsWith('0x')) {
          encryptedKeyWithError = key;
          key = web3.eth.abi.decodeParameter('string', encryptedKey);
        }
        // ABI decoded key then should be a valid base 64 string
        decode(String(key));
      });
    } catch (e) {
      throw Error(`Can not ABI decode shares encrypted key: ${encryptedKeyWithError}. Error: ${String(e)}`);
    }
  }

  /**
   * Check that counts are consistent.
   */
  async validateCounts(): Promise<any> {
    if (!this.sharesEncryptedKeys?.length || !this.sharesPublicKeys?.length) {
      return;
    }
    if (this.operatorIds.length !== this.sharesEncryptedKeys.length
      || this.operatorIds.length !== this.sharesPublicKeys.length
      || this.operatorIds.length !== this.operatorPublicKeys.length) {
      throw Error('Length of operators and shares should be equal.');
    }
  }

  /**
   * Go over operator public keys and try to check if they are:
   * 1) valid base 64 strings
   * 2) when base 64 decoded - valid RSA public key
   */
  async validateOperatorsPublicKeys(): Promise<any> {
    for (const operatorPublicKey of this.operatorPublicKeys) {
      const result = await operatorValidator(operatorPublicKey);
      if (result !== true) {
        throw Error(String(result));
      }
    }
  }

  /**
   * Do all possible validations.
   */
  async validate(): Promise<any> {
    await bls.init(bls.BLS12_381);
    await this.validateCounts();
    await this.validateSharesPublicKeys();
    await this.validateValidatorPublicKey();
    await this.validateSharesEncryptedKeys();
    await this.validateOperatorsPublicKeys();
  }
}
