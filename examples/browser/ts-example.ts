import Web3 from 'web3';
import { encode } from 'js-base64';
import { EthereumKeyStore, Encryption, Threshold } from 'ssv-keys';
import { EncryptShare } from 'ssv-keys/src/lib/Encryption/Encryption';

const keystore = require('./test.keystore.json');
const operators = require('./operators.json');
const keystorePassword = 'testtest';

async function main() {
  // Decrypt private key
  const keyStore = new EthereumKeyStore(JSON.stringify(keystore));
  const privateKey = await keyStore.getPrivateKey(keystorePassword);
  console.debug('Private Key: ' + privateKey);

  // Build shares
  const thresholdInstance = new Threshold();
  const threshold = await thresholdInstance.create(privateKey);
  const shares = new Encryption(operators, threshold.shares).encrypt();
  console.debug('Shares :' + JSON.stringify(shares, null, '  '));

  // Build payload
  const web3 = new Web3();
  const operatorsPublicKeys = operators.map((operator: string) => web3.eth.abi.encodeParameter('string', encode(operator)));
  const sharePublicKeys = shares.map((share: EncryptShare) => share.publicKey);
  const sharePrivateKeys = shares.map((share: EncryptShare) => web3.eth.abi.encodeParameter('string', share.privateKey));
  console.debug('Web3 Transaction: ', [
    threshold.validatorPublicKey,
    operatorsPublicKeys,
    sharePublicKeys,
    sharePrivateKeys,
  ]);
}

main();
