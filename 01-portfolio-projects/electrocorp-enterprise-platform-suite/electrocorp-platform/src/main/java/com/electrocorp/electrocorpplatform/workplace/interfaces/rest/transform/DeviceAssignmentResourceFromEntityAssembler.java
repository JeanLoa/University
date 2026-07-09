package com.electrocorp.electrocorpplatform.workplace.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.workplace.domain.model.aggregates.DeviceAssignment;
import com.electrocorp.electrocorpplatform.workplace.interfaces.rest.resources.DeviceAssignmentResource;

public class DeviceAssignmentResourceFromEntityAssembler {
    private DeviceAssignmentResourceFromEntityAssembler() {
    }

    public static DeviceAssignmentResource toResourceFromEntity(DeviceAssignment entity) {
        return DeviceAssignmentResource.from(entity);
    }
}