import { getNormalizedRut, getNormalizedRutCheckDigit, getNormalizedRutId, isZeroRutId } from "./normalizers";

describe("internal normalizers", () => {
    test("normalizes supported identifiers, check digits and complete RUTs", () => {
        expect(getNormalizedRutId("00.012.345.678")).toBe("12345678");
        expect(getNormalizedRutId("12,345,678")).toBe("12345678");
        expect(getNormalizedRutCheckDigit("k")).toBe("K");
        expect(getNormalizedRutCheckDigit("5")).toBe("5");
        expect(getNormalizedRut("00.012.345.678-k")).toBe("12345678-K");
    });

    test("preserves existing errors for unsupported inputs", () => {
        expect(() => getNormalizedRutId("12.345,678")).toThrow("Error: RUT Number has non valid format");
        expect(() => getNormalizedRutId("0")).toThrow("Error: RUT Number has non valid format");
        expect(() => getNormalizedRutCheckDigit("X")).toThrow("Error: RUT Check Digit has non valid format");
        expect(() => getNormalizedRut("123456785")).toThrow("Error: RUT has non valid format");
    });

    test("detects identifiers that consist only of zeros", () => {
        expect(isZeroRutId("0")).toBe(true);
        expect(isZeroRutId("0.000")).toBe(true);
        expect(isZeroRutId("0001")).toBe(false);
    });
});
