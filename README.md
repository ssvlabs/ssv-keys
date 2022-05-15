# SSV Keys

[![Build and test status](https://github.com/metachris/typescript-boilerplate/workflows/Lint%20and%20test/badge.svg)](https://github.com/metachris/typescript-boilerplate/actions?query=workflow%3A%22Build+and+test%22)

Library and CLI to work with ETH keystore file, decrypt private key from it using password,
use that private key to get shares for operators and to build final payload for transaction
to use it in SSV Network.

* [Installation](docs/install.md)
* [Running CLI](docs/cli.md)
* [Using in your projects](docs/library.md)
* [Code Architecture](docs/arch.md)
* [Development](docs/dev.md)

## Todo

* Make it possible to use specific number of signers and fails in shares generation, use four by default.
  Read: [From Crash to Byzantine Consensus with 2f + 1 Processes](https://www.gsd.inesc-id.pt/~mpc/pubs/bc2f+1.pdf)

## Authors

* [Dmitri Meshin](https://github.com/meshin-blox)
* [Guy Muroch](https://github.com/guym-blox)

## License

MIT License
