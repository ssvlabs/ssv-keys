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

  // Step 3: Build final web3 transaction payload
  const payload = await ssvKeys.buildPayload(
    threshold.validatorPublicKey,
    operatorIds,
    shares,
    123456789,
  );

  // Step 4. Build keyshares file raw data
  const operatorsData: any = [];
  operators.map((operator: any, index: string | number) => {
    operatorsData.push({
      id: operatorIds[index],
      publicKey: operator,
    })
  });

  const keySharesData = {
    version: 'v2',
    data: {
      publicKey: threshold.validatorPublicKey,
      operators: operatorsData,
      shares: {
        publicKeys: shares.map((share: { publicKey: any; }) => share.publicKey),
        encryptedKeys: shares.map((share: { privateKey: any; }) => share.privateKey),
      },
    },
    payload: {
      explained: {
        validatorPublicKey: payload[0],
        operatorIds: payload[1],
        sharePublicKeys: payload[2],
        sharePrivateKey: payload[3],
        ssvAmount: payload[4],
      },
      raw: payload.join(','),
    },
  };

  // Step 5: Build keyshares file from raw data (should validate data automatically)
  const keySharesFile = await KeyShares.fromData(keySharesData);
  const keySharesFilePath = path.join(process.cwd(), 'data');

  // Step 6: Save validated keyshares into file
  await fsp.writeFile(keySharesFilePath, keySharesFile.toString(), { encoding: 'utf-8' });

  console.debug('Keyshares file saved to: ', keySharesFilePath);
}

void main();
