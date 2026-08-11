package com.enviro.assessment.junior.cherlton.service;

import com.enviro.assessment.junior.cherlton.dto.AdminMetricsDTO;
import com.enviro.assessment.junior.cherlton.dto.ProductDTO;
import com.enviro.assessment.junior.cherlton.model.Product;
import com.enviro.assessment.junior.cherlton.model.WithdrawalStatus;
import com.enviro.assessment.junior.cherlton.repository.InvestorRepository;
import com.enviro.assessment.junior.cherlton.repository.ProductRepository;
import com.enviro.assessment.junior.cherlton.repository.WithdrawalNoticeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final InvestorRepository investorRepository;
    private final ProductRepository productRepository;
    private final WithdrawalNoticeRepository withdrawalNoticeRepository;

    public AdminServiceImpl(
            InvestorRepository investorRepository,
            ProductRepository productRepository,
            WithdrawalNoticeRepository withdrawalNoticeRepository) {
        this.investorRepository = investorRepository;
        this.productRepository = productRepository;
        this.withdrawalNoticeRepository = withdrawalNoticeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminMetricsDTO getMetrics() {
        BigDecimal totalAUM = productRepository.findAll().stream()
                .map(p -> p.getBalance() != null ? p.getBalance() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalInvestors = investorRepository.count();
        long pendingNotices = withdrawalNoticeRepository.findAll().stream()
                .filter(n -> n.getStatus() == WithdrawalStatus.PENDING)
                .count();
        long totalProducts = productRepository.count();

        return new AdminMetricsDTO(totalAUM, totalInvestors, pendingNotices, totalProducts);
    }

    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = new Product(
                productDTO.getName(),
                productDTO.getType(),
                productDTO.getCurrentPrice(),
                productDTO.getBalance()
        );
        Product saved = productRepository.save(product);
        return new ProductDTO(saved);
    }
}
