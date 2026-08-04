package com.wareflow.auth_service.controller;

import com.wareflow.auth_service.dto.AuthRequest;
import com.wareflow.auth_service.dto.AuthResponse;
import com.wareflow.auth_service.dto.RegisterRequest;
import com.wareflow.auth_service.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse resp = authService.register(request);
            var user = java.util.Map.of(
                    "id", resp.getUserId(),
                    "email", resp.getEmail(),
                    "roles", resp.getRoles()
            );
            var body = java.util.Map.of("data", java.util.Map.of("accessToken", resp.getToken(), "user", user));
            return ResponseEntity.ok(body);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse resp = authService.login(request);
            var user = java.util.Map.of(
                    "id", resp.getUserId(),
                    "email", resp.getEmail(),
                    "roles", resp.getRoles()
            );
            var body = java.util.Map.of("data", java.util.Map.of("accessToken", resp.getToken(), "user", user));
            return ResponseEntity.ok(body);
        } catch (org.springframework.security.core.AuthenticationException | IllegalArgumentException e) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Invalid email or password"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logout() {
        return ResponseEntity.ok(java.util.Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/guest-login")
    public ResponseEntity<Object> guestLogin() {
        AuthRequest request = new AuthRequest("guest@flowstock.com", "guest123");
        AuthResponse resp = authService.login(request);
        var user = java.util.Map.of(
                "id", resp.getUserId(),
                "email", resp.getEmail(),
                "roles", resp.getRoles()
        );
        var body = java.util.Map.of("data", java.util.Map.of("accessToken", resp.getToken(), "user", user));
        return ResponseEntity.ok(body);
    }

    @GetMapping("/me")
    public ResponseEntity<Object> getCurrentUser(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof com.wareflow.auth_service.security.CustomUserDetails)) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Unauthorized"));
        }
        com.wareflow.auth_service.security.CustomUserDetails userDetails = (com.wareflow.auth_service.security.CustomUserDetails) authentication.getPrincipal();
        var user = userDetails.getUser();
        
        java.util.List<String> roles = authentication.getAuthorities().stream()
                .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                .map(r -> r.replace("ROLE_", ""))
                .collect(java.util.stream.Collectors.toList());
                
        var userData = java.util.Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "roles", roles
        );
        var body = java.util.Map.of("data", userData);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/users")
    public ResponseEntity<Object> getAllUsers() {
        var users = authService.getAllUsers();
        var body = java.util.Map.of("data", users);
        return ResponseEntity.ok(body);
    }
}
