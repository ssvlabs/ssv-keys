import EthereumKeyStore from 'eth2-keystore-js';
import { readFile } from '../../../lib/helpers/file.helper';


export class KeystorePasswordValidator {
  protected keystoreFilePath = '';

  /*
  setKeystoreFilePath(filePath: string): void {
    this.keystoreFilePath = filePath;
  }
  */

  async validatePassword(password: string, keystoreFilePath: string): Promise<boolean | string> {
    if (!password.trim().length) {
      return 'Password is empty';
    }
    const errorMessage = 'Invalid keystore file password.';
    // let messageInterval: any;
    let output: any;
    try {
      /*
      if (showProgress) {
        let dots = 1;
        const message = `\rChecking password`
        process.stdout.write('\r' + String(' ').repeat(250));
        process.stdout.write(`\r${message}`);
        messageInterval = setInterval(() => {
          const progressMessage = `\r${message}` +
            `${String('.').repeat(dots)}${String(' ').repeat(30 - dots)}`;
          process.stdout.write(progressMessage);
          dots += 1;
          if (dots > 3) {
            dots = 1;
          }
        }, 1000);
      }
      */
      const data = await readFile(keystoreFilePath);
      const keyStore = new EthereumKeyStore(data);
      const privateKey = await keyStore.getPrivateKey(password)
      output = !!privateKey;
    } catch (e) {
      output = errorMessage;
    }
    /*
    if (showProgress) {
      process.stdout.write('\n');
      clearInterval(messageInterval);
    }
    */
    return output;
  }
}

export const keystorePasswordValidator = new KeystorePasswordValidator();
