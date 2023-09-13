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
    help: 'The validator keystore file/folder path, if a folder is provided all keystore files within the provided folder will be split according to the provided arguments'
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
