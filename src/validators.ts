import { validateRutCheckDigitFormat, validateRutFormat, validateRutIdFormat } from "./formats";
import { parseRut } from "./rut";

export { validateRutCheckDigitFormat, validateRutFormat, validateRutIdFormat };

/**
 * Validates a RUT using its syntax and modulo-11 check digit.
 *
 * This does not verify whether the RUT has been legally issued.
 */
export const validateRut = (rut: string) => parseRut(rut).ok;
