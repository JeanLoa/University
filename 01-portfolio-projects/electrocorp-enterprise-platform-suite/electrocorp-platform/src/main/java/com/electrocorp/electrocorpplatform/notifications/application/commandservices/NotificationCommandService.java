package com.electrocorp.electrocorpplatform.notifications.application.commandservices;

import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.Alert;
import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.AlertRule;
import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.AlertRuleProfile;
import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.NotificationPreference;
import com.electrocorp.electrocorpplatform.notifications.domain.model.commands.ActivateAlertRuleProfileCommand;
import com.electrocorp.electrocorpplatform.notifications.domain.model.commands.CreateAlertCommand;
import com.electrocorp.electrocorpplatform.notifications.domain.model.commands.CreateAlertRuleProfileCommand;
import com.electrocorp.electrocorpplatform.notifications.domain.model.commands.CreateAlertRuleCommand;
import com.electrocorp.electrocorpplatform.notifications.domain.model.commands.DismissAlertCommand;
import com.electrocorp.electrocorpplatform.notifications.domain.model.commands.MarkAlertAsReadCommand;
import com.electrocorp.electrocorpplatform.notifications.domain.model.commands.ResolveAlertCommand;
import com.electrocorp.electrocorpplatform.notifications.domain.model.commands.ToggleAlertRuleCommand;
import com.electrocorp.electrocorpplatform.notifications.domain.model.commands.UpdateNotificationPreferenceCommand;

public interface NotificationCommandService {
    Alert handle(CreateAlertCommand command);
    Alert handle(MarkAlertAsReadCommand command);
    Alert handle(DismissAlertCommand command);
    Alert handle(ResolveAlertCommand command);
    void deleteAlert(Long userId, Long alertId);
    AlertRule handle(CreateAlertRuleCommand command);
    AlertRule handle(ToggleAlertRuleCommand command);
    void deleteRule(Long userId, Long ruleId);
    AlertRuleProfile handle(CreateAlertRuleProfileCommand command);
    AlertRuleProfile handle(ActivateAlertRuleProfileCommand command);
    NotificationPreference handle(UpdateNotificationPreferenceCommand command);
}
