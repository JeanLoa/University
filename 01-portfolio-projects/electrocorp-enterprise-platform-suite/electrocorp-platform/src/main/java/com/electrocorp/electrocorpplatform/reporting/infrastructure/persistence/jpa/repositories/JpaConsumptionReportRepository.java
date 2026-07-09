package com.electrocorp.electrocorpplatform.reporting.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.reporting.domain.model.aggregates.ConsumptionReport;
import com.electrocorp.electrocorpplatform.reporting.domain.repositories.ConsumptionReportRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaConsumptionReportRepository extends JpaRepository<ConsumptionReport, Long>, ConsumptionReportRepository {
}
