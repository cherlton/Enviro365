package com.enviro.assessment.junior.cherlton.controller;

import com.enviro.assessment.junior.cherlton.dto.AdminMetricsDTO;
import com.enviro.assessment.junior.cherlton.dto.ProductDTO;
import com.enviro.assessment.junior.cherlton.dto.UpdateNoticeStatusDTO;
import com.enviro.assessment.junior.cherlton.dto.WithdrawalNoticeDTO;
import com.enviro.assessment.junior.cherlton.service.AdminService;
import com.enviro.assessment.junior.cherlton.service.WithdrawalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final WithdrawalService withdrawalService;

    public AdminController(AdminService adminService, WithdrawalService withdrawalService) {
        this.adminService = adminService;
        this.withdrawalService = withdrawalService;
    }

    /**
     * GET /api/admin/metrics
     * Summary of system performance and metrics.
     */
    @GetMapping("/metrics")
    public ResponseEntity<AdminMetricsDTO> getMetrics() {
        AdminMetricsDTO metrics = adminService.getMetrics();
        return ResponseEntity.ok(metrics);
    }

    /**
     * PUT /api/admin/withdrawals/{noticeId}/status
     * Admin action to approve or reject a notice.
     */
    @PutMapping("/withdrawals/{noticeId}/status")
    public ResponseEntity<WithdrawalNoticeDTO> updateNoticeStatus(
            @PathVariable Long noticeId,
            @Valid @RequestBody UpdateNoticeStatusDTO request) {
        WithdrawalNoticeDTO updated = withdrawalService.updateNoticeStatus(noticeId, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    /**
     * POST /api/admin/products
     * Admin action to add a new system financial product.
     */
    @PostMapping("/products")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO created = adminService.createProduct(productDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
