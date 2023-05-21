# Release v0.0.19 - 2023-05-19

This release introduces new feature to generate BLS signatures with a validator's private key for improved security.

## Breaking changes

  ```code
  import { SSVKeys, KeyShares } from 'ssv-keys';

  const ssvKeys = new SSVKeys();
  const keyShares = new KeyShares();

  const { privateKey, publicKey } = await ssvKeys.extractKeys(keystore, keystorePassword);

  ...
  const payload = keyShares.buildPayload({
    publicKey,
    operators,
    encryptedShares
  }, {
    ownerAddress: ...validator owner address...,
    ownerNonce: ...nonce of the owner...,
    privateKey
  });

  await keyShares.validateSingleShares(payload.shares, {
    ownerAddress: ...validator owner address...,
    ownerNonce: ...nonce of the owner...,
    publicKey,
  });
  ```

