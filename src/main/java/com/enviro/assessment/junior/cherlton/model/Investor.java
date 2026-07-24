package com.enviro.assessment.junior.cherlton.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents an investor in the Enviro365 investment management system.
 * An investor can own multiple portfolios and file multiple withdrawal notices.
 */
@Entity
@Table(name = "investors")
public class Investor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Column(nullable = false, unique = true)
    private String email;

    @Pattern(regexp = "^(\\+27|0)[6-8][0-9]{8}$", message = "Phone must be a valid SA mobile number")
    private String phone;

    private String address;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @OneToMany(mappedBy = "investor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Portfolio> portfolios = new ArrayList<>();

    @OneToMany(mappedBy = "investor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WithdrawalNotice> withdrawalNotices = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- Lifecycle callbacks ---

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- Constructors ---

    public Investor() {
    }

    public Investor(String name, String email, String phone, String address) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    public Investor(String name, String email, String phone, String address, LocalDate dateOfBirth) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    /**
     * Calculates the investor's current age based on date of birth.
     * Encapsulates age calculation logic (OOP Domain method).
     */
    public int getAge() {
        if (dateOfBirth == null) {
            return 0;
        }
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

    /**
     * Business Rule check: Investor must be strictly older than 65 for retirement withdrawals.
     */
    public boolean isEligibleForRetirementWithdrawal() {
        return getAge() > 65;
    }

    public List<Portfolio> getPortfolios() {
        return portfolios;
    }

    public void setPortfolios(List<Portfolio> portfolios) {
        this.portfolios = portfolios;
    }

    public List<WithdrawalNotice> getWithdrawalNotices() {
        return withdrawalNotices;
    }

    public void setWithdrawalNotices(List<WithdrawalNotice> withdrawalNotices) {
        this.withdrawalNotices = withdrawalNotices;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // --- Helper methods ---

    public void addPortfolio(Portfolio portfolio) {
        portfolios.add(portfolio);
        portfolio.setInvestor(this);
    }

    public void removePortfolio(Portfolio portfolio) {
        portfolios.remove(portfolio);
        portfolio.setInvestor(null);
    }

    public void addWithdrawalNotice(WithdrawalNotice notice) {
        withdrawalNotices.add(notice);
        notice.setInvestor(this);
    }

    public void removeWithdrawalNotice(WithdrawalNotice notice) {
        withdrawalNotices.remove(notice);
        notice.setInvestor(null);
    }
}
