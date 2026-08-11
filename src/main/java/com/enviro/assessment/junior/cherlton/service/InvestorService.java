package com.enviro.assessment.junior.cherlton.service;

import com.enviro.assessment.junior.cherlton.dto.InvestorDTO;
import com.enviro.assessment.junior.cherlton.dto.UpdateInvestorRequestDTO;

import java.util.List;

public interface InvestorService {
    List<InvestorDTO> getAllInvestors();
    InvestorDTO getInvestorById(Long id);
    InvestorDTO updateInvestor(Long id, UpdateInvestorRequestDTO request);
}
