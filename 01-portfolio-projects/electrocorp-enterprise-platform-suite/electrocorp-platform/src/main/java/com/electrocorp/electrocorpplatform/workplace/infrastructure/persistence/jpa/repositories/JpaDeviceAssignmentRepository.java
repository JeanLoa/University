package com.electrocorp.electrocorpplatform.workplace.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.workplace.domain.model.aggregates.DeviceAssignment;
import com.electrocorp.electrocorpplatform.workplace.domain.repositories.DeviceAssignmentRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaDeviceAssignmentRepository extends JpaRepository<DeviceAssignment, Long>, DeviceAssignmentRepository {
}
