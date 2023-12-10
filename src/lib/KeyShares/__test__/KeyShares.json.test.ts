import { KeyShares, KeySharesItem } from '../../../main';

import mockKeyShares from './mock-key-shares/multi-shares.json';
import mockKeySharesInvalidStruct from './mock-key-shares/multi-shares-invalid-struct.json';
import mockKeySharesItemEmpty from './mock-key-shares/item-empty.json';
import mockKeySharesItemWithOperators from './mock-key-shares/item-with-operators.json';

let keySharesItem: KeySharesItem;
let keyShares: KeyShares;

describe('KeyShares.fromJson/toJson', () => {
  beforeAll(async () => {
    keyShares = new KeyShares();
    keySharesItem = new KeySharesItem();
  });

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
    const keySharesString = keySharesItem.toJson();
    const keySharesObject = JSON.parse(keySharesString);
    expect(keySharesObject.data.operators).toEqual(mockKeySharesItemEmpty.data.operators);
    expect(keySharesObject.data.publicKey).toEqual(mockKeySharesItemEmpty.data.publicKey);
    expect(keySharesObject.payload).toEqual(mockKeySharesItemEmpty.payload);
  });

  it('Should not throw error the semantic versioning test', async () => {
    expect(async() => await KeySharesItem.fromJson(mockKeySharesItemWithOperators)).not.toThrowError();
  });

  it('Should create multi-shares file', async () => {
    keyShares.add(keySharesItem);
    keyShares.toJson();
  });

  it('should add a KeyShares item', () => {
    const item = new KeySharesItem();
    keyShares.add(item);
    expect(keyShares.list()).toContain(item);
  });

  it('should serialize to JSON', () => {
    const json = keyShares.toJson();
    expect(json).toBeDefined();
    expect(typeof json).toBe('string');
  });

  it('should create KeyShares from valid JSON', async () => {
    const keyShares = await KeyShares.fromJson(mockKeyShares);
    expect(keyShares).toBeInstanceOf(KeyShares);
    expect(keyShares.list().length).toEqual(mockKeyShares.shares.length);
  });

  it('should throw error on invalid JSON format', async () => {
    await expect(KeyShares.fromJson(mockKeySharesInvalidStruct)).rejects.toThrow();
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
    await expect(KeyShares.fromJson(invalidSharesJson)).rejects.toThrow();
  });
});
