import { SSVKeysException } from './base';
export class KeySharesAbiDecodeError extends SSVKeysException {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}
