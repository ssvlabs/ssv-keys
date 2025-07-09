import { operatorPublicKeyValidator } from '../validators';

const uniqueOperators: any = {};

export default {
  arg1: '-oks',
  arg2: '--operator-keys',
  options: {
    type: 'string',
    required: true,
    help: 'Comma-separated list of operator keys (same sequence as operator ids). The amount must be 3f+1 compatible'
  },
  interactive: {
    options: {
      type: 'string',
      message: 'Enter operator public key for {{index}} operator',
      validate: (value: string) => {
        if (uniqueOperators[value]) {
          return 'This operator already used';
        }
        try {
          console.log();
          console.log('operator-public-keys ', value);
          console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
          uniqueOperators[value] = operatorPublicKeyValidator(value);
          return true;
        } catch (e: any) {
          return e.message;
        }
      }
    }
  }
};
