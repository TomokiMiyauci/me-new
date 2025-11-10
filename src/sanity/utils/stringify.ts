import { isValue } from "./validation.ts";

export function coalesceInternationalizedArrayString(
    field: unknown,
    fallback: string,
): string {
    if (Array.isArray(field)) {
        const first = field[0];

        if (isValue(first) && typeof first.value === "string") {
            return first.value;
        }
    }

    return fallback;
}
