export class KeyStoreDataFormatError extends Error {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}

export class KeyStoreInvalidError extends Error {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}

export class KeyStorePasswordError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class EthereumWalletError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class PrivateKeyFormatError extends Error {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}
