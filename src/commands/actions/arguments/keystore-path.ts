import { fileExistsValidator, jsonFileValidator, sanitizePath } from '../validators/file';

/**
 * Keystore argument validates if keystore file exists and is valid keystore file.
 */
export default {
  arg1: '-kp',
  arg2: '--keystore-path',
  options: {
    required: true,
    type: String,
    help: 'The validator keystore file(s) path'
  },
  interactive: {
    options: {
      type: 'text',
    },
  },
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
};
