import colors from "colors/safe";
import pkg from "../package.json";

import { SSVKeysCommand } from "./commands/SSVKeysCommand";

const BannerMessage = async () => {
  const banner = `
███████╗███████╗██╗   ██╗    ██╗  ██╗███████╗██╗   ██╗███████╗
██╔════╝██╔════╝██║   ██║    ██║ ██╔╝██╔════╝╚██╗ ██╔╝██╔════╝
███████╗███████╗██║   ██║    █████╔╝ █████╗   ╚████╔╝ ███████╗
╚════██║╚════██║╚██╗ ██╔╝    ██╔═██╗ ██╔══╝    ╚██╔╝  ╚════██║
███████║███████║ ╚████╔╝     ██║  ██╗███████╗   ██║   ███████║
╚══════╝╚══════╝  ╚═══╝      ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝
                                
🗝️ SSV Keys v${pkg.version}
`;
  return banner;
};

export default async function main(interactive: boolean): Promise<any> {
  const message = await BannerMessage();
  console.log(
    " ----------------------------------------------------------------------"
  );
  console.log(message);
  for (const str of String(pkg.description).match(/.{1,67}/g) || []) {
    console.log(` ${str}`);
  }
  console.log(
    " ----------------------------------------------------------------------\n"
  );

  const command = new SSVKeysCommand(interactive);
  try {
    const output = await command.execute();
    if (typeof output === "string" && output.trim().length > 0) {
      console.debug(
        "\nKey distribution successful! Find your key shares file at:"
      );
      console.debug(`${colors.bgYellow(colors.black(output))}`);
    }
  } catch (error: any) {
    console.trace(`${colors.red("Error:")} ${colors.bold(error.message)}`);
  }
}
