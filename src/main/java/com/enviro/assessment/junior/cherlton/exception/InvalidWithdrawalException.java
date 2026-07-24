package com.enviro.assessment.junior.cherlton.exception;

public class InvalidWithdrawalException extends RuntimeException {

    private final String errorCode;

    public InvalidWithdrawalException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
