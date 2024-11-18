import { IsString, Length, ValidateNested, IsOptional, validateSync, IsNumber } from 'class-validator';
import { OperatorData } from './OperatorData';
import { IKeySharesData, IKeySharesPartialData } from './IKeySharesData';
import { OpeatorsListValidator, PublicKeyValidator, OwnerAddressValidator, OwnerNonceValidator } from './validators';
import { operatorSortedList } from '../../helpers/operator.helper';

export class KeySharesData implements IKeySharesData {
  @IsOptional()
  @IsNumber()
  @OwnerNonceValidator()
  public ownerNonce?: number | null = null;

  @IsOptional()
  @IsString()
  @OwnerAddressValidator()
  public ownerAddress?: string | null = null;

  @IsOptional()
  @IsString()
  @Length(98, 98)
  @PublicKeyValidator()
  public publicKey?: string | null = null;

  @IsOptional()
  @ValidateNested({ each: true })
  @OpeatorsListValidator()
  public operators?: OperatorData[] | null = null;

  update(data: IKeySharesPartialData) {
    if (data.ownerAddress) {
      this.ownerAddress = data.ownerAddress;
    }
    if (typeof data.ownerNonce === 'number') {
      this.ownerNonce = data.ownerNonce;
    }
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
    return this.operators.map(operator => String(operator.operatorKey));
  }
}
