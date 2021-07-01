import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-node-polyfills";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const plugins = [typescript(), json(), commonjs(), nodePolyfills(), resolve()];

export default [
  {
    input: "src/background.ts",
    plugins,
    output: {
      file: "dist/background.js",
      format: "iife",
      sourcemap: true,
    },
  },
  {
    input: "src/content.ts",
    plugins,
    output: {
      file: "dist/content.js",
      format: "iife",
      sourcemap: true,
    },
  },
];
