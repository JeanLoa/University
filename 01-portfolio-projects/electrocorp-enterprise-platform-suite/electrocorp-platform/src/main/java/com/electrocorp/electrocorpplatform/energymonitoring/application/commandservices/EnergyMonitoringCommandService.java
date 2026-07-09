package com.electrocorp.electrocorpplatform.energymonitoring.application.commandservices;

import com.electrocorp.electrocorpplatform.energymonitoring.domain.model.aggregates.EnergyReading;
import com.electrocorp.electrocorpplatform.energymonitoring.domain.model.commands.CreateEnergyReadingCommand;
import com.electrocorp.electrocorpplatform.energymonitoring.domain.model.commands.UpdateEnergySamplingSettingsCommand;

public interface EnergyMonitoringCommandService {
    EnergyReading handle(CreateEnergyReadingCommand command);
    Integer handle(UpdateEnergySamplingSettingsCommand command);
}
