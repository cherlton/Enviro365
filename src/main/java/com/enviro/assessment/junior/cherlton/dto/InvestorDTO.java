package com.enviro.assessment.junior.cherlton.dto;

import com.enviro.assessment.junior.cherlton.model.Investor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class InvestorDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private int age;
    private boolean eligibleForRetirement;
    private List<PortfolioDTO> portfolios;
    private java.math.BigDecimal totalInvestmentValue;

    public InvestorDTO() {}

    public InvestorDTO(Investor investor) {
        this.id = investor.getId();
        this.name = investor.getName();
        this.email = investor.getEmail();
        this.phone = investor.getPhone();
        this.address = investor.getAddress();
        this.dateOfBirth = investor.getDateOfBirth();
        this.age = investor.getAge();
        this.eligibleForRetirement = investor.isEligibleForRetirementWithdrawal();
        if (investor.getPortfolios() != null) {
            this.portfolios = investor.getPortfolios().stream()
                    .map(PortfolioDTO::new)
                    .collect(Collectors.toList());
            this.totalInvestmentValue = investor.getPortfolios().stream()
                    .flatMap(p -> p.getProducts().stream())
                    .map(prod -> prod.getBalance() != null ? prod.getBalance() : java.math.BigDecimal.ZERO)
                    .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        } else {
            this.totalInvestmentValue = java.math.BigDecimal.ZERO;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public boolean isEligibleForRetirement() { return eligibleForRetirement; }
    public void setEligibleForRetirement(boolean eligibleForRetirement) { this.eligibleForRetirement = eligibleForRetirement; }

    public List<PortfolioDTO> getPortfolios() { return portfolios; }
    public void setPortfolios(List<PortfolioDTO> portfolios) { this.portfolios = portfolios; }

    public java.math.BigDecimal getTotalInvestmentValue() { return totalInvestmentValue; }
    public void setTotalInvestmentValue(java.math.BigDecimal totalInvestmentValue) { this.totalInvestmentValue = totalInvestmentValue; }
}
