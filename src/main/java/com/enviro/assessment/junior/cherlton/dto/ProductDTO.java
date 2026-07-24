package com.enviro.assessment.junior.cherlton.dto;

import com.enviro.assessment.junior.cherlton.model.Product;

import java.math.BigDecimal;

public class ProductDTO {
    private Long id;
    private String name;
    private String type;
    private BigDecimal currentPrice;
    private BigDecimal balance;
    private BigDecimal maxWithdrawalAllowed;

    public ProductDTO() {}

    public ProductDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.type = product.getType();
        this.currentPrice = product.getCurrentPrice();
        this.balance = product.getBalance();
        this.maxWithdrawalAllowed = product.getMaxWithdrawalAllowed();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public BigDecimal getMaxWithdrawalAllowed() { return maxWithdrawalAllowed; }
    public void setMaxWithdrawalAllowed(BigDecimal maxWithdrawalAllowed) { this.maxWithdrawalAllowed = maxWithdrawalAllowed; }
}
