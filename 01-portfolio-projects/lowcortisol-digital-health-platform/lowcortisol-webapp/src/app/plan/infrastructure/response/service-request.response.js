import { BaseResponse } from "../../../shared/infrastructure/response/base.response";

export class ServiceRequestResponse extends BaseResponse {
    constructor({ data = [], message = "", success = true, errors = [], total = 0 } = {}) {
        super({ data, message, success, errors });
        this.total = total || data.length;
    }
}