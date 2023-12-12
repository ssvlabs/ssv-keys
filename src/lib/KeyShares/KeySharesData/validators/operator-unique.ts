import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from 'class-validator';
import { DuplicatedOperatorIdError, DuplicatedOperatorPublicKeyError } from '../../../exceptions/operator';

@ValidatorConstraint({ name: 'uniqueList', async: false })
export class OpeatorsListValidatorConstraint implements ValidatorConstraintInterface {
  validate(operatorsList: any) {
    const operatorIds = new Set(), operatorPublicKeys = new Set();
    for (const operator of operatorsList || []) {
      if (operatorIds.has(operator.id)) {
        throw new DuplicatedOperatorIdError(operator, `The operator ID '${operator.id}' is duplicated in the list`);
      }
      operatorIds.add(operator.id);

      if (operatorPublicKeys.has(operator.operatorKey)) {
        throw new DuplicatedOperatorPublicKeyError(operator, `The public key for operator ID ${operator.id} is duplicated in the list`);
      }
      operatorPublicKeys.add(operator.operatorKey);
    }
    return true;
  }

  defaultMessage() {
    return 'The list of operators contains duplicate entries';
  }
}

export function OpeatorsListValidator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: OpeatorsListValidatorConstraint,
    });
  };
}


