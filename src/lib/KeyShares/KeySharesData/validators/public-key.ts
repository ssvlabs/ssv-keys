import bls from '../../../BLS';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from 'class-validator';
import { BLSDeserializeError } from '../exceptions/bls';

/* Try to BLS deserialize validator public key. */
@ValidatorConstraint({ name: 'publicKey', async: false })
export class PublicKeyValidatorConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    try {
      bls.init(bls.BLS12_381);
      bls.deserializeHexStrToPublicKey(value.replace('0x', ''));
    } catch (e) {
      throw new BLSDeserializeError( value, `Can not BLS deserialize validator public key`);
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
