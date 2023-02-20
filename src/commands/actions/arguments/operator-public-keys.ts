import { operatorPublicKeyValidator } from '../validators/operator';

const uniqueOperators: any = {};

export default {
  arg1: '-oks',
  arg2: '--operator-keys',
  options: {
    type: String,
    required: true,
    help: 'Comma-separated list of operator keys (same sequence as operator ids)'
  },
  interactive: {
    options: {
      type: 'text',
      message: 'Enter operator public key for {{index}} operator',
      validate: async (value: string) => {
        if (uniqueOperators[value]) {
          return 'This operator already used';
        }
        const returnValue = operatorPublicKeyValidator(value);
        if (returnValue === true) {
          uniqueOperators[value] = true;
        }
        return returnValue;
      }
    }
  }
};
