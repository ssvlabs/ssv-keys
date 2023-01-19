import Web3 from 'web3';
import _ from 'underscore';
import { decode } from 'js-base64';
import { IsArray, MinLength } from 'class-validator';
import bls from '../../BLS';
import { IKeySharesKeys } from './IKeySharesKeys';

const web3 = new Web3();

export class KeySharesKeysV2 implements IKeySharesKeys {
  @IsArray()
  @MinLength(98, {
    each: true,
  })
  publicKeys: string[] | undefined;

  @IsArray()
  @MinLength(98, {
    each: true,
  })
  encryptedKeys: string[] | undefined;

  /**
   * Set public and encrypted keys from data.
   * @param data
   */
  setData(data: any) {
    if (data.publicKeys) {
      this.validateArrayOfStrings(data.publicKeys);
      this.publicKeys = data.publicKeys;
    }
    if (data.encryptedKeys) {
      this.validateArrayOfStrings(data.encryptedKeys);
      this.encryptedKeys = data.encryptedKeys;
    }
  }

  /**
   * Validation of all data.
   */
  validate(): void {
    this.validatePublicKeys();
    this.validateEncryptedKeys();
  }

  /**
   * If shares encrypted keys are ABI encoded - try to decode them.
   */
  validateEncryptedKeys(): void {
    let encryptedKeyWithError = '';
    try {
      (this.encryptedKeys || []).map(encryptedKey => {
        let key: any = encryptedKey;
        // If the key is ABI encoded - decode it.
        if (key.startsWith('0x')) {
          encryptedKeyWithError = key;
          key = web3.eth.abi.decodeParameter('string', encryptedKey);
        }
        // ABI decoded key then should be a valid base 64 string
        decode(String(key));
      });
    } catch (e) {
      throw Error(`Can not ABI decode shares encrypted key: ${encryptedKeyWithError}. Error: ${String(e)}`);
    }
  }

  /**
   * Try to BLS deserialize shares public keys.
   */
  validatePublicKeys(): void {
    let publicKeyWithError = '';
    try {
      for (const publicKey of this.publicKeys || []) {
        publicKeyWithError = publicKey;
        bls.deserializeHexStrToPublicKey(publicKey.replace('0x', ''));
      }
    } catch (e) {
      throw Error(`Can not BLS deserialize shares public key: ${publicKeyWithError}. Error: ${String(e)}`);
    }
  }

  /**
   * Validate that the data is the array of strings.
   * @param data
   */
  validateArrayOfStrings(data: any) {
    if (!_.isArray(data)) {
      throw Error('Keys should be an array of strings');
    }
    const isArrayOfStrings = data.every((key: any) => typeof key === 'string');
    if (!isArrayOfStrings) {
      throw Error('Keys should be an array of strings');
    }
  }
}
