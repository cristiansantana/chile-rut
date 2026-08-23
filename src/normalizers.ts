import { INVALID_RUT_CHECK_DIGIT_MESSAGE, INVALID_RUT_ID_MESSAGE, INVALID_RUT_MESSAGE } from "./errors";
import { validateRutCheckDigitFormat, validateRutFormat, validateRutIdFormat } from "./formats";

export const isZeroRutId = (rutNumber: string) => /^0+$/.test(rutNumber.replace(/[.,]/g, ""));

export const getNormalizedRutId = (rutNumber: string) => {
    if (!validateRutIdFormat(rutNumber)) {
        throw new Error(INVALID_RUT_ID_MESSAGE);
    }

    const normalizedRut = rutNumber.replace(/[.,]/g, "").replace(/^0+/, "");

    if (normalizedRut === "") {
        throw new Error(INVALID_RUT_ID_MESSAGE);
    }

    return normalizedRut;
};

export const getNormalizedRutCheckDigit = (checkDigit: string) => {
    if (!validateRutCheckDigitFormat(checkDigit)) {
        throw new Error(INVALID_RUT_CHECK_DIGIT_MESSAGE);
    }

    return checkDigit === "k" ? "K" : checkDigit;
};

export const getNormalizedRut = (rut: string) => {
    if (!validateRutFormat(rut)) {
        throw new Error(INVALID_RUT_MESSAGE);
    }

    const components = rut.split("-");

    return getNormalizedRutId(components[0]) + "-" + getNormalizedRutCheckDigit(components[1]);
};
