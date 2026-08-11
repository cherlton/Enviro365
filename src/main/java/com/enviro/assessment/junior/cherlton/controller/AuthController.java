package com.enviro.assessment.junior.cherlton.controller;

import com.enviro.assessment.junior.cherlton.dto.AuthResponseDTO;
import com.enviro.assessment.junior.cherlton.dto.LoginRequestDTO;
import com.enviro.assessment.junior.cherlton.dto.RegisterRequestDTO;
import com.enviro.assessment.junior.cherlton.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/login
     * Authenticates investor or admin users.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        AuthResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/register
     * Registers a new Investor or Admin user.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        AuthResponseDTO response = authService.register(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/auth/me
     * Returns current user information.
     */
    @GetMapping("/me")
    public ResponseEntity<AuthResponseDTO> getCurrentUser(@RequestParam String email) {
        AuthResponseDTO response = authService.getCurrentUser(email);
        return ResponseEntity.ok(response);
    }
}
