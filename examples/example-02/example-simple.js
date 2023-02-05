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
  const ssvKeys = new SSVKeys(SSVKeys.VERSION.V3);
  // Step 2: Get private key
  const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(keystore, keystorePassword);
  // Step 3: Build shares from operator IDs and public keys
  const encryptedShares = await ssvKeys.buildShares(privateKey, operatorIds, operators);

  // --------------------------------------------------------------------------
  // ✳️ Lesson 2: Build final web3 transaction payload
  // --------------------------------------------------------------------------
  // params to scan contract for the latest cluster snapshot to fill the payload data
  const contractParams = {
    ownerAddress: 'VALIDATOR_OWNER_ADDRESS',
    contractAddress: 'SSV_CONTRACT_ADDRESS',
    nodeUrl: 'ETH_NODE_URL',
  };

  // Build final web3 transaction payload and update keyshares file with payload data
  const payload = await ssvKeys.buildPayload(
    {
      publicKey: ssvKeys.publicKey,
      operatorIds,
      encryptedShares,
      amount: 123456789,
    },
    contractParams
  );

  console.log('Web3 Payload: ', payload);

  // --------------------------------------------------------------------------
  // ✳️ Lesson 3: Saving keyshares file
  // --------------------------------------------------------------------------
  // If you need to save result in a reusable unified format for both web and node
  // environments, save data to keyshares file.
  // --------------------------------------------------------------------------
  // Step 1: Build keyshares object
  const keyShares = await ssvKeys.keyShares.fromJson({
    version: 'v3',
    data: {
      operators: operators.map((operator, index) => ({
        id: operatorIds[index],
        publicKey: operator,
      })),
      publicKey: ssvKeys.publicKey,
      encryptedShares,
    },
    payload,
  });
  // Step 2: Save to the file
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
