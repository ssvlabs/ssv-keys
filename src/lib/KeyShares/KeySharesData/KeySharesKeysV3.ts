import _ from 'underscore';

import { IsArray, MinLength, validateSync } from 'class-validator';
import { IKeySharesKeys } from './IKeySharesKeys';
import { MatchLengthValidator } from './validators/match';
import { PublicKeyValidator } from './validators/public-key';
import { EncryptedKeyValidator } from './validators/encrypted-key';


export class KeySharesKeysV3 implements IKeySharesKeys {
  @IsArray()
  @MinLength(98, {
    each: true,
  })
  @PublicKeyValidator({ each: true })
  publicKeys: string[] | undefined;

  @IsArray()
  @MinLength(98, {
    each: true,
  })
  @MatchLengthValidator('publicKeys', { message: 'Length of encrypted and public keys should be equal.'})
  @EncryptedKeyValidator()
  encryptedKeys: string[] | undefined;

  /**
   * Set public and encrypted keys from data.
   * @param data
   */
  setData(data: { publicKeys: string[] | null | undefined, encryptedKeys: string[] | null | undefined }) {
    if (data.publicKeys) {
      this.publicKeys = data.publicKeys;
    }
    if (data.encryptedKeys) {
      this.encryptedKeys = data.encryptedKeys;
    }
  }

  /**
   * Validation of all data.
   */
  validate(): void {
    validateSync(this);
  }
}

