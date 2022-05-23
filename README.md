# SSV Keys

![GitHub](https://img.shields.io/github/license/bloxapp/ssv-keys)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/bloxapp/ssv-keys/Lint%20and%20test)
![GitHub package.json version](https://img.shields.io/github/package-json/v/bloxapp/ssv-keys)

![GitHub commit activity](https://img.shields.io/github/commit-activity/y/bloxapp/ssv-keys)
![GitHub contributors](https://img.shields.io/github/contributors/bloxapp/ssv-keys)
![GitHub last commit](https://img.shields.io/github/last-commit/bloxapp/ssv-keys)

![GitHub package.json dynamic](https://img.shields.io/github/package-json/keywords/bloxapp/ssv-keys)
![GitHub package.json dynamic](https://img.shields.io/github/package-json/author/bloxapp/ssv-keys)

![Discord](https://img.shields.io/discord/723834989506068561?style=for-the-badge&label=Ask%20for%20support&logo=discord&logoColor=white)

Important dependencies:

* ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/bloxapp/ssv-keys/web3?style=social)
* ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/bloxapp/ssv-keys/bls-eth-wasm?style=social)
* ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/bloxapp/ssv-keys/bls-signatures?style=social)
* ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/bloxapp/ssv-keys/eth2-keystore-js?style=social)
* ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/bloxapp/ssv-keys/ethereumjs-util?style=social)
* ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/bloxapp/ssv-keys/ethereumjs-wallet?style=social)

---

Library and CLI to work with the ETH keystore file:
1. Parse the private key using the keystore password,
2. Use the private key to get shares for operators 
3. Build the payload for the transaction


## Installation

Developer use:

```bash
git clone https://github.com/bloxapp/ssv-keys.git
cd ssv-keys
yarn install
yarn cli --help
```

Use in your project:

```bash
yarn add https://github.com/bloxapp/ssv-keys.git
```

## Running the CLI

- For regular CLI usage you will be running the command as: `yarn cli ...`
- Under the hood it will use `ts-node` to run the relevant TypeScript files.

### Help

Help on available actions:

```bash
yarn cli --help
```

Help on a specific action:

```bash
yarn cli <action> --help
```


### Example

#### Step 1: Fetch the private key:
**Input parameters:**
keystore = path to keystore jSON file
password = keystore password
```bash
yarn cli decrypt --keystore=src/lib/EthereumKeyStore/__tests__/test.keystore.json --password=testtest
```
**Output:**  private key

#### Step 2: Building the shares for the validator:
**Input parameters:**
private-key = private key output from step 1
op = 4 public operator keys (comma seperated)
Output = shares json file location
```bash
yarn cli shares --private-key=... -op=...,...,...,... --output=./shares.json
```
**Output:** shares json

#### Step 3: Build and ouput the transaction payload:
**Input parameters:**
private-key = private key output from step 1
shares = path to shares json file
ouput = transaction payload text file location
```bash
yarn cli transaction --private-key=... --shares=./shares.json --output=./payload.txt
```
**Output:**  Transaction payload

## Development

### Run the CLI as a TypeScript executable:

```bash
yarn dev:cli ...
```

### Run the CLI as a JavaScript compiled executable:

```bash
yarn cli ...
```

### Lint

```bash
yarn lint
```

### Testing

```bash
yarn test
```

In watch mode during development

```bash
yarn test --watchAll
```

### Building

Build TypeScript into JavaScript

```bash
yarn build
```

Build for NodeJs using `esbuild`

```bash
yarn esbuild
```

Build everything

```bash
yarn build-all
```

## Integration in your projects

### Node Project

To run an example of a NodeJS project containing all code snippets to get private key, build share and final transaction, simply follow these instructions!

```bash
cd examples/node
yarn install
```

To run a JavaScript example:

```bash
yarn start:js
```

To run a TypeScript example:

```bash
yarn start:ts
```

### Browser project (web application)

Go to the example folder and then install all the dependencies:

```bash
cd examples/browser
yarn install
```

Start the web app:

```bash
yarn start
```

Open the developer console to see how it works in a browser environment.

## TODO

* Make it possible to use a specific number of signers (Currently with a default of 4).
  Read: [From Crash to Byzantine Consensus with 2f + 1 Processes](https://www.gsd.inesc-id.pt/~mpc/pubs/bc2f+1.pdf)

## Authors

* [Dmitri Meshin](https://github.com/meshin-blox)
* [Guy Muroch](https://github.com/guym-blox)

## License

MIT License
