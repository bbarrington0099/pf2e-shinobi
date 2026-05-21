import { defineConfig } from "vite";
import { resolve } from "node:path";

/**
 * Vite build config for the Foundry module runtime code.
 *
 * Foundry expects ES modules with stable filenames referenced by `module.json`'s
 * `esmodules` field, so we disable hashing and emit a single bundle.
 */
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    target: "es2022",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "PF2eShinobi",
      formats: ["es"],
      fileName: () => "pf2e-shinobi.js",
    },
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: (asset) => {
          if (asset.name && asset.name.endsWith(".css")) {
            return "pf2e-shinobi.css";
          }
          return "[name][extname]";
        },
      },
    },
    minify: false,
  },
});
