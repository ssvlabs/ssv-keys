# SSV Keys

![GitHub](https://img.shields.io/github/license/ssvlabs/ssv-keys)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ssvlabs/ssv-keys/Lint%20and%20test)
![GitHub package.json version](https://img.shields.io/github/package-json/v/ssvlabs/ssv-keys)

![GitHub commit activity](https://img.shields.io/github/commit-activity/y/ssvlabs/ssv-keys)
![GitHub contributors](https://img.shields.io/github/contributors/ssvlabs/ssv-keys)
![GitHub last commit](https://img.shields.io/github/last-commit/ssvlabs/ssv-keys)

![GitHub package.json dynamic](https://img.shields.io/github/package-json/keywords/ssvlabs/ssv-keys)
![GitHub package.json dynamic](https://img.shields.io/github/package-json/author/ssvlabs/ssv-keys)

![Discord](https://img.shields.io/discord/723834989506068561?style=for-the-badge&label=Ask%20for%20support&logo=discord&logoColor=white)

Important dependencies:

* ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/ssvlabs/ssv-keys/bls-eth-wasm?style=social)
* ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/ssvlabs/ssv-keys/bls-signatures?style=social)
* ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/ssvlabs/ssv-keys/eth2-keystore-js?style=social)
* ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/ssvlabs/ssv-keys/ethereumjs-util?style=social)
* ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/ssvlabs/ssv-keys/ethereumjs-wallet?style=social)

---

Library and CLI to work with the ETH keystore file and extract latest validator cluster snapshot to build the payload:
1. Parse the private key using the keystore password
2. Use the private key to get shares for operators
3. Build the payload for the transaction

## Option 1: Running an Executable (Recommended route)

If you want to run a compiled version (easier option then CLI)

1. Go to the releases section: https://github.com/ssvlabs/ssv-keys/releases
2. Select the latest release for the specific version of the CLI: `vX.Y.Z-v1` - for the first version of the contract, `vX.Y.Z-v2` - for second etc.
   Example: `v0.0.1-v1` or `v0.0.1-v2`.
3. Download the native executable for your operating system:
   * `ssv-keys-lin` - for Ubuntu Linux
   * `ssv-keys-mac` - for MacOS
   * `ssv-keys.exe` - for Windows
4. Open terminal and change the directory to where you downloaded the executable. For instance, on MacOS you can:
   ```bash
   cd ~/Downloads
   ```
5. (Mac and Linux) Make sure that the executable has permissions to run by running:
   ```bash
   chmod 777 ./ssv-keys-mac
   ```
6. Now you can run it:
   ```bash
   ./ssv-keys-mac
   ```
7. If your operating system prevents you from running the executable you can open it from the file manager (Finder in case of MacOS), right click on it, and click the `Open` menu. Once open click the `Open` or `allow` button when you are asked to do so. After this go back to the console and try to run it again.

## Option 2: Running from the CLI

### Installation

This installation requires NodeJS on your machine.
You can download it [here](https://nodejs.org/en/download/).

Once you have installed NodeJS, follow instructions:

```bash
git clone https://github.com/ssvlabs/ssv-keys.git
cd ssv-keys
npm install -g yarn
yarn install
yarn cli --help
```

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

To run you will use the "shares" command

**Input parameters:**
- keystore (ks) = The path to either a validator keystore file or a folder that contains multiple validator keystore files. If a folder is provided, it will split in bulk all the keystore files within it according to the additional arguments provided
- password (ps) = The keystore file encryption password, if a folder was provided the password will be used for all keystore files in the folder
- operator-ids (oids) = Comma-separated list of operator IDs. The amount must be 3f+1 compatible
- operator-keys (oks) = Comma-separated list of operator keys (same sequence as operator ids). The amount must be 3f+1 compatible
- output-folder (of) = Target folder path to output the key shares file
- owner-address (oa) = The cluster owner address (in the SSV contract)
- owner-nonce (on) = The validator registration nonce of the account (owner address) within the SSV contract (increments after each validator registration), obtained using the ssv-scanner tool

```bash
# single file
yarn cli shares --keystore=keystore.json --password=test --operator-ids=1,2,3,4 --operator-keys=LS..,LS..,LS..,LS.. --output-folder=./ --owner-address=... --owner-nonce=..

# folder with multiple keystore files
yarn cli shares --keystore=./keystore-files --password=test --operator-ids=1,2,3,4 --operator-keys=LS..,LS..,LS..,LS.. --output-folder=./ --owner-address=... --owner-nonce=..
```

**Output:**  Name will start with keyshares-timestamp.json

## Option 3: Integration in your projects

### Node Project

To run an example of a NodeJS project containing all the code snippets to build the share and transaction payload, simply follow these instructions!

```bash
cd examples/console
yarn install
```

To run a JavaScript example:

```bash
# example 1
yarn start:basic:js
# example 2
yarn start:complex:js
```

To run a TypeScript example:

```bash
yarn start:ts
```

### Browser project (web application)

Go to the example folder and then install all the dependencies:

```bash
cd examples/react-app
yarn install
```

Start the web app:

```bash
yarn start
```

Open the developer console to see how it works in a browser environment.

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

## License

The ssv-api is licensed under the
[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html),
also included in our repository in the `LICENSE` file.
