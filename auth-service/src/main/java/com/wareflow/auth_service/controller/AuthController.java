package com.wareflow.auth_service.controller;

import com.wareflow.auth_service.dto.AuthRequest;
import com.wareflow.auth_service.dto.AuthResponse;
import com.wareflow.auth_service.dto.RegisterRequest;
import com.wareflow.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse resp = authService.register(request);
        var user = java.util.Map.of(
                "id", resp.getUserId(),
                "email", resp.getEmail(),
                "roles", resp.getRoles()
        );
        var body = java.util.Map.of("data", java.util.Map.of("accessToken", resp.getToken(), "user", user));
        return ResponseEntity.ok(body);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse resp = authService.login(request);
        var user = java.util.Map.of(
                "id", resp.getUserId(),
                "email", resp.getEmail(),
                "roles", resp.getRoles()
        );
        var body = java.util.Map.of("data", java.util.Map.of("accessToken", resp.getToken(), "user", user));
        return ResponseEntity.ok(body);
    }
}
