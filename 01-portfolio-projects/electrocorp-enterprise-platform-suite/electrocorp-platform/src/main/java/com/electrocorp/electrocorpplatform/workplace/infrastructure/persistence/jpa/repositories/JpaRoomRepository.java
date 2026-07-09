package com.electrocorp.electrocorpplatform.workplace.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.workplace.domain.model.aggregates.Room;
import com.electrocorp.electrocorpplatform.workplace.domain.repositories.RoomRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaRoomRepository extends JpaRepository<Room, Long>, RoomRepository {
}
