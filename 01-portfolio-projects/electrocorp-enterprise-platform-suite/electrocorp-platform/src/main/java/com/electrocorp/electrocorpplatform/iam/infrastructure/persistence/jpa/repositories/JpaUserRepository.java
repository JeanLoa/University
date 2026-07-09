package com.electrocorp.electrocorpplatform.iam.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.iam.domain.model.aggregates.User;
import com.electrocorp.electrocorpplatform.iam.domain.repositories.UserRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaUserRepository extends JpaRepository<User, Long>, UserRepository {
}
