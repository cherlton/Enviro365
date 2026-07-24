package com.enviro.assessment.junior.cherlton.service;

import com.enviro.assessment.junior.cherlton.dto.InvestorDTO;
import com.enviro.assessment.junior.cherlton.dto.PortfolioDTO;

import java.util.List;

public interface PortfolioService {
    InvestorDTO getInvestorPortfolio(Long investorId);
    List<PortfolioDTO> getPortfoliosByInvestor(Long investorId);
}
