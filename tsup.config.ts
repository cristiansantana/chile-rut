import { defineConfig } from "tsup";

export default defineConfig({
    entryPoints: ["src/index.ts"],
    tsconfig: "tsconfig.build.json",
    dts: true,
    sourcemap: true,
    clean: true,
    format: ["esm"],
});
