import { SSVKeys } from '../../SSVKeys';
import emptyKeyShares from './key-shares/empty.json';
// import keySharesWithOperators from './key-shares/with-operators.json';

let ssvKeys: SSVKeys;

describe('KeyShares', () => {
  beforeAll(async () => {
    ssvKeys = new SSVKeys(SSVKeys.VERSION.V3);
  });

  it('Should create empty data with version', async () => {
    const keySharesString = ssvKeys.keyShares.toJson();
    const keySharesObject = JSON.parse(keySharesString);
    expect(keySharesObject.version).toEqual(emptyKeyShares.version);
    expect(keySharesObject.data.operators).toEqual(emptyKeyShares.data.operators);
    expect(keySharesObject.data.publicKey).toEqual(emptyKeyShares.data.publicKey);
    expect(keySharesObject.data.shares).toEqual(emptyKeyShares.data.shares);
    expect(keySharesObject.payload).toEqual(emptyKeyShares.payload);
  });

  // it('Should update data with operators and validate it with no errors', async () => {
  //   await keyShares.setData({
  //     operators: keySharesWithOperators.data.operators,
  //   });
  //   const keySharesString = keyShares.toJson();
  //   const keySharesObject = JSON.parse(keySharesString);
  //   expect(keySharesObject.version).toEqual(keySharesWithOperators.version);
  //   expect(keySharesObject.data.operators).toEqual(keySharesWithOperators.data?.operators);
  //   expect(keySharesObject.data.publicKey).toEqual(keySharesWithOperators.data?.publicKey);
  //   expect(keySharesObject.payload).toEqual(keySharesWithOperators.payload);
  // });
});
