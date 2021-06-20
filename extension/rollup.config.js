import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "src/background.ts",
    plugins: [typescript()],
    output: {
      file: "dist/background.js",
      format: "cjs",
    },
  },
  {
    input: "src/content.ts",
    plugins: [typescript()],
    output: {
      file: "dist/content.js",
      format: "cjs",
    },
  },
];
