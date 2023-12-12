import { SSVKeysException } from './base';
export class BLSDeserializeError extends SSVKeysException {
  public publicKey: string;

  constructor(publicKey: string, message: string) {
    super(message);
    this.publicKey = publicKey;
  }
}

export class SingleSharesSignatureInvalid extends SSVKeysException {
  public data: string;

  constructor(data: string, message: string) {
    super(message);
    this.data = data;
  }
}

