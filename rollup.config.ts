import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
export default defineConfig([
    // First config: Generate JS bundles (CJS and ESM)
    {
        input: "src/index.ts",
        output: [
            { file: "dist/index.cjs.js", format: "cjs" }, // CommonJS
            { file: "dist/index.esm.js", format: "esm" }, // ESM
        ],
        plugins: [
            typescript({
                tsconfig: "./tsconfig.json",
            }),
            commonjs(),
        ],
    },
    // Second config: Generate combined .d.ts file
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.d.ts",
            format: "esm", // Format doesn’t matter much for .d.ts, but ESM is fine
        },
        plugins: [dts()],
        external: ['express', '@types/express'],
    },
]);