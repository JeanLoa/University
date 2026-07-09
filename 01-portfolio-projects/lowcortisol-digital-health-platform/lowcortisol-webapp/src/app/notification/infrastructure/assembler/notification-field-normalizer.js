export function normalizeEnum(value, fallback = "") {
    if (value === undefined || value === null || value === "") return fallback;

    return String(value)
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/[\s-]+/g, "_")
        .toLowerCase();
}

export function normalizeDate(value) {
    if (!value) return null;

    return value instanceof Date ? value.toISOString() : value;
}

export function normalizeBoolean(value, fallback = false) {
    if (value === undefined || value === null) return fallback;

    return Boolean(value);
}
