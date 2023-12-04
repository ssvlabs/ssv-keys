import { BaseCustomError } from './base';
export class BLSDeserializeError extends BaseCustomError {
  public publicKey: string;

  constructor(publicKey: string, message: string) {
    super(message);
    this.publicKey = publicKey;
  }
}

export class SingleSharesSignatureInvalid extends BaseCustomError {
  public data: string;

  constructor(data: string, message: string) {
    super(message);
    this.data = data;
  }
}

