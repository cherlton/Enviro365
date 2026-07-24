package com.enviro.assessment.junior.cherlton.service;

import com.enviro.assessment.junior.cherlton.dto.InvestorDTO;
import com.enviro.assessment.junior.cherlton.dto.PortfolioDTO;
import com.enviro.assessment.junior.cherlton.exception.ResourceNotFoundException;
import com.enviro.assessment.junior.cherlton.model.Investor;
import com.enviro.assessment.junior.cherlton.repository.InvestorRepository;
import com.enviro.assessment.junior.cherlton.repository.PortfolioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class PortfolioServiceImpl implements PortfolioService {

    private final InvestorRepository investorRepository;
    private final PortfolioRepository portfolioRepository;

    public PortfolioServiceImpl(InvestorRepository investorRepository, PortfolioRepository portfolioRepository) {
        this.investorRepository = investorRepository;
        this.portfolioRepository = portfolioRepository;
    }

    @Override
    public InvestorDTO getInvestorPortfolio(Long investorId) {
        Investor investor = investorRepository.findById(investorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found with ID: " + investorId));
        return new InvestorDTO(investor);
    }

    @Override
    public List<PortfolioDTO> getPortfoliosByInvestor(Long investorId) {
        if (!investorRepository.existsById(investorId)) {
            throw new ResourceNotFoundException("Investor not found with ID: " + investorId);
        }
        return portfolioRepository.findByInvestorId(investorId).stream()
                .map(PortfolioDTO::new)
                .collect(Collectors.toList());
    }
}
