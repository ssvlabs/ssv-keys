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

This installation requires NodeJS on your machine.
You can download it [here](https://nodejs.org/en/download/).

Once you have installed NodeJS, follow instructions:

```bash
git clone https://github.com/bloxapp/ssv-keys.git
cd ssv-keys
install yarn
yarn install
yarn cli --help
```

Use in your project:

```bash
yarn add https://github.com/bloxapp/ssv-keys.git
```

## Running the CLI

### Running from repository

- For regular CLI usage you will be running the command as: `yarn cli ...`
- Follow [installation](#Installation) instructions.

### Running from releases

If you want to run compiled native variant of CLI for your operating system.

1. Go to releases section: https://github.com/bloxapp/ssv-keys/releases
2. Select latest release for specific version of CLI: `vX.Y.Z-v1` - for the first version of the contract, `vX.Y.Z-v2` - for second etc.
   Example: `v0.0.1-v1` or `v0.0.1-v2`.
3. Download native executable for your operating system:
   * `ssv-keys-lin` - for Ubuntu Linux
   * `ssv-keys-mac` - for MacOS
   * `ssv-keys.exe` - for Windows
4. Open terminal and change directory to where you downloaded executable. For instance, on MacOS you can:
   ```bash
   cd ~/Downloads
   ```
5. Make sure that executable can be run:
   ```bash
   chmod 777 ./ssv-keys-mac
   ```
6. Now you can run it:
   ```bash
   ./ssv-keys-mac
   ```
7. If operating system prevents you from running executable and you still want to do it, open it from
   standard file manager (Finder in case of MacOS), right click on it, and use `Open` menu. Then click `Open` button
   when will be asked in a prompt. Go back to console and try to run it again.

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

- keystore = path to keystore json file
- password = keystore password

```bash
yarn cli decrypt --keystore=src/lib/EthereumKeyStore/__tests__/test.keystore.json --password=testtest
```

**Output:**  private key

#### Step 2: Building the shares for the validator:

**Input parameters:**

- private-key = private key output from step 1
- op = 4 public operator keys (comma seperated)
- Output = shares json file location
-
```bash
yarn cli shares --private-key=... -op=...,...,...,... --output=./shares.json
```

**Output:** shares json

#### Step 3: Build and ouput the transaction payload:
**Input parameters:**
- operators-ids = 4 comma seperated operator ids (should match 4 the operators used in step 2)
- private-key = private key output from step 1
- token-amount = yearly fee in wei
- shares = path to shares json file
- output = transaction payload text file location

```bash
yarn cli transaction --operators-ids=1,2,3,4 --private-key=... --token-amount=1234567890 --shares=./shares.json --output=./payload.txt
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

To run an example of a NodeJS project containing all the code snippets to get a private key, build the share and transaction payload, simply follow these instructions!

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
