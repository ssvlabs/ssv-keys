# SSV Keys

Library and CLI to work with ETH keystore file, decrypt private key from it using password,
use that private key to get shares for operators and to build final payload for transaction
to use it in SSV Network.

## Installation

If you want to test it as developer:

```bash
git clone https://github.com/bloxapp/ssv-keys.git
cd ssv-keys
yarn
yarn cli --help
```

If you want to use it as part of your project:

```bash
yarn add https://github.com/bloxapp/ssv-keys.git
```

If you want to install CLI globally in your system:

```bash
yarn add -g https://github.com/bloxapp/ssv-keys.git
ssv-keys --help
```

## Running CLI

Let's assume in all examples that you installed package globally.
In such case all examples will be with `ssv-keys ...` executable.

But if for instance you cloned all the repo with `git clone`, executable
will be `yarn cli ...` or `yarn dev:cli ...`

### Help

Help about available actions:

```bash
ssv-keys --help
```

Help about specific action:

```bash
ssv-keys <action> --help
```

Follow instructions in help of how to get private key,
how to generate shares and dump everything into the file
and then use dumped data to build final transaction and
transaction V2.


### Example

#### Step 1: Getting private key

```bash
yarn dev:cli decrypt --keystore=src/lib/EthereumKeyStore/__tests__/test.keystore.json --password=testtest
```

#### Step 2: Building shares for validators

```bash
yarn dev:cli shares --private-key=... -op=...,...,...,... --output=./shares.json
```

#### Step 3: Building final transaction

```bash
yarn dev:cli transaction --private-key=... --shares=./shares.json --output=./payload.txt
```

#### Step 4: Building final transaction V2

```bash
yarn dev:cli transaction_v2 --private-key=... --shares=./shares.json --output=./payload_v2.txt
```

## Development

### Run CLI as TypeScript executable

```bash
yarn dev:cli ...
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

## TODO

* Make it possible to use specific number of signers and fails in shares generation, use four by default.
  Read: [From Crash to Byzantine Consensus with 2f + 1 Processes](https://www.gsd.inesc-id.pt/~mpc/pubs/bc2f+1.pdf)

## Authors

* [Dmitri Meshin](https://github.com/meshin-blox)
* [Guy Muroch](https://github.com/guym-blox)

## License

MIT License
