const validRutIdRegex = /^([0-9]{1,3}(\.[0-9]{3})*|[0-9]{1,3}(,[0-9]{3})*|[0-9]+)$/;
const validRutRegex = /^([0-9]{1,3}(\.[0-9]{3})*|[0-9]{1,3}(,[0-9]{3})*|[0-9]+)-(k|K|[0-9])$/;
const validRutCheckDigitRegex = /^(k|K|[0-9])$/;

/**
 * Checks whether a complete RUT uses one of the supported syntactic formats.
 */
export const validateRutFormat = (rut: string) => typeof rut === "string" && validRutRegex.test(rut);

/**
 * Checks whether a RUT identifier uses one of the supported syntactic formats.
 */
export const validateRutIdFormat = (rut: string) => typeof rut === "string" && validRutIdRegex.test(rut);

/**
 * Checks whether a value is a single numeric check digit or the letter K.
 */
export const validateRutCheckDigitFormat = (checkDigit: string) =>
    typeof checkDigit === "string" && validRutCheckDigitRegex.test(checkDigit);
