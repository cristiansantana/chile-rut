import {
    getCheckDigit,
    validateRut
} from ".";

describe("testing getCheckDigit function", () => {

    test("getCheckDigit of 12345678", () => {
        expect(getCheckDigit("12345678")).toBe("5");
    });

    test("getCheckDigit of 12.345.678", () => {
        expect(getCheckDigit("12.345.678")).toBe("5");
    });

    test("getCheckDigit of 12,345,678", () => {
        expect(getCheckDigit("12,345,678")).toBe("5");
    });

    test("getCheckDigit of 00012345678", () => {
        expect(getCheckDigit("00012345678")).toBe("5");
    });

    test("getCheckDigit of 00.012.345.678", () => {
        expect(getCheckDigit("00.012.345.678")).toBe("5");
    });

    test("getCheckDigit of 0,012,345,678", () => {
        expect(getCheckDigit("0,012,345,678")).toBe("5");
    });

    test("getCheckDigit of \"\"", () => {
        expect(() => getCheckDigit("")).toThrow();
    });

    test("getCheckDigit of \"a\"", () => {
        expect(() => getCheckDigit("a")).toThrow();
    });

    test("getCheckDigit of \"1 2\"", () => {
        expect(() => getCheckDigit("a")).toThrow();
    });

});

describe("testing validateRut function", () => {

    test("validateRut of 12345678-0", () => {
        expect(validateRut("12345678-0")).toBe(false);
    });

    test("validateRut of 12345678-1", () => {
        expect(validateRut("12345678-1")).toBe(false);
    });

    test("validateRut of 12345678-2", () => {
        expect(validateRut("12345678-2")).toBe(false);
    });

    test("validateRut of 12345678-3", () => {
        expect(validateRut("12345678-3")).toBe(false);
    });

    test("validateRut of 12345678-4", () => {
        expect(validateRut("12345678-4")).toBe(false);
    });

    test("validateRut of 12345678-5", () => {
        expect(validateRut("12345678-5")).toBe(true);
    });

    test("validateRut of 12345678-6", () => {
        expect(validateRut("12345678-6")).toBe(false);
    });

    test("validateRut of 12345678-7", () => {
        expect(validateRut("12345678-7")).toBe(false);
    });

    test("validateRut of 12345678-8", () => {
        expect(validateRut("12345678-8")).toBe(false);
    });

    test("validateRut of 12345678-9", () => {
        expect(validateRut("12345678-9")).toBe(false);
    });

    test("validateRut of 12345678-k", () => {
        expect(validateRut("12345678-k")).toBe(false);
    });

    test("validateRut of 12345678-K", () => {
        expect(validateRut("12345678-K")).toBe(false);
    });

    test("validateRut of 12.345.678-5", () => {
        expect(validateRut("12.345.678-5")).toBe(true);
    });

    test("validateRut of 12,345,678-5", () => {
        expect(validateRut("12,345,678-5")).toBe(true);
    });

    test("validateRut of 00012345678-5", () => {
        expect(validateRut("00012345678-5")).toBe(true);
    });

    test("validateRut of 0.012.345.678-5", () => {
        expect(validateRut("0.012.345.678-5")).toBe(true);
    });

    test("validateRut of 0,012,345,678-5", () => {
        expect(validateRut("0,012,345,678-5")).toBe(true);
    });

    test("validateRut of 12345678", () => {
        expect(validateRut("")).toBe(false);
    });

    test("validateRut of \"\"", () => {
        expect(validateRut("")).toBe(false)
    });

    test("validateRut of \"a\"", () => {
        expect(validateRut("a")).toBe(false)
    });

    test("validateRut of \"1 2\"", () => {
        expect(validateRut("1 2")).toBe(false)
    });

});