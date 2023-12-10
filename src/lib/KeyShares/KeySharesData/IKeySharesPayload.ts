export interface IKeySharesPayload {
  sharesData: string;
  publicKey: string;
  operatorIds: number[];
  update(data: any): any;
  validate(): void;
  build(data: any): any;
}

export interface IKeySharesPartitialPayload {
  sharesData: string;
  publicKey: string;
  operatorIds: number[];
}
