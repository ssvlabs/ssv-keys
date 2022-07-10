import Web3 from 'web3';
import { encode } from 'js-base64';
import { EthereumKeyStore, Encryption, Threshold } from 'ssv-keys';
import { EncryptShare } from 'ssv-keys/src/lib/Encryption/Encryption';

const keystore = require('./test.keystore.json');
const operators = require('./operators.json');
const operatorIds = require('./operatorIds.json');
const keystorePassword = 'testtest';

async function main() {
  // Step 1: read keystore from file

  const keyStore = new EthereumKeyStore(JSON.stringify(keystore));

  // Step 2: get private key from keystore using keystore password
  const privateKey = await keyStore.getPrivateKey(keystorePassword);
  console.debug('Private Key: ' + privateKey);

  // Step 3: Build shares
  const thresholdInstance = new Threshold();
  const threshold = await thresholdInstance.create(privateKey, operatorIds);
  let shares = new Encryption(operators, threshold.shares).encrypt();
  shares = shares.map((share: EncryptShare) => {
    share.operatorPublicKey = encode(share.operatorPublicKey);
    return share;
  });
  console.debug('Shares :' + JSON.stringify(shares, null, '  '));

  // Step 4: Build payload
  const web3 = new Web3();
  const operatorsPublicKeys = operators.map((operator: string) => web3.eth.abi.encodeParameter('string', encode(operator)));
  const sharePublicKeys = shares.map((share: EncryptShare) => share.publicKey);
  const shareEncrypted = shares.map((share: EncryptShare) => web3.eth.abi.encodeParameter('string', share.privateKey));

  // TODO: Get operator IDs from the contract!

  // TODO: Calculate final ssv amount in Wei according to calculation rules
  const ssvAmount = web3.utils.toBN(123456789).toString();

  return [
    threshold.validatorPublicKey,
    `[${operatorIds.join(',')}]`,
    operatorsPublicKeys,
    sharePublicKeys,
    shareEncrypted,
    ssvAmount,
  ];
}

main();
