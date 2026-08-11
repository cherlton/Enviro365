package com.enviro.assessment.junior.cherlton.validation;

import com.enviro.assessment.junior.cherlton.exception.InvalidWithdrawalException;
import com.enviro.assessment.junior.cherlton.model.Investor;
import com.enviro.assessment.junior.cherlton.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class WithdrawalValidatorTest {

    private WithdrawalValidator validator;
    private Investor elderlyInvestor; // Age > 65 (Born 1950)
    private Investor youngInvestor;   // Age <= 65 (Born 1985)

    private Product retirementProduct;
    private Product savingsProduct;

    @BeforeEach
    void setUp() {
        validator = new WithdrawalValidator();

        elderlyInvestor = new Investor("Elderly Investor", "elderly@example.com", "0820000000", "123 Main St", LocalDate.of(1950, 1, 1));
        youngInvestor = new Investor("Young Investor", "young@example.com", "0830000000", "456 Side St", LocalDate.of(1985, 1, 1));

        retirementProduct = new Product("Retirement Fund", "RETIREMENT", new BigDecimal("100.00"), new BigDecimal("100000.00"));
        savingsProduct = new Product("Savings Fund", "SAVINGS", new BigDecimal("200.00"), new BigDecimal("100000.00"));
    }

    @Test
    @DisplayName("Retirement withdrawal age rule - Elderly investor (>65) should succeed")
    void testRetirementAgeRule_ElderlyInvestor_Success() {
        assertDoesNotThrow(() -> validator.validateRetirementAgeRule(elderlyInvestor, retirementProduct));
    }

    @Test
    @DisplayName("Retirement withdrawal age rule - Young investor (<=65) should fail with RETIREMENT_AGE_RESTRICTION")
    void testRetirementAgeRule_YoungInvestor_ThrowsException() {
        InvalidWithdrawalException ex = assertThrows(
                InvalidWithdrawalException.class,
                () -> validator.validateRetirementAgeRule(youngInvestor, retirementProduct)
        );
        assertEquals(WithdrawalValidator.CODE_RETIREMENT_AGE_RESTRICTION, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("require investor age to be greater than 65"));
    }

    @Test
    @DisplayName("Retirement withdrawal age rule - Young investor withdrawing from SAVINGS product should succeed")
    void testRetirementAgeRule_NonRetirementProduct_Success() {
        assertDoesNotThrow(() -> validator.validateRetirementAgeRule(youngInvestor, savingsProduct));
    }

    @Test
    @DisplayName("Balance sufficiency check - Amount within balance should succeed")
    void testBalanceSufficiency_WithinBalance_Success() {
        assertDoesNotThrow(() -> validator.validateBalanceSufficiencyRule(savingsProduct, new BigDecimal("50000.00")));
    }

    @Test
    @DisplayName("Balance sufficiency check - Amount exceeding balance should fail with INSUFFICIENT_BALANCE")
    void testBalanceSufficiency_ExceedingBalance_ThrowsException() {
        InvalidWithdrawalException ex = assertThrows(
                InvalidWithdrawalException.class,
                () -> validator.validateBalanceSufficiencyRule(savingsProduct, new BigDecimal("150000.00"))
        );
        assertEquals(WithdrawalValidator.CODE_INSUFFICIENT_BALANCE, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("exceeds current available balance"));
    }

    @Test
    @DisplayName("90% Cap Rule - Amount strictly less than 90% balance should succeed")
    void test90PercentCapRule_WithinCap_Success() {
        // Balance is 100,000; 80% is 80,000 (strictly < 90%)
        assertDoesNotThrow(() -> validator.validate90PercentCapRule(savingsProduct, new BigDecimal("80000.00")));
    }

    @Test
    @DisplayName("90% Cap Rule - Amount >= 90% balance should fail with CAP_90_PERCENT_EXCEEDED")
    void test90PercentCapRule_ExceedingCap_ThrowsException() {
        // Balance is 100,000; 90% is 90,000; requesting 90,000 (90%)
        InvalidWithdrawalException ex = assertThrows(
                InvalidWithdrawalException.class,
                () -> validator.validate90PercentCapRule(savingsProduct, new BigDecimal("90000.00"))
        );
        assertEquals(WithdrawalValidator.CODE_CAP_90_PERCENT_EXCEEDED, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("exceeds maximum allowed withdrawal of 90%"));
    }

    @Test
    @DisplayName("Full Validation - Elderly investor withdrawing 50% from retirement product should pass all rules")
    void testFullValidation_Success() {
        assertDoesNotThrow(() -> validator.validate(elderlyInvestor, retirementProduct, new BigDecimal("50000.00")));
    }
}
