export class KeySharesAbiDecodeError extends Error {
  public data: any;

  constructor(data: any, message: string) {
    super(message);
    this.data = data;
  }
}
