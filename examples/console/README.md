## Example for building shares and final payload from raw data

### Steps:

#### Step 1: Read operators data and keystore file

```javascript
import { ISharesKeyPairs, SSVKeys } from 'ssv-keys';

const keystore = require('./test.keystore.json');
const operatorKeys = require('./operators.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

const operators = operatorKeys.map((operatorKey, index) => ({
  id: operatorIds[index],
  operatorKey,
}));
```

#### Step 2: Get private key from keystore file

```javascript
const ssvKeys = new SSVKeys();
const { publicKey, privateKey } = await ssvKeys.extractKeys(keystore, keystorePassword);
```

#### Step 3: Build shares from operator IDs and public keys

```javascript
const operators: [] = [{ publicKey, id }];
const threshold: ISharesKeyPairs = await ssvKeys.createThreshold(privateKey, operators);
const shares = await ssvKeys.encryptShares(operators, threshold.shares);
```

#### Step 4: Build final web3 transaction payload

```javascript
const payload = await ssvKeys.buildPayload({
  publicKey,
  operators,
  shares
}, {
  ownerAddress: TEST_OWNER_ADDRESS,
  ownerNonce: TEST_OWNER_NONCE,
  privateKey
});
console.log(payload);
```
