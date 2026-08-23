import { getCheckDigit, validateRut, validateRutCheckDigitFormat, validateRutFormat, validateRutIdFormat } from ".";

describe("getCheckDigit", () => {
    test.each([
        ["12345678", "5"],
        ["12.345.678", "5"],
        ["12,345,678", "5"],
        ["00012345678", "5"],
        ["00.012.345.678", "5"],
        ["0,012,345,678", "5"],
        ["6", "K"],
        ["14", "0"],
    ])("calculates the check digit for %s", (rutId, expected) => {
        expect(getCheckDigit(rutId)).toBe(expected);
    });

    test.each(["", "a", "12.34.567", "12.345,678", "0", "000", "0.000"])("throws for invalid identifier %p", (rutId) => {
        expect(() => getCheckDigit(rutId)).toThrow();
    });
});

describe("format validators", () => {
    test.each(["12345678-5", "12.345.678-5", "12,345,678-5", "012345678-5", "6-K", "6-k", "14-0", "0-0"])(
        "accepts complete RUT format %s",
        (rut) => {
            expect(validateRutFormat(rut)).toBe(true);
        },
    );

    test.each(["", " ", "a", "123456785", "12.34.567-5", "12.345,678-5", "12 345 678-5", "12345678-X"])(
        "rejects complete RUT format %p",
        (rut) => {
            expect(validateRutFormat(rut)).toBe(false);
        },
    );

    test.each(["12345678", "12.345.678", "12,345,678", "012345678", "00.012.345.678", "0"])(
        "accepts identifier format %s",
        (rutId) => {
            expect(validateRutIdFormat(rutId)).toBe(true);
        },
    );

    test.each(["", " ", "a", "12.34.567", "12.345,678", "12 345 678", "12345678-5"])(
        "rejects identifier format %p",
        (rutId) => {
            expect(validateRutIdFormat(rutId)).toBe(false);
        },
    );

    test.each(["0", "5", "K", "k"])("accepts check digit format %s", (checkDigit) => {
        expect(validateRutCheckDigitFormat(checkDigit)).toBe(true);
    });

    test.each(["", " ", "10", "X", "k5"])("rejects check digit format %p", (checkDigit) => {
        expect(validateRutCheckDigitFormat(checkDigit)).toBe(false);
    });
});

describe("validateRut", () => {
    test.each([
        "12345678-5",
        "12.345.678-5",
        "12,345,678-5",
        "00012345678-5",
        "0.012.345.678-5",
        "0,012,345,678-5",
        "6-K",
        "6-k",
        "14-0",
    ])("accepts valid RUT %s", (rut) => {
        expect(validateRut(rut)).toBe(true);
    });

    test.each(["12345678-0", "12345678-1", "12345678-2", "12345678-3", "12345678-4", "12345678-K"])(
        "rejects a well-formed RUT with the wrong check digit %s",
        (rut) => {
            expect(validateRut(rut)).toBe(false);
        },
    );

    test.each(["", " ", "a", "1 2", "123456785", "12.34.567-5", "12.345,678-5"])("rejects malformed RUT %p", (rut) => {
        expect(validateRut(rut)).toBe(false);
    });

    test.each(["0-0", "000-0", "0.000-0", "0,000-0", "00000000-0"])("returns false for zero-only RUT %s", (rut) => {
        expect(validateRut(rut)).toBe(false);
    });
});
