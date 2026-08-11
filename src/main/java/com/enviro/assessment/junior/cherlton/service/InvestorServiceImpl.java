package com.enviro.assessment.junior.cherlton.service;

import com.enviro.assessment.junior.cherlton.dto.InvestorDTO;
import com.enviro.assessment.junior.cherlton.dto.UpdateInvestorRequestDTO;
import com.enviro.assessment.junior.cherlton.exception.ResourceNotFoundException;
import com.enviro.assessment.junior.cherlton.model.Investor;
import com.enviro.assessment.junior.cherlton.repository.InvestorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InvestorServiceImpl implements InvestorService {

    private final InvestorRepository investorRepository;

    public InvestorServiceImpl(InvestorRepository investorRepository) {
        this.investorRepository = investorRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvestorDTO> getAllInvestors() {
        return investorRepository.findAll().stream()
                .map(InvestorDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InvestorDTO getInvestorById(Long id) {
        Investor investor = investorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found with ID: " + id));
        return new InvestorDTO(investor);
    }

    @Override
    public InvestorDTO updateInvestor(Long id, UpdateInvestorRequestDTO request) {
        Investor investor = investorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found with ID: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            investor.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            investor.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            investor.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            investor.setAddress(request.getAddress());
        }
        if (request.getDateOfBirth() != null) {
            investor.setDateOfBirth(request.getDateOfBirth());
        }

        Investor updated = investorRepository.save(investor);
        return new InvestorDTO(updated);
    }
}
