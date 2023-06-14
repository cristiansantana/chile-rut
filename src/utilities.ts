import { _validateRutIdFormat } from "./validators";
import { _getNormalizedRutId } from "./normalizers";

/** @internal */
export const _getCheckDigit = (rutId: string) => {

    if (!_validateRutIdFormat(rutId)) {
        throw new Error("Error: Rut Id has a non valid format");
    }

    const normalizedRutId = _getNormalizedRutId(rutId);

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
