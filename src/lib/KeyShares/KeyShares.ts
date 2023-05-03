import * as ethers from 'ethers';

import {
  IsOptional,
  ValidateNested,
  validateSync
} from 'class-validator';

import { KeySharesData } from './KeySharesData/KeySharesData';
import { KeySharesPayload } from './KeySharesData/KeySharesPayload';
import { EncryptShare } from '../Encryption/Encryption';
import { IPartitialData } from './KeySharesData/IKeySharesData';
import { IOperator } from './KeySharesData/IOperator';
import { operatorSortedList } from '../helpers/operator.helper';

export interface IPayloadMetaData {
  publicKey: string,
  operators: IOperator[],
  encryptedShares: EncryptShare[],
}

/**
 * Key shares file data interface.
 */
export class KeyShares {
  @IsOptional()
  @ValidateNested()
  public data: KeySharesData;

  @IsOptional()
  @ValidateNested()
  public payload: KeySharesPayload;

  constructor() {
    this.data = new KeySharesData();
    this.payload = new KeySharesPayload();
  }

  /**
   * Build payload from encrypted shares, validator public key and operator IDs
   * @param publicKey
   * @param operatorIds
   * @param encryptedShares
   */
  buildPayload(metaData: IPayloadMetaData): any {
    return this.payload.build({
      publicKey: metaData.publicKey,
      operatorIds: operatorSortedList(metaData.operators).map(operator => operator.id),
      encryptedShares: metaData.encryptedShares,
    });
  }

  /**
   * Build shares from bytes string and operators list length
   * @param bytes
   * @param operatorCount
   */
  buildSharesFromBytes(bytes: string, operatorCount: number): any {
    bytes = bytes.replace('0x', '');
    const pkLength = parseInt(bytes.substring(0, 4), 16);

    // get the public keys part
    const pkSplit = bytes.substring(4, pkLength + 2);
    const pkArray = ethers.utils.arrayify('0x' + pkSplit);
    const sharesPublicKeys = this._splitArray(operatorCount, pkArray).map(item =>
      ethers.utils.hexlify(item),
    );

    const eSplit = bytes.substring(pkLength + 2);
    const eArray = ethers.utils.arrayify('0x' + eSplit);
    const encryptedKeys = this._splitArray(operatorCount, eArray).map(item =>
      Buffer.from(ethers.utils.hexlify(item).replace('0x', ''), 'hex').toString(
        'base64',
      ),
    );
    return {
      sharesPublicKeys,
      encryptedKeys,
    };
  }

  /**
   * Set new data and validate it.
   * @param data
   */
  update(data: IPartitialData) {
    this.data.update(data);
    this.validate();
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
  fromJson(content: string | any): KeyShares {
    const data = typeof content === 'string'
      ? JSON.parse(content).data
      : content.data;

    this.update(data);
    return this;
  }

  /**
   * Stringify key shares to be ready for saving in file.
   */
  toJson(): string {
    return JSON.stringify({
      version: 'v3',
      createdAt: new Date().toISOString(),
      data: this.data || null,
      payload: this.payload.readable || null,
    }, null, '  ');
  }

  private _splitArray(parts: number, arr: Uint8Array) {
    const partLength = Math.floor(arr.length / parts);
    const partsArr = [];
    for (let i = 0; i < parts; i++) {
      const start = i * partLength;
      const end = start + partLength;
      partsArr.push(arr.slice(start, end));
    }
    return partsArr;
  }
}
