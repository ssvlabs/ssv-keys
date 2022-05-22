#!/usr/bin/env node
'use strict';

const Web3 = require('web3');
const { encode } = require('js-base64');
const { EthereumKeyStore, Encryption, Threshold } = require('ssv-keys');
const keystore = require('./test.keystore.json');
const operators = require('./operators.json');
const keystorePassword = 'testtest';

async function main() {
  // Getting private key
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
  const operatorsPublicKeys = operators.map(operator => web3.eth.abi.encodeParameter('string', encode(operator)));
  const sharePublicKeys = shares.map(share => share.publicKey);
  const sharePrivateKeys = shares.map(share => web3.eth.abi.encodeParameter('string', share.privateKey));
  console.debug('Web3 Transaction: ', [
    threshold.validatorPublicKey,
    operatorsPublicKeys,
    sharePublicKeys,
    sharePrivateKeys,
  ])
}

main();
