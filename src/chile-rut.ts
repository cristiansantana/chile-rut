import { validateRutFormat, validateRutIdFormat, validateRutCheckDigitFormat } from "./formatValidators";
import { getNormalizedRut, getNormalizedRutId, getNormalizedRutCheckDigit } from "./normalizers";

const getCheckDigit = (rutId: string) => {

    if (!validateRutIdFormat(rutId)) {
        throw new Error("Error: Rut Id has a non valid format");
    }

    const normalizedRutId = getNormalizedRutId(rutId);

    const backwardsRut = normalizedRutId.split("").reverse();

    const factors = [2,3,4,5,6,7];

    const sum = backwardsRut.reduce((previous, current, index) => {
        const factorIndex = (factors.length + index) % factors.length;
        return previous + ( parseInt(current) * factors[factorIndex]);
    }, 0);

    const quotient = Math.floor(sum / 11);
    const subtrahend1 = quotient * 11;
    const subtrahend2 = Math.abs(sum - subtrahend1);
    const digit = 11 - subtrahend2;

    if (digit === 11) {
        return "0";
    }
    if (digit === 10) {
        return "K";
    }

    return digit.toFixed(0);
};

const validateRut = (rut: string) => {
    
    if (!validateRutFormat(rut)) {
        throw new Error("Error: Rut Id has a non valid format");
    }

    const normalizedRut = getNormalizedRut(rut);

    return normalizedRut.checkDigit === getCheckDigit(normalizedRut.id);
};

export {
    getCheckDigit,
    getNormalizedRut,
    getNormalizedRutId,
    getNormalizedRutCheckDigit,
    validateRut,
    validateRutFormat,
    validateRutIdFormat,
    validateRutCheckDigitFormat,
};
