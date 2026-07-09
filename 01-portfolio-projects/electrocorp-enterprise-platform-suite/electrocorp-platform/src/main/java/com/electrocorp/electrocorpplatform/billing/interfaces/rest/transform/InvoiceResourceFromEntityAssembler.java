package com.electrocorp.electrocorpplatform.billing.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Invoice;
import com.electrocorp.electrocorpplatform.billing.interfaces.rest.resources.InvoiceResource;

public class InvoiceResourceFromEntityAssembler {
    private InvoiceResourceFromEntityAssembler() {
    }

    public static InvoiceResource toResourceFromEntity(Invoice entity) {
        return InvoiceResource.from(entity);
    }
}