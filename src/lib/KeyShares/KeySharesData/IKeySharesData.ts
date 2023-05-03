import { IOperatorData } from './IOperatorData';

export interface IKeySharesData {
  publicKey?: string | null;
  operators?: IOperatorData[] | null;
  update(data: any): any;
  validate(): void;
  get operatorIds(): number[];
  get operatorPublicKeys(): string[];
}


export interface IPartitialData {
  publicKey?: string | null;
  operators?: IOperatorData[] | null;
}
