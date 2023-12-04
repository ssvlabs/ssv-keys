export class BaseCustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.stack = `${this.name}: ${this.message}`; // Customizing stack
  }
}
