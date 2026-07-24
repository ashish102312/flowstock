package com.wareflow.auth.service;

import com.wareflow.auth.dto.request.*;
import com.wareflow.auth.dto.response.AuthResponse;
import com.wareflow.auth.dto.response.UserResponse;
import com.wareflow.auth.entity.*;
import com.wareflow.auth.exception.AuthException;
import com.wareflow.auth.repository.*;
import com.wareflow.auth.security.UserPrincipal;
import com.wareflow.auth.util.CookieUtil;
import com.wareflow.auth.util.RequestUtil;
import com.wareflow.auth.util.TokenHashUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final LoginSessionRepository loginSessionRepository;

    private final TokenService tokenService;
    private final EmailService emailService;
    private final AuditService auditService;

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final CookieUtil cookieUtil;

    @Value("${application.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${application.jwt.refresh-token-expiration:2592000}")
    private long refreshTokenExpirySeconds;

    @Value("${application.max-login-attempts:5}")
    private int maxLoginAttempts;

    // ── Register ───────────────────────────────────────────────────────────────

    @Transactional
    public void register(RegisterRequest request, HttpServletRequest httpRequest) {
        if (userRepository.existsByEmail(request.email())) {
            throw AuthException.emailAlreadyExists(request.email());
        }

        String requestedRoleName = "ROLE_USER";
        if (request.role() != null && !request.role().equalsIgnoreCase("USER")) {
            if (request.adminSecret() == null || !request.adminSecret().equals("flowstock-secret-2026")) {
                throw new AuthException(org.springframework.http.HttpStatus.FORBIDDEN, "Invalid admin secret for privileged role registration", "INVALID_ADMIN_SECRET");
            }
            if (request.role().equalsIgnoreCase("ADMIN")) {
                requestedRoleName = "ROLE_ADMIN";
            } else if (request.role().equalsIgnoreCase("MANAGER") || request.role().equalsIgnoreCase("OWNER")) {
                requestedRoleName = "ROLE_MANAGER";
            }
        }

        final String finalRoleName = requestedRoleName;
        Role userRole = roleRepository.findByName(finalRoleName)
                .orElseThrow(() -> new IllegalStateException("Role " + finalRoleName + " not found. Ensure DB migrations ran."));

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.password()))
                .provider(User.AuthProvider.LOCAL)
                .emailVerified(false)
                .roles(Set.of(userRole))
                .build();

        user = userRepository.save(user);

        // Issue email verification token
        String rawToken = TokenHashUtil.generateSecureToken();
        EmailVerificationToken evToken = EmailVerificationToken.builder()
                .user(user)
                .tokenHash(TokenHashUtil.hash(rawToken))
                .expiresAt(Instant.now().plusSeconds(86400)) // 24h
                .build();
        emailVerificationTokenRepository.save(evToken);

        String verificationLink = frontendUrl + "/verify-email?token=" + rawToken;
        emailService.sendEmailVerification(user.getEmail(), user.getFullName(), verificationLink);

        auditService.logSuccess(AuditLog.AuditAction.REGISTER, user.getId(),
                user.getEmail(), httpRequest, "User registered successfully");

        log.info("User registered: {}", user.getEmail());
    }

    // ── Login ──────────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest,
                              HttpServletResponse httpResponse) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> AuthException.invalidCredentials());

        // Check account lock
        if (user.isLocked()) {
            if (user.getLockedUntil() != null && Instant.now().isAfter(user.getLockedUntil())) {
                userRepository.resetFailedAttempts(user.getId());
                user.setLocked(false);
            } else {
                auditService.logFailure(AuditLog.AuditAction.ACCOUNT_LOCKED, request.email(),
                        httpRequest, "Account locked");
                throw AuthException.accountLocked();
            }
        }

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password()));

            UserPrincipal principal = (UserPrincipal) auth.getPrincipal();

            // Reset failed attempts on success
            userRepository.resetFailedAttempts(user.getId());

            // Update last login
            user.setLastLoginAt(Instant.now());
            userRepository.save(user);

            return issueTokensAndCreateSession(principal, user, httpRequest, httpResponse);

        } catch (BadCredentialsException e) {
            handleFailedLoginAttempt(user, httpRequest);
            throw AuthException.invalidCredentials();
        }
    }

    // ── Logout ─────────────────────────────────────────────────────────────────

    @Transactional
    public void logout(String accessToken, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        // 1. Blacklist the access token in Redis
        if (accessToken != null) {
            tokenService.blacklistAccessToken(accessToken);
        }

        // 2. Revoke refresh token from cookie
        cookieUtil.extractRefreshToken(httpRequest).ifPresent(rawRefreshToken -> {
            String hash = TokenHashUtil.hash(rawRefreshToken);
            refreshTokenRepository.findByTokenHash(hash).ifPresent(rt -> {
                rt.setRevoked(true);
                rt.setRevokedAt(Instant.now());
                refreshTokenRepository.save(rt);

                // Terminate associated session
                loginSessionRepository.findByRefreshTokenId(rt.getId()).ifPresent(session -> {
                    session.setStatus(LoginSession.SessionStatus.LOGGED_OUT);
                    session.setTerminatedAt(Instant.now());
                    loginSessionRepository.save(session);
                });
            });
        });

        // 3. Clear cookie
        cookieUtil.clearRefreshTokenCookie(httpResponse);

        // 4. Audit
        auditService.logSuccess(AuditLog.AuditAction.LOGOUT, null, null, httpRequest, "User logged out");
    }

    // ── Refresh Token ──────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse refreshToken(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String rawRefreshToken = cookieUtil.extractRefreshToken(httpRequest)
                .orElseThrow(() -> AuthException.refreshTokenMissing());

        String hash = TokenHashUtil.hash(rawRefreshToken);
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> AuthException.invalidRefreshToken());

        if (!storedToken.isValid()) {
            // Possible token theft — revoke all tokens for this user
            refreshTokenRepository.revokeAllByUserId(storedToken.getUser().getId());
            loginSessionRepository.terminateAllActiveSessionsByUserId(storedToken.getUser().getId());
            throw AuthException.refreshTokenCompromised();
        }

        // Revoke old refresh token (rotation)
        storedToken.setRevoked(true);
        storedToken.setRevokedAt(Instant.now());
        refreshTokenRepository.save(storedToken);

        User user = storedToken.getUser();
        UserPrincipal principal = new UserPrincipal(user);

        auditService.logSuccess(AuditLog.AuditAction.REFRESH_TOKEN, user.getId(),
                user.getEmail(), httpRequest, "Token refreshed");

        return issueTokensAndCreateSession(principal, user, httpRequest, httpResponse);
    }

    // ── Email Verification ─────────────────────────────────────────────────────

    @Transactional
    public void verifyEmail(String rawToken, HttpServletRequest httpRequest) {
        String hash = TokenHashUtil.hash(rawToken);
        EmailVerificationToken evToken = emailVerificationTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> AuthException.invalidVerificationToken());

        if (evToken.isUsed() || evToken.isExpired()) {
            throw AuthException.expiredVerificationToken();
        }

        User user = evToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        evToken.setUsed(true);
        emailVerificationTokenRepository.save(evToken);

        auditService.logSuccess(AuditLog.AuditAction.EMAIL_VERIFICATION, user.getId(),
                user.getEmail(), httpRequest, "Email verified");
    }

    // ── Forgot Password ────────────────────────────────────────────────────────

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request, HttpServletRequest httpRequest) {
        // Always return 200 to prevent email enumeration
        userRepository.findByEmail(request.email().toLowerCase()).ifPresent(user -> {
            // Delete any existing reset tokens
            passwordResetTokenRepository.deleteAllByUserId(user.getId());

            String rawToken = TokenHashUtil.generateSecureToken();
            PasswordResetToken prt = PasswordResetToken.builder()
                    .user(user)
                    .tokenHash(TokenHashUtil.hash(rawToken))
                    .expiresAt(Instant.now().plusSeconds(900)) // 15 min
                    .build();
            passwordResetTokenRepository.save(prt);

            String resetLink = frontendUrl + "/reset-password?token=" + rawToken;
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), resetLink);

            auditService.logSuccess(AuditLog.AuditAction.FORGOT_PASSWORD, user.getId(),
                    user.getEmail(), httpRequest, "Password reset requested");
        });
    }

    // ── Reset Password ─────────────────────────────────────────────────────────

    @Transactional
    public void resetPassword(ResetPasswordRequest request, HttpServletRequest httpRequest) {
        String hash = TokenHashUtil.hash(request.token());
        PasswordResetToken prt = passwordResetTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> AuthException.invalidResetToken());

        if (prt.isUsed() || prt.isExpired()) {
            throw AuthException.expiredResetToken();
        }

        User user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);

        // Revoke all sessions (security measure after password change)
        refreshTokenRepository.revokeAllByUserId(user.getId());
        loginSessionRepository.terminateAllActiveSessionsByUserId(user.getId());

        emailService.sendPasswordChangedAlert(user.getEmail(), user.getFullName());
        auditService.logSuccess(AuditLog.AuditAction.RESET_PASSWORD, user.getId(),
                user.getEmail(), httpRequest, "Password reset successful");
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private AuthResponse issueTokensAndCreateSession(UserPrincipal principal, User user,
                                                      HttpServletRequest httpRequest,
                                                      HttpServletResponse httpResponse) {
        // Generate tokens
        String accessToken = tokenService.generateAccessToken(principal);
        String rawRefreshToken = tokenService.generateRefreshToken(principal);

        // Store refresh token as hash only
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(TokenHashUtil.hash(rawRefreshToken))
                .ipAddress(RequestUtil.extractIpAddress(httpRequest))
                .userAgent(RequestUtil.extractUserAgent(httpRequest))
                .expiresAt(Instant.now().plusSeconds(refreshTokenExpirySeconds))
                .build();
        refreshToken = refreshTokenRepository.save(refreshToken);

        // Create login session
        String userAgent = RequestUtil.extractUserAgent(httpRequest);
        LoginSession session = LoginSession.builder()
                .user(user)
                .refreshTokenId(refreshToken.getId())
                .ipAddress(RequestUtil.extractIpAddress(httpRequest))
                .userAgent(userAgent)
                .deviceName(RequestUtil.parseDeviceName(userAgent))
                .browser(RequestUtil.parseBrowser(userAgent))
                .os(RequestUtil.parseOs(userAgent))
                .lastActiveAt(Instant.now())
                .build();
        loginSessionRepository.save(session);

        // Set refresh token in HttpOnly cookie
        cookieUtil.setRefreshTokenCookie(httpResponse, rawRefreshToken);

        UserResponse userResponse = buildUserResponse(user);
        return AuthResponse.of(accessToken, tokenService.getAccessTokenExpirySeconds(), userResponse);
    }

    private void handleFailedLoginAttempt(User user, HttpServletRequest httpRequest) {
        userRepository.incrementFailedAttempts(user.getId());
        int attempts = user.getFailedLoginAttempts() + 1;

        if (attempts >= maxLoginAttempts) {
            user.setLocked(true);
            user.setLockedUntil(Instant.now().plusSeconds(900)); // Lock for 15 min
            userRepository.save(user);
            auditService.logFailure(AuditLog.AuditAction.ACCOUNT_LOCKED, user.getEmail(),
                    httpRequest, "Account locked after " + attempts + " failed attempts");
        } else {
            auditService.logFailure(AuditLog.AuditAction.LOGIN_FAILED, user.getEmail(),
                    httpRequest, "Failed attempt " + attempts + "/" + maxLoginAttempts);
        }
    }

    private UserResponse buildUserResponse(User user) {
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
}
