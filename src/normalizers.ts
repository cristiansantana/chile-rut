import { _validateRutFormat, _validateRutIdFormat, _validateRutCheckDigitFormat } from "./validators";

/** @internal */
export const _getNormalizedRutId = (rutNumber: string) => {

    if (!_validateRutIdFormat(rutNumber)) {
        throw new Error("Error: RUT Number has non valid format");
    }

    const digitRegex = /^\d$/;

    return rutNumber.split("").reduce((previous, current) => {

        if (current === "0" && !previous) {
            return "";
        }

        if (digitRegex.test(current)) {
            return previous + current;
        }

        return previous;
    }, "" as string);
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

    return {
        id: _getNormalizedRutId(components[0]),
        checkDigit: _getNormalizedRutCheckDigit(components[1]),
    };
};
