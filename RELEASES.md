# Release v0.0.18 - 2023-05-07

This release introduces some significant SDK changes, including a few breaking changes. Please review the notes below and update your code accordingly.

## Breaking Changes

### SSVKeys, KeyShares
- Removed multi-version support.

  Old version:
  ```code
  const ssvKeys = new SSVKeys(SSVKeys.VERSION.V3);
  ```

  New format:
  ```code
  import { SSVKeys, KeyShares } from 'ssv-keys';

  const ssvKeys = new SSVKeys();
  const keyShares = new KeyShares();
  ```

- Replaced `operatorIds` and `operatorKeys` with a single array of objects:

  ```code
  const operators = [{ id, publicKey },...];
  ```

- Replaced `getPrivateKeyFromKeystoreData` method by `extractKeys` which returns validator privateKey and publicKey.

  ```code
  const { privateKey, publicKey } = await ssvKeys.extractKeys(keystore, keystorePassword);
  ```

- Replaced `ssvKeys.keyShares.setData` to `keyShares.update`

  Old version:
  ```code
  await ssvKeys.keyShares.setData({ operators });
  ````

  New format:
  ```code
  const keyShares = new KeyShares();
  keyShares.update({ operators, publicKey });
  ```

- Changed `buildShares` function params:

  Old version:
  ```code
  const encryptedShares = await ssvKeys.buildShares(privateKey, operatorIds, operators);
  ```

  New format:
  ```code
  const encryptedShares = await ssvKeys.buildShares(privateKey, operators);
  ```

- Changed `buildPayload` interface and params:

  Old version:
  ```code
  const payload = await ssvKeys.buildPayload({ publicKey, operatorIds, encryptedShares });
  ```

  New format:
  ```code
  const payload = keyShares.buildPayload({ publicKey, operators, encryptedShares });
  ```

- Added `buildSharesFromBytes` to extract shares from a single string:

  ```code
  const shares = keyShares.buildSharesFromBytes(payload.shares, operators.length);
  ```
