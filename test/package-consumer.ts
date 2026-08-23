import { getCheckDigit, validateRut } from "@cristiansantana/chile-rut";

const checkDigit: string = getCheckDigit("12345678");
const validRut: boolean = validateRut("12345678-5");
const invalidRut: boolean = validateRut("12345678-4");

if (checkDigit !== "5" || !validRut || invalidRut) {
    throw new Error("The installed package did not produce the expected results");
}
