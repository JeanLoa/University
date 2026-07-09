package com.electrocorp.electrocorpplatform.workplace.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.workplace.domain.model.aggregates.Location;
import com.electrocorp.electrocorpplatform.workplace.domain.repositories.LocationRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaLocationRepository extends JpaRepository<Location, Long>, LocationRepository {
}
