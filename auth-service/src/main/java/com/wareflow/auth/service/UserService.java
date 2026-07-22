package com.wareflow.auth.service;

import com.wareflow.auth.dto.response.UserResponse;
import com.wareflow.auth.entity.Role;
import com.wareflow.auth.entity.User;
import com.wareflow.auth.exception.AuthException;
import com.wareflow.auth.repository.UserRepository;
import com.wareflow.auth.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final com.wareflow.auth.repository.LoginSessionRepository loginSessionRepository;
    private final com.wareflow.auth.repository.AuditLogRepository auditLogRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return new UserPrincipal(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> AuthException.userNotFound(id.toString()));
        return buildResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(UserPrincipal principal) {
        return getUserById(principal.getUserId());
    }

    private UserResponse buildResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .profilePictureUrl(user.getProfilePictureUrl())
                .emailVerified(user.isEmailVerified())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

    @Transactional(readOnly = true)
    public java.util.List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public java.util.List<com.wareflow.auth.dto.response.SessionResponse> getUserSessions(UUID userId) {
        return loginSessionRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(session -> com.wareflow.auth.dto.response.SessionResponse.builder()
                        .id(session.getId())
                        .ipAddress(session.getIpAddress())
                        .deviceName(session.getDeviceName())
                        .browser(session.getBrowser())
                        .os(session.getOs())
                        .status(session.getStatus().name())
                        .lastActiveAt(session.getLastActiveAt())
                        .createdAt(session.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public java.util.List<com.wareflow.auth.dto.response.AuditLogResponse> getUserAuditLogs(UUID userId, org.springframework.data.domain.Pageable pageable) {
        return auditLogRepository.findAllByUserIdOrderByCreatedAtDesc(userId, pageable).stream()
                .map(log -> com.wareflow.auth.dto.response.AuditLogResponse.builder()
                        .id(log.getId())
                        .action(log.getAction().name())
                        .entityId(log.getUserId() != null ? log.getUserId().toString() : null)
                        .actorEmail(log.getEmail())
                        .ipAddress(log.getIpAddress())
                        .userAgent(log.getUserAgent())
                        .details(log.getDetails())
                        .status(log.getResult().name())
                        .createdAt(log.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
