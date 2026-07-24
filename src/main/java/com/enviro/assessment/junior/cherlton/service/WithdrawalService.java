package com.enviro.assessment.junior.cherlton.service;

import com.enviro.assessment.junior.cherlton.dto.WithdrawalNoticeDTO;
import com.enviro.assessment.junior.cherlton.dto.WithdrawalRequestDTO;

import java.time.LocalDate;
import java.util.List;

public interface WithdrawalService {
    WithdrawalNoticeDTO createWithdrawalNotice(WithdrawalRequestDTO request);
    List<WithdrawalNoticeDTO> getWithdrawalNotices(Long investorId, Long productId, LocalDate startDate, LocalDate endDate);
    byte[] exportWithdrawalCsv(Long investorId, Long productId, LocalDate startDate, LocalDate endDate);
}
