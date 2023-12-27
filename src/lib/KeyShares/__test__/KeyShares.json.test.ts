import { KeyShares, KeySharesItem } from '../../../main';

import mockKeyShares from './mock-key-shares/multi-shares.json';
import mockOldKeyShares from './mock-key-shares/old-shares.json';
import mockKeySharesInvalidStruct from './mock-key-shares/multi-shares-invalid-struct.json';
import mockKeySharesItemEmpty from './mock-key-shares/item-empty.json';
import mockKeySharesItemWithOperators from './mock-key-shares/item-with-operators.json';
import mockKeySharesItemWithWrongOperatorId from './mock-key-shares/item-with-wrong-operator-id.json';
import mockKeySharesItemWithMissedOperatorKey from './mock-key-shares/item-with-missed-operator-key.json';
import mockKeySharesItemWithDuplicatedOperatorKey from './mock-key-shares/item-with-duplicated-operator-key.json';
import { DuplicatedOperatorPublicKeyError, OperatorsCountsMismatchError } from '../../exceptions/operator';

describe('KeyShares.fromJson/toJson', () => {
  it('should initialize with passed KeySharesItems', () => {
    // Create mock KeySharesItems
    const mockShares = [new KeySharesItem(), new KeySharesItem()];

    // Initialize KeyShares with the mock items
    const keyShares = new KeyShares(mockShares);

    // Check if the KeyShares instance contains the mock items
    expect(keyShares.list()).toEqual(mockShares);
  });

  it('should initialize with empty array when no items passed', () => {
    const keyShares = new KeyShares();
    expect(keyShares.list()).toEqual([]);
  });

  it('Should create empty data with version', async () => {
    const keySharesItem = new KeySharesItem();
    const keySharesString = keySharesItem.toJson();
    const keySharesObject = JSON.parse(keySharesString);
    expect(keySharesObject.data.operators).toEqual(mockKeySharesItemEmpty.data.operators);
    expect(keySharesObject.data.publicKey).toEqual(mockKeySharesItemEmpty.data.publicKey);
    expect(keySharesObject.payload).toEqual(mockKeySharesItemEmpty.payload);
  });

  it('Should throw an error for invalid operator data', async () => {
    expect((await KeySharesItem.fromJson(mockKeySharesItemWithMissedOperatorKey)).error).toBeInstanceOf(OperatorsCountsMismatchError);
    expect((await KeySharesItem.fromJson(mockKeySharesItemWithWrongOperatorId)).error).toBeInstanceOf(OperatorsCountsMismatchError);
    expect((await KeySharesItem.fromJson(mockKeySharesItemWithDuplicatedOperatorKey)).error).toBeInstanceOf(DuplicatedOperatorPublicKeyError);
  });

  it('Should create KeyShares Item', async () => {
    expect(async() => await KeySharesItem.fromJson(mockKeySharesItemWithOperators)).not.toThrowError();
  });

  it('Should create multi-shares file', async () => {
    const keySharesItem = new KeySharesItem();
    const keyShares = new KeyShares([keySharesItem]);
    expect(keyShares.list()).toContain(keySharesItem);
  });

  it('should add a KeyShares item', () => {
    const item = new KeySharesItem();
    const keyShares = new KeyShares();
    keyShares.add(item);
    expect(keyShares.list()).toContain(item);
  });

  it('should serialize to JSON', () => {
    const keyShares = new KeyShares();
    const json = keyShares.toJson();
    expect(json).toBeDefined();
    expect(typeof json).toBe('string');
  });

  it('should create KeyShares from single shares as valid JSON', async () => {
    const keyShares = await KeyShares.fromJson(mockOldKeyShares);
    expect(keyShares).toBeInstanceOf(KeyShares);
    expect(keyShares.list().length).toEqual(1);
  });

  it('should create KeyShares from multi shares valid JSON', async () => {
    const keyShares = await KeyShares.fromJson(mockKeyShares);
    expect(keyShares).toBeInstanceOf(KeyShares);
    expect(keyShares.list().length).toEqual(mockKeyShares.shares.length);
  });

  it('should throw error on invalid JSON format', async () => {
    const keyShares = await KeyShares.fromJson(mockKeySharesInvalidStruct);
    expect(keyShares.list()[0].error).not.toBeNull();
  });

  it('should throw error on version incompatibility', async () => {
    const incompatibleVersionJson = {
      ...mockKeyShares,
      version: 'v2.0.0'
    };
    await expect(KeyShares.fromJson(incompatibleVersionJson)).rejects.toThrow(/does not have the same version.*as supported by ssv-keys/);
  });

  it('should throw error on invalid shares data', async () => {
    const invalidSharesJson = {
      ...mockKeyShares,
      shares: [{ "invalid": "data" }],
    };
    const keyShares = await KeyShares.fromJson(invalidSharesJson);
    expect(keyShares.list()[0].error).not.toBeNull();
  });
});
