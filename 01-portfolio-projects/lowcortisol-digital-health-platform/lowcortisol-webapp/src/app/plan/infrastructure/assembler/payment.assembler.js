import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { Payment } from "../../domain/model/payment.entity";
import { PaymentResource } from "../resource/payment.resource";

export class PaymentAssembler extends BaseAssembler {
    toEntity(resource) {
        return new Payment({
            id: resource.id,
            subscriptionId: resource.subscriptionId,
            amount: resource.amount,
            currency: resource.currency,
            method: resource.method,
            status: resource.status,
            paidAt: resource.paidAt,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new PaymentResource({
            id: entity.id,
            subscriptionId: entity.subscriptionId,
            amount: entity.amount,
            currency: entity.currency,
            method: entity.method,
            status: entity.status,
            paidAt: entity.paidAt,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}