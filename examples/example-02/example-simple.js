const path = require('path');
const fsp = require('fs').promises;
const { SSVKeys, KeyShares } = require('ssv-keys');

const operatorPublicKeys = require('./operators.json');
const keystore = require('./test.keystore.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

// The nonce of the owner within the SSV contract (increments after each validator registration), obtained using the ssv-scanner tool
const TEST_OWNER_NONCE = 1;
// The cluster owner address
const TEST_OWNER_ADDRESS = '0x81592c3de184a3e2c0dcb5a261bc107bfa91f494';

const getKeySharesFilePath = () => {
  return `${path.join(process.cwd(), 'data')}${path.sep}keyshares-example-simple.json`;
};

/**
 * This is more complex example demonstrating usage of SSVKeys SDK together with
 * KeyShares file which can be useful in a different flows for solo staker, staking provider or web developer.
 */
async function main() {
  // --------------------------------------------------------------------------
  // ✳️ Lesson 1: Building shares in 3 easy steps.
  // --------------------------------------------------------------------------
  // Step 1: Initialize SSVKeys SDK
  const ssvKeys = new SSVKeys();
  // Step 2: Get private key
  const { publicKey, privateKey } = await ssvKeys.extractKeys(keystore, keystorePassword);
  // Step 3: Build shares from operator IDs and public keys
  const operators = operatorPublicKeys.map((publicKey, index) => ({
    id: operatorIds[index],
    publicKey,
  }));
  const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

  // --------------------------------------------------------------------------
  // ✳️ Lesson 2: Build final web3 transaction payload
  // --------------------------------------------------------------------------
  // Build final web3 transaction payload and update keyshares file with payload data
  const keyShares = new KeyShares();
  const payload = await keyShares.buildPayload({
    publicKey,
    operators,
    encryptedShares,
  }, {
    ownerAddress: TEST_OWNER_ADDRESS,
    ownerNonce: TEST_OWNER_NONCE,
    privateKey
  });

  console.log('Web3 Payload: ', payload);

  const filePath = getKeySharesFilePath();
  await fsp.writeFile(filePath, keyShares.toJson(), { encoding: 'utf-8' });
  console.log('See your keyshares file in ', filePath);

  // --------------------------------------------------------------------------
  // ✳️ Lesson 4: Reading keyshares file
  // --------------------------------------------------------------------------
  // If you saved your keyshares to use it later you have two options to do that
  // --------------------------------------------------------------------------
  // Example 1: read saved keyshares as string.
  // Useful in architecture with more dynamic project structure
  // when you can not include json file using `require`
  // --------------------------------------------------------------------------
  const ks1 = await keyShares.fromJson(String(await fsp.readFile(filePath)));
  console.log('Keyshares read as string: ', ks1.toJson());
  // --------------------------------------------------------------------------
  // Example 2: use keyshares json (node way)
  // --------------------------------------------------------------------------
  const ks2 = await keyShares.fromJson(require(filePath));
  console.log('Keyshares read as json: ', ks2.toJson());

  // For more possible scenarios ideas look at complex example.
}

void main();
