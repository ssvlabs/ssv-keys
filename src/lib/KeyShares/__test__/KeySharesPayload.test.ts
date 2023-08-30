import { KeyShares, IKeySharesPayloadData, IKeySharesToSignatureData } from '../KeyShares';

const validOperatorKey = 'LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdHhHZEx6QVBnR0hhYWVoYUN6a0YKTmdiSmZ6WndCQnlsVFhMdWxPc3ErMzA2NCtBUFNQZHh3YmVXalpPRWpvWC9rRy9EaHNUVmw5eGw0SktUdWxpQwpYdlpMZXRpd3ZuM3RYQTFTKzNGTnJLZ1FjNFBnSHppd1RKL01yMEdyRzFyYWpvYm9VMGVETU5Hbi8zL3BRdk1WCks5bFNuY1QyaFhLbW1PdDdtQUUyK3ltT0JOZDhKU3g5NnA3ajFWdDNwc2d4ZzJMTUU0Nnd2dEpPVyswUWdNVDMKSDNEVjVSTWZWUlU4Z29nUFptbjNYRUR4RUJLZUtmaFZHVjlYNmFhcXkvU2Y4aEo3aG16eVcrQ3F1bkFYYWUySwo5ZDdSL0g0dStZcGovaU5NYkNQNi9GOGlIOCtQbWRyTmtUUFRPakwrb05HZVlNSVB3L1hYVStZbkhzcGp4SjRMCnBRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K';

describe('KeySharesPayload', () => {
  let keyShares: KeyShares;
  let payloadData: IKeySharesPayloadData;
  let toSignatureData: IKeySharesToSignatureData;

  beforeEach(() => {
    keyShares = new KeyShares();
    payloadData = {
      publicKey: 'publicKey',
      operators: [{ id: 1, operatorKey: validOperatorKey }, { id: 2, operatorKey: validOperatorKey }],
      encryptedShares: [{ operatorPublicKey: 'operatorPublicKey1', privateKey: 'privateKey1', publicKey: 'publicKey1' }, { operatorPublicKey: 'operatorPublicKey2', privateKey: 'privateKey2', publicKey: 'publicKey2' }]
    };
    toSignatureData = {
      ownerAddress: 'ownerAddress',
      ownerNonce: 1,
      privateKey: 'privateKey',
    };
  });

  it('should build payload', async () => {
    const result = await keyShares.buildPayload(payloadData, toSignatureData);
    expect(result).toBeDefined();
    // add more assertions based on the expected result
  });

  it('should validate single shares', async () => {
    const shares = 'shares';
    const fromSignatureData = {
      ownerAddress: 'ownerAddress',
      ownerNonce: 1,
      publicKey: 'publicKey',
    };
    await keyShares.validateSingleShares(shares, fromSignatureData);
    // add assertions if there is any expected result or check if no error is thrown
  });

  it('should build shares from bytes', () => {
    const bytes = 'bytes';
    const operatorCount = 2;
    const result = keyShares.buildSharesFromBytes(bytes, operatorCount);
    expect(result).toBeDefined();
    // add more assertions based on the expected result
  });

  it('should update data', () => {
    const data = {};
    keyShares.update(data);
    // add assertions if there is any expected result or check if no error is thrown
  });

  it('should validate', () => {
    keyShares.validate();
    // add assertions if there is any expected result or check if no error is thrown
  });

  it('should initialize from JSON', () => {
    const content = JSON.stringify({
      version: 'v1.0.0',
      createdAt: new Date().toISOString(),
      data: { data: 'data' },
      payload: { payload: 'payload' },
    });
    const result = keyShares.fromJson(content);
    expect(result).toBeDefined();
    // add more assertions based on the expected result
  });

  it('should stringify to JSON', () => {
    const result = keyShares.toJson();
    expect(result).toBeDefined();
    // add more assertions based on the expected result
  });
});
