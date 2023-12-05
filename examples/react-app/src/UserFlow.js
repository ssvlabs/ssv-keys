import React, { useCallback, useState } from "react";
import { SSVKeys, KeyShares, KeySharesItem } from 'ssv-keys';
import "./index.css";
import "./App.css";
import Dropzone from "./Dropzone";
import Spinner from "./Spinner";

// Operators and their IDs dummy data
const operatorKeys = require('./operators.json');
const operatorIds = require('./operatorIds.json');

const STEPS = {
  START: 0,
  ENTER_PASSWORD: 1,
  DECRYPT_KEYSTORE: 2,
  ENCRYPT_SHARES: 3,
  FINISH: 4,
}

function UserFlow() {
  // Initialize SSVKeys SDK
  const ssvKeys = new SSVKeys();
  const keyShares = new KeyShares();
  const keySharesItem = new KeySharesItem();

  // States
  const [step, setStep] = useState(STEPS.START);
  const [password, setPassword] = useState('');
  const [keySharesData, setKeyShares] = useState([]);
  const [finalPayload, setFinalPayload] = useState('');
  const [keystoreFile, setKeystoreFile] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        setKeystoreFile(e.target.result);
        setStep(STEPS.ENTER_PASSWORD);
      };
      reader.readAsText(file)
      return file;
    });
  }, []);

  const startProcess = async () => {
    setStep(STEPS.DECRYPT_KEYSTORE);
    const { publicKey, privateKey } = await ssvKeys.extractKeys(keystoreFile, password)
      .then((result) => {
        setStep(STEPS.ENCRYPT_SHARES);
        console.log('Private key ready');
        return result;
      }).catch((e) => {
        alert(e.message);
        setStep(STEPS.ENTER_PASSWORD);
        return;
      });

    const operators = operatorKeys.map((operator, index) => ({
      id: operatorIds[index],
      operatorKey: operator,
    }));

    const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

    // The nonce of the owner within the SSV contract (increments after each validator registration), obtained using the ssv-scanner tool
    const TEST_OWNER_NONCE = 1;
    // The cluster owner address
    const TEST_OWNER_ADDRESS = '0x81592c3de184a3e2c0dcb5a261bc107bfa91f494';

    // Build final web3 transaction payload and update keyshares file with payload data
    const payload = await keySharesItem.buildPayload({
      publicKey,
      operators,
      encryptedShares,
    }, {
      ownerAddress: TEST_OWNER_ADDRESS,
      ownerNonce: TEST_OWNER_NONCE,
      privateKey
    });

    setFinalPayload(JSON.stringify(payload));
    console.log('Payload ready');

    // Keyshares
    keySharesItem.update({
      ownerAddress: TEST_OWNER_ADDRESS,
      ownerNonce: TEST_OWNER_NONCE,
      operators,
      publicKey
    });

    keyShares.add(keySharesItem);

    setKeyShares(keyShares.toJson());
    console.log('KeyShares ready');
    setStep(STEPS.FINISH);
  };

  const downloadKeyShares = () => {
    const blob = new Blob([keyShares], { type: 'application/json;charset=utf-8;' });
    const filename = 'KeyShares.json';
    if (navigator.msSaveBlob) { // In case of IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  switch (step) {
    default:
    case STEPS.START:
      return (
        <div id={`${STEPS.START}`}>
          <h3>Select keystore file</h3>
          <h5>You can select <code>test.keystore.json</code> file in the root of this project. Password: <code>testtest</code></h5>
          <Dropzone onDrop={onDrop} accept={"application/json"} />
        </div>
      );
    case STEPS.ENTER_PASSWORD:
      return (
        <div id={`${STEPS.ENTER_PASSWORD}`}>
          <h3>Enter keystore password</h3>
          <input type="password" onChange={(event) => { setPassword(event.target.value); }} className="input" />
          <br />
          <button type="button" onClick={startProcess} className="btn">
            Decrypt Keystore File
          </button>
        </div>
      );
    case STEPS.DECRYPT_KEYSTORE:
      return (
        <div id={`${STEPS.DECRYPT_KEYSTORE}`}>
          <h3>Decrypting keystore with your password..</h3>
          <Spinner />
        </div>
      );
    case STEPS.ENCRYPT_SHARES:
      return (
        <div id={`${STEPS.ENCRYPT_SHARES}`}>
          <h3>Encrypting Shares..</h3>
          <Spinner />
        </div>
      );
    case STEPS.FINISH:
      return (
        <div id={`${STEPS.FINISH}`}>
          <h3>Results</h3>
          <h4>Dummy operators data:</h4>
          <table style={{ textAlign: 'left' }}>
            <tr>
              <th>ID</th>
              <th>Public Key</th>
            </tr>
            {operatorKeys.map((operator, index) => {
              return (
                <tr>
                  <td>{operatorIds[index]}</td>
                  <td>{operator}</td>
                </tr>
              );
            })}
          </table>
          <h4>Web3 Raw Payload</h4>
          <textarea rows={10} style={{ width: '100%' }} value={finalPayload} />
          <h4>KeyShares File Contents</h4>
          <textarea rows={10} style={{ width: '100%' }} value={keySharesData} />
          <br />
          <br />
          <button type="button" onClick={downloadKeyShares} disabled={!keySharesData} className="btn">
            Download Keyshares File
          </button>
        </div>
      );
  }
}

export default UserFlow;
