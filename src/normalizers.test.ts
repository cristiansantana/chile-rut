import { _getNormalizedRut } from "./normalizers";

describe("testing _getNormalizedRut function", () => {

    test("normalize 11222333-4", () => {
        expect(_getNormalizedRut("11222333-4")).toBe("11222333-4");
    });

    test("normalize 011.222.333-4", () => {
        expect(_getNormalizedRut("011.222.333-4")).toBe("11222333-4");
    });

    test("normalize 11,222,333-4", () => {
        expect(_getNormalizedRut("11,222,333-4")).toBe("11222333-4");
    });

    test("normalize 1-1", () => {
        expect(_getNormalizedRut("1-1")).toBe("1-1");
    });

    test("normalize 0.000.001-0", () => {
        expect(_getNormalizedRut("0.000.001-0")).toBe("1-0");
    });

    test("normalize 0.000.000-0", () => {
        expect(() => _getNormalizedRut("0.000.000-0")).toThrow();
    });

    test("normalize \"  11.222.333-4\"", () => {
        expect(() => _getNormalizedRut("  11,222,333-4")).toThrow();
    });

    test("normalize 11x222x333-4", () => {
        expect(() => _getNormalizedRut("11x222x333-4")).toThrow();
    });

    test("normalize \"\"", () => {
        expect(() => _getNormalizedRut("")).toThrow();
    });

    test("normalize \"1\"", () => {
        expect(() => _getNormalizedRut("1")).toThrow();
    });

    test("normalize \"a\"", () => {
        expect(() => _getNormalizedRut("a")).toThrow();
    });

    test("normalize \"0\"", () => {
        expect(() => _getNormalizedRut("0")).toThrow();
    });
});
