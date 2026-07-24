package com.enviro.assessment.junior.cherlton.controller;

import com.enviro.assessment.junior.cherlton.dto.WithdrawalNoticeDTO;
import com.enviro.assessment.junior.cherlton.dto.WithdrawalRequestDTO;
import com.enviro.assessment.junior.cherlton.service.WithdrawalService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/withdrawals")
public class WithdrawalController {

    private final WithdrawalService withdrawalService;

    public WithdrawalController(WithdrawalService withdrawalService) {
        this.withdrawalService = withdrawalService;
    }

    /**
     * POST /api/withdrawals
     * Creates a new withdrawal notice after executing business rule validations and balance calculation.
     */
    @PostMapping
    public ResponseEntity<WithdrawalNoticeDTO> createWithdrawalNotice(@Valid @RequestBody WithdrawalRequestDTO request) {
        WithdrawalNoticeDTO notice = withdrawalService.createWithdrawalNotice(request);
        return new ResponseEntity<>(notice, HttpStatus.CREATED);
    }

    /**
     * GET /api/withdrawals
     * Retrieves past withdrawal notices with optional query filter parameters.
     */
    @GetMapping
    public ResponseEntity<List<WithdrawalNoticeDTO>> getWithdrawalNotices(
            @RequestParam(required = false) Long investorId,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<WithdrawalNoticeDTO> notices = withdrawalService.getWithdrawalNotices(investorId, productId, startDate, endDate);
        return ResponseEntity.ok(notices);
    }

    /**
     * GET /api/withdrawals/export/csv
     * Streams CSV statement download with query parameter filtering.
     */
    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsvStatements(
            @RequestParam(required = false) Long investorId,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        byte[] csvData = withdrawalService.exportWithdrawalCsv(investorId, productId, startDate, endDate);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "withdrawal_statements.csv");
        headers.setContentLength(csvData.length);

        return new ResponseEntity<>(csvData, headers, HttpStatus.OK);
    }
}
