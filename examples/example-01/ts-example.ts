import { SSVKeys, KeyShares } from 'ssv-keys';

const operatorPublicKeys = require('./operators.json');
const keystore = require('./test.keystore.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

async function main() {
  // Step 1: read keystore file
  const ssvKeys = new SSVKeys();
  const { publicKey, privateKey } = await ssvKeys.extractKeys(keystore, keystorePassword);

  const operators = operatorPublicKeys.map((publicKey: string, index: number) => ({
    id: operatorIds[index],
    publicKey,
  }));

  // Step 2: Build shares from operator IDs and public keys
  const threshold = await ssvKeys.createThreshold(privateKey, operators);
  const encryptedShares = await ssvKeys.encryptShares(operators, threshold.shares);

  // Step 3: Build final web3 transaction payload and update keyshares file with payload data
  const keyShares = new KeyShares();
  const payload = await keyShares.buildPayload({
    publicKey,
    operators,
    encryptedShares,
  });

  console.debug('payload: ', payload);
}

void main();
