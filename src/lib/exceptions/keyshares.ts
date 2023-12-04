import { BaseCustomError } from './base';
export class KeySharesAbiDecodeError extends BaseCustomError {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}
