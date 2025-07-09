// // import { defineConfig } from 'vite'
// // import { resolve } from 'path'
// //
// // export default defineConfig({
// //   build: {
// //     target: 'node20', // or node18 if older
// //     lib: {
// //       entry: resolve(__dirname, 'src/cli.ts'),
// //       formats: ['cjs'], // CLI tools use CommonJS
// //       fileName: () => 'cli.js'
// //     },
// //     rollupOptions: {
// //       external: [
// //         'figlet',       // external library
// //         'fs', 'path', 'crypto', 'os', 'util', // node built-ins
// //       ],
// //       output: {
// //         banner: '#!/usr/bin/env node'
// //       }
// //     },
// //     outDir: 'dist',
// //     emptyOutDir: true,
// //     minify: false
// //   }
// // })
//
//
// import { resolve } from 'path'
// import { defineConfig } from 'vite'
// import dts from 'vite-plugin-dts'
//
// export default defineConfig({
//   // plugins: [
//   //   dts({ include: ['src/**/*.ts'], exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts'] }),
//   // ],
//   // resolve: {
//   //   alias: {
//   //     '@': resolve(__dirname, 'src'),
//   //   },
//   // },
//   ssr: {
//     noExternal: true, // важно!
//   },
//   build: {
//     target: 'node22',
//     minify: false,
//     lib: {
//       entry: {
//         cli: resolve(__dirname, 'src/cli.ts'),
//         // utils: resolve(__dirname, 'src/utils/index.ts'),
//         // keys: resolve(__dirname, 'src/libs/ssv-keys/index.ts'),
//       },
//       formats: ['cjs'],
//     },
//
//     rollupOptions: {
//       external:[
//         'fs', 'path', 'url', 'os', 'crypto', 'stream', 'buffer', 'util',
//         'node:fs', 'node:path', 'node:url', 'node:os', 'node:crypto', 'node:stream', 'node:buffer', 'node:util', 'node:module'
//       ]
//     },
//     outDir: 'dist',
//   },
//   optimizeDeps: {
//     include: ['src/graphql/graphql.ts'],
//   },
// })
//

import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node22",
    minify: false,
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/cli-interactive.ts"),
      formats: ["cjs"],
      fileName: () => "cli-interactive.js",
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
