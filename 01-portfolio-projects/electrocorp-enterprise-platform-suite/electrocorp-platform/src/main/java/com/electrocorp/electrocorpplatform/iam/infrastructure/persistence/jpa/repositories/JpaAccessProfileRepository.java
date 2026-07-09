package com.electrocorp.electrocorpplatform.iam.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.iam.domain.model.aggregates.AccessProfile;
import com.electrocorp.electrocorpplatform.iam.domain.repositories.AccessProfileRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaAccessProfileRepository extends JpaRepository<AccessProfile, Long>, AccessProfileRepository {
}
