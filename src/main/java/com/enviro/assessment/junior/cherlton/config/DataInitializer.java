package com.enviro.assessment.junior.cherlton.config;

import com.enviro.assessment.junior.cherlton.model.*;
import com.enviro.assessment.junior.cherlton.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final InvestorRepository investorRepository;
    private final PortfolioRepository portfolioRepository;
    private final ProductRepository productRepository;
    private final WithdrawalNoticeRepository withdrawalNoticeRepository;

    public DataInitializer(
            InvestorRepository investorRepository,
            PortfolioRepository portfolioRepository,
            ProductRepository productRepository,
            WithdrawalNoticeRepository withdrawalNoticeRepository) {
        this.investorRepository = investorRepository;
        this.portfolioRepository = portfolioRepository;
        this.productRepository = productRepository;
        this.withdrawalNoticeRepository = withdrawalNoticeRepository;
    }

    @Override
    public void run(String... args) {
        if (investorRepository.count() > 0) {
            log.info("Database already seeded.");
            return;
        }

        log.info("Seeding initial demo data for Enviro365 Investment Management System...");

        // 1. Create Products
        Product p1 = new Product("Old Mutual Retirement Annuity", "RETIREMENT", new BigDecimal("150.00"), new BigDecimal("500000.00"));
        Product p2 = new Product("Allan Gray Balanced Fund", "SAVINGS", new BigDecimal("320.50"), new BigDecimal("250000.00"));
        Product p3 = new Product("Sygnia Itrix Top 40 ETF", "TAX_FREE", new BigDecimal("75.25"), new BigDecimal("85000.00"));
        Product p4 = new Product("Coronation Wealth Builder", "SAVINGS", new BigDecimal("210.00"), new BigDecimal("120000.00"));
        Product p5 = new Product("Ninety One Retirement Preserver", "RETIREMENT", new BigDecimal("180.00"), new BigDecimal("350000.00"));

        productRepository.save(p1);
        productRepository.save(p2);
        productRepository.save(p3);
        productRepository.save(p4);
        productRepository.save(p5);

        // 2. Investor 1: Dr. Sipho Ndlovu (Age 72 -> Born 1954-05-12) - ELIGIBLE for retirement withdrawal (> 65)
        Investor investor1 = new Investor(
                "Dr. Sipho Ndlovu",
                "sipho.ndlovu@example.com",
                "0821234567",
                "123 Rosebank Road, Johannesburg",
                LocalDate.of(1954, 5, 12)
        );

        Portfolio portfolio1 = new Portfolio("Sipho's Primary Investment Portfolio", "Retirement and balanced growth funds", PortfolioType.RETIREMENT, investor1);
        portfolio1.addProduct(p1);
        portfolio1.addProduct(p2);

        Portfolio portfolio2 = new Portfolio("Sipho's Tax-Free Savings", "Tax-free index funds", PortfolioType.TAX_FREE, investor1);
        portfolio2.addProduct(p3);

        investor1.addPortfolio(portfolio1);
        investor1.addPortfolio(portfolio2);

        investorRepository.save(investor1);

        // 3. Investor 2: Thabo Mbeki Jr (Age 40 -> Born 1985-09-24) - INELIGIBLE for retirement withdrawal (<= 65)
        Investor investor2 = new Investor(
                "Thabo Mbeki Jr",
                "thabo.junior@example.com",
                "0739876543",
                "45 Waterfront Drive, Cape Town",
                LocalDate.of(1985, 9, 24)
        );

        Portfolio portfolio3 = new Portfolio("Thabo's Wealth Accelerator", "Aggressive growth savings & pension", PortfolioType.SAVINGS, investor2);
        portfolio3.addProduct(p4);
        portfolio3.addProduct(p5);

        investor2.addPortfolio(portfolio3);

        investorRepository.save(investor2);

        // 4. Initial Withdrawal Notices
        WithdrawalNotice notice1 = new WithdrawalNotice(investor1, p2, new BigDecimal("15000.00"), LocalDate.now().minusDays(10));
        notice1.setStatus(WithdrawalStatus.APPROVED);
        notice1.setReason("Home renovation expenses");

        WithdrawalNotice notice2 = new WithdrawalNotice(investor1, p1, new BigDecimal("25000.00"), LocalDate.now().minusDays(3));
        notice2.setStatus(WithdrawalStatus.APPROVED);
        notice2.setReason("Annual retirement income drawdown");

        withdrawalNoticeRepository.save(notice1);
        withdrawalNoticeRepository.save(notice2);

        log.info("Demo data seeding completed successfully! Seeded 2 investors, 3 portfolios, 5 products, and 2 notices.");
    }
}
