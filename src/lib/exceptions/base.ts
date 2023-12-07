export class SSVKeysException extends Error {
  public trace: any;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.trace = this.stack;
    this.stack = `${this.name}: ${this.message}`; // Customizing stack
  }
}
