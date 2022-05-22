let index: any;

try {
  window.crypto;
  index = require('jsencrypt');
} catch {
  index = require('node-jsencrypt');
}

export default index;
