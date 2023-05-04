import { IOperatorData } from '../KeyShares/KeySharesData/IOperatorData';

export class DuplicatedOperatorIdError extends Error {
  public operator: IOperatorData;

  constructor(operator: IOperatorData, message: string) {
    super(message);
    this.operator = operator;
  }
}

export class DuplicatedOperatorPublicKeyError extends Error {
  public operator: IOperatorData;

  constructor(operator: IOperatorData, message: string) {
    super(message);
    this.operator = operator;
  }
}

export class OperatorsCountsMismatchError extends Error {
  public listOne: any[] | null | undefined;
  public listTwo: any[] | null | undefined;

  constructor(propertyListOne: any[] | null | undefined, propertyListTwo: any[] | null | undefined, message: string) {
    super(message);
    this.listOne = propertyListOne;
    this.listTwo = propertyListTwo;
  }
}

export class OperatorPublicKeyError extends Error {
  public publicKey: string;

  constructor(publicKey: string, message: string) {
    super(message);
    this.publicKey = publicKey;
  }
}
