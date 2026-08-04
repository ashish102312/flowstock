package com.wareflow.auth_service.service;

import com.wareflow.auth_service.dto.AuthRequest;
import com.wareflow.auth_service.dto.AuthResponse;
import com.wareflow.auth_service.dto.RegisterRequest;
import com.wareflow.auth_service.entity.Role;
import com.wareflow.auth_service.entity.User;
import com.wareflow.auth_service.repository.RoleRepository;
import com.wareflow.auth_service.repository.UserRepository;
import com.wareflow.auth_service.security.CustomUserDetails;
import com.wareflow.auth_service.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Role role = roleRepository.findByName(request.getRole().toUpperCase())
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(request.getRole().toUpperCase());
                    return roleRepository.save(newRole);
                });

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Set.of(role));

        User savedUser = userRepository.save(user);
        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String jwtToken = jwtUtil.generateToken(userDetails);

        return new AuthResponse(
                jwtToken,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
        );
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtUtil.generateToken(userDetails);

        return new AuthResponse(
                jwtToken,
                user.getId(),
                user.getEmail(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
        );
    }

    @Override
    public java.util.List<java.util.Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            java.util.List<String> roles = user.getRoles().stream()
                    .map(Role::getName)
                    .map(r -> "ROLE_" + r)
                    .collect(Collectors.toList());
            return java.util.Map.<String, Object>of(
                    "id", user.getId(),
                    "firstName", user.getFirstName() != null ? user.getFirstName() : "",
                    "lastName", user.getLastName() != null ? user.getLastName() : "",
                    "email", user.getEmail(),
                    "roles", roles,
                    "emailVerified", true,
                    "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : "",
                    "status", "ACTIVE"
            );
        }).collect(Collectors.toList());
    }
}
