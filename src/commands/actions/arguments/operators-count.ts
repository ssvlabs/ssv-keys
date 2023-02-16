import { isOperatorsLengthValid, operatorIdsValidator } from "../validators/operator-ids";

export default {
  arg1: '-oa',
  arg2: '--operators-amount',
  options: {
    type: Number,
    required: true,
    default: 4,
    help: `Enter operators amount, 4, 7, 10 or 13. Default: 4`
  },
  interactive: {
    options: {
      type: 'number',
      message: 'Enter operators amount:',
      validate: (value: number) => {
        if (!isOperatorsLengthValid(value)) {
          return 'Invalid operators amount.'
        }
        operatorIdsValidator.setOperatorsCount(value);
        return true;
      }
    }
  }
};
