const COMMAND_NAMES = ["shares", "nonce", "cluster", "operator"] as const;
type CommandName = (typeof COMMAND_NAMES)[number];

const HELP_FLAGS = new Set(["-h", "--help"]);

// Legacy shares-only flags supported by historical binary docs (no explicit "shares" command).
const LEGACY_SHARES_FLAGS = new Set([
  "-ks",
  "--keystore",
  "-ps",
  "--password",
  "-oks",
  "--operator-keys",
  "-on",
  "--owner-nonce",
  "-of",
  "--output-folder",
]);

export interface BinaryModeResolution {
  interactive: boolean;
  injectedAction?: CommandName;
}

const normalizeToken = (token: string): string => token.split("=")[0];

const isKnownCommand = (token: string | undefined): token is CommandName =>
  !!token && (COMMAND_NAMES as readonly string[]).includes(token);

const hasLegacySharesFlags = (userArgs: string[]): boolean => {
  return userArgs.some((arg) => LEGACY_SHARES_FLAGS.has(normalizeToken(arg)));
};

export const resolveBinaryMode = (
  argv: string[]
): BinaryModeResolution => {
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
      injectedAction: "shares",
    };
  }

  return { interactive: true };
};

