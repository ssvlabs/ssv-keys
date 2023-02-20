import { supportedVersion } from '../validators/version-support';

export default {
  arg1: '-ksv',
  arg2: '--key-shares-version',
  options: {
    type: String,
    required: false,
    default: '3',
    help: 'The version of the tool output, e.g. use "2" for previous version?'
  },
  interactive: {
    options: {
      type: 'text',
      validate: (value: string): string | boolean => {
        if (!value.trim().length) {
          return 'Invalid version format';
        }
        return supportedVersion(value, `Version ${value} is not supported`);
      }
    }
  }
};
