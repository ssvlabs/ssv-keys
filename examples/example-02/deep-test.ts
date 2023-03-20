import { SSVKeys } from '../../src/main';

const operators = require('./operators.json');
const keystore = require('./test.keystore.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

/**
 * This is more complex example demonstrating usage of SSVKeys SDK together with
 * KeyShares file which can be useful in a different flows for solo staker, staking provider or web developer.
 */
async function main() {
  // 0. Initialize SSVKeys SDK
  const ssvKeys = new SSVKeys(SSVKeys.VERSION.V3);
  const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(keystore, keystorePassword);

  let i = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.log(i, '+');
    // use ssv keys to build the payload
    const encryptedShares = await ssvKeys.buildShares(
        privateKey,
        operatorIds,
        operators,
    )
    const payload = await ssvKeys.buildPayload(
        {
            publicKey: ssvKeys.publicKey,
            operatorIds,
            encryptedShares,
        }
    );

    if (payload.readable.shares.length === 2436) {
        console.error('ERROR123', i, encryptedShares)
    } else {
      console.log(payload.readable.shares.length);
    }
    i++;
  }
}

void main();
