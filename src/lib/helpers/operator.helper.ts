import { IOperator } from "../KeyShares/KeySharesData/IOperator";
import { OperatorData } from "../KeyShares/KeySharesData/OperatorData";

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
          throw Error('Mismatch amount of operator ids and operator keys.');
        }
        return new OperatorData(operator);
      }
    );
}
