import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from 'class-validator';
import { operatorPublicKeyValidator } from '../../../../commands/actions/validators/operator';

@ValidatorConstraint({ name: 'operatorPublicKey', async: false })
export class OpeatorPublicKeyValidatorConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    const result = operatorPublicKeyValidator(value);
    if (result !== true) {
      throw Error(String(result));
    }
    return true;
  }

  defaultMessage() {
    return 'Invalid operator public key';
  }
}

export function OpeatorPublicKeyValidator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: OpeatorPublicKeyValidatorConstraint,
    });
  };
}
