package com.electrocorp.electrocorpplatform.workplace.domain.repositories;

import com.electrocorp.electrocorpplatform.workplace.domain.model.aggregates.Location;

import java.util.List;
import java.util.Optional;

public interface LocationRepository {
    List<Location> findByUserId(Long userId);

    Optional<Location> findById(Long id);

    Location save(Location location);

    void delete(Location location);
}
