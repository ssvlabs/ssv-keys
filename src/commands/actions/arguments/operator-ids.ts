import { operatorIdsValidator } from "../validators/operator-ids";

const uniqueOperatorIds: any = {};

export default {
  arg1: '-oid',
  arg2: '--operator-ids',
  options: {
    type: String,
    required: true,
    help: 'Comma-separated list of operators IDs from the contract in the same sequence as you provided operators itself'
  },
  interactive: {
    repeat: () => operatorIdsValidator.operatorsCount,
    repeatWith: [
      '--operator-keys'
    ],
    options: {
      type: 'number',
      message: 'Enter operator ID for {{index}} operator',
      validate: (operatorId: number): boolean | string => {
        if (uniqueOperatorIds[operatorId]) {
          return 'This operator ID already used';
        }
        const returnValue = !(Number.isInteger(operatorId) && operatorId > 0) ? 'Invalid operator ID format' : true;
        if (returnValue === true) {
          uniqueOperatorIds[operatorId] = true;
        }
        return returnValue;
      }
    }
  }
};
