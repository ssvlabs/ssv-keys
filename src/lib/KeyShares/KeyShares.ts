import * as ethers from 'ethers';

import {
  IsString,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  validateSync
} from 'class-validator';

import { IKeySharesData } from './KeySharesData/IKeySharesData';
import { IKeySharesPayload } from './KeySharesData/IKeySharesPayload';

import { KeySharesDataV3 } from './KeySharesData/KeySharesDataV3';
import { KeySharesPayloadV3 } from './KeySharesData/KeySharesPayloadV3';

export type KeySharesData = IKeySharesData;
export type KeySharesPayload = IKeySharesPayload;

/**
 * Key shares file data interface.
 */
export class KeyShares {
  static VERSION_V3 = 'v3';

  // Versions of deeper structures
  private byVersion: any = {
    'payload': {
      [KeyShares.VERSION_V3]: KeySharesPayloadV3,
    },
    'data': {
      [KeyShares.VERSION_V3]: KeySharesDataV3,
    }
  }

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  public version: string;

  @IsOptional()
  @ValidateNested()
  public data: KeySharesData;

  @IsOptional()
  @ValidateNested()
  public payload: KeySharesPayload;

  /**
   * @param version
   */
  constructor() {
    this.version = KeyShares.VERSION_V3;
    this.data = this.getByVersion('data', this.version);
    this.payload = this.getByVersion('payload', this.version);
  }

  /**
   * Set final payload for web3 transaction and validate it.
   * @param payload
   */
  generateContractPayload(data: any): KeySharesPayload {
    const payloadData = this.payload.build(data);
    this.payload?.setData(payloadData);

    return this.payload;
  }

  generateKeySharesFromBytes(shares: string, operatorIds: any[]): any {
    const operatorCount = operatorIds.length;
    shares = shares.replace('0x', '');
    const pkLength = parseInt(shares.substring(0, 4), 16);

    // get the public keys part
    const pkSplit = shares.substring(4, pkLength + 2);
    const pkArray = ethers.utils.arrayify('0x' + pkSplit);
    const sharesPublicKeys = this.splitArray(operatorCount, pkArray).map(item =>
      ethers.utils.hexlify(item),
    );

    const eSplit = shares.substring(pkLength + 2);
    const eArray = ethers.utils.arrayify('0x' + eSplit);
    const encryptedKeys = this.splitArray(operatorCount, eArray).map(item =>
      Buffer.from(ethers.utils.hexlify(item).replace('0x', ''), 'hex').toString(
        'base64',
      ),
    );
    return {
      sharesPublicKeys,
      encryptedKeys,
    };
  }

  private splitArray(parts: number, arr: Uint8Array) {
    const partLength = Math.floor(arr.length / parts);
    const partsArr = [];
    for (let i = 0; i < parts; i++) {
      const start = i * partLength;
      const end = start + partLength;
      partsArr.push(arr.slice(start, end));
    }
    return partsArr;
  }

  /**
   * Set new data and validate it.
   * @param data
   */
  setData(data: any) {
    if (!data) {
      return;
    }
    this.data.setData(data);
    this.validate();
  }

  /**
   * Get entity by version.
   * @param entity
   * @param version
   * @private
   */
  private getByVersion(entity: string, version: string): any {
    if (!this.byVersion[entity]) {
      throw Error(`"${entity}" is unknown entity`);
    }
    if (!this.byVersion[entity][version]) {
      throw Error(`"${entity}" is not supported in version of key shares: ${version}`);
    }
    return new this.byVersion[entity][version]();
  }

  /**
   * Validate everything
   */
  validate(): any {
    validateSync(this);
  }

  /**
   * Initialise from JSON or object data.
   */
  fromJson(data: string | any): KeyShares {
    // Parse json
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    this.setData(data.data);
    return this;
  }


  /**
   * Stringify key shares to be ready for saving in file.
   */
  toJson(): string {
    return JSON.stringify({
      version: this.version,
      createdAt: new Date().toISOString(),
      data: this.data || null,
      payload: this.payload.readable || null,
    }, null, '  ');
  }
}
