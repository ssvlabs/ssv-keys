import figlet from 'figlet';
import colors from 'colors/safe';
import pkg from '../package.json';

import { SSVKeysCommand } from './commands/SSVKeysCommand';

const FigletMessage = async (message: string) => {
  return new Promise(resolve => {
    figlet(message, (error: any, output?: string) => {
      if (error) {
        return resolve('');
      }
      resolve(output);
    });
  })
}

export default async function main(interactive: boolean): Promise<any> {
  const messageText = `SSV Keys v${pkg.version}`;
  const message = await FigletMessage(messageText);
  if (message) {
    console.log(' ----------------------------------------------------------------------');
    console.log(`${message || messageText}`);
    console.log(' ----------------------------------------------------------------------');
    for (const str of String(pkg.description).match(/.{1,67}/g) || []) {
      console.log(` ${str}`);
    }
    console.log(' ----------------------------------------------------------------------\n');
  }
  const command = new SSVKeysCommand(interactive);
  try {
    const outputFile = await command.execute();
    console.debug('\nKey distribution successful! Find your key shares file at:');
    console.debug(`${colors.bgYellow(colors.black(outputFile))}`);
  } catch(error: any) {
    console.error(`${colors.red('Error:')} ${colors.bold(error.message)}`);
  }
}
