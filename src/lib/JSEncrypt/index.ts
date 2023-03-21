let index: any;

try {
  window.crypto;
  index = require('jsencrypt').JSEncrypt;
} catch {
  index = require('./jsencrypt.bundle');
}

export default index;
