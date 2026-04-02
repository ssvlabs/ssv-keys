#!/usr/bin/env node
import { m as main } from "./cli-shared-Bt1UsokZ.mjs";
const COMMAND_NAMES = ["shares", "nonce", "cluster", "operator"];
const HELP_FLAGS = /* @__PURE__ */ new Set(["-h", "--help"]);
const LEGACY_SHARES_FLAGS = /* @__PURE__ */ new Set([
  "-ks",
  "--keystore",
  "-ps",
  "--password",
  "-oks",
  "--operator-keys",
  "-on",
  "--owner-nonce",
  "-of",
  "--output-folder"
]);
const normalizeToken = (token) => token.split("=")[0];
const isKnownCommand = (token) => !!token && COMMAND_NAMES.includes(token);
const hasLegacySharesFlags = (userArgs) => {
  return userArgs.some((arg) => LEGACY_SHARES_FLAGS.has(normalizeToken(arg)));
};
const resolveBinaryMode = (argv) => {
  const userArgs = argv.slice(2);
  const firstToken = userArgs[0];
  if (!firstToken) {
    return { interactive: true };
  }
  if (isKnownCommand(firstToken)) {
    return { interactive: false };
  }
  if (HELP_FLAGS.has(firstToken)) {
    return { interactive: false };
  }
  if (hasLegacySharesFlags(userArgs)) {
    return {
      interactive: false,
      injectedAction: "shares"
    };
  }
  return { interactive: true };
};
const resolution = resolveBinaryMode(process.argv);
if (resolution.injectedAction) {
  process.argv.splice(2, 0, resolution.injectedAction);
}
void main(resolution.interactive);
