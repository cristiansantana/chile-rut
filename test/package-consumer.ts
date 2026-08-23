import {
    getCheckDigit,
    validateRut,
    validateRutCheckDigitFormat,
    validateRutFormat,
    validateRutIdFormat,
} from "@cristiansantana/chile-rut";

const checkDigit: string = getCheckDigit("12345678");
const validRut: boolean = validateRut("12345678-5");
const invalidRut: boolean = validateRut("12345678-4");
const validRutFormat: boolean = validateRutFormat("12.345.678-5");
const validRutIdFormat: boolean = validateRutIdFormat("12,345,678");
const validCheckDigitFormat: boolean = validateRutCheckDigitFormat("k");

if (checkDigit !== "5" || !validRut || invalidRut || !validRutFormat || !validRutIdFormat || !validCheckDigitFormat) {
    throw new Error("The installed package did not produce the expected results");
}
