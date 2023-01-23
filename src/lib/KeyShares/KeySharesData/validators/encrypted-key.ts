import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from 'class-validator';
import { decode } from 'js-base64';
import { web3 } from '../../../helpers/web3.helper';

/* Try to BLS deserialize validator public key. */
@ValidatorConstraint({ name: 'encryptedKey', async: false })
export class EncryptedKeyValidatorConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    let keyWithError = '';
    try {
      const encryptedKeys = Array.isArray(value) ? value : [value];
      encryptedKeys.forEach((key: any) => {
        keyWithError = key;
        decode(key.startsWith('0x') ? web3.eth.abi.decodeParameter('string', key): key);
      });
    } catch (e: any) {
      throw Error(`Filed ABI decode shares encrypted key: ${keyWithError}. Error: ${e.message}`);
    }

    return true;
  }

  defaultMessage() {
    return 'Filed ABI decode shares encrypted key';
  }
}

export function EncryptedKeyValidator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: EncryptedKeyValidatorConstraint,
    });
  };
}
