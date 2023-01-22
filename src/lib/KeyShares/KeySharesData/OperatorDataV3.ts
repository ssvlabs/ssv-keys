import { IsDefined, IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { KeySharesDataV2 } from './KeySharesDataV2';
import { operatorPublicKeyValidator } from '../../../commands/actions/validators/operator';

export class OperatorDataV3 extends KeySharesDataV2  {}
