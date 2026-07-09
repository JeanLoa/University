import { BaseResponse } from "../../../shared/infrastructure/response/base.response";

export class MonitoringSummaryResponse extends BaseResponse {
    constructor({ data = null, message = "", success = true, errors = [] } = {}) {
        super({ data, message, success, errors });
    }
}