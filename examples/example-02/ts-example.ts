import * as path from 'path';
import { promises as fsp } from 'fs';
import { SSVKeys, KeyShares } from 'ssv-keys';

const operators = require('./operators.json');
const keystore = require('./test.keystore.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

async function main() {
  // Step 1: read keystore file
  const ssvKeys = new SSVKeys();
  const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(keystore, keystorePassword);

  // Step 2: Build shares from operator IDs and public keys
  const threshold = await ssvKeys.createThreshold(privateKey, operatorIds);
  const shares = await ssvKeys.encryptShares(operators, threshold.shares);

  // Step 3. Build keyshares file raw data without saving final transaction payload.
  let keySharesData: any = {
    version: 'v2',
    data: {
      publicKey: threshold.validatorPublicKey,
      operators: operators.map((operator: any, index: string | number) => ({
        id: operatorIds[index],
        publicKey: operator,
      })),
      shares: {
        publicKeys: shares.map((share: { publicKey: any; }) => share.publicKey),
        encryptedKeys: shares.map((share: { privateKey: any; }) => share.privateKey),
      },
    },
  };

  // Step 4: Save keyshares file
  let keySharesFile = await KeyShares.fromData(keySharesData);
  const keySharesFilePath = `${path.join(process.cwd(), 'data')}${path.sep}keyshares.json`;
  await fsp.writeFile(keySharesFilePath, keySharesFile.toString(), { encoding: 'utf-8' });
  console.debug('Keyshares file saved to: ', keySharesFilePath);

  // Step 5: Build final web3 transaction payload and update keyshares file with payload data
  let payload = await ssvKeys.buildPayload(
    threshold.validatorPublicKey,
    operatorIds,
    shares,
    123456789,
  );
  keySharesData.payload = {
    explained: {
      validatorPublicKey: payload[0],
        operatorIds: payload[1],
        sharePublicKeys: payload[2],
        sharePrivateKey: payload[3],
        ssvAmount: payload[4],
    },
    raw: payload.join(','),
  };

  // Step 6: Save keyshares file again with payload details
  keySharesFile = await KeyShares.fromData(keySharesData);
  await fsp.writeFile(keySharesFilePath, keySharesFile.toString(), { encoding: 'utf-8' });
  console.debug('Keyshares file saved to: ', keySharesFilePath);

  // Step 7. Read saved keyshares file
  keySharesData = JSON.parse(String(await fsp.readFile(keySharesFilePath)));
  keySharesFile = await KeyShares.fromData(keySharesData);

  // Step 8. Build payload with a new ssv amount
  payload = await ssvKeys.buildPayload(
    keySharesFile.data.publicKey,
    keySharesFile.data.operatorIds,
    keySharesFile.data.shares.toEncryptShares(keySharesData.data.operatorPublicKeys),
    987654321,
  );
  keySharesFile.payload.explained = {
    ...keySharesFile.payload.explained,
    ssvAmount: payload[4],
  }
  keySharesFile.payload.raw = payload.join(',');

  // Step 9. Save keyshares file again with updated data.
  await fsp.writeFile(keySharesFilePath, keySharesFile.toString(), { encoding: 'utf-8' });
  console.debug('Keyshares file saved to: ', keySharesFilePath);
}

void main();
