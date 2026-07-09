package com.electrocorp.electrocorpplatform.notifications.application.queryservices;

import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.Alert;
import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.AlertRule;
import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.AlertRuleProfile;
import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.NotificationPreference;
import com.electrocorp.electrocorpplatform.notifications.domain.model.queries.EvaluateAlertRulesQuery;
import com.electrocorp.electrocorpplatform.notifications.domain.model.queries.GetAlertRulesByUserQuery;
import com.electrocorp.electrocorpplatform.notifications.domain.model.queries.GetAlertRuleProfilesByUserQuery;
import com.electrocorp.electrocorpplatform.notifications.domain.model.queries.GetAlertsByUserQuery;
import com.electrocorp.electrocorpplatform.notifications.domain.model.queries.GetNotificationPreferenceQuery;
import com.electrocorp.electrocorpplatform.notifications.domain.model.results.RuleEvaluationResult;

import java.util.List;

public interface NotificationQueryService {
    List<Alert> handle(GetAlertsByUserQuery query);
    List<AlertRule> handle(GetAlertRulesByUserQuery query);
    List<AlertRuleProfile> handle(GetAlertRuleProfilesByUserQuery query);
    RuleEvaluationResult handle(EvaluateAlertRulesQuery query);
    NotificationPreference handle(GetNotificationPreferenceQuery query);
}
