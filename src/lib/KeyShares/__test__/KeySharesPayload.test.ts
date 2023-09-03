import { SSVKeys } from '../../SSVKeys';
import { KeyShares, IKeySharesPayloadData, IKeySharesToSignatureData } from '../KeyShares';

const operators = require('./key-shares/with-operators.json').data.operators;

const keystore = require('./key-stores/test.keystore.json');
const keystorePassword = 'testtest';

const ownerAddress = '0x7867F021bCFcc7B8FB896e2985ad10C86709ecFe';

describe('KeySharesPayload', () => {
  let ssvKeys: SSVKeys;
  let keyShares: KeyShares;
  let payloadData: IKeySharesPayloadData;
  let toSignatureData: IKeySharesToSignatureData;
  let publicKey: string, privateKey: string;

  beforeEach(async () => {
    ssvKeys = new SSVKeys();
    const extractedKeys = await ssvKeys.extractKeys(keystore, keystorePassword);
    publicKey = extractedKeys.publicKey;
    privateKey = extractedKeys.privateKey;

    const threshold = await ssvKeys.createThreshold(privateKey, operators);
    const encryptedShares = await ssvKeys.encryptShares(operators, threshold.shares);

    keyShares = new KeyShares();
    payloadData = {
      publicKey,
      operators,
      encryptedShares,
    };
    toSignatureData = {
      ownerAddress,
      ownerNonce: 1,
      privateKey,
    };
  });

  it('should build payload', async () => {
    const result = await keyShares.buildPayload(payloadData, toSignatureData);
    expect(result).toBeDefined();
  });

  it('should update data', () => {
    const data = {};
    keyShares.update(data);
  });

  it('should validate', () => {
    keyShares.validate();
  });
});
