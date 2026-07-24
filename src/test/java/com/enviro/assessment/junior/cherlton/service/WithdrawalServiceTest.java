package com.enviro.assessment.junior.cherlton.service;

import com.enviro.assessment.junior.cherlton.dto.WithdrawalNoticeDTO;
import com.enviro.assessment.junior.cherlton.dto.WithdrawalRequestDTO;
import com.enviro.assessment.junior.cherlton.model.*;
import com.enviro.assessment.junior.cherlton.repository.InvestorRepository;
import com.enviro.assessment.junior.cherlton.repository.ProductRepository;
import com.enviro.assessment.junior.cherlton.repository.WithdrawalNoticeRepository;
import com.enviro.assessment.junior.cherlton.validation.WithdrawalValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WithdrawalServiceTest {

    @Mock
    private InvestorRepository investorRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private WithdrawalNoticeRepository withdrawalNoticeRepository;

    @Mock
    private WithdrawalValidator withdrawalValidator;

    @InjectMocks
    private WithdrawalServiceImpl withdrawalService;

    private Investor investor;
    private Product product;

    @BeforeEach
    void setUp() {
        investor = new Investor("Test Investor", "test@example.com", "0821112222", "123 Street", LocalDate.of(1950, 1, 1));
        investor.setId(1L);

        product = new Product("Equity Savings Fund", "SAVINGS", new BigDecimal("100.00"), new BigDecimal("100000.00"));
        product.setId(10L);
    }

    @Test
    @DisplayName("Create Withdrawal Notice - Should validate, deduct product balance, and save notice")
    void testCreateWithdrawalNotice_Success() {
        WithdrawalRequestDTO request = new WithdrawalRequestDTO(1L, 10L, new BigDecimal("20000.00"), LocalDate.now(), "Medical expenses");

        when(investorRepository.findById(1L)).thenReturn(Optional.of(investor));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(withdrawalNoticeRepository.save(any(WithdrawalNotice.class))).thenAnswer(invocation -> {
            WithdrawalNotice n = invocation.getArgument(0);
            n.setId(100L);
            return n;
        });

        WithdrawalNoticeDTO response = withdrawalService.createWithdrawalNotice(request);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(new BigDecimal("20000.00"), response.getAmount());
        assertEquals(WithdrawalStatus.APPROVED, response.getStatus());

        // Verify balance deduction: 100,000 - 20,000 = 80,000
        assertEquals(new BigDecimal("80000.00"), product.getBalance());

        // Verify interactions
        verify(withdrawalValidator, times(1)).validate(investor, product, new BigDecimal("20000.00"));
        verify(productRepository, times(1)).save(product);
        verify(withdrawalNoticeRepository, times(1)).save(any(WithdrawalNotice.class));
    }
}
