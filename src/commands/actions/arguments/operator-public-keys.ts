import { operatorPublicKeyValidator } from '../validators';

export default {
  arg1: '-oks',
  arg2: '--operator-keys',
  options: {
    type: String,
    required: true,
    help: 'Comma-separated list of operator keys (same sequence as operator ids). The amount must be 3f+1 compatible'
  },
  interactive: {
    options: {
      type: 'text',
      message: 'Enter operator public key for {{index}} operator',
      validate: (value: string) => {
        try {
          operatorPublicKeyValidator(value);
          return true;
        } catch (e: any) {
          return e.message;
        }
      }
    }
  }
};
