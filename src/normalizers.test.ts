import { _getNormalizedRut } from "./normalizers";

describe("_getNormalizedRut", () => {

    test("normalize 11222333-4", () => {
        expect(_getNormalizedRut("11222333-4")).toBe("11222333-4");
    });

    test("normalize 011.222.333-4", () => {
        expect(_getNormalizedRut("011.222.333-4")).toBe("11222333-4");
    });

    test("normalize 11,222,333-4", () => {
        expect(_getNormalizedRut("11,222,333-4")).toBe("11222333-4");
    });

    test("normalize \"  11.222.333-4\"", () => {
        expect(() => _getNormalizedRut("  11,222,333-4")).toThrow();
    });

    test("normalize 11x222x333-4", () => {
        expect(() => _getNormalizedRut("11x222x333-4")).toThrow();
    });
});
