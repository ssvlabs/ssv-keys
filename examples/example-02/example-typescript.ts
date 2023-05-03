import * as path from 'path';
import { promises as fsp } from 'fs';
import { SSVKeys, KeyShares } from 'ssv-keys';

const keystore = require('./test.keystore.json');
const operatorPublicKeys = require('./operators.json');
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
  const ssvKeys = new SSVKeys();
  const { privateKey, publicKey } = await ssvKeys.extractKeys(keystore, keystorePassword);

  const keyShares = new KeyShares();
  // 1. Save it with version only and with no any data.
  await fsp.writeFile(getKeySharesFilePath(1), keyShares.toJson(), { encoding: 'utf-8' });

  // 2. At some point we get operator IDs and public keys and want to save them too
  const operators = operatorPublicKeys.map((publicKey: any, index: string | number) => ({
    id: operatorIds[index],
    publicKey,
  }));

  keyShares.update({ operators, publicKey });

  // 3. Save it with version only and with no any data.
  await fsp.writeFile(getKeySharesFilePath(2), keyShares.toJson(), { encoding: 'utf-8' });

  // 4. Build shares from operator IDs and public keys
  const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

  // Build final web3 transaction payload and update keyshares file with payload data
  const payload = keyShares.buildPayload({ publicKey, operators, encryptedShares });

  await fsp.writeFile(getKeySharesFilePath(3), keyShares.toJson(), { encoding: 'utf-8' });

  const shares = keyShares.buildSharesFromBytes(payload.shares, operators.length);
  console.log('Keys Shares from bytes:', shares);
}

void main();
