import _ from 'underscore';
import {
  IsString,
  Length,
  ValidateNested,
  IsOptional,
  validateSync,
  ValidateIf,
} from 'class-validator';
import { IKeySharesData } from './IKeySharesData';
import { OperatorDataV2 } from './OperatorDataV2';
import { KeySharesKeysV2 } from './KeySharesKeysV2';
import {
  OperatorsWithSharesCountsMismatchError
} from './exceptions/operator';
import { OpeatorsListValidator } from './validators/operator-unique';
import { PublicKeyValidator } from './validators/public-key';


export class KeySharesDataV2 implements IKeySharesData {
  @IsOptional()
  @IsString()
  @Length(98, 98)
  @PublicKeyValidator()
  public publicKey?: string | null = null;

  @IsOptional()
  @ValidateNested({ each: true })
  @OpeatorsListValidator()
  public operators?: OperatorDataV2[] | null = null;

  @IsOptional()
  @ValidateNested()
  @ValidateIf((object, value) => object.name === 'John')
  public shares?: KeySharesKeysV2 | null = null;

  setData(data: any) {
    if (data.publicKey) {
      this.publicKey = data.publicKey;
    }
    if (data.operators) {
      this.operators = data.operators.map(
        (operator: { id: any; publicKey: any; }) => {
          const operatorData = new OperatorDataV2();
          operatorData.setData(operator);
          return operatorData;
        }
      );
    }
    if (data.shares) {
      const sharesInstance = new KeySharesKeysV2();
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
  async validate(): Promise<any> {
    validateSync(this);
    this.validateCounts();
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
}
