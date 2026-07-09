package com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands.CreateRoutineCommand;
import com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.resources.CreateRoutineResource;

public class CreateRoutineCommandFromResourceAssembler {
    public static CreateRoutineCommand toCommandFromResource(CreateRoutineResource resource, Long userId) {
        return new CreateRoutineCommand(
                userId,
                resource.deviceId(),
                resource.groupId(),
                resource.targetType(),
                resource.targetId(),
                resource.name(),
                resource.action(),
                resource.time(),
                resource.repeatType(),
                resource.daysOfWeek(),
                resource.intervalDays(),
                resource.startsOn()
        );
    }
}
