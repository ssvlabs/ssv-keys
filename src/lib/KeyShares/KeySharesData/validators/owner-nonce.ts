import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from 'class-validator';

import { OwnerNonceFormatError } from '../../../exceptions/keystore';

/* Try to validate owner nonce. */
@ValidatorConstraint({ name: 'ownerNonce', async: false })
export class OwnerNonceValidatorConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (!Number.isInteger(value) || value < 0) {
      throw new OwnerNonceFormatError(value, 'Owner nonce is not positive integer');
    }
    return true;
  }

  defaultMessage() {
    return 'Invalid owner nonce';
  }
}

export function OwnerNonceValidator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: OwnerNonceValidatorConstraint,
    });
  };
}
