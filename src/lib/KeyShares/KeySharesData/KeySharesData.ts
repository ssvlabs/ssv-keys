import {
  IsString,
  Length,
  ValidateNested,
  IsOptional,
  validateSync,
} from 'class-validator';
import { IKeySharesData, IPartitialData } from './IKeySharesData';
import { OperatorData } from './OperatorData';
import { OpeatorsListValidator } from './validators/operator-unique';
import { PublicKeyValidator } from './validators/public-key';

export class KeySharesData implements IKeySharesData {
  @IsOptional()
  @IsString()
  @Length(98, 98)
  @PublicKeyValidator()
  public publicKey?: string | null = null;

  @IsOptional()
  @ValidateNested({ each: true })
  @OpeatorsListValidator()
  public operators?: OperatorData[] | null = null;

  update(data: IPartitialData) {
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
            return new OperatorData(operator);
          }
        );
    }
  }

  /**
   * Do all possible validations.
   */
  async validate(): Promise<any> {
    validateSync(this);
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
