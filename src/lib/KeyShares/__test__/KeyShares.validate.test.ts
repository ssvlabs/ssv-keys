import { KeySharesItem, SSVKeysException } from '../../../main';

import mockKeySharesItemWithOperators from './mock-key-shares/item-with-operators.json';

let keySharesItem: KeySharesItem;

describe('KeyShares.validateSingleShares', () => {
  beforeAll(async () => {
    keySharesItem = new KeySharesItem();
  });

  it('should validate successfully with correct inputs', async () => {
    const shares = mockKeySharesItemWithOperators.payload.sharesData;
    const fromSignatureData = {
      ownerNonce: mockKeySharesItemWithOperators.data.ownerNonce,
      publicKey: mockKeySharesItemWithOperators.data.publicKey,
      ownerAddress: mockKeySharesItemWithOperators.data.ownerAddress,
    };

    await expect(keySharesItem.validateSingleShares(shares, fromSignatureData)).resolves.toBeUndefined();
  });

  it('should throw error for invalid owner nonce', async () => {
    const shares = mockKeySharesItemWithOperators.payload.sharesData;
    const fromSignatureData = {
      ownerNonce: -1, // Invalid nonce
      publicKey: mockKeySharesItemWithOperators.data.publicKey,
      ownerAddress: mockKeySharesItemWithOperators.data.ownerAddress,
    };

    await expect(keySharesItem.validateSingleShares(shares, fromSignatureData)).rejects.toThrow('Owner nonce is not positive integer');
  });

  it('should throw BLS error for invalid signature', async () => {
    const invalidSignature = '0x123'; // An altered or incorrectly generated signature
    const fromSignatureData = {
      ownerNonce: 2,
      publicKey: mockKeySharesItemWithOperators.data.publicKey,
      ownerAddress: mockKeySharesItemWithOperators.data.ownerAddress,
    };

    await expect(keySharesItem.validateSingleShares(invalidSignature, fromSignatureData)).rejects.toThrowError();
  });

  it('should throw SSVKeysException error type', async () => {
    const signature = mockKeySharesItemWithOperators.payload.sharesData;
    const fromSignatureData = {
      ownerNonce: mockKeySharesItemWithOperators.data.ownerNonce + 1,
      publicKey: mockKeySharesItemWithOperators.data.publicKey,
      ownerAddress: mockKeySharesItemWithOperators.data.ownerAddress,
    };

    try {
      await keySharesItem.validateSingleShares(signature, fromSignatureData);
      fail('Expected method to throw SSVKeysException error');
    } catch (error: any) {
      expect(error).toBeInstanceOf(SSVKeysException);
      expect(error.name).toBe('SingleSharesSignatureInvalid');
      expect(error.message).toBe('Single shares signature is invalid');
    }
  });
});
