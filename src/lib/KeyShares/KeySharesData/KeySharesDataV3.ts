import _ from 'underscore';
import {
  IsString,
  Length,
  ValidateNested, IsOptional
} from 'class-validator';
import bls from '../../BLS';
import { IKeySharesData } from './IKeySharesData';
import { OperatorDataV3 } from './OperatorDataV3';
import { KeySharesKeysV3 } from './KeySharesKeysV3';
import {
  DuplicatedOperatorIdError,
  DuplicatedOperatorPublicKeyError,
  OperatorsWithSharesCountsMismatchError
} from './exceptions/operator';
import { BLSDeserializeError } from './exceptions/bls';


export class KeySharesDataV3 implements IKeySharesData {
  @IsOptional()
  @IsString()
  @Length(98, 98)
  public publicKey?: string | null = null;

  @IsOptional()
  @ValidateNested({ each: true })
  public operators?: OperatorDataV3[] | null = null;

  @IsOptional()
  @ValidateNested()
  public shares?: KeySharesKeysV3 | null = null;

  setData(data: any) {
    if (data.publicKey) {
      this.publicKey = data.publicKey;
    }
    if (data.operators) {
      this.operators = data.operators.map(
        (operator: { id: any; publicKey: any; }) => {
          const operatorData = new OperatorDataV3();
          operatorData.setData(operator);
          return operatorData;
        }
      );
    }
    if (data.shares) {
      const sharesInstance = new KeySharesKeysV3();
      if (_.isArray(data.shares)) {
        sharesInstance.setData({
          publicKeys: data.shares.map((share: { publicKey: string; }) => share.publicKey),
          encryptedKeys: data.shares.map((share: { privateKey: string; }) => share.privateKey),
        });
      } else {
        sharesInstance.setData(data.shares);
      }
      this.shares = sharesInstance;
    }
  }

  /**
   * Do all possible validations.
   */
  validate(): void {
    this.validateDuplicates();
    bls.init(bls.BLS12_381);
    this.validateCounts();
    this.shares?.validate();
    this.validatePublicKey();
    this.validateOperators();
  }

  /**
   * Get the list of shares public keys.
   */
  get sharesPublicKeys(): string[] {
    return this.shares?.publicKeys || [];
  }

  /**
   * Get the list of encrypted shares.
   */
  get sharesEncryptedKeys(): string[] {
    return this.shares?.encryptedKeys || [];
  }

  /**
   * Get the list of operators IDs.
   */
  get operatorIds(): number[] {
    if (!this.operators?.length) {
      return [];
    }
    return this.operators.map(operator => parseInt(String(operator.id), 10));
  }

  /**
   * Get the list of operators public keys.
   */
  get operatorPublicKeys(): string[] {
    if (!this.operators?.length) {
      return [];
    }
    return this.operators.map(operator => String(operator.publicKey));
  }

  /**
   * Try to BLS deserialize validator public key.
   */
  validatePublicKey(): void {
    if (!this.publicKey) {
      return;
    }
    try {
      bls.deserializeHexStrToPublicKey(this.publicKey.replace('0x', ''));
    } catch (e) {
      throw new BLSDeserializeError(
        this.publicKey,
        `Can not BLS deserialize validator public key`
      );
    }
  }

  /**
   * Check that counts are consistent.
   */
  validateCounts(): void {
    if (!this.sharesEncryptedKeys?.length || !this.sharesPublicKeys?.length) {
      return;
    }
    if (this.operatorIds.length !== this.sharesEncryptedKeys.length
      || this.operatorIds.length !== this.sharesPublicKeys.length
      || this.operatorIds.length !== this.operatorPublicKeys.length) {
      throw new OperatorsWithSharesCountsMismatchError(
        this.operators || [],
        this.shares,
        'Length of operators and shares should be equal.',
      );
    }
  }

  /**
   * Validate all operators
   */
  validateOperators(): void {
    for (const operator of this.operators || []) {
      operator.validate();
    }
  }

  /**
   * Do not allow to use duplicated operator IDs and public keys.
   */
  validateDuplicates(): void {
    const operatorIds: any = {},
      operatorPublicKeys: any = {};
    for (const operator of this.operators || []) {
      if (operatorIds[String(operator.id)] === true) {
        throw new DuplicatedOperatorIdError(
          operator,
          `Operator ID already exists`
        );
      }
      operatorIds[String(operator.id)] = true;

      if (operatorPublicKeys[String(operator.publicKey)] === true) {
        throw new DuplicatedOperatorPublicKeyError(
          operator,
          `Operator public key already exists`
        );
      }
      operatorPublicKeys[String(operator.publicKey)] = true;
    }
  }
}
