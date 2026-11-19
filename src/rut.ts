import { validateRutFormat } from "./formats";
import { getNormalizedRutCheckDigit, getNormalizedRutId, isZeroRutId } from "./normalizers";
import { getCheckDigit } from "./utilities";

export type ParseRutResult =
    | { ok: true; id: string; checkDigit: string; canonical: string }
    | { ok: false; reason: "invalid_format" | "zero_id" | "invalid_check_digit" };

export type RutFormatStyle = "dotted" | "plain";

/** Validates the syntax and modulo-11 check digit, then returns the normalized RUT. */
export const parseRut = (input: unknown): ParseRutResult => {
    if (typeof input !== "string" || !validateRutFormat(input)) {
        return { ok: false, reason: "invalid_format" };
    }

    const [rawId, rawCheckDigit] = input.split("-");

    if (isZeroRutId(rawId)) {
        return { ok: false, reason: "zero_id" };
    }

    const id = getNormalizedRutId(rawId);
    const checkDigit = getNormalizedRutCheckDigit(rawCheckDigit);

    if (checkDigit !== getCheckDigit(id)) {
        return { ok: false, reason: "invalid_check_digit" };
    }

    return { ok: true, id, checkDigit, canonical: `${id}-${checkDigit}` };
};

/** Formats a valid RUT in the requested style. Returns null for invalid input or style. */
export const formatRut = (input: unknown, options: { style: RutFormatStyle }): string | null => {
    const style = options?.style;

    if (style !== "dotted" && style !== "plain") {
        return null;
    }

    const result = parseRut(input);

    if (!result.ok) {
        return null;
    }

    if (style === "plain") {
        return result.canonical;
    }

    const { id, checkDigit } = result;
    const firstGroupLength = id.length % 3 || 3;
    const groups = [id.slice(0, firstGroupLength)];

    for (let offset = firstGroupLength; offset < id.length; offset += 3) {
        groups.push(id.slice(offset, offset + 3));
    }

    return `${groups.join(".")}-${checkDigit}`;
};
