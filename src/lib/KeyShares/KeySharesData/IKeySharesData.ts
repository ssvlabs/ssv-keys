import { IOperator } from './IOperator';
import { IOperatorData } from './IOperatorData';

export interface IKeySharesData {
  ownerNonce?: number | null;
  ownerAddress?: string | null;
  publicKey?: string | null;
  operators?: IOperatorData[] | null;
  update(data: any): any;
  validate(): void;
  get operatorIds(): number[];
  get operatorPublicKeys(): string[];
}


export interface IKeySharesPartialData {
  ownerNonce?: number | null;
  ownerAddress?: string | null;
  publicKey?: string | null;
  operators?: IOperator[] | null;
}
