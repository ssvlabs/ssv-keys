import { BaseCustomError } from './base';

export class KeyStoreDataFormatError extends BaseCustomError {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}

export class KeyStoreInvalidError extends BaseCustomError {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}

export class KeyStorePasswordError extends BaseCustomError {
  constructor(message: string) {
    super(message);
  }
}

export class EthereumWalletError extends BaseCustomError {
  constructor(message: string) {
    super(message);
  }
}

export class PrivateKeyFormatError extends BaseCustomError {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}

export class OwnerAddressFormatError extends BaseCustomError {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}

export class OwnerNonceFormatError extends BaseCustomError {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}
