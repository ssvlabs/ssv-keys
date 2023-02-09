const { SSVKeys } = require('ssv-keys');

const keystore = require('./test.keystore.json');
const operators = require('./operators.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

async function main() {
  // Step 1: read keystore file
  const ssvKeys = new SSVKeys(SSVKeys.VERSION.V3);
  const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(keystore, keystorePassword);

  // Step 2: Build shares from operator IDs and public keys
  const threshold = await ssvKeys.createThreshold(privateKey, operatorIds);
  const encryptedShares = await ssvKeys.encryptShares(operators, threshold.shares);

  // params to scan contract for the latest cluster snapshot to fill the payload data
  const contractParams = {
    ownerAddress: 'VALIDATOR_OWNER_ADDRESS',
    contractAddress: 'SSV_CONTRACT_ADDRESS',
    nodeUrl: 'ETH_NODE_URL',
  };

  // Step 3: Build final web3 transaction payload and update keyshares file with payload data
  const payload = await ssvKeys.buildPayload(
    {
      publicKey: ssvKeys.publicKey,
      operatorIds,
      encryptedShares,
      amount: 123456789,
    },
    contractParams
  );

  console.debug('payload: ', payload);
}

void main();
