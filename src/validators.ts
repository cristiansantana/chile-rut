import { getNormalizedRut } from "./normalizers";
import { getCheckDigit } from "./utilities";

export const validateRutFormat = (rut: string) => {
    const validRegex = /^([0-9]{1,3}(\.[0-9]{3})*|[0-9]{1,3}(,[0-9]{3})*|[0-9]+)-(k|K|[0-9])$/;
    return validRegex.test(rut);
};

export const validateRutIdFormat = (rut: string) => {
    const validRegex = /^([0-9]{1,3}(\.[0-9]{3})*|[0-9]{1,3}(,[0-9]{3})*|[0-9]+)$/;
    return validRegex.test(rut);
};

export const validateRutCheckDigitFormat = (checkDigit: string) => {
    const validRegex = /^(k|K|[0-9])$/;
    return validRegex.test(checkDigit);
};

export const validateRut = (rut: string) => {
    if (!validateRutFormat(rut)) {
        return false;
    }

    const normalizedRut = getNormalizedRut(rut);
    const components = normalizedRut.split("-");
    const id = components[0];
    const checkDigit = components[1];

    return checkDigit === getCheckDigit(id);
};
