import _ from 'underscore';
import * as ethers from 'ethers';

import { IsString, IsObject, IsOptional } from 'class-validator';
import { IKeySharesPayload } from './IKeySharesPayload';
import { EncryptShare } from '../../Encryption/Encryption';

/**
 * Key Shares Payload v2.
 */
export class KeySharesPayloadV3 implements IKeySharesPayload {
  static PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY = 0;
  static PAYLOAD_INDEX_OPERATOR_IDS = 1;
  static PAYLOAD_INDEX_SHARES_KEYS = 2;
  static PAYLOAD_INDEX_SSV_AMOUNT = 3;

  @IsOptional()
  @IsObject()
  public readable?: any = null;

  @IsOptional()
  @IsString()
  public raw?: string | null = null;

  private decodeRSAShares(arr: string[]) {
    return arr.map(item => ('0x' + Buffer.from(item, 'base64').toString('hex')));
  }

  private sharesToBytes(publicKeys: string[], privateKeys: string[]): string {
    const encryptedShares = this.decodeRSAShares(privateKeys);
    const arrayPublicKeys = new Uint8Array([
        ...ethers.utils.arrayify(publicKeys[0]),
        ...ethers.utils.arrayify(publicKeys[1]),
        ...ethers.utils.arrayify(publicKeys[2]),
        ...ethers.utils.arrayify(publicKeys[3]),
    ]);

    const arrayEncryptedShares = new Uint8Array([
        ...ethers.utils.arrayify(encryptedShares[0]),
        ...ethers.utils.arrayify(encryptedShares[1]),
        ...ethers.utils.arrayify(encryptedShares[2]),
        ...ethers.utils.arrayify(encryptedShares[3]),
    ]);

    // public keys hex encoded
    const pkHex = ethers.utils.hexlify(arrayPublicKeys);
    // length of the public keys (hex), hex encoded
    const pkHexLength = String(pkHex.length.toString(16)).padStart(4, '0');

    // join arrays
    const pkPsBytes = Buffer.concat([arrayPublicKeys, arrayEncryptedShares]);

    // add length of the public keys at the beginning
    // this is the variable that is sent to the contract as bytes, prefixed with 0x
    return pkHexLength + pkPsBytes.toString('hex');
  }

  build(data: any): any {
    return [
      data.validatorPublicKey,
      data.operatorsIds.join(','),
      this.sharesToBytes(data.encryptedShares.map((share: EncryptShare) => share.publicKey), data.encryptedShares.map((share: EncryptShare) => share.privateKey)),
      data.ssvAmount,
    ];
  }

  /**
   * Setting data in array or object format or cleaning it up.
   * @param data
   */
  setData(data: any): any {
    // Cleanup
    if (!data === null) {
      this.raw = null;
      this.readable = null;
      return;
    }

    // Payload array
    if (_.isArray(data)) {
      this.raw = this.toRaw(data);
      this.readable = this.toReadable(data);
      return;
    }

    // Payload object (typically from key shares file)
    if (_.isObject(data)) {
      if (data.readable) {
        this.readable = data.readable;
      }
      if (data.raw) {
        this.raw = data.raw;
      }
    }
  }

  /**
   * Building raw payload for web3.
   * @param payload
   */
  toRaw(payload: any[]): any {
    return payload.join(',');
  }

  /**
   * Building readable payload structure.
   * @param payload
   */
  toReadable(payload: any[]): any {
    return {
      validatorPublicKey: payload[KeySharesPayloadV3.PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY],
      operatorIds: payload[KeySharesPayloadV3.PAYLOAD_INDEX_OPERATOR_IDS],
      shares: payload[KeySharesPayloadV3.PAYLOAD_INDEX_SHARES_KEYS],
      ssvAmount: payload[KeySharesPayloadV3.PAYLOAD_INDEX_SSV_AMOUNT],
    };
  }

  validate(): any {
    // Find out how final payload can be validated.
  }
}
