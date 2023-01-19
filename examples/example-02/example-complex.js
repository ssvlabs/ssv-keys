const path = require('path');
const fsp = require('fs').promises;
const { SSVKeys, KeyShares } = require('ssv-keys');

const operators = require('./operators.json');
const keystore = require('./test.keystore.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

const getKeySharesFilePath = (step) => {
  return `${path.join(process.cwd(), 'data')}${path.sep}keyshares-step-${step}.json`;
};

/**
 * This is more complex example demonstrating usage of SSVKeys SDK together with
 * KeyShares file which can be useful in a different flows for solo staker, staking provider or web developer.
 */
async function main() {
  // Initialize SSVKeys SDK
  const ssvKeys = new SSVKeys(SSVKeys.VERSION.V3);
  const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(keystore, keystorePassword);

  /**
   * Or alternatively you can use simple constructor, but in this case potentially passed
   * data won't be automatically validated at this point.
   * Example:
   *  const keyShares = new KeyShares({ version: 'v2' });
   */

  // Save it with version only and with no any data.
  await fsp.writeFile(getKeySharesFilePath(1), ssvKeys.keySharesInstance.toString(), { encoding: 'utf-8' });

  // At some point we get operator IDs and public keys and want to save them too
  await ssvKeys.keySharesInstance.setData({
    operators: operators.map((operator, index) => ({
      id: operatorIds[index],
      publicKey: operator,
    }))
  });
  await fsp.writeFile(getKeySharesFilePath(2), ssvKeys.keySharesInstance.toString(), { encoding: 'utf-8' });


  // Build shares from operator IDs and public keys
  const shares = await ssvKeys.buildShares(privateKey, operatorIds, operators);

  // Now save to key shares file encrypted shares and validator public key
  await ssvKeys.keySharesInstance.setData({
    publicKey: ssvKeys.getValidatorPublicKey(),
    shares,
  });

  await fsp.writeFile(getKeySharesFilePath(3), ssvKeys.keySharesInstance.toString(), { encoding: 'utf-8' });

  // Build final web3 transaction payload and update keyshares file with payload data
  await ssvKeys.buildPayload(
    ssvKeys.getValidatorPublicKey(),
    operatorIds,
    shares,
    123456789,
  );
  await fsp.writeFile(getKeySharesFilePath(4), ssvKeys.keySharesInstance.toString(), { encoding: 'utf-8' });

  // Build payload with a new ssv amount and from saved on previous steps key shares data
  const keySharesWithoutPayload = await ssvKeys.keySharesInstance.init(String(await fsp.readFile(getKeySharesFilePath(3))));
  await ssvKeys.buildPayloadFromKeyShares(keySharesWithoutPayload, 987654321);

  // Save new key shares file with new ssv amount
  await fsp.writeFile(getKeySharesFilePath(5), ssvKeys.keySharesInstance.toString(), { encoding: 'utf-8' });
  console.log('Compare key shares file contents for steps #4 and #5');
}

void main();
