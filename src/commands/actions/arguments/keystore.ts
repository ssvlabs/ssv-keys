import { keystorePasswordValidator } from '../validators/keystore-password';
import { fileExistsValidator, jsonFileValidator, sanitizePath } from '../validators/file';



/**
 * Keystore argument validates if keystore file exists and is valid keystore file.
 */
export default {
  arg1: '-ks',
  arg2: '--keystore',
  options: {
    required: true,
    type: String,
    help: 'The validator keystore file path'
  },
  interactive: {
    options: {
      type: 'text',
      validate: (filePath: string): boolean | string => {
        filePath = sanitizePath(String(filePath).trim());
        let isValid = fileExistsValidator(filePath);
        if (isValid !== true) {
          return isValid;
        }
        isValid = jsonFileValidator(filePath);
        if (isValid !== true) {
          return isValid;
        }
        keystorePasswordValidator.setKeystoreFilePath(filePath);
        return true;
      },
    }
  }
};
