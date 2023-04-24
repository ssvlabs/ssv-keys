import { SSVKeys } from 'ssv-keys';

const operators = require('./operators.json');
const keystore = require('./test.keystore.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

async function main() {
  // Step 1: read keystore file
  const ssvKeys = new SSVKeys();
  const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(keystore, keystorePassword);

  // Step 2: Build shares from operator IDs and public keys
  const threshold = await ssvKeys.createThreshold(privateKey, operatorIds);
  const encryptedShares = await ssvKeys.encryptShares(operators, threshold.shares);

  // Step 3: Build final web3 transaction payload and update keyshares file with payload data
  const payload = await ssvKeys.buildPayload(
    {
      publicKey: ssvKeys.publicKey,
      operatorIds,
      encryptedShares,
    },
  );

  console.debug('payload: ', payload);
}

void main();
