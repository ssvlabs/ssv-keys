import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node22",
    minify: false,
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: {
        cli: resolve(__dirname, "src/cli.ts"),
        "cli-interactive": resolve(__dirname, "src/cli-interactive.ts"),
      },
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: [
        "fs",
        "path",
        "url",
        "os",
        "crypto",
        "stream",
        "buffer",
        "util",
        "readline",
        "node:fs",
        "node:path",
        "node:url",
        "node:os",
        "node:crypto",
        "node:stream",
        "node:buffer",
        "node:util",
        "node:readline",
        "node:module",
      ],
      output: {
        banner: "#!/usr/bin/env node",
      },
    },
  },
  ssr: {
    noExternal: true,
  },
});
