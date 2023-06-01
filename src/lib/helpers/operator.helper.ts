import { IOperator } from "../KeyShares/KeySharesData/IOperator";
import { OperatorData } from "../KeyShares/KeySharesData/OperatorData";
import { OperatorsCountsMismatchError } from "../exceptions/operator";

/**
 * Sort operators input.
 * @param operators list
 */
export const operatorSortedList = (operators: IOperator[]): OperatorData[] => {
  return operators
    .sort((a: any, b: any) => +a.id - +b.id)
    .map(
      (operator: { id: any; publicKey: any; }) => {
        if (!operator.id || !operator.publicKey) {
          throw new OperatorsCountsMismatchError(operators, operators, 'Mismatch amount of operator ids and operator keys.');
        }
        return new OperatorData(operator);
      }
    );
}
