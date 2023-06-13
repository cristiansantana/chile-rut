import { validateRutFormat, validateRutIdFormat, validateRutCheckDigitFormat } from "./formatValidators";

export const getNormalizedRutId = (rutNumber: string) => {

    if (!validateRutIdFormat(rutNumber)) {
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

export const getNormalizedRutCheckDigit = (checkDigit: string) => {

    if (!validateRutCheckDigitFormat(checkDigit)) {
        throw new Error("Error: RUT Check Digit has non valid format");
    }

    return checkDigit === "k" ? "K" : checkDigit;
};

export const getNormalizedRut = (rut: string) => {

    if (!validateRutFormat(rut)) {
        throw new Error("Error: RUT has non valid format");
    }

    const components = rut.split("-");

    return {
        id: getNormalizedRutId(components[0]),
        checkDigit: getNormalizedRutCheckDigit(components[1]),
    };
};
