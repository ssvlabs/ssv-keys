let index: any;

try {
  window.crypto;
  index = require('bls-eth-wasm/browser');
} catch {
  index = require('bls-eth-wasm');
}

let crypto;
try {
  crypto = require('crypto');
  globalThis.crypto = crypto;
} catch (err) {
  console.log('crypto support is disabled!');
}

export default index;
