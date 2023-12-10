import { KeySharesItem } from '../../../main';

import mockKeySharesItemWithOperators from './mock-key-shares/item-with-operators.json';

let keySharesItem: KeySharesItem;

describe('KeyShares.buildSharesFromBytes', () => {
  beforeAll(async () => {
    keySharesItem = new KeySharesItem();
  });

  it('should correctly build shares from valid bytes and operator count', () => {
    const bytes = mockKeySharesItemWithOperators.payload.sharesData;
    const operatorCount = mockKeySharesItemWithOperators.payload.operatorIds.length;

    const result = keySharesItem.buildSharesFromBytes(bytes, operatorCount);

    expect(result.sharesPublicKeys).toHaveLength(operatorCount);
    expect(result.encryptedKeys).toHaveLength(operatorCount);
  });

  it('should handle invalid byte string format', () => {
    const invalidBytes = 'not a valid hex string';
    const operatorCount = 4;

    expect(() => keySharesItem.buildSharesFromBytes(invalidBytes, operatorCount)).toThrow();
  });

  it('should handle invalid operator count', () => {
    const bytes = mockKeySharesItemWithOperators.payload.sharesData;
    const invalidOperatorCount = -1;

    expect(() => keySharesItem.buildSharesFromBytes(bytes, invalidOperatorCount)).toThrow();
  });
});
