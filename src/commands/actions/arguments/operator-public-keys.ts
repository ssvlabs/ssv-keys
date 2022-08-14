import { operatorValidator } from '../validators/operator';

export default {
  arg1: '-ok',
  arg2: '--operators-keys',
  options: {
    type: String,
    required: true,
    help: 'Comma-separated list of base64 operator keys. ' +
      'Require at least 4 operators'
  },
  interactive: {
    repeat: 4,
    options: {
      type: 'text',
      message: 'Enter operator key for operator',
      validate: operatorValidator
    }
  }
};
