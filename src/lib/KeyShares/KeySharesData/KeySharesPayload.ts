import { hexArrayToBytes } from '../../helpers/web3.helper';

import { IsString, Length, validateSync, IsNumber } from 'class-validator';
import { PublicKeyValidator } from './validators';

import { IKeySharesPartialPayload, IKeySharesPayload } from './IKeySharesPayload';
import { EncryptShare } from '../../Encryption/Encryption';

/**
 * Key Shares Payload
 */
export class KeySharesPayload implements IKeySharesPayload {
  @IsString()
  public sharesData!: string;

  @IsString()
  @Length(98, 98)
  @PublicKeyValidator()
  public publicKey!: string;

  @IsNumber({}, { each: true })
  public operatorIds!: number[];

  /**
   * Converts arrays of public and private keys to a single hexadecimal string.
   * @param publicKeys Array of public keys.
   * @param privateKeys Array of private keys.
   * @returns Hexadecimal string representation of keys.
   */
  private _sharesToBytes(publicKeys: string[], privateKeys: string[]) {
    const encryptedShares = [...privateKeys].map(item => ('0x' + Buffer.from(item, 'base64').toString('hex')));
    const pkPsBytes = hexArrayToBytes([...publicKeys, ...encryptedShares]);
    return `0x${pkPsBytes.toString('hex')}`;
  }

  /**
   * Updates the payload with new data and validates it.
   * @param data Partial key shares payload to update.
   */
  update(data: IKeySharesPartialPayload): void {
    this.publicKey = data.publicKey;
    this.sharesData = data.sharesData;
    this.operatorIds = data.operatorIds;
    this.validate();
  }

  /**
   * Validates the current state of the instance.
   * @returns {void | ValidationError[]} Validation errors if any, otherwise undefined.
   */
  validate(): any {
    validateSync(this);
  }

  /**
   * Builds the payload from the given data.
   * @param data Data to build the payload.
   * @returns {KeySharesPayload} The current instance for chaining.
   */
  build(data: any): KeySharesPayload {
    this.publicKey = data.publicKey;
    this.operatorIds = data.operatorIds;
    this.sharesData = this._sharesToBytes(
      data.encryptedShares.map((share: EncryptShare) => share.publicKey),
      data.encryptedShares.map((share: EncryptShare) => share.privateKey)
    );

    return this;
  }
}
