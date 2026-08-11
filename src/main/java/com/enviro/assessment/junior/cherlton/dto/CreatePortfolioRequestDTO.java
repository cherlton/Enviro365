package com.enviro.assessment.junior.cherlton.dto;

import com.enviro.assessment.junior.cherlton.model.PortfolioType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreatePortfolioRequestDTO {

    @NotNull(message = "Investor ID is required")
    private Long investorId;

    @NotBlank(message = "Portfolio name is required")
    private String name;

    private String description;

    @NotNull(message = "Portfolio type is required")
    private PortfolioType type;

    public CreatePortfolioRequestDTO() {
    }

    public CreatePortfolioRequestDTO(Long investorId, String name, String description, PortfolioType type) {
        this.investorId = investorId;
        this.name = name;
        this.description = description;
        this.type = type;
    }

    public Long getInvestorId() {
        return investorId;
    }

    public void setInvestorId(Long investorId) {
        this.investorId = investorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public PortfolioType getType() {
        return type;
    }

    public void setType(PortfolioType type) {
        this.type = type;
    }
}
