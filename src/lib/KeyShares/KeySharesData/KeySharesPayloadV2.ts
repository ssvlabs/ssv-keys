import { IsString, IsObject } from 'class-validator';

// ---------------------------------------------------------------
// Structure interfaces
// ---------------------------------------------------------------

export interface IKeySharesPayloadV2 {
  explained?: any,
  raw?: string
}

// ---------------------------------------------------------------
// Structure classes
// ---------------------------------------------------------------

export class KeySharesPayloadV2 {
  @IsObject()
  public explained: any = {};

  @IsString()
  public raw = '';


  constructor(data: IKeySharesPayloadV2) {
    this.explained = data.explained || {};
    this.raw = data.raw || '';
  }

  /**
   * Do all possible validations.
   */
  async validate(): Promise<any> {
    // Find out how final payload can be validated.
  }
}
