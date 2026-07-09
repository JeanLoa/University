package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.entities;

import com.electrocorp.electrocorpplatform.shared.domain.model.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "device_group_devices")
public class DeviceGroupDevice extends AuditableEntity {

    @Column(nullable = false)
    private Long deviceGroupId;

    @Column(nullable = false)
    private Long deviceId;
}
