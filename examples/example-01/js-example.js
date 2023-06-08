const { SSVKeys, KeyShares } = require('ssv-keys');

const keystore = require('./test.keystore.json');
const operatorKeys = require('./operators.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

// The validator registration nonce of the account (owner address) within the SSV contract (increments after each validator registration), obtained using the ssv-scanner tool
const TEST_REGISTER_NONCE = 1;
// The cluster owner address
const TEST_OWNER_ADDRESS = '0x81592c3de184a3e2c0dcb5a261bc107bfa91f494';

async function main() {
  // Step 1: read keystore file
  const ssvKeys = new SSVKeys();
  const { publicKey, privateKey } = await ssvKeys.extractKeys(keystore, keystorePassword);

  const operators = operatorKeys.map((operatorKey, index) => ({
    id: operatorIds[index],
    operatorKey,
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
  }, {
    ownerAddress: TEST_OWNER_ADDRESS,
    registerNonce: TEST_REGISTER_NONCE,
    privateKey
  });

  console.debug('payload: ', payload);
}

void main();
