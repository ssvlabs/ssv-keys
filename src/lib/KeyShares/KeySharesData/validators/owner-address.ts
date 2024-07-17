import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from 'class-validator';
import { toChecksumAddress } from '../../../helpers/web3.helper';

import { OwnerAddressFormatError } from '../../../exceptions/keystore';

/* Try to validate ethereum owner address. */
@ValidatorConstraint({ name: 'ownerAddress', async: false })
export class OwnerAddressValidatorConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    try {
      toChecksumAddress(value);
    } catch {
      throw new OwnerAddressFormatError(value, 'Owner address is not a valid Ethereum address');
    }
    return true;
  }

  defaultMessage() {
    return 'Invalid owner address';
  }
}

export function OwnerAddressValidator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: OwnerAddressValidatorConstraint,
    });
  };
}
