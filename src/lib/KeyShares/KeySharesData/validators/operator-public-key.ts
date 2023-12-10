import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from 'class-validator';
import { operatorPublicKeyValidator } from '../../../../commands/actions/validators';

@ValidatorConstraint({ name: 'operatorKey', async: false })
export class OpeatorPublicKeyValidatorConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return operatorPublicKeyValidator(value);
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
