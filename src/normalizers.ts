import { _validateRutFormat, _validateRutIdFormat, _validateRutCheckDigitFormat } from "./validators";

/** @internal */
export const _getNormalizedRutId = (rutNumber: string) => {

    if (!_validateRutIdFormat(rutNumber)) {
        throw new Error("Error: RUT Number has non valid format");
    }

    const digitRegex = /^\d$/;

    const normalizedRut = rutNumber.split("").reduce((previous, current) => {

        if (current === "0" && !previous) {
            return "";
        }

        if (digitRegex.test(current)) {
            return previous + current;
        }

        return previous;
    }, "" as string);

    if (normalizedRut === "") {
        throw new Error("Error: RUT Number has non valid format");
    }

    return normalizedRut;
};

/** @internal */
export const _getNormalizedRutCheckDigit = (checkDigit: string) => {

    if (!_validateRutCheckDigitFormat(checkDigit)) {
        throw new Error("Error: RUT Check Digit has non valid format");
    }

    return checkDigit === "k" ? "K" : checkDigit;
};

/** @internal */
export const _getNormalizedRut = (rut: string) => {

    if (!_validateRutFormat(rut)) {
        throw new Error("Error: RUT has non valid format");
    }

    const components = rut.split("-");

    return _getNormalizedRutId(components[0]) + "-" + _getNormalizedRutCheckDigit(components[1]);
};
