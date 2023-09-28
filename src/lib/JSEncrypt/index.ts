let index: any;

try {
  window.crypto;
  index = require('jsencrypt').JSEncrypt || require('jsencrypt');
} catch {
  index = require('./jsencrypt.bundle');
}

export default index;
