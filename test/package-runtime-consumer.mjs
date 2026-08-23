import { readFileSync } from "node:fs";
import * as packageExports from "@cristiansantana/chile-rut";

const { getCheckDigit, validateRut, validateRutCheckDigitFormat, validateRutFormat, validateRutIdFormat } = packageExports;

const expectedExports = [
    "getCheckDigit",
    "validateRut",
    "validateRutCheckDigitFormat",
    "validateRutFormat",
    "validateRutIdFormat",
];

const assert = (condition, message) => {
    if (!condition) throw new Error(message);
};

const getThrownError = (callback, message) => {
    let thrown;

    try {
        callback();
    } catch (error) {
        thrown = error;
    }

    assert(thrown instanceof Error, message);
    return thrown;
};

const assertInvalidRutIdError = (callback, context) => {
    const error = getThrownError(callback, `Expected an Error for ${context}`);
    assert(error.name === "Error", `Unexpected error name for ${context}`);
    assert(error.message === "RUT ID has an invalid format", `Unexpected error message for ${context}`);
    assert(String(error) === "Error: RUT ID has an invalid format", `Unexpected stringified error for ${context}`);
};

assert(JSON.stringify(Object.keys(packageExports).sort()) === JSON.stringify(expectedExports), "Unexpected package exports");

for (const [rutId, expected] of [
    ["12345678", "5"],
    ["12.345.678", "5"],
    ["12,345,678", "5"],
    ["00012345678", "5"],
    ["00.012.345.678", "5"],
    ["0,012,345,678", "5"],
    ["6", "K"],
    ["14", "0"],
]) {
    assert(getCheckDigit(rutId) === expected, `Unexpected check digit for ${rutId}`);
}

for (const rutId of ["", "a", "12.34.567", "12.345,678", "0", "000", "0.000"]) {
    assertInvalidRutIdError(() => getCheckDigit(rutId), JSON.stringify(rutId));
}

for (const rut of [
    "12345678-5",
    "12.345.678-5",
    "12,345,678-5",
    "00012345678-5",
    "0.012.345.678-5",
    "0,012,345,678-5",
    "6-K",
    "6-k",
    "14-0",
]) {
    assert(validateRut(rut), `Expected ${rut} to be valid`);
}

for (const rut of [
    "12345678-4",
    "",
    " ",
    "a",
    "123456785",
    "12.34.567-5",
    "12.345,678-5",
    "0-0",
    "000-0",
    "0.000-0",
    "0,000-0",
]) {
    assert(validateRut(rut) === false, `Expected ${JSON.stringify(rut)} to be invalid`);
}

for (const rut of ["12345678-5", "12.345.678-5", "12,345,678-5", "6-K", "6-k", "0-0"]) {
    assert(validateRutFormat(rut), `Expected ${rut} to have a valid format`);
}

for (const rut of ["", "123456785", "12.34.567-5", "12.345,678-5", "12 345 678-5", "12345678-X"]) {
    assert(!validateRutFormat(rut), `Expected ${JSON.stringify(rut)} to have an invalid format`);
}

for (const rutId of ["12345678", "12.345.678", "12,345,678", "012345678", "00.012.345.678", "0"]) {
    assert(validateRutIdFormat(rutId), `Expected ${rutId} to have a valid identifier format`);
}

for (const rutId of ["", "a", "12.34.567", "12.345,678", "12 345 678", "12345678-5"]) {
    assert(!validateRutIdFormat(rutId), `Expected ${JSON.stringify(rutId)} to have an invalid identifier format`);
}

for (const checkDigit of ["0", "5", "K", "k"]) {
    assert(validateRutCheckDigitFormat(checkDigit), `Expected ${checkDigit} to have a valid check digit format`);
}

for (const checkDigit of ["", " ", "10", "X", "k5"]) {
    assert(!validateRutCheckDigitFormat(checkDigit), `Expected ${JSON.stringify(checkDigit)} to be invalid`);
}

for (const value of [undefined, null, 12345678, {}, []]) {
    const context = String(value);
    assert(validateRut(value) === false, `Expected validateRut to reject ${context}`);
    assert(validateRutFormat(value) === false, `Expected validateRutFormat to reject ${context}`);
    assert(validateRutIdFormat(value) === false, `Expected validateRutIdFormat to reject ${context}`);
    assert(validateRutCheckDigitFormat(value) === false, `Expected validateRutCheckDigitFormat to reject ${context}`);
    assertInvalidRutIdError(() => getCheckDigit(value), context);
}

let deepImportError;

try {
    await import("@cristiansantana/chile-rut/dist/index.js");
} catch (error) {
    deepImportError = error;
}

assert(deepImportError?.code === "ERR_PACKAGE_PATH_NOT_EXPORTED", "Expected deep imports to be blocked by exports");

const packageRoot = new URL("./node_modules/@cristiansantana/chile-rut/", import.meta.url);
const packageJson = JSON.parse(readFileSync(new URL("package.json", packageRoot), "utf8"));
const javascript = readFileSync(new URL("dist/index.js", packageRoot), "utf8");
const declarations = readFileSync(new URL("dist/index.d.ts", packageRoot), "utf8");
const sourceMap = JSON.parse(readFileSync(new URL("dist/index.js.map", packageRoot), "utf8"));

assert(packageJson.main === "dist/index.js", "Unexpected main entrypoint");
assert(packageJson.types === "dist/index.d.ts", "Unexpected types entrypoint");
assert(packageJson.exports["."].import === "./dist/index.js", "Unexpected import export");
assert(packageJson.exports["."].types === "./dist/index.d.ts", "Unexpected types export");
assert(packageJson.dependencies === undefined, "The package must not have runtime dependencies");
assert(javascript.includes("//# sourceMappingURL=index.js.map"), "JavaScript does not reference its source map");
assert(sourceMap.version === 3, "Unexpected source map version");
assert(sourceMap.sources.length === sourceMap.sourcesContent.length, "Source map sources and content are inconsistent");

for (const exportedName of expectedExports) {
    assert(declarations.includes(exportedName), `Declarations do not include ${exportedName}`);
}

console.log(`Installed artifact verified on ${process.version}`);
