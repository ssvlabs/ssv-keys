const COMMAND_NAMES = ["shares", "nonce", "cluster", "operator"] as const;
type CommandName = (typeof COMMAND_NAMES)[number];

const HELP_FLAGS = new Set(["-h", "--help"]);

// Scanner flags still need an explicit action, but we keep the existing
// interactive fallback when users provide those known inputs directly.
const INTERACTIVE_SCANNER_FLAGS = new Set([
  "-nw",
  "--network",
  "-n",
  "--node-url",
  "-oa",
  "--owner-address",
]);

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

const isFlagLike = (token: string | undefined): boolean => !!token?.startsWith("-");

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

  if (
    isFlagLike(firstToken) &&
    !INTERACTIVE_SCANNER_FLAGS.has(normalizeToken(firstToken))
  ) {
    return { interactive: false };
  }

  return { interactive: true };
};
