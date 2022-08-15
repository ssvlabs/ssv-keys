import { IsString, IsObject } from 'class-validator';

// ---------------------------------------------------------------
// Structure interfaces
// ---------------------------------------------------------------

export interface IKeySharesPayloadV2 {
  readable?: any,
  raw?: string
}

// ---------------------------------------------------------------
// Structure classes
// ---------------------------------------------------------------

export class KeySharesPayloadV2 {
  @IsObject()
  public readable: any = {};

  @IsString()
  public raw = '';


  constructor(data: IKeySharesPayloadV2) {
    this.readable = data.readable || {};
    this.raw = data.raw || '';
  }

  /**
   * Do all possible validations.
   */
  async validate(): Promise<any> {
    // Find out how final payload can be validated.
  }
}
