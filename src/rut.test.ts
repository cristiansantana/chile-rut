import { formatRut, getCheckDigit, parseRut } from ".";

describe("parseRut", () => {
    test.each(["18.765.002-k", "18,765,002-K", "00018765002-k", "18.765.002-K"])("normalizes %s", (input) => {
        expect(parseRut(input)).toEqual({
            ok: true,
            id: "18765002",
            checkDigit: "K",
            canonical: "18765002-K",
        });
    });

    test.each([undefined, null, 123456785, {}, "", "123456785", " 12.345.678-5 ", "12.345,678-5", "0-X"])(
        "rejects invalid syntax for %p",
        (input) => {
            expect(parseRut(input)).toEqual({ ok: false, reason: "invalid_format" });
        },
    );

    test.each(["0-0", "000-5", "0.000-k", "0,000-0"])("rejects a zero-only identifier %s", (input) => {
        expect(parseRut(input)).toEqual({ ok: false, reason: "zero_id" });
    });

    test("rejects an incorrect check digit", () => {
        expect(parseRut("12.345.678-6")).toEqual({ ok: false, reason: "invalid_check_digit" });
    });
});

describe("formatRut", () => {
    const longId = "12345678901234567890";
    const longCheckDigit = getCheckDigit(longId);

    test.each([
        ["00,018,765,002-k", "18765002-K", "18.765.002-K"],
        ["6-k", "6-K", "6-K"],
        ["123456-0", "123456-0", "123.456-0"],
        [`${longId}-${longCheckDigit}`, `${longId}-${longCheckDigit}`, `12.345.678.901.234.567.890-${longCheckDigit}`],
    ])("formats %s in both styles and preserves the canonical value", (input, plain, dotted) => {
        const plainResult = formatRut(input, { style: "plain" });
        const dottedResult = formatRut(input, { style: "dotted" });

        expect(plainResult).toBe(plain);
        expect(dottedResult).toBe(dotted);
        expect(parseRut(plainResult)).toMatchObject({ ok: true, canonical: plain });
        expect(parseRut(dottedResult)).toMatchObject({ ok: true, canonical: plain });
    });

    test.each(["123456785", "0-0", "12.345.678-6"])("returns null for invalid RUT %s", (input) => {
        expect(formatRut(input, { style: "dotted" })).toBeNull();
    });

    test.each([undefined, null, {}, { style: "unknown" }])("returns null for invalid options %p", (options) => {
        expect(Reflect.apply(formatRut, undefined, ["18.765.002-k", options])).toBeNull();
    });
});
