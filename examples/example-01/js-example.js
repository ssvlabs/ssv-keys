const { SSVKeys } = require('ssv-keys');

const keystore = require('./test.keystore.json');
const operators = require('./operators.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

async function main() {
  // Step 1: read validator private key form keystore file
  const ssvKeys = new SSVKeys();
  const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(keystore, keystorePassword);

  // Step 2: Build keyshares from operator IDs and keys
  const threshold = await ssvKeys.createThreshold(privateKey, operatorIds);
  const keyshares = await ssvKeys.encryptShares(operators, threshold.shares);

  // Step 3: Build final web3 transaction payload
  const payload = await ssvKeys.buildPayload(
    threshold.validatorPublicKey,
    operatorIds,
    keyshares, // shares public keys + shares encrypted
    123456789, // amount of ssv tokens in wei to deposit
  );

  console.debug('payload: ', payload);
}

void main();
