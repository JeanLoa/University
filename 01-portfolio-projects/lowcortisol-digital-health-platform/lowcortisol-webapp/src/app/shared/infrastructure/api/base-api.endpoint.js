import { API_CONFIG } from "./api.config";

export class BaseApiEndpoint {
    constructor(endpointUrl = "", assembler = null) {
        this.endpointUrl = endpointUrl;
        this.assembler = assembler;
    }

    get url() {
        return `${API_CONFIG.baseUrl}${this.endpointUrl}`;
    }

    async getAll() {
        const response = await this.request("");

        if (Array.isArray(response)) {
            return this.assembler ? this.assembler.toEntities(response) : response;
        }

        const data = response?.data ?? [];

        return this.assembler ? this.assembler.toEntities(data) : data;
    }

    async getById(id) {
        const response = await this.request(`/${id}`);
        const data = response?.data ?? response;

        return this.assembler ? this.assembler.toEntity(data) : data;
    }

    async create(entity) {
        const resource = this.assembler ? this.assembler.toResource(entity) : entity;

        const response = await this.request("", {
            method: "POST",
            body: JSON.stringify(resource),
        });

        const data = response?.data ?? response;

        return this.assembler ? this.assembler.toEntity(data) : data;
    }

    async update(id, entity) {
        const resource = this.assembler ? this.assembler.toResource(entity) : entity;

        const response = await this.request(`/${id}`, {
            method: "PUT",
            body: JSON.stringify(resource),
        });

        const data = response?.data ?? response;

        return this.assembler ? this.assembler.toEntity(data) : data;
    }

    async patch(id, partialResource) {
        const response = await this.request(`/${id}`, {
            method: "PATCH",
            body: JSON.stringify(partialResource),
        });

        const data = response?.data ?? response;

        return this.assembler ? this.assembler.toEntity(data) : data;
    }

    async delete(id) {
        return this.request(`/${id}`, {
            method: "DELETE",
        });
    }

    async request(path = "", options = {}) {
        const requestUrl = `${this.url}${path}`;

        const response = await fetch(requestUrl, {
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