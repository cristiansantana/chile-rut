import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const expectedFiles = [
    "CHANGELOG.md",
    "LICENSE",
    "README.md",
    "dist/index.d.ts",
    "dist/index.js",
    "dist/index.js.map",
    "package.json",
];

const manifestPathIndex = process.argv.indexOf("--manifest");
let packResult;
let temporaryDirectory;

if (manifestPathIndex !== -1) {
    const manifestPath = process.argv[manifestPathIndex + 1];

    if (!manifestPath) {
        throw new Error("--manifest requires a path to the npm pack JSON output");
    }

    packResult = JSON.parse(readFileSync(manifestPath, "utf8"));
} else {
    temporaryDirectory = mkdtempSync(join(tmpdir(), "chile-rut-package-check-"));
    const npmCli = process.env.npm_execpath;

    if (!npmCli) {
        throw new Error("npm_execpath is required to inspect the package");
    }

    const result = spawnSync(process.execPath, [npmCli, "pack", "--dry-run", "--json", "--ignore-scripts"], {
        cwd: process.cwd(),
        encoding: "utf8",
        env: {
            ...process.env,
            npm_config_cache: join(temporaryDirectory, "npm-cache"),
        },
    });

    if (result.status !== 0) {
        throw new Error(`npm pack failed:\n${result.stderr || result.stdout}`);
    }

    packResult = JSON.parse(result.stdout);
}

try {
    if (!Array.isArray(packResult) || packResult.length !== 1) {
        throw new Error("Expected npm pack to describe exactly one package");
    }

    const actualFiles = packResult[0].files.map(({ path }) => path).sort();
    const missingFiles = expectedFiles.filter((path) => !actualFiles.includes(path));
    const unexpectedFiles = actualFiles.filter((path) => !expectedFiles.includes(path));

    if (missingFiles.length > 0 || unexpectedFiles.length > 0) {
        throw new Error(
            [
                "Unexpected package contents.",
                `Missing: ${missingFiles.length > 0 ? missingFiles.join(", ") : "none"}`,
                `Unexpected: ${unexpectedFiles.length > 0 ? unexpectedFiles.join(", ") : "none"}`,
            ].join("\n"),
        );
    }

    console.log(`Package contents verified (${actualFiles.length} files)`);
} finally {
    if (temporaryDirectory) {
        rmSync(temporaryDirectory, { recursive: true, force: true });
    }
}
