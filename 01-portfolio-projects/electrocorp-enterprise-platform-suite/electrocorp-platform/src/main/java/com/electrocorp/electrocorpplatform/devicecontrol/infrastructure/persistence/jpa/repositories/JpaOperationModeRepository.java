package com.electrocorp.electrocorpplatform.devicecontrol.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.OperationModeStatus;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.aggregates.OperationMode;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.repositories.OperationModeRepository;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaOperationModeRepository extends JpaRepository<OperationMode, Long>, OperationModeRepository {

    @Override
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select mode
            from OperationMode mode
            where mode.userId = :userId
              and mode.locationId = :locationId
            order by mode.id
            """)
    List<OperationMode> findByUserIdAndLocationIdForUpdate(
            @Param("userId") Long userId,
            @Param("locationId") Long locationId
    );

    @Override
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select mode
            from OperationMode mode
            where mode.userId = :userId
              and mode.locationId = :locationId
              and mode.status = :status
            order by mode.id
            """)
    List<OperationMode> findActiveByUserIdAndLocationIdForUpdate(
            @Param("userId") Long userId,
            @Param("locationId") Long locationId,
            @Param("status") OperationModeStatus status
    );
}
