package com.enviro.assessment.junior.cherlton.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Represents a financial product (e.g. Unit Trust, ETF) that can be held
 * in one or more portfolios.
 */
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;

    @Column(name = "product_type")
    private String type;

    @PositiveOrZero(message = "Current price must be zero or positive")
    @Column(name = "current_price", precision = 19, scale = 4)
    private BigDecimal currentPrice;

    @PositiveOrZero(message = "Product balance must be zero or positive")
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal balance = BigDecimal.ZERO;

    @ManyToMany(mappedBy = "products")
    private Set<Portfolio> portfolios = new HashSet<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- Lifecycle callbacks ---

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.balance == null) {
            this.balance = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- Constructors ---

    public Product() {
    }

    public Product(String name, String type, BigDecimal currentPrice) {
        this.name = name;
        this.type = type;
        this.currentPrice = currentPrice;
        this.balance = BigDecimal.ZERO;
    }

    public Product(String name, String type, BigDecimal currentPrice, BigDecimal balance) {
        this.name = name;
        this.type = type;
        this.currentPrice = currentPrice;
        this.balance = balance != null ? balance : BigDecimal.ZERO;
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    // --- OOP Domain Methods ---

    /**
     * Checks if requested amount does not exceed total available balance.
     */
    public boolean hasSufficientBalance(BigDecimal amount) {
        if (amount == null || balance == null) return false;
        return amount.compareTo(balance) <= 0;
    }

    /**
     * Calculates the maximum withdrawal amount allowed (90% of current balance).
     */
    public BigDecimal getMaxWithdrawalAllowed() {
        if (balance == null) return BigDecimal.ZERO;
        return balance.multiply(new BigDecimal("0.90")).setScale(2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Checks if requested amount exceeds 90% of available balance.
     */
    public boolean exceeds90PercentCap(BigDecimal amount) {
        if (amount == null || balance == null) return false;
        return amount.compareTo(getMaxWithdrawalAllowed()) >= 0;
    }

    /**
     * Deducts the withdrawal amount from current balance.
     */
    public void withdraw(BigDecimal amount) {
        if (amount != null && balance != null) {
            this.balance = this.balance.subtract(amount);
        }
    }

    public Set<Portfolio> getPortfolios() {
        return portfolios;
    }

    public void setPortfolios(Set<Portfolio> portfolios) {
        this.portfolios = portfolios;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
