package com.enviro.assessment.junior.cherlton.dto;

import com.enviro.assessment.junior.cherlton.model.WithdrawalStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateNoticeStatusDTO {

    @NotNull(message = "Status is required")
    private WithdrawalStatus status;

    private String comment;

    public UpdateNoticeStatusDTO() {
    }

    public UpdateNoticeStatusDTO(WithdrawalStatus status, String comment) {
        this.status = status;
        this.comment = comment;
    }

    public WithdrawalStatus getStatus() {
        return status;
    }

    public void setStatus(WithdrawalStatus status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
