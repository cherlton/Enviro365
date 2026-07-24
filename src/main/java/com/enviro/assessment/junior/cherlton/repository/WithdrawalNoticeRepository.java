package com.enviro.assessment.junior.cherlton.repository;

import com.enviro.assessment.junior.cherlton.model.WithdrawalNotice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WithdrawalNoticeRepository extends JpaRepository<WithdrawalNotice, Long>, JpaSpecificationExecutor<WithdrawalNotice> {

    List<WithdrawalNotice> findByInvestorId(Long investorId);

    @Query("SELECT w FROM WithdrawalNotice w WHERE " +
           "(:investorId IS NULL OR w.investor.id = :investorId) AND " +
           "(:productId IS NULL OR w.product.id = :productId) AND " +
           "(:startDate IS NULL OR w.noticeDate >= :startDate) AND " +
           "(:endDate IS NULL OR w.noticeDate <= :endDate) " +
           "ORDER BY w.createdAt DESC")
    List<WithdrawalNotice> filterNotices(
            @Param("investorId") Long investorId,
            @Param("productId") Long productId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
