import React, { useCallback, useState } from "react";
import { SSVKeys } from 'ssv-keys';
import "./index.css";
import "./App.css";
import Dropzone from "./Dropzone";

// Operators and their IDs dummy data
const operators = require('./operators.json');
const operatorIds = require('./operatorIds.json');

function App() {
  const STEP_START = 0;
  const STEP_ENTER_PASSWORD = 1;
  const STEP_ENCRYPT_SHARES = 2;
  const STEP_FINISH = 3;
  const [step, setStep] = useState(STEP_START);
  const [password, setPassword] = useState('');
  const [keystoreFile, setKeystoreFile] = useState('');

  /**
   * @type {(function(*): void)|*}
   */
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        setKeystoreFile(e.target.result);
        setStep(STEP_ENTER_PASSWORD);
      };
      reader.readAsText(file)
      return file;
    });
  }, []);

  /**
   * @return {Promise<void>}
   */
  const decryptKeystore = async () => {
    // Initialize SSVKeys SDK
    const ssvKeys = new SSVKeys();
    console.log('keystoreFile:', keystoreFile);
    const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(String(keystoreFile), password);
    console.log('privateKey:', privateKey);
    console.log('password:', password);
    //
    // // Build shares from operator IDs and public keys
    // const shares = await ssvKeys.buildShares(privateKey, operatorIds, operators);
    // console.log('private key:', privateKey);
    // console.log('shares:', shares);
  };
  return (
    <main className="App">
      <h1 className="text-center">SSV Keys React Example</h1>
      {step === STEP_START ? (
        <>
          <h3>Select keystore file</h3>
          <Dropzone onDrop={onDrop} accept={"application/json"} />
          <br />
          <hr />
          <h3>Dummy operators data:</h3>
          <div style={{ textAlign: 'left' }}>
            {operators.map((operator, index) => {
              return (
                <div>ID: {operatorIds[index]}. PublicKey: {operator}</div>
              );
            })}
          </div>
        </>
      ) : ''}
      {step === STEP_ENTER_PASSWORD ? (
        <>
          <h3>Enter keystore password</h3>
          <input type="password" onChange={(event) => { setPassword(event.target.value); }} className="input" />
          <br />
          <button type="button" onClick={decryptKeystore} className="btn">
            Decrypt Keystore
          </button>
        </>
      ) : ''}
    </main>
  );
}
export default App;
