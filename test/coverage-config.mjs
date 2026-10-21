import assert from "node:assert/strict";
import { mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import { transformSync } from "@babel/core";

const require = createRequire(import.meta.url);
const plugin = require.resolve("babel-plugin-istanbul");
const fixtureDirectory = realpathSync(mkdtempSync(join(tmpdir(), "chile-rut-coverage-config-")));

try {
    // Exercise the coverage consumer of the scoped js-yaml override, including
    // YAML inheritance and filtering that the ordinary Jest config does not use.
    writeFileSync(join(fixtureDirectory, "package.json"), "{}");
    writeFileSync(join(fixtureDirectory, "base.yaml"), "exclude:\n  - ignored.js\n");
    writeFileSync(join(fixtureDirectory, ".nycrc.yml"), "extends: ./base.yaml\ninclude:\n  - '**/*.js'\n");

    const source = 'module.exports = (value) => value > 0 ? "positive" : "other";';
    const instrument = (filename) =>
        transformSync(source, {
            filename: join(fixtureDirectory, filename),
            babelrc: false,
            configFile: false,
            plugins: [[plugin, { cwd: fixtureDirectory }]],
        }).code;

    const included = { module: { exports: {} } };
    runInNewContext(instrument("source.js"), included);
    assert.equal(included.module.exports(1), "positive");
    assert.equal(included.module.exports(0), "other");
    const coverage = included.__coverage__[join(fixtureDirectory, "source.js")];
    assert.ok(Object.keys(coverage.f).length > 0);
    assert.ok(Object.keys(coverage.b).length > 0);
    assert.ok(Object.values(coverage.s).every((count) => count > 0));
    assert.ok(Object.values(coverage.f).every((count) => count > 0));
    assert.ok(Object.values(coverage.b).every((counts) => counts.every((count) => count > 0)));

    const excluded = { module: { exports: {} } };
    runInNewContext(instrument("ignored.js"), excluded);
    assert.equal(excluded.module.exports(1), "positive");
    assert.equal(excluded.__coverage__, undefined);

    console.log("YAML coverage configuration, inheritance, instrumentation and exclusion verified");
} finally {
    rmSync(fixtureDirectory, { recursive: true, force: true });
}
