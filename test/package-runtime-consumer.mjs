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
    if (!condition) {
        throw new Error(message);
    }
};

assert(JSON.stringify(Object.keys(packageExports).sort()) === JSON.stringify(expectedExports), "Unexpected package exports");
assert(getCheckDigit("12345678") === "5", "Unexpected check digit");
assert(getCheckDigit("12.345.678") === "5", "Unexpected check digit for a formatted identifier");
assert(getCheckDigit("6") === "K", "Unexpected K check digit");
assert(validateRut("12345678-5"), "Expected a valid RUT");
assert(validateRut("6-k"), "Expected a valid lowercase K check digit");
assert(!validateRut("12345678-4"), "Expected an invalid check digit");
assert(!validateRut("0-0"), "Expected a zero-only RUT to be invalid");
assert(validateRutFormat("12.345.678-5"), "Expected a valid complete format");
assert(!validateRutFormat("12.345,678-5"), "Expected mixed separators to be invalid");
assert(validateRutIdFormat("12,345,678"), "Expected a valid identifier format");
assert(!validateRutIdFormat("12.345,678"), "Expected mixed identifier separators to be invalid");
assert(validateRutCheckDigitFormat("K"), "Expected uppercase K to be valid");
assert(validateRutCheckDigitFormat("k"), "Expected lowercase K to be valid");
assert(!validateRutCheckDigitFormat("10"), "Expected a multi-character check digit to be invalid");

let zeroRutThrew = false;

try {
    getCheckDigit("0");
} catch {
    zeroRutThrew = true;
}

assert(zeroRutThrew, "Expected a zero-only identifier to throw");
