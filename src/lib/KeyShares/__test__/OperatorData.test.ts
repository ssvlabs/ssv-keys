import { operatorPublicKeyValidator } from '../../../commands/actions/validators/operator';
import { OperatorData } from '../KeySharesData/OperatorData';

const validOperatorKey = 'LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdHhHZEx6QVBnR0hhYWVoYUN6a0YKTmdiSmZ6WndCQnlsVFhMdWxPc3ErMzA2NCtBUFNQZHh3YmVXalpPRWpvWC9rRy9EaHNUVmw5eGw0SktUdWxpQwpYdlpMZXRpd3ZuM3RYQTFTKzNGTnJLZ1FjNFBnSHppd1RKL01yMEdyRzFyYWpvYm9VMGVETU5Hbi8zL3BRdk1WCks5bFNuY1QyaFhLbW1PdDdtQUUyK3ltT0JOZDhKU3g5NnA3ajFWdDNwc2d4ZzJMTUU0Nnd2dEpPVyswUWdNVDMKSDNEVjVSTWZWUlU4Z29nUFptbjNYRUR4RUJLZUtmaFZHVjlYNmFhcXkvU2Y4aEo3aG16eVcrQ3F1bkFYYWUySwo5ZDdSL0g0dStZcGovaU5NYkNQNi9GOGlIOCtQbWRyTmtUUFRPakwrb05HZVlNSVB3L1hYVStZbkhzcGp4SjRMCnBRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K';
const invalidOperatorKey = 'invalidKey';

describe('OperatorData', () => {
  it('Should create OperatorData with provided id and operatorKey', () => {
    const operatorData = new OperatorData({ id: 1, operatorKey: validOperatorKey });
    expect(operatorData.id).toEqual(1);
    expect(operatorData.operatorKey).toEqual(validOperatorKey);
  });

  it('operatorPublicKeyValidator should return true for valid operatorKey', () => {
    expect(operatorPublicKeyValidator(validOperatorKey)).toBe(true);
  });

  it('operatorPublicKeyValidator should return error message for invalid operatorKey', () => {
    expect(operatorPublicKeyValidator(invalidOperatorKey)).toBe('The length of the operator public key must be at least 98 characters.');
  });
});
