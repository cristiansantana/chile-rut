import { validateRutCheckDigitFormat, validateRutFormat, validateRutIdFormat } from "./formats";
import { getNormalizedRut, isZeroRutId } from "./normalizers";
import { getCheckDigit } from "./utilities";

export { validateRutCheckDigitFormat, validateRutFormat, validateRutIdFormat };

/**
 * Validates a RUT using its syntax and modulo-11 check digit.
 *
 * This does not verify whether the RUT has been legally issued.
 */
export const validateRut = (rut: string) => {
    if (!validateRutFormat(rut)) {
        return false;
    }

    const rutId = rut.split("-")[0];

    if (isZeroRutId(rutId)) {
        return false;
    }

    const normalizedRut = getNormalizedRut(rut);
    const components = normalizedRut.split("-");
    const id = components[0];
    const checkDigit = components[1];

    return checkDigit === getCheckDigit(id);
};
