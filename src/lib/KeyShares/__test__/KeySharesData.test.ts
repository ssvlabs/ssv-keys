import { KeySharesData } from '../KeySharesData/KeySharesData';
import { OperatorData } from '../KeySharesData/OperatorData';
import { IKeySharesPartitialData } from '../KeySharesData/IKeySharesData';

describe('KeySharesData', () => {
  const validOperatorKey = 'LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdHhHZEx6QVBnR0hhYWVoYUN6a0YKTmdiSmZ6WndCQnlsVFhMdWxPc3ErMzA2NCtBUFNQZHh3YmVXalpPRWpvWC9rRy9EaHNUVmw5eGw0SktUdWxpQwpYdlpMZXRpd3ZuM3RYQTFTKzNGTnJLZ1FjNFBnSHppd1RKL01yMEdyRzFyYWpvYm9VMGVETU5Hbi8zL3BRdk1WCks5bFNuY1QyaFhLbW1PdDdtQUUyK3ltT0JOZDhKU3g5NnA3ajFWdDNwc2d4ZzJMTUU0Nnd2dEpPVyswUWdNVDMKSDNEVjVSTWZWUlU4Z29nUFptbjNYRUR4RUJLZUtmaFZHVjlYNmFhcXkvU2Y4aEo3aG16eVcrQ3F1bkFYYWUySwo5ZDdSL0g0dStZcGovaU5NYkNQNi9GOGlIOCtQbWRyTmtUUFRPakwrb05HZVlNSVB3L1hYVStZbkhzcGp4SjRMCnBRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K';

  const operator1 = new OperatorData({id: 1, operatorKey: validOperatorKey});
  const operator2 = new OperatorData({id: 2, operatorKey: validOperatorKey});

  let keySharesData: KeySharesData;

  beforeEach(() => {
    keySharesData = new KeySharesData();
  });

  it('Should update ownerAddress', () => {
    const data: IKeySharesPartitialData = { ownerAddress: '0x1234567890abcdef' };
    keySharesData.update(data);
    expect(keySharesData.ownerAddress).toEqual('0x1234567890abcdef');
  });

  it('Should update ownerNonce', () => {
    const data: IKeySharesPartitialData = { ownerNonce: 123 };
    keySharesData.update(data);
    expect(keySharesData.ownerNonce).toEqual(123);
  });

  it('Should update publicKey', () => {
    const data: IKeySharesPartitialData = { publicKey: validOperatorKey };
    keySharesData.update(data);
    expect(keySharesData.publicKey).toEqual(validOperatorKey);
  });

  it('Should update operators', () => {
    const operators: OperatorData[] = [operator1, operator2];
    const data: IKeySharesPartitialData = { operators };
    keySharesData.update(data);
    expect(keySharesData.operators).toEqual(operators);
  });

  it('Should return operator ids', () => {
    keySharesData.operators = [operator1, operator2];
    expect(keySharesData.operatorIds).toEqual([1, 2]);
  });

  it('Should return operator public keys', () => {
    keySharesData.operators = [operator1, operator2];
    expect(keySharesData.operatorPublicKeys).toEqual([validOperatorKey, validOperatorKey]);
  });
});
