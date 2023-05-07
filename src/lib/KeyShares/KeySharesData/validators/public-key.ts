import bls from '../../../BLS';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from 'class-validator';
import { BLSDeserializeError } from '../../../exceptions/bls';

/* Try to BLS deserialize validator public key. */
@ValidatorConstraint({ name: 'publicKey', async: true })
export class PublicKeyValidatorConstraint implements ValidatorConstraintInterface {
  async validate(value: any) {
    try {
      if (typeof value === 'string') {
        bls.deserializeHexStrToPublicKey(value.replace('0x', ''));
      } else {
        value.forEach((item: string) => bls.deserializeHexStrToPublicKey(item.replace('0x', '')));
      }
    } catch (e) {
      throw new BLSDeserializeError( value, 'Failed to BLS deserialize validator public key');
    }
    return true;
  }

  defaultMessage() {
    return 'Invalid public key';
  }
}

export function PublicKeyValidator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: PublicKeyValidatorConstraint,
    });
  };
}
