package com.enviro.assessment.junior.cherlton.controller;

import com.enviro.assessment.junior.cherlton.dto.InvestorDTO;
import com.enviro.assessment.junior.cherlton.service.PortfolioService;
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
}
