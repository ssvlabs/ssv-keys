export class OperatorIdsValidator {
  public operatorsCount = 3;

  setOperatorsCount(amount: number): void {
    this.operatorsCount = amount;
  }
}

export const isOperatorsLengthValid = (length: number) => {
  if (length < 4 || length > 13 || length % 3 != 1) {
    return false;
  }
  return true;
}

export const operatorIdsValidator = new OperatorIdsValidator();
