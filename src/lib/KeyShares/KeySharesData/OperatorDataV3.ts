import { IsDefined, IsInt, IsNotEmpty, IsString, validateSync } from 'class-validator';
import { IOperatorData } from './IOperatorData';
import { OpeatorPublicKeyValidator } from './validators/operator-public-key';

export class OperatorDataV3 implements IOperatorData {
  @IsNotEmpty({ message: 'The operator id is null'})
  @IsDefined({ message: 'The operator id is undefined'})
  @IsInt({ message: 'The operator id must be an integer'})
  public id: number | undefined;

  @IsNotEmpty({ message: 'The operator public key is null'})
  @IsDefined({ message: 'The operator public key is undefined'})
  @IsString({ message: 'The operator public key must be a string'})
  @OpeatorPublicKeyValidator()
  public publicKey: string | undefined;

  setData(data: any): any {
    if (data.id) {
      this.id = data.id;
    }
    if (data.publicKey) {
      this.publicKey = data.publicKey;
    }
  }

  /**
   * Validate operator ID and public key
   */
  validate(): void {
    validateSync(this);
  }
}
