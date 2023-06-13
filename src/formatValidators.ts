export const validateRutFormat = (rut: string) => {
    const validRegex = /^([0-9]{1,3}(\.[0-9]{3}){0,2}|[0-9]{1,3}(,[0-9]{3}){0,2}|[0-9]{1,9})-(k|K|[0-9])$/;
    return validRegex.test(rut);
};

export const validateRutIdFormat = (rut: string) => {
    const validRegex = /^([0-9]{1,3}(\.[0-9]{3}){0,2}|[0-9]{1,3}(,[0-9]{3}){0,2}|[0-9]{1,9})$/;
    return validRegex.test(rut);
};

export const validateRutCheckDigitFormat = (checkDigit: string) => {
    const validRegex = /^(k|K|[0-9])$/;
    return validRegex.test(checkDigit);
};
