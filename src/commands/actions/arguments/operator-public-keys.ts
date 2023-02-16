import { operatorPublicKeyValidator } from '../validators/operator';
import { operatorIdsValidator } from '../validators/operator-ids';

const uniqueOperators: any = {};

export default {
  arg1: '-ok',
  arg2: '--operator-keys',
  options: {
    type: String,
    required: true,
    help: 'Comma-separated list of base64 operator keys. ' +
      'Require at least 4 operators'
  },
  interactive: {
    repeat: () => operatorIdsValidator.operatorsCount,
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
