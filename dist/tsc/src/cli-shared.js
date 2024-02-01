"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const figlet_1 = tslib_1.__importDefault(require("figlet"));
const safe_1 = tslib_1.__importDefault(require("colors/safe"));
const package_json_1 = tslib_1.__importDefault(require("../package.json"));
const SSVKeysCommand_1 = require("./commands/SSVKeysCommand");
const FigletMessage = async (message) => {
    return new Promise(resolve => {
        (0, figlet_1.default)(message, (error, output) => {
            if (error) {
                return resolve('');
            }
            resolve(output);
        });
    });
};
async function main(interactive) {
    const messageText = `SSV Keys v${package_json_1.default.version}`;
    const message = await FigletMessage(messageText);
    if (message) {
        console.log(' ----------------------------------------------------------------------');
        console.log(`${message || messageText}`);
        console.log(' ----------------------------------------------------------------------');
        for (const str of String(package_json_1.default.description).match(/.{1,67}/g) || []) {
            console.log(` ${str}`);
        }
        console.log(' ----------------------------------------------------------------------\n');
    }
    const command = new SSVKeysCommand_1.SSVKeysCommand(interactive);
    try {
        const outputFile = await command.execute();
        console.debug('\nKey distribution successful! Find your key shares file at:');
        console.debug(`${safe_1.default.bgYellow(safe_1.default.black(outputFile))}`);
    }
    catch (error) {
        console.error(`${safe_1.default.red('Error:')} ${safe_1.default.bold(error.message)}`);
    }
}
exports.default = main;
//# sourceMappingURL=cli-shared.js.map