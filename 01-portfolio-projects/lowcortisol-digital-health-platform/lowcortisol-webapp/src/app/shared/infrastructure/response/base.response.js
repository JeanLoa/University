export class BaseResponse {
    constructor({ data = null, message = "", success = true, errors = [] } = {}) {
        this.data = data;
        this.message = message;
        this.success = success;
        this.errors = errors;
    }
}