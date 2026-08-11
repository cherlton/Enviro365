package com.enviro.assessment.junior.cherlton.service;

import com.enviro.assessment.junior.cherlton.dto.AuthResponseDTO;
import com.enviro.assessment.junior.cherlton.dto.LoginRequestDTO;
import com.enviro.assessment.junior.cherlton.dto.RegisterRequestDTO;

public interface AuthService {
    AuthResponseDTO login(LoginRequestDTO loginRequest);
    AuthResponseDTO register(RegisterRequestDTO registerRequest);
    AuthResponseDTO getCurrentUser(String email);
}
