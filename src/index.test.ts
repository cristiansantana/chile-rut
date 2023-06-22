import {
    getCheckDigit,
    validateRut,
} from ".";

describe("testing index", () => {

    test("getCheckDigit of well formed rut ids", () => {
        expect(getCheckDigit("12345678")).toBe("5");
        expect(getCheckDigit("12.345.678")).toBe("5");
        expect(getCheckDigit("12,345,678")).toBe("5");
        expect(getCheckDigit("00012345678")).toBe("5");
        expect(getCheckDigit("00.012.345.678")).toBe("5");
        expect(getCheckDigit("0,012,345,678")).toBe("5");
    });

    test("getCheckDigit of malformed rut ids", () => {
        expect(() => getCheckDigit("")).toThrow();
        expect(() => getCheckDigit("a")).toThrow();
        expect(() => getCheckDigit("a")).toThrow();
    });

    test("validateRut of well formed and valid ruts", () => {
        expect(validateRut("12345678-5")).toBe(true);
        expect(validateRut("12.345.678-5")).toBe(true);
        expect(validateRut("12,345,678-5")).toBe(true);
        expect(validateRut("00012345678-5")).toBe(true);
        expect(validateRut("0.012.345.678-5")).toBe(true);
        expect(validateRut("0,012,345,678-5")).toBe(true);
    });

    test("validateRut of well formed and invalid ruts", () => {
        expect(validateRut("12345678-0")).toBe(false);
        expect(validateRut("12345678-1")).toBe(false);
        expect(validateRut("12345678-2")).toBe(false);
        expect(validateRut("12345678-3")).toBe(false);
        expect(validateRut("12345678-4")).toBe(false);
        expect(validateRut("12345678-6")).toBe(false);
        expect(validateRut("12345678-7")).toBe(false);
        expect(validateRut("12345678-8")).toBe(false);
        expect(validateRut("12345678-9")).toBe(false);
        expect(validateRut("12345678-K")).toBe(false);
        expect(validateRut("12345678-k")).toBe(false);
    });

    test("validateRut of malformed ruts", () => {
        expect(validateRut("")).toBe(false);
        expect(validateRut(" ")).toBe(false);
        expect(validateRut("a")).toBe(false);
        expect(validateRut("1 2")).toBe(false);
        expect(validateRut("123456785")).toBe(false);
    });

});
