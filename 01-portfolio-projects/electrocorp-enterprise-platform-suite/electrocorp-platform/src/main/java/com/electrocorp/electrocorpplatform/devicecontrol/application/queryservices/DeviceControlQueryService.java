package com.electrocorp.electrocorpplatform.devicecontrol.application.queryservices;

import com.electrocorp.electrocorpplatform.devicecontrol.application.results.DeviceGroupDetails;
import com.electrocorp.electrocorpplatform.devicecontrol.application.results.OperationModePreviewResult;
import com.electrocorp.electrocorpplatform.devicecontrol.application.results.RoutineDetails;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.aggregates.Device;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.aggregates.OperationMode;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.queries.GetDeviceGroupsQuery;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.queries.GetDevicesQuery;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.queries.GetOperationModesQuery;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.queries.GetRoutinesQuery;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.queries.PreviewOperationModeQuery;

import java.util.List;

public interface DeviceControlQueryService {
    List<Device> handle(GetDevicesQuery query);
    List<RoutineDetails> handle(GetRoutinesQuery query);
    List<DeviceGroupDetails> handle(GetDeviceGroupsQuery query);
    List<OperationMode> handle(GetOperationModesQuery query);
    OperationModePreviewResult handle(PreviewOperationModeQuery query);
}
