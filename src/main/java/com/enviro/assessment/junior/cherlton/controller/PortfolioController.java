package com.enviro.assessment.junior.cherlton.controller;

import com.enviro.assessment.junior.cherlton.dto.AddProductToPortfolioDTO;
import com.enviro.assessment.junior.cherlton.dto.CreatePortfolioRequestDTO;
import com.enviro.assessment.junior.cherlton.dto.InvestorDTO;
import com.enviro.assessment.junior.cherlton.dto.PortfolioDTO;
import com.enviro.assessment.junior.cherlton.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    /**
     * GET /api/portfolios/{investorId}
     * Retrieves investor details along with associated portfolios and product holdings.
     */
    @GetMapping("/{investorId}")
    public ResponseEntity<InvestorDTO> getInvestorPortfolio(@PathVariable Long investorId) {
        InvestorDTO investorPortfolio = portfolioService.getInvestorPortfolio(investorId);
        return ResponseEntity.ok(investorPortfolio);
    }

    /**
     * POST /api/portfolios
     * Creates a new portfolio for an investor.
     */
    @PostMapping
    public ResponseEntity<PortfolioDTO> createPortfolio(@Valid @RequestBody CreatePortfolioRequestDTO request) {
        PortfolioDTO created = portfolioService.createPortfolio(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * POST /api/portfolios/{portfolioId}/products
     * Adds an investment product directly to a portfolio.
     */
    @PostMapping("/{portfolioId}/products")
    public ResponseEntity<PortfolioDTO> addProductToPortfolio(
            @PathVariable Long portfolioId,
            @RequestBody AddProductToPortfolioDTO request) {
        if (request.getPortfolioId() == null) {
            request.setPortfolioId(portfolioId);
        }
        PortfolioDTO updated = portfolioService.addProductToPortfolio(request);
        return new ResponseEntity<>(updated, HttpStatus.CREATED);
    }
}
