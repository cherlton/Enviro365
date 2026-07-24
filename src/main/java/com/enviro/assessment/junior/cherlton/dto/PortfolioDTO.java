package com.enviro.assessment.junior.cherlton.dto;

import com.enviro.assessment.junior.cherlton.model.Portfolio;
import com.enviro.assessment.junior.cherlton.model.PortfolioType;

import java.util.List;
import java.util.stream.Collectors;

public class PortfolioDTO {
    private Long id;
    private String name;
    private String description;
    private PortfolioType type;
    private List<ProductDTO> products;

    public PortfolioDTO() {}

    public PortfolioDTO(Portfolio portfolio) {
        this.id = portfolio.getId();
        this.name = portfolio.getName();
        this.description = portfolio.getDescription();
        this.type = portfolio.getType();
        if (portfolio.getProducts() != null) {
            this.products = portfolio.getProducts().stream()
                    .map(ProductDTO::new)
                    .collect(Collectors.toList());
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public PortfolioType getType() { return type; }
    public void setType(PortfolioType type) { this.type = type; }

    public List<ProductDTO> getProducts() { return products; }
    public void setProducts(List<ProductDTO> products) { this.products = products; }
}
