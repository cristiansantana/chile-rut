import { _getCheckDigit } from "./utilities";
import { _validateRut, _validateRutFormat, _validateRutIdFormat, _validateRutCheckDigitFormat } from "./validators";

export const getCheckDigit = (rutId: string) => _getCheckDigit(rutId);
export const validateRut = (rut: string) => _validateRut(rut);
export const validateRutFormat = (rut: string) => _validateRutFormat(rut);
export const validateRutIdFormat = (rut: string) => _validateRutIdFormat(rut);
export const validateRutCheckDigitFormat = (checkDigit: string) => _validateRutCheckDigitFormat(checkDigit);
