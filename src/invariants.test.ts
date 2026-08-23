import { getCheckDigit, validateRut } from ".";

const getReferenceCheckDigit = (rutId: string) => {
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

const groupDigits = (rutId: string, separator: string) => rutId.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

const createRandomStrings = (count: number) => {
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

describe("calculation invariants", () => {
    test("matches an independent modulo-11 implementation across supported representations", () => {
        for (let value = 1; value <= 25_000; value += 1) {
            const plain = String(value);
            const withLeadingZeros = `00${plain}`;
            const representations = [
                plain,
                groupDigits(plain, "."),
                groupDigits(plain, ","),
                withLeadingZeros,
                groupDigits(withLeadingZeros, "."),
                groupDigits(withLeadingZeros, ","),
            ];
            const expected = getReferenceCheckDigit(plain);

            for (const representation of representations) {
                expect(getCheckDigit(representation)).toBe(expected);
                expect(validateRut(`${representation}-${expected}`)).toBe(true);
            }
        }
    });

    test("validateRut never throws and always returns a boolean for deterministic fuzz input", () => {
        for (const input of createRandomStrings(5_000)) {
            let result: boolean | undefined;

            expect(() => {
                result = validateRut(input);
            }).not.toThrow();
            expect(typeof result).toBe("boolean");
        }
    });
});
