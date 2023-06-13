export class BLSDeserializeError extends Error {
  public publicKey: string;

  constructor(publicKey: string, message: string) {
    super(message);
    this.publicKey = publicKey;
  }
}

export class SingleSharesSignatureInvalid extends Error {
  public data: string;

  constructor(data: string, message: string) {
    super(message);
    this.data = data;
  }
}

