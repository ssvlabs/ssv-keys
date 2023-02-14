import * as path from 'path';
import { promises as fsp } from 'fs';
import { SSVKeys } from 'ssv-keys';

const operators = require('./operators.json');
const keystore = require('./test.keystore.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

const getKeySharesFilePath = (step: string | number) => {
  return `${path.join(process.cwd(), 'data')}${path.sep}keyshares-step-${step}.json`;
};

/**
 * This is more complex example demonstrating usage of SSVKeys SDK together with
 * KeyShares file which can be useful in a different flows for solo staker, staking provider or web developer.
 */
async function main() {
  // 0. Initialize SSVKeys SDK
  const ssvKeys = new SSVKeys(SSVKeys.VERSION.V3);
  const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(keystore, keystorePassword);
  // 1. Save it with version only and with no any data.
  await fsp.writeFile(getKeySharesFilePath(1), ssvKeys.keyShares.toJson(), { encoding: 'utf-8' });

  // 2. At some point we get operator IDs and public keys and want to save them too
  await ssvKeys.keyShares.setData({
    operators: operators.map((operator: any, index: string | number) => ({
      id: operatorIds[index],
      publicKey: operator,
    }))
  });

  // 3. Save it with version only and with no any data.
  await fsp.writeFile(getKeySharesFilePath(2), ssvKeys.keyShares.toJson(), { encoding: 'utf-8' });

  // 4. Build shares from operator IDs and public keys
  const encryptedShares = await ssvKeys.buildShares(privateKey, operatorIds, operators);

  // Now save to key shares file encrypted shares and validator public key
  await ssvKeys.keyShares.setData({
    publicKey: ssvKeys.publicKey,
    encryptedShares,
  });

  await fsp.writeFile(getKeySharesFilePath(3), ssvKeys.keyShares.toJson(), { encoding: 'utf-8' });

  // Build final web3 transaction payload and update keyshares file with payload data
  await ssvKeys.buildPayload(
    {
      publicKey: ssvKeys.publicKey,
      operatorIds,
      encryptedShares,
    }
  );
  await fsp.writeFile(getKeySharesFilePath(4), ssvKeys.keyShares.toJson(), { encoding: 'utf-8' });

  // Build payload with a new ssv amount and from saved on previous steps key shares data
  const keySharesWithoutPayload = await ssvKeys.keyShares.fromJson(String(await fsp.readFile(getKeySharesFilePath(3))));
  await ssvKeys.buildPayloadFromKeyShares(keySharesWithoutPayload);

  // Save new key shares file with new ssv amount
  await fsp.writeFile(getKeySharesFilePath(5), ssvKeys.keyShares.toJson(), { encoding: 'utf-8' });
  console.log('Compare key shares file contents for steps #4 and #5');
}

void main();
