import { coalesceInternationalizedArrayString } from "./stringify.ts";

function createI18n(locale: Record<string, string>) {
    return (key: string) => {
        return locale[key] || key;
    };
}

const i18n = createI18n({
    "untitled": "Untitled",
});

export function displayInternationalizedArrayString(
    field: unknown,
): string {
    return coalesceInternationalizedArrayString(field, i18n("untitled"));
}
