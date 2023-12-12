#!/usr/bin/env node

const { nodeExternalsPlugin } = require('esbuild-node-externals');

const options = {
  tsconfig: 'tsconfig.json',
  logLevel: "info",
  entryPoints: [
    "src/main.ts",
    "src/lib/JSEncrypt/jsencrypt.bundle.js"
  ],
  platform: 'node',
  minify: true,
  bundle: true,
  outdir: "dist/esbuild",
  sourcemap: "external",
  plugins: [
    nodeExternalsPlugin({}),
  ],
};

console.debug('Final build config: ', { options });

require("esbuild")
  .build(options)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
