package com.enviro.assessment.junior.cherlton.service;

import com.enviro.assessment.junior.cherlton.dto.AuthResponseDTO;
import com.enviro.assessment.junior.cherlton.dto.LoginRequestDTO;
import com.enviro.assessment.junior.cherlton.dto.RegisterRequestDTO;
import com.enviro.assessment.junior.cherlton.exception.ResourceNotFoundException;
import com.enviro.assessment.junior.cherlton.model.Investor;
import com.enviro.assessment.junior.cherlton.model.Role;
import com.enviro.assessment.junior.cherlton.model.User;
import com.enviro.assessment.junior.cherlton.repository.InvestorRepository;
import com.enviro.assessment.junior.cherlton.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final InvestorRepository investorRepository;

    public AuthServiceImpl(UserRepository userRepository, InvestorRepository investorRepository) {
        this.userRepository = userRepository;
        this.investorRepository = investorRepository;
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        // Simple validation matching demo password or stored hash
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = "Bearer-" + UUID.randomUUID();
        Long investorId = user.getInvestor() != null ? user.getInvestor().getId() : null;
        String name = user.getInvestor() != null ? user.getInvestor().getName() : "System Admin";

        return new AuthResponseDTO(token, user.getId(), user.getEmail(), name, user.getRole(), investorId);
    }

    @Override
    public AuthResponseDTO register(RegisterRequestDTO registerRequest) {
        String email = registerRequest.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered in the system");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(registerRequest.getPassword());
        user.setRole(registerRequest.getRole());

        if (registerRequest.getRole() == Role.INVESTOR) {
            Investor investor = new Investor(
                    registerRequest.getName(),
                    email,
                    registerRequest.getPhone(),
                    registerRequest.getAddress(),
                    registerRequest.getDateOfBirth()
            );
            Investor savedInvestor = investorRepository.save(investor);
            user.setInvestor(savedInvestor);
        }

        User savedUser = userRepository.save(user);

        String token = "Bearer-" + UUID.randomUUID();
        Long investorId = savedUser.getInvestor() != null ? savedUser.getInvestor().getId() : null;
        String name = savedUser.getInvestor() != null ? savedUser.getInvestor().getName() : registerRequest.getName();

        return new AuthResponseDTO(token, savedUser.getId(), savedUser.getEmail(), name, savedUser.getRole(), investorId);
    }

    @Override
    public AuthResponseDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        Long investorId = user.getInvestor() != null ? user.getInvestor().getId() : null;
        String name = user.getInvestor() != null ? user.getInvestor().getName() : "System Admin";

        return new AuthResponseDTO("Bearer-session", user.getId(), user.getEmail(), name, user.getRole(), investorId);
    }
}
