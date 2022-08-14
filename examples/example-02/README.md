## Example 02

Example for building shares and final payload from raw data and saving keyshares file.
Also read saved keshares file and validate its contents.
There is plenty of different possible scenarios for solo staker, staking provider and web developer.

Some examples:

### Scenario #1
1. Generate keyshares file with operators data in web app
2. Use keyshares file offline to generate encrypted shares using your keystore file and build final payload
3. Use final keyshares file with final payload data to make actual web3 transaction

### Scenario #2
1. Generate keyshares file with operators data in web app
2. Use keyshares file offline to generate encrypted shares using your keystore file
3. Build final payload in web app and send it to web3

### Scenario #3
1. Build keyshares structure with operators data and encrypted shares (or without it)
2. Save keyshares contents in your database
3. When necessary - use keyshares content to build final payload for web3

### Steps:

#### Step 1: Read operators data and keystore file

```javascript
import * as path from 'path';
import { promises as fsp } from 'fs';
import { SSVKeys, KeyShares } from 'ssv-keys';

const operators = require('./operators.json');
const keystore = require('./test.keystore.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';
```

#### Step 2: Get private key from keystore file

```javascript
const ssvKeys = new SSVKeys();
const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(keystore, keystorePassword);
```

#### Step 3: Build shares from operator IDs and public keys

```javascript
const threshold: ISharesKeyPairs = await ssvKeys.createThreshold(privateKey, operatorIds);
const shares = await ssvKeys.encryptShares(operators, threshold.shares);
```

#### Step 4: Build final web3 transaction payload

```javascript
const payload = await ssvKeys.buildPayload(
  threshold.validatorPublicKey,
  operatorIds,
  shares,
  123456789,
);
```

#### Step 5. Build keyshares file raw data

```javascript
const keySharesData = {
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
```

#### Step 6: Build keyshares file from raw data (should validate data automatically)

```javascript
const keySharesFile = await KeyShares.fromData(keySharesData);
const keySharesFilePath = path.join(process.cwd(), 'data');
```

#### Step 7: Save validated keyshares into file

```javascript
const filePath = `${keySharesFilePath}${path.sep}keyshares.json`;
await fsp.writeFile(filePath, keySharesFile.toString(), { encoding: 'utf-8' });
```
