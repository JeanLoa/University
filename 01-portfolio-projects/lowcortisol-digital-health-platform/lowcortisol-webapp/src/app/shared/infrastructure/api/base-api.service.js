import { API_CONFIG } from "./api.config";

export class BaseApiService {
    async get(url) {
        return this.request(url, {
            method: "GET",
        });
    }

    async post(url, body = {}) {
        return this.request(url, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    async put(url, body = {}) {
        return this.request(url, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    }

    async patch(url, body = {}) {
        return this.request(url, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
    }

    async delete(url) {
        return this.request(url, {
            method: "DELETE",
        });
    }

    async request(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...API_CONFIG.headers,
                ...(options.headers || {}),
            },
        });

        const data = await this.parseResponse(response);

        if (!response.ok) {
            throw new Error(data?.message || `Error HTTP ${response.status}`);
        }

        return data;
    }

    async parseResponse(response) {
        try {
            return await response.json();
        } catch {
            return null;
        }
    }
}