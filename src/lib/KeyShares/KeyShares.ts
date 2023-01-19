import {
  IsString,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  validateOrReject
} from 'class-validator';

import { KeySharesDataV2 } from './KeySharesData/KeySharesDataV2';
import { KeySharesPayloadV2 } from './KeySharesData/KeySharesPayloadV2';

import { KeySharesDataV3 } from './KeySharesData/KeySharesDataV3';
import { KeySharesPayloadV3 } from './KeySharesData/KeySharesPayloadV3';

export type KeySharesData = KeySharesDataV3;
export type KeySharesPayload = KeySharesPayloadV3;

/**
 * Key shares file data interface.
 */
export class KeyShares {
  static VERSION_V2 = 'v2';
  static VERSION_V3 = 'v3';

  // Versions of deeper structures
  private byVersion: any = {
    'payload': {
      [KeyShares.VERSION_V2]: KeySharesPayloadV2,
      [KeyShares.VERSION_V3]: KeySharesPayloadV3,
    },
    'data': {
      [KeyShares.VERSION_V2]: KeySharesDataV2,
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
  constructor({ version }: { version: string }) {
    this.version = version;
    this.data = this.getByVersion('data', version);
    this.payload = this.getByVersion('payload', version);
  }

  init(data: string | any): KeyShares {
    // Parse json
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    this.setData(data.data);
    return this;
  }

  /**
   * Set final payload for web3 transaction and validate it.
   * @param payload
   */
  generateContractPayload(data: any): void {
    const payloadData = this.payload.build(data);
    this.payload?.setData(payloadData);
  }

  /**
   * Set new data and validate it.
   * @param data
   */
  setData(data: any) {
    this.useData(data);
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
   * Get final data converted from raw data.
   * @param data
   * @param version
   */
  useData(data: any): void {
    if (!data) {
      return;
    }
    this.data.setData(data);
    this.validate();
  }

  /**
   * Validate everything
   */
  validate(): any {
    // Validate data and payload
    this.payload?.validate();
    this.data?.validate();
    validateOrReject(this)
      .then()
      .catch((err) => {
        throw Error(err)
      });
  }

  /**
   * Stringify key shares to be ready for saving in file.
   */
  toString(): string {
    return JSON.stringify({
      version: this.version,
      data: this.data || null,
      payload: this.payload || null,
      createdAt: new Date().toISOString()
    }, null, '  ');
  }
}
