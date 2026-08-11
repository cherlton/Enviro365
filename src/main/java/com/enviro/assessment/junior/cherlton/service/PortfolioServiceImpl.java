package com.enviro.assessment.junior.cherlton.service;

import com.enviro.assessment.junior.cherlton.dto.AddProductToPortfolioDTO;
import com.enviro.assessment.junior.cherlton.dto.CreatePortfolioRequestDTO;
import com.enviro.assessment.junior.cherlton.dto.InvestorDTO;
import com.enviro.assessment.junior.cherlton.dto.PortfolioDTO;
import com.enviro.assessment.junior.cherlton.exception.ResourceNotFoundException;
import com.enviro.assessment.junior.cherlton.model.Investor;
import com.enviro.assessment.junior.cherlton.model.Portfolio;
import com.enviro.assessment.junior.cherlton.model.Product;
import com.enviro.assessment.junior.cherlton.repository.InvestorRepository;
import com.enviro.assessment.junior.cherlton.repository.PortfolioRepository;
import com.enviro.assessment.junior.cherlton.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PortfolioServiceImpl implements PortfolioService {

    private final InvestorRepository investorRepository;
    private final PortfolioRepository portfolioRepository;
    private final ProductRepository productRepository;

    public PortfolioServiceImpl(InvestorRepository investorRepository,
                                PortfolioRepository portfolioRepository,
                                ProductRepository productRepository) {
        this.investorRepository = investorRepository;
        this.portfolioRepository = portfolioRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public InvestorDTO getInvestorPortfolio(Long investorId) {
        Investor investor = investorRepository.findById(investorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found with ID: " + investorId));
        return new InvestorDTO(investor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PortfolioDTO> getPortfoliosByInvestor(Long investorId) {
        if (!investorRepository.existsById(investorId)) {
            throw new ResourceNotFoundException("Investor not found with ID: " + investorId);
        }
        return portfolioRepository.findByInvestorId(investorId).stream()
                .map(PortfolioDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public PortfolioDTO createPortfolio(CreatePortfolioRequestDTO request) {
        Investor investor = investorRepository.findById(request.getInvestorId())
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found with ID: " + request.getInvestorId()));

        Portfolio portfolio = new Portfolio(request.getName(), request.getDescription(), request.getType(), investor);
        Portfolio saved = portfolioRepository.save(portfolio);
        return new PortfolioDTO(saved);
    }

    @Override
    public PortfolioDTO addProductToPortfolio(AddProductToPortfolioDTO request) {
        Portfolio portfolio = portfolioRepository.findById(request.getPortfolioId())
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with ID: " + request.getPortfolioId()));

        Product product = new Product(request.getName(), request.getType(), request.getUnitPrice(), request.getCurrentBalance());
        Product savedProduct = productRepository.save(product);

        portfolio.addProduct(savedProduct);
        Portfolio updated = portfolioRepository.save(portfolio);
        return new PortfolioDTO(updated);
    }
}
