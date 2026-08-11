package com.enviro.assessment.junior.cherlton.dto;

import java.math.BigDecimal;

public class AdminMetricsDTO {

    private BigDecimal totalAssetsUnderManagement;
    private long totalInvestors;
    private long pendingWithdrawalNotices;
    private long totalProducts;

    public AdminMetricsDTO() {
    }

    public AdminMetricsDTO(BigDecimal totalAssetsUnderManagement, long totalInvestors, long pendingWithdrawalNotices, long totalProducts) {
        this.totalAssetsUnderManagement = totalAssetsUnderManagement;
        this.totalInvestors = totalInvestors;
        this.pendingWithdrawalNotices = pendingWithdrawalNotices;
        this.totalProducts = totalProducts;
    }

    public BigDecimal getTotalAssetsUnderManagement() {
        return totalAssetsUnderManagement;
    }

    public void setTotalAssetsUnderManagement(BigDecimal totalAssetsUnderManagement) {
        this.totalAssetsUnderManagement = totalAssetsUnderManagement;
    }

    public long getTotalInvestors() {
        return totalInvestors;
    }

    public void setTotalInvestors(long totalInvestors) {
        this.totalInvestors = totalInvestors;
    }

    public long getPendingWithdrawalNotices() {
        return pendingWithdrawalNotices;
    }

    public void setPendingWithdrawalNotices(long pendingWithdrawalNotices) {
        this.pendingWithdrawalNotices = pendingWithdrawalNotices;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }
}
