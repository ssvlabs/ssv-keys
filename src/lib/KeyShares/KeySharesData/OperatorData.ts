import { IsDefined, IsInt, IsNotEmpty, IsString, validateSync } from 'class-validator';
import { IOperatorData } from './IOperatorData';
import { OpeatorPublicKeyValidator } from './validators/operator-public-key';
import { IOperator } from './IOperator';

export class OperatorData implements IOperatorData {
  @IsNotEmpty({ message: 'The operator id is null'})
  @IsDefined({ message: 'The operator id is undefined'})
  @IsInt({ message: 'The operator id must be an integer'})
  public id: number;

  @IsNotEmpty({ message: 'The operator public key is null'})
  @IsDefined({ message: 'The operator public key is undefined'})
  @IsString({ message: 'The operator public key must be a string'})
  @OpeatorPublicKeyValidator()
  public publicKey: string;

  constructor(data: IOperator) {
    this.id = data.id;
    this.publicKey = data.publicKey;
    this.validate();
  }

  /**
   * Validate operator id and public key
   */
  validate(): void {
    validateSync(this);
  }
}
