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

const assertThrows = (callback, message) => {
    let threw = false;

    try {
        callback();
    } catch {
        threw = true;
    }

    assert(threw, message);
};

const getReferenceCheckDigit = (rutId) => {
    const digits = rutId.replace(/[.,]/g, "").replace(/^0+/, "");
    let factor = 2;
    let sum = 0;

    for (let index = digits.length - 1; index >= 0; index -= 1) {
        sum += Number(digits[index]) * factor;
        factor = factor === 7 ? 2 : factor + 1;
    }

    const digit = 11 - (sum % 11);

    if (digit === 11) return "0";
    if (digit === 10) return "K";
    return String(digit);
};

const groupDigits = (rutId, separator) => rutId.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

const createRandomStrings = (count) => {
    const alphabet = "0123456789kK-., abcXYZ";
    let state = 0x5eed1234;
    const next = () => {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state;
    };

    return Array.from({ length: count }, () => {
        const length = next() % 40;
        return Array.from({ length }, () => alphabet[next() % alphabet.length]).join("");
    });
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
    assertThrows(() => getCheckDigit(rutId), `Expected getCheckDigit to throw for ${JSON.stringify(rutId)}`);
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

for (let value = 1; value <= 25_000; value += 1) {
    const plain = String(value);
    const withLeadingZeros = `00${plain}`;
    const expected = getReferenceCheckDigit(plain);
    const representations = [
        plain,
        groupDigits(plain, "."),
        groupDigits(plain, ","),
        withLeadingZeros,
        groupDigits(withLeadingZeros, "."),
        groupDigits(withLeadingZeros, ","),
    ];

    for (const representation of representations) {
        assert(getCheckDigit(representation) === expected, `Invariant failed for ${representation}`);
        assert(validateRut(`${representation}-${expected}`), `Generated RUT failed for ${representation}`);
    }
}

for (const input of createRandomStrings(5_000)) {
    let result;

    try {
        result = validateRut(input);
    } catch (error) {
        throw new Error(`validateRut threw for ${JSON.stringify(input)}`, { cause: error });
    }

    assert(typeof result === "boolean", `validateRut returned a non-boolean for ${JSON.stringify(input)}`);
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
assert(javascript.includes("//# sourceMappingURL=index.js.map"), "JavaScript does not reference its source map");
assert(sourceMap.version === 3, "Unexpected source map version");
assert(sourceMap.sources.length === sourceMap.sourcesContent.length, "Source map sources and content are inconsistent");

for (const exportedName of expectedExports) {
    assert(declarations.includes(exportedName), `Declarations do not include ${exportedName}`);
}

console.log(`Installed artifact verified on ${process.version}`);
