import { readFile } from '../../../file.helper';
import { Keystore } from '@chainsafe/bls-keystore';

export class KeystorePasswordValidator {
  async validatePassword(password: string, keystoreFilePath: string): Promise<boolean | string> {
    if (!password.trim().length) {
      return 'Password is empty';
    }

    const errorMessage = 'Invalid keystore file password.';
    try {
      const data = await readFile(keystoreFilePath);
      const keystoreJson = JSON.parse(data.toString());
      const keystore = Keystore.fromObject(keystoreJson);
      const isValid = await keystore.verifyPassword(password);
      return isValid;
    } catch (e) {
      return errorMessage;
    }
  }
}

export const keystorePasswordValidator = new KeystorePasswordValidator();
