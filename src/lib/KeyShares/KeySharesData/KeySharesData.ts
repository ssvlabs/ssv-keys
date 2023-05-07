import {
  IsString,
  Length,
  ValidateNested,
  IsOptional,
  validateSync,
} from 'class-validator';
import { IKeySharesData, IKeySharesPartitialData } from './IKeySharesData';
import { OperatorData } from './OperatorData';
import { OpeatorsListValidator } from './validators/operator-unique';
import { PublicKeyValidator } from './validators/public-key';
import { operatorSortedList } from '../../helpers/operator.helper';

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

  update(data: IKeySharesPartitialData) {
    if (data.publicKey) {
      this.publicKey = data.publicKey;
    }
    if (data.operators) {
      this.operators = operatorSortedList(data.operators);
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
