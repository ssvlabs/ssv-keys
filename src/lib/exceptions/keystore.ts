import { SSVKeysException } from './base';

export class KeyStoreDataFormatError extends SSVKeysException {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}

export class KeyStoreInvalidError extends SSVKeysException {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}

export class KeyStorePasswordError extends SSVKeysException {
  constructor(message: string) {
    super(message);
  }
}

export class EthereumWalletError extends SSVKeysException {
  constructor(message: string) {
    super(message);
  }
}

export class PrivateKeyFormatError extends SSVKeysException {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}

export class OwnerAddressFormatError extends SSVKeysException {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}

export class OwnerNonceFormatError extends SSVKeysException {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}
