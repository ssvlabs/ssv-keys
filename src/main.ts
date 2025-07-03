import { SSVKeys, KeySharesItem, KeyShares, SSVKeysException, OperatorPublicKeyError, OperatorsCountsMismatchError } from '@ssv-labs/ssv-sdk';

export { SSVKeys, KeySharesItem, KeyShares, SSVKeysException, OperatorPublicKeyError, OperatorsCountsMismatchError };

// import * as KeyStoreData from './keystore.json';
//
// async function testSSVKeys() {
//   console.log('yo yo 1')
//
//   const keystoreData = JSON.stringify(KeyStoreData);
//   console.log('yo yo 2')
//
//   const ssvKeysOperators = [{id: 1, operatorKey: "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBa1BOUnUzbmN0cjROaSs5azNIMjAKYThtK0VxOTZCNlRYMHZIbVFzZXFiMEZPSGFCNUtkb1dCVDhIYWFpdUp2UWhPdnk4YlIzTXFqelpkSlg3YzRQdgowYjRaelhoVldaUW5Pb0k0a3lTeWZyczFPc2JyNXUrUzdiQ3NIODByOThPWkpNY2ZkNjBzSmNWZU1va2J2L1pKCmp1ck85b1M0OFY5V09WOGRwNm5lRXBQTU9Jc0FZdWR1MEZsV0lTSHpwVmpnWjhzS3NFc1VxandzWmJXbEF5WCsKWmxSZXh1NmtGZVdBb2YxNlI4cmYyaWNYTStOUGI0Rnc3Yi91aElYYndNa2tZWnFURWEyZHR6bURVcnpiRDhVOQpOVnhRVjQ4Z2t3Mm4zZnpkbnl4bnZUUXV1RTlUTjdFbHU0c2dNMUxHVjhlaWtwQ1owWDhFVUkvVmVGZHBXK1o1CjV3SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K"},{id: 2, operatorKey: "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdExZaDhLcVVyYWVHVzJPMzRpaEcKWVVKUW45ckVIRkhhcVpnYm1BSHdURm5tblNJN2l3L0c0MHBabkJ4b1NvVlBpL2xRSCtnRkxaMVA4anYzaDc1TgpzeGpYYkFEMCtCSmFjS3NiUGJkc2cya21PS3RBU3JHbkxZc0tzOXJSeWNrS1dYN3JFL0M4WUdqOWdlakNQR0xiClBQQS9waW1MTnQxR2J4REh4ak9BemdFN2E3SUVjSFJuemRaWlVQSDRTTHpvenh4d3hZeWhJdGIwazFpa3B0OWwKWjI3bExSNW9qb2YwVjAwQlpnVGY4dGhBaHFncGNmemtqMy85M2NoZmFRSi9mdGZuZWxxMnMzamNlVVh1Wk4xVApwWlVqelRaSHp3L1NzTFZVYitwVTg5MWY3cUh2dnVVZE1yQUV3dFdKNmVmb2J1L0ludUNxTGhZSDlQS0VsZU1QClFRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K"},{id: 3, operatorKey: "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBbTVCOVpzaHcza3NMcGFkcC9SSmkKTmx4TVMvUDlEblF1K2VIclV2S0pSM2NJWUVkOEthSGkyYTZpMHVZYWtaQURXU0lVckZYelNockx2bldWNzZnYgpPNDMxdUtsWW9MenlQOTlxcWFEbnpxdXZ4YUZTajhPSG5UZ1gvMnRFWHB6MExva2dLN2pyT1gzUG5jcUw1MTVQClRWejBmdWlWRzk1ZTRsenFsZS9YUmdKcjJrcFAvZHZjTTI1S0NGRWdhZXR5WHBNWENKdlU5d25SZGkrZmkwUVcKK3pCVm9QbjR3OXprWWpacjRVU2tGNExjVEVYQ09Wa2NuZjhSNGpHaW4ySS8va2ZjcU5JdFBiNWlGVjAzU0NiSQp6dS9lUWRpMlIyd250VzRyd0ozYTIzclJRMUo5MEhJRmpPRzZWaGJiWmZFVzYxcEcvWEExMkRORTR5OWpWb3NZCkNRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K"},{id: 4, operatorKey: "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBczBrNk5aTm1Pczk5ejZTcE92dnIKMHdtcHgwRFMyUnM0VUh2N0xtMFlZVVpNVk9EOU40b2VmUmJOb1FwM3lPRlN2UGxtZUwxR3lUdlJyWE5xUmFtegpVM3kxcSsrR3NuRTNpdGRPdW1EclB0Ny9hMGczeDQ5YkljT0hUb1lVa0NpbVpzTUQrR3BQL3ozaDhRVjR3eVQvCm9PUW9pQXRoU0hhSnBCZHdhVVNqM0dxVWlRd1JPRTNZTFlaVW9ZUUMwYTIwdlNtQ2ovd0g1cm1NL2I0bTlxL3QKRzIxUXZHZ08xRkdaK1hHQjBtY2taQ2wrL2k2MUR1YnVtZ1k5U3VGVEliLytUUHp4UTcvN2dDV1MrdWRZRUZvagppTmkwM1N6cyt2S0YwZStuQ2pKYkFjQ3dkTHBNZnVlUWNEZ1dKYUI3bmdMcUlTQW1lMmJMN0YwaXVRY1h4M0V1Ckl3SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K"}]
//
//   const ssvKeys = new SSVKeys()
//   const { publicKey, privateKey } = await ssvKeys.extractKeys(keystoreData, '123123123');
//
//   console.log('yo yo 3')
//
//   // Build shares from operator IDs and public keys
//   const threshold = await ssvKeys.createThreshold(privateKey, ssvKeysOperators);
//   const encryptedShares = await ssvKeys.encryptShares(ssvKeysOperators, threshold.shares);
//
//   console.log('yo yo 4')
//
//   // Build final web3 transaction payload and update keyshares file with payload data
//   const keySharesItem = new KeySharesItem();
//   const builtPayload = await keySharesItem.buildPayload({
//     publicKey,
//     operators: ssvKeysOperators,
//     encryptedShares,
//   }, {
//     ownerAddress: '0x91E32eFb8139cd88caE0Df30d2Bf471294c6ed27',
//     ownerNonce: 1,
//     privateKey
//   })
//   const shares = builtPayload.sharesData
//
//   console.log('yo yo 5')
//
//   console.log(shares)
//
// }
// testSSVKeys()

// npx tsx src/main.ts
