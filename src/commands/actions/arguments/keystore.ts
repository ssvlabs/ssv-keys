import { fileExistsValidator, jsonFileValidator, sanitizePath } from '../validators';

/**
 * Keystore argument validates if keystore file exists and is valid keystore file.
 */
export default {
  arg1: '-ks',
  arg2: '--keystore',
  options: {
    required: false,
    type: String,
    help: 'The validator keystore file path. Only one keystore file can be specified using this argument'
  },
  interactive: {
    options: {
      type: 'text',
      message: 'Provide the keystore file path',
      validateSingle: (filePath: string): any => {
        filePath = sanitizePath(String(filePath).trim());
        let isValid = fileExistsValidator(filePath);
        if (isValid !== true) {
          return isValid;
        }
        isValid = jsonFileValidator(filePath);
        if (isValid !== true) {
          return isValid;
        }
        return true;
      },
    }
  }
};
