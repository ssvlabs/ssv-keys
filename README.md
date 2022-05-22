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

Library and CLI to work with ETH keystore file, decrypt private key from it using password,
use that private key to get shares for operators and to build final payload for transaction
to use it in SSV Network.

## Installation

If you want to test it as developer:

```bash
git clone https://github.com/bloxapp/ssv-keys.git
cd ssv-keys
yarn install
yarn cli --help
```

If you want to use it as part of your project:

```bash
yarn add https://github.com/bloxapp/ssv-keys.git
```

## Running CLI

For regular CLI usage you will be running command as: `yarn cli ...`.
Under the hood it will use `ts-node` to run TypeScript files.

### Help

Help about available actions:

```bash
yarn cli --help
```

Help about specific action:

```bash
yarn cli <action> --help
```

Follow instructions in help of how to get private key,
how to generate shares and dump everything into the file
and then use dumped data to build final transaction and
transaction V2.


### Example

#### Step 1: Getting private key

```bash
yarn cli decrypt --keystore=src/lib/EthereumKeyStore/__tests__/test.keystore.json --password=testtest
```

#### Step 2: Building shares for validators

```bash
yarn cli shares --private-key=... -op=...,...,...,... --output=./shares.json
```

#### Step 3: Building final transaction

```bash
yarn cli transaction --private-key=... --shares=./shares.json --output=./payload.txt
```

#### Step 4: Building final transaction V2

```bash
yarn cli transaction_v2 --operators-ids=1,2,3,4 --private-key=... --token-amount-gwei=1234567890 --shares=./shares.json --output=./payload_v2.txt
```

## Development

### Run CLI as TypeScript executable

```bash
yarn cli ...
```

### Run CLI as JavaScript compiled executable

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

### Install dependency

```bash
yarn add https://github.com/bloxapp/ssv-keys.git
```

## TODO

* Make it possible to use specific number of signers and fails in shares generation, use four by default.
  Read: [From Crash to Byzantine Consensus with 2f + 1 Processes](https://www.gsd.inesc-id.pt/~mpc/pubs/bc2f+1.pdf)

## Authors

* [Dmitri Meshin](https://github.com/meshin-blox)
* [Guy Muroch](https://github.com/guym-blox)

## License

MIT License
