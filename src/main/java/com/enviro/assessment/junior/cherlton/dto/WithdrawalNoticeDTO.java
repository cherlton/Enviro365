package com.enviro.assessment.junior.cherlton.dto;

import com.enviro.assessment.junior.cherlton.model.WithdrawalNotice;
import com.enviro.assessment.junior.cherlton.model.WithdrawalStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class WithdrawalNoticeDTO {
    private Long id;
    private Long investorId;
    private String investorName;
    private Long productId;
    private String productName;
    private String productType;
    private BigDecimal amount;
    private WithdrawalStatus status;
    private String reason;
    private LocalDate noticeDate;
    private LocalDateTime createdAt;

    public WithdrawalNoticeDTO() {}

    public WithdrawalNoticeDTO(WithdrawalNotice notice) {
        this.id = notice.getId();
        if (notice.getInvestor() != null) {
            this.investorId = notice.getInvestor().getId();
            this.investorName = notice.getInvestor().getName();
        }
        if (notice.getProduct() != null) {
            this.productId = notice.getProduct().getId();
            this.productName = notice.getProduct().getName();
            this.productType = notice.getProduct().getType();
        }
        this.amount = notice.getAmount();
        this.status = notice.getStatus();
        this.reason = notice.getReason();
        this.noticeDate = notice.getNoticeDate();
        this.createdAt = notice.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getInvestorId() { return investorId; }
    public void setInvestorId(Long investorId) { this.investorId = investorId; }

    public String getInvestorName() { return investorName; }
    public void setInvestorName(String investorName) { this.investorName = investorName; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public WithdrawalStatus getStatus() { return status; }
    public void setStatus(WithdrawalStatus status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDate getNoticeDate() { return noticeDate; }
    public void setNoticeDate(LocalDate noticeDate) { this.noticeDate = noticeDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
