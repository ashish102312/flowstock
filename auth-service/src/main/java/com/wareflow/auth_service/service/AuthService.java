package com.wareflow.auth_service.service;

import com.wareflow.auth_service.dto.AuthRequest;
import com.wareflow.auth_service.dto.AuthResponse;
import com.wareflow.auth_service.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
}
