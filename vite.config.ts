import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    target: 'node20', // or node18 if older
    lib: {
      entry: resolve(__dirname, 'src/cli.ts'),
      formats: ['cjs'], // CLI tools use CommonJS
      fileName: () => 'cli.js'
    },
    rollupOptions: {
      external: [
        'figlet',       // external library
        'fs', 'path', 'crypto', 'os', 'util', // node built-ins
      ],
      output: {
        banner: '#!/usr/bin/env node'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: false
  }
})
