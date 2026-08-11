package com.enviro.assessment.junior.cherlton.service;

import com.enviro.assessment.junior.cherlton.dto.WithdrawalNoticeDTO;
import com.enviro.assessment.junior.cherlton.dto.WithdrawalRequestDTO;
import com.enviro.assessment.junior.cherlton.exception.ResourceNotFoundException;
import com.enviro.assessment.junior.cherlton.model.Investor;
import com.enviro.assessment.junior.cherlton.model.Product;
import com.enviro.assessment.junior.cherlton.model.WithdrawalNotice;
import com.enviro.assessment.junior.cherlton.model.WithdrawalStatus;
import com.enviro.assessment.junior.cherlton.repository.InvestorRepository;
import com.enviro.assessment.junior.cherlton.repository.ProductRepository;
import com.enviro.assessment.junior.cherlton.repository.WithdrawalNoticeRepository;
import com.enviro.assessment.junior.cherlton.validation.WithdrawalValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WithdrawalServiceImpl implements WithdrawalService {

    private final InvestorRepository investorRepository;
    private final ProductRepository productRepository;
    private final WithdrawalNoticeRepository withdrawalNoticeRepository;
    private final WithdrawalValidator withdrawalValidator;

    public WithdrawalServiceImpl(
            InvestorRepository investorRepository,
            ProductRepository productRepository,
            WithdrawalNoticeRepository withdrawalNoticeRepository,
            WithdrawalValidator withdrawalValidator) {
        this.investorRepository = investorRepository;
        this.productRepository = productRepository;
        this.withdrawalNoticeRepository = withdrawalNoticeRepository;
        this.withdrawalValidator = withdrawalValidator;
    }

    @Override
    public WithdrawalNoticeDTO createWithdrawalNotice(WithdrawalRequestDTO request) {
        Investor investor = investorRepository.findById(request.getInvestorId())
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found with ID: " + request.getInvestorId()));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + request.getProductId()));

        // Perform centralized validation rules
        withdrawalValidator.validate(investor, product, request.getAmount());

        // Perform balance deduction on domain model (OOP encapsulation)
        product.withdraw(request.getAmount());
        productRepository.save(product);

        // Build and persist withdrawal notice
        LocalDate noticeDate = request.getNoticeDate() != null ? request.getNoticeDate() : LocalDate.now();
        WithdrawalNotice notice = new WithdrawalNotice(investor, product, request.getAmount(), noticeDate);
        notice.setStatus(WithdrawalStatus.APPROVED);
        notice.setReason(request.getReason());

        WithdrawalNotice savedNotice = withdrawalNoticeRepository.save(notice);
        return new WithdrawalNoticeDTO(savedNotice);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WithdrawalNoticeDTO> getWithdrawalNotices(Long investorId, Long productId, LocalDate startDate, LocalDate endDate) {
        List<WithdrawalNotice> notices = withdrawalNoticeRepository.filterNotices(investorId, productId, startDate, endDate);
        return notices.stream()
                .map(WithdrawalNoticeDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportWithdrawalCsv(Long investorId, Long productId, LocalDate startDate, LocalDate endDate) {
        List<WithdrawalNotice> notices = withdrawalNoticeRepository.filterNotices(investorId, productId, startDate, endDate);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            // Write CSV Header
            writer.println("Notice ID,Notice Date,Investor Name,Investor Email,Product Name,Product Type,Amount (ZAR),Status,Reason");

            // Write CSV Data Rows
            for (WithdrawalNotice notice : notices) {
                writer.printf("%d,%s,\"%s\",\"%s\",\"%s\",%s,%.2f,%s,\"%s\"%n",
                        notice.getId(),
                        notice.getNoticeDate(),
                        notice.getInvestor() != null ? notice.getInvestor().getName() : "",
                        notice.getInvestor() != null ? notice.getInvestor().getEmail() : "",
                        notice.getProduct() != null ? notice.getProduct().getName() : "",
                        notice.getProduct() != null ? notice.getProduct().getType() : "",
                        notice.getAmount(),
                        notice.getStatus(),
                        notice.getReason() != null ? notice.getReason().replace("\"", "\"\"") : ""
                );
            }
        }
        return out.toByteArray();
    }

    @Override
    public WithdrawalNoticeDTO updateNoticeStatus(Long noticeId, WithdrawalStatus status) {
        WithdrawalNotice notice = withdrawalNoticeRepository.findById(noticeId)
                .orElseThrow(() -> new ResourceNotFoundException("Withdrawal notice not found with ID: " + noticeId));

        notice.setStatus(status);
        WithdrawalNotice updated = withdrawalNoticeRepository.save(notice);
        return new WithdrawalNoticeDTO(updated);
    }
}
