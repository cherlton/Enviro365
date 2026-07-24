package com.enviro.assessment.junior.tumi.repository;

import com.enviro.assessment.junior.cherlton.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByInvestorId(Long investorId);
}
