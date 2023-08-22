const path = require('path');
const fsp = require('fs').promises;
const { SSVKeys, KeyShares } = require('ssv-keys');

const operatorKeys = require('./operators.json');
const keystore = require('./test.keystore.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

// The nonce of the owner within the SSV contract (increments after each validator registration), obtained using the ssv-scanner tool
const TEST_OWNER_NONCE = 1;
// The cluster owner address
const TEST_OWNER_ADDRESS = '0x81592c3de184a3e2c0dcb5a261bc107bfa91f494';

const getKeySharesFilePath = (step: any) => {
  return `${path.join(process.cwd(), 'data')}${path.sep}keyshares-step-${step}.json`;
};

/**
 * This is more complex example demonstrating usage of SSVKeys SDK together with
 * KeyShares file which can be useful in a different flows for solo staker, staking provider or web developer.
 */
async function main() {
  // Initialize SSVKeys SDK
  const ssvKeys = new SSVKeys();
  const { publicKey, privateKey } = await ssvKeys.extractKeys(keystore, keystorePassword);

  // At some point we get operator IDs and public keys and want to save them too
  const operators = operatorKeys.map((operatorKey: any, index: number) => ({
    id: operatorIds[index],
    operatorKey,
  }));

  const keyShares = new KeyShares();
  // Save it with version only and with no any data.
  await fsp.writeFile(getKeySharesFilePath(1), keyShares.toJson(), { encoding: 'utf-8' });

  await keyShares.update({ operators });
  await fsp.writeFile(getKeySharesFilePath(2), keyShares.toJson(), { encoding: 'utf-8' });

  // Now save to key shares file encrypted shares and validator public key
  await keyShares.update({ ownerAddress: TEST_OWNER_ADDRESS, ownerNonce: TEST_OWNER_NONCE, publicKey });
  await fsp.writeFile(getKeySharesFilePath(3), keyShares.toJson(), { encoding: 'utf-8' });

  // Build shares from operator IDs and public keys
  const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

  // Build final web3 transaction payload and update keyshares file with payload data
  await keyShares.buildPayload({
    publicKey,
    operators,
    encryptedShares,
  }, {
    ownerAddress: TEST_OWNER_ADDRESS,
    ownerNonce: TEST_OWNER_NONCE,
    privateKey
  });

  await fsp.writeFile(getKeySharesFilePath(4), keyShares.toJson(), { encoding: 'utf-8' });
}

void main();
