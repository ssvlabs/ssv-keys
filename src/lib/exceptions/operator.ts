import { SSVKeysException } from './base';

import { IOperatorData } from '../KeyShares/KeySharesData/IOperatorData';

export class DuplicatedOperatorIdError extends SSVKeysException {
  public operator: IOperatorData;

  constructor(operator: IOperatorData, message: string) {
    super(message);
    this.operator = operator;
  }
}

export class DuplicatedOperatorPublicKeyError extends SSVKeysException {
  public operator: IOperatorData;

  constructor(operator: IOperatorData, message: string) {
    super(message);
    this.operator = operator;
  }
}

export class OperatorsCountsMismatchError extends SSVKeysException {
  public listOne: any[] | null | undefined;
  public listTwo: any[] | null | undefined;

  constructor(propertyListOne: any[] | null | undefined, propertyListTwo: any[] | null | undefined, message: string) {
    super(message);
    this.listOne = propertyListOne;
    this.listTwo = propertyListTwo;
  }
}

export class OperatorPublicKeyError extends SSVKeysException {
  public operator: any;

  constructor(operator: { rsa: string, base64: string }, message: string) {
    super(message);
    this.operator = operator;
  }
}
