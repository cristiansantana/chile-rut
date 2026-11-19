import {
    formatRut,
    getCheckDigit,
    parseRut,
    validateRut,
    validateRutCheckDigitFormat,
    validateRutFormat,
    validateRutIdFormat,
} from "@cristiansantana/chile-rut";
import type { ParseRutResult, RutFormatStyle } from "@cristiansantana/chile-rut";

const checkDigit: string = getCheckDigit("12345678");
const validRut: boolean = validateRut("12345678-5");
const invalidRut: boolean = validateRut("12345678-4");
const validRutFormat: boolean = validateRutFormat("12.345.678-5");
const validRutIdFormat: boolean = validateRutIdFormat("12,345,678");
const validCheckDigitFormat: boolean = validateRutCheckDigitFormat("k");

const input: unknown = "00.018.765.002-k";
const parsed: ParseRutResult = parseRut(input);
if (parsed.ok) {
    const canonical: string = parsed.canonical;
    if (canonical !== "18765002-K") throw new Error("Unexpected canonical RUT");
} else {
    throw new Error(parsed.reason);
}

const style: RutFormatStyle = "dotted";
const formatted: string | null = formatRut(input, { style });
if (formatted !== "18.765.002-K") throw new Error("Unexpected formatted RUT");

// @ts-expect-error A style is required.
formatRut(input, {});
// @ts-expect-error The options argument is required.
formatRut(input);

if (checkDigit !== "5" || !validRut || invalidRut || !validRutFormat || !validRutIdFormat || !validCheckDigitFormat) {
    throw new Error("The installed package did not produce the expected results");
}
