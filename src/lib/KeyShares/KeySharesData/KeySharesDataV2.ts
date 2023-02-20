import _ from 'underscore';
import {
  IsString,
  Length,
  ValidateNested,
  IsOptional,
  validateSync,
} from 'class-validator';
import { IKeySharesData } from './IKeySharesData';
import { OperatorDataV2 } from './OperatorDataV2';
import { KeySharesKeysV2 } from './KeySharesKeysV2';
import { OpeatorsListValidator } from './validators/operator-unique';
import { PublicKeyValidator } from './validators/public-key';
import { MatchLengthValidator } from './validators/match';


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
  @MatchLengthValidator('operators', { message: 'Length of operators and shares should be equal.'})
  public shares?: KeySharesKeysV2 | null = null;

  setData(data: any) {
    if (data.publicKey) {
      this.publicKey = data.publicKey;
    }
    if (data.operators) {
      this.operators = data.operators
        .sort((a: any, b: any) => +a.id - +b.id)
        .map(
          (operator: { id: any; publicKey: any; }) => {
            if (!operator.id || !operator.publicKey) {
              throw Error('Mismatch amount of operator ids and operator keys.');
            }
            const operatorData = new OperatorDataV2();
            operatorData.setData(operator);
            return operatorData;
          }
        );
    }
    if (data.encryptedShares) {
      const sharesInstance = new KeySharesKeysV2();
      if (_.isArray(data.encryptedShares)) {
        sharesInstance.setData({
          publicKeys: data.encryptedShares.map((share: { publicKey: string; }) => share.publicKey),
          encryptedKeys: data.encryptedShares.map((share: { privateKey: string; }) => share.privateKey),
        });
      } else {
        sharesInstance.setData(data.encryptedShares);
      }
      this.shares = sharesInstance;
    }
  }

  /**
   * Do all possible validations.
   */
  async validate(): Promise<any> {
    validateSync(this);
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
}
