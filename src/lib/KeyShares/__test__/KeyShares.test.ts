import emptyKeyShares from './key-shares/empty.json';

import { KeyShares } from '../../../main';
import keySharesWithOperators from './key-shares/with-operators.json';

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

  it('Should not throw error the semantic versioning test', async () => {
    expect(() => keyShares.fromJson(keySharesWithOperators)).not.toThrowError();
  });
});
