import { getKeyStoreFiles } from '../../../lib/helpers/file.helper';
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
    help: 'The validator keystore file(s) path'
  },
  interactive: {
    confirmMessage: `{value} keystore files detected would you like to proceed with key distribution?`,
    confirmConditions: async(filePath: string) => {
      const { files, isFolder } = await getKeyStoreFiles(filePath);
      if (isFolder) {
        return files.length;
      }
      return false;
    },
    options: {
      type: 'text',
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
