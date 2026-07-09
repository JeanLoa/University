const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is required to connect LowCortisol with the platform API.");
}

export const API_CONFIG = {
    baseUrl: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
};
