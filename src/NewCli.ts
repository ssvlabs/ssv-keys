// import yargs, { Arguments } from 'yargs';
// import { hideBin } from 'yargs/helpers';
//
// // Import argument definitions
// import { keystoreArgument, operatorIdsArgument, operatorPublicKeysArgument, keystorePasswordArgument, ownerNonceArgument, ownerAddressArgument, outputFolderArgument } from './commands/actions/arguments';
//
// export class Cli {
//   private argv: Arguments;
//
//   constructor() {
//     this.argv = yargs(hideBin(process.argv))
//       .usage('Usage: cli [options]')
//       .options({
//         ...this.toYargsOption(keystoreArgument),
//         ...this.toYargsOption(keystorePasswordArgument),
//         ...this.toYargsOption(operatorIdsArgument),
//         ...this.toYargsOption(operatorPublicKeysArgument),
//         ...this.toYargsOption(outputFolderArgument),
//         ...this.toYargsOption(ownerAddressArgument),
//         ...this.toYargsOption(ownerNonceArgument),
//       })
//       .help('h')
//       .alias('h', 'help')
//       .epilog('To get more detailed help: "<action> --help". Example: "pnpm cli --help"')
//       .strict()
//       .parseSync();
//
//     this.executeInOrder();
//   }
//
//   private toYargsOption(argDef: any) {
//     const key = argDef.arg2.replace(/^--/, '');
//     return {
//       [key]: {
//         type: argDef.options.type,
//         describe: argDef.options.help,
//         demandOption: argDef.options.required,
//         default: argDef.options.default,
//       }
//     };
//   }
//
//   getArgs(): Arguments {
//     return this.argv;
//   }
//
//   async executeInOrder(): Promise<void> {
//     const order = [
//       '--keystore',
//       '--password',
//       '--operator-ids',
//       '--operator-keys',
//       '--output-folder',
//       '--owner-address',
//       '--owner-nonce'
//     ];
//
//     for (const argKey of order) {
//       console.log(order)
//       const normalizedKey = argKey.replace(/^--/, '').replace(/-/g, '_');
//       const value = this.argv[normalizedKey];
//       console.log(`${argKey}:`, value);
//       // You can replace this with actual logic to process each argument
//     }
//   }
// }
//
// // new Cli();
