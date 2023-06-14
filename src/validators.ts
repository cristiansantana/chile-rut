import { _getNormalizedRut } from "./normalizers";
import { _getCheckDigit } from "./utilities";

/** @internal */
export const _validateRutFormat = (rut: string) => {
    const validRegex = /^([0-9]{1,3}(\.[0-9]{3}){0,2}|[0-9]{1,3}(,[0-9]{3}){0,2}|[0-9]{1,9})-(k|K|[0-9])$/;
    return validRegex.test(rut);
};

/** @internal */
export const _validateRutIdFormat = (rut: string) => {
    const validRegex = /^([0-9]{1,3}(\.[0-9]{3}){0,2}|[0-9]{1,3}(,[0-9]{3}){0,2}|[0-9]{1,9})$/;
    return validRegex.test(rut);
};

/** @internal */
export const _validateRutCheckDigitFormat = (checkDigit: string) => {
    const validRegex = /^(k|K|[0-9])$/;
    return validRegex.test(checkDigit);
};

/** @internal */
export const _validateRut = (rut: string) => {
    
    if (!_validateRutFormat(rut)) {
        throw new Error("Error: Rut Id has a non valid format");
    }

    const normalizedRut = _getNormalizedRut(rut);
    const components = normalizedRut.split("-");
    const id = components[0];
    const checkDigit = components[1];

    return checkDigit === _getCheckDigit(id);
};
