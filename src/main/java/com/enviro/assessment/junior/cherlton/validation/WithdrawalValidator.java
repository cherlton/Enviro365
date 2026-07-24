package com.enviro.assessment.junior.cherlton.validation;

import com.enviro.assessment.junior.cherlton.exception.InvalidWithdrawalException;
import com.enviro.assessment.junior.cherlton.model.Investor;
import com.enviro.assessment.junior.cherlton.model.Product;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Dedicated Business Rule Validator component for withdrawal validation.
 * Centralizes all validation logic so it can be easily tested, maintained, and audited.
 */
@Component
public class WithdrawalValidator {

    public static final String CODE_RETIREMENT_AGE_RESTRICTION = "RETIREMENT_AGE_RESTRICTION";
    public static final String CODE_INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE";
    public static final String CODE_CAP_90_PERCENT_EXCEEDED = "CAP_90_PERCENT_EXCEEDED";

    /**
     * Executes all business validation rules against a proposed withdrawal.
     */
    public void validate(Investor investor, Product product, BigDecimal amount) {
        validateRetirementAgeRule(investor, product);
        validateBalanceSufficiencyRule(product, amount);
        validate90PercentCapRule(product, amount);
    }

    /**
     * Business Rule 1: Retirement Withdrawal Age Rule.
     * Rejects retirement withdrawals unless investor age is strictly greater than 65.
     */
    public void validateRetirementAgeRule(Investor investor, Product product) {
        if ("RETIREMENT".equalsIgnoreCase(product.getType())) {
            if (!investor.isEligibleForRetirementWithdrawal()) {
                throw new InvalidWithdrawalException(
                        CODE_RETIREMENT_AGE_RESTRICTION,
                        String.format(
                                "Retirement product withdrawal rejected. Investor '%s' is %d years old. " +
                                "Withdrawals from RETIREMENT products require investor age to be greater than 65.",
                                investor.getName(),
                                investor.getAge()
                        )
                );
            }
        }
    }

    /**
     * Business Rule 2: Balance Sufficiency Check.
     * Rejects withdrawal if requested amount exceeds available product balance.
     */
    public void validateBalanceSufficiencyRule(Product product, BigDecimal amount) {
        if (!product.hasSufficientBalance(amount)) {
            throw new InvalidWithdrawalException(
                    CODE_INSUFFICIENT_BALANCE,
                    String.format(
                            "Withdrawal rejected. Requested amount R%s exceeds current available balance of R%s for product '%s'.",
                            amount,
                            product.getBalance(),
                            product.getName()
                    )
            );
        }
    }

    /**
     * Business Rule 3: 90% Cap Rule.
     * Rejects withdrawal if requested amount exceeds 90% of current available balance.
     */
    public void validate90PercentCapRule(Product product, BigDecimal amount) {
        if (product.exceeds90PercentCap(amount)) {
            throw new InvalidWithdrawalException(
                    CODE_CAP_90_PERCENT_EXCEEDED,
                    String.format(
                            "Withdrawal rejected. Requested amount R%s exceeds maximum allowed withdrawal of 90%% (R%s) for product '%s' (Balance: R%s).",
                            amount,
                            product.getMaxWithdrawalAllowed(),
                            product.getName(),
                            product.getBalance()
                    )
            );
        }
    }
}
