import { KeyShares } from '../../../main';
import emptyKeyShares from './key-shares/empty.json';
// import keySharesWithOperators from './key-shares/with-operators.json';

let keyShares: KeyShares;

describe('KeyShares', () => {
  beforeAll(async () => {
    keyShares = new KeyShares();
  });

  it('Should create empty data with version', async () => {
    const keySharesString = keyShares.toJson();
    const keySharesObject = JSON.parse(keySharesString);
    expect(keySharesObject.data.operators).toEqual(emptyKeyShares.data.operators);
    expect(keySharesObject.data.publicKey).toEqual(emptyKeyShares.data.publicKey);
    expect(keySharesObject.payload).toEqual(emptyKeyShares.payload);
  });

  // it('Should update data with operators and validate it with no errors', async () => {
  //   await keyShares.setData({
  //     operators: keySharesWithOperators.data.operators,
  //   });
  //   const keySharesString = keyShares.toJson();
  //   const keySharesObject = JSON.parse(keySharesString);
  //   expect(keySharesObject.data.operators).toEqual(keySharesWithOperators.data?.operators);
  //   expect(keySharesObject.data.publicKey).toEqual(keySharesWithOperators.data?.publicKey);
  //   expect(keySharesObject.payload).toEqual(keySharesWithOperators.payload);
  // });
});
