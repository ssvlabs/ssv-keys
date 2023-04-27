const path = require('path');
const fsp = require('fs').promises;
const { SSVKeys } = require('ssv-keys');

const operators = require('./operators.json');
const keystore = require('./test.keystore.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

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
  const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(keystore, keystorePassword);
  // Step 3: Build shares from operator IDs and public keys
  const encryptedShares = await ssvKeys.buildShares(privateKey, operatorIds, operators);

  // --------------------------------------------------------------------------
  // ✳️ Lesson 2: Build final web3 transaction payload
  // --------------------------------------------------------------------------
  // Build final web3 transaction payload and update keyshares file with payload data
  const payload = await ssvKeys.buildPayload(
    {
      publicKey: ssvKeys.publicKey,
      operatorIds,
      encryptedShares,
    }
  );

  console.log('Web3 Payload: ', payload);

  const filePath = getKeySharesFilePath();
  await fsp.writeFile(filePath, ssvKeys.keyShares.toJson(), { encoding: 'utf-8' });
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
  const ks1 = await ssvKeys.keyShares.fromJson(String(await fsp.readFile(filePath)));
  console.log('Keyshares read as string: ', ks1.toJson());
  // --------------------------------------------------------------------------
  // Example 2: use keyshares json (node way)
  // --------------------------------------------------------------------------
  const ks2 = await ssvKeys.keyShares.fromJson(require(filePath));
  console.log('Keyshares read as json: ', ks2.toJson());

  // For more possible scenarios ideas look at complex example.
}

void main();
