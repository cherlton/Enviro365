package com.enviro.assessment.junior.cherlton.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public class WithdrawalRequestDTO {

    @NotNull(message = "Investor ID is required")
    private Long investorId;

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Withdrawal amount is required")
    @Positive(message = "Withdrawal amount must be greater than zero")
    private BigDecimal amount;

    private LocalDate noticeDate;
    private String reason;

    public WithdrawalRequestDTO() {}

    public WithdrawalRequestDTO(Long investorId, Long productId, BigDecimal amount, LocalDate noticeDate, String reason) {
        this.investorId = investorId;
        this.productId = productId;
        this.amount = amount;
        this.noticeDate = noticeDate;
        this.reason = reason;
    }

    public Long getInvestorId() { return investorId; }
    public void setInvestorId(Long investorId) { this.investorId = investorId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getNoticeDate() { return noticeDate; }
    public void setNoticeDate(LocalDate noticeDate) { this.noticeDate = noticeDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
