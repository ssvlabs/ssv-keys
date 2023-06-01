export interface IOperatorData {
  id: number | undefined;
  publicKey: string | undefined;
  validate(): void;
}
