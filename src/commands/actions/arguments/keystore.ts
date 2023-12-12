import { fileExistsValidator, jsonFileValidator } from '../validators';

const validateKeystoreFile = (filePath: string) => {
  let validation = fileExistsValidator(filePath);
  if (validation !== true) {
    return { isValid: false, error: validation };
  }

  validation = jsonFileValidator(filePath);
  if (validation !== true) {
    return { isValid: false, error: validation };
  }

  return { isValid: true };
};

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
      validate: (filePath: string) => {
        const result = validateKeystoreFile(filePath);
        return result.isValid || result.error;
      },
    }
  }
};
