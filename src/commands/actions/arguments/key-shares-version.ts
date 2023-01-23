import { supportedVersion } from '../validators/version-support';

export default {
  arg1: '-ksv',
  arg2: '--key-shares-version',
  options: {
    type: String,
    required: true,
    help: 'Payload version format [2 or 3]?'
  },
  interactive: {
    options: {
      type: 'text',
      validate: (value: string): string | boolean => {
        if (!String(value).trim().length) {
          return 'Invalid version format';
        }
        return supportedVersion(value, `Version ${value} is not supported`);
      }
    }
  }
};
