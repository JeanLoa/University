package com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.resources;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.RoutineAction;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.RoutineRepeatType;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.RoutineTargetType;

public record CreateRoutineResource(
        Long deviceId,
        Long groupId,
        RoutineTargetType targetType,
        Long targetId,
        String name,
        RoutineAction action,
        String time,
        RoutineRepeatType repeatType,
        String daysOfWeek,
        Integer intervalDays,
        String startsOn
) {
}
