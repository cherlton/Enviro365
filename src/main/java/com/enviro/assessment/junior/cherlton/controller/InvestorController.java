package com.enviro.assessment.junior.cherlton.controller;

import com.enviro.assessment.junior.cherlton.dto.InvestorDTO;
import com.enviro.assessment.junior.cherlton.dto.UpdateInvestorRequestDTO;
import com.enviro.assessment.junior.cherlton.service.InvestorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investors")
public class InvestorController {

    private final InvestorService investorService;

    public InvestorController(InvestorService investorService) {
        this.investorService = investorService;
    }

    /**
     * GET /api/investors
     * Retrieves list of all investors in the system.
     */
    @GetMapping
    public ResponseEntity<List<InvestorDTO>> getAllInvestors() {
        List<InvestorDTO> investors = investorService.getAllInvestors();
        return ResponseEntity.ok(investors);
    }

    /**
     * GET /api/investors/{id}
     * Retrieves specific investor details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<InvestorDTO> getInvestorById(@PathVariable Long id) {
        InvestorDTO investor = investorService.getInvestorById(id);
        return ResponseEntity.ok(investor);
    }

    /**
     * PUT /api/investors/{id}
     * Updates investor contact details or personal information.
     */
    @PutMapping("/{id}")
    public ResponseEntity<InvestorDTO> updateInvestor(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInvestorRequestDTO request) {
        InvestorDTO updated = investorService.updateInvestor(id, request);
        return ResponseEntity.ok(updated);
    }
}
