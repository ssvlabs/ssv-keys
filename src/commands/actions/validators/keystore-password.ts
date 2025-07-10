import { readFile } from "../../../file.helper";
import { Keystore } from "@chainsafe/bls-keystore";

export class KeystorePasswordValidator {
  async validatePassword(
    password: string,
    keystoreFilePath: string
  ): Promise<boolean | string> {
    if (!password.trim().length) {
      return "Password is empty";
    }

    const errorMessage = "Invalid keystore file password.";
    try {
      const parsed = await readFile(keystoreFilePath);
      const keystore = Keystore.fromObject(parsed);
      const isValid = await keystore.verifyPassword(password);
      return isValid;
    } catch {
      return errorMessage;
    }
  }
}

export const keystorePasswordValidator = new KeystorePasswordValidator();
