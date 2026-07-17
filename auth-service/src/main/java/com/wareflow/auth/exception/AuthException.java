package com.wareflow.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AuthException extends ResponseStatusException {

    private final String errorCode;

    public AuthException(HttpStatus status, String message, String errorCode) {
        super(status, message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    // ── Factory methods ────────────────────────────────────────────────────────

    public static AuthException emailAlreadyExists(String email) {
        return new AuthException(HttpStatus.CONFLICT,
                "An account with email '" + email + "' already exists",
                "EMAIL_ALREADY_EXISTS");
    }

    public static AuthException invalidCredentials() {
        return new AuthException(HttpStatus.UNAUTHORIZED,
                "Invalid email or password",
                "INVALID_CREDENTIALS");
    }

    public static AuthException accountLocked() {
        return new AuthException(HttpStatus.FORBIDDEN,
                "Account is temporarily locked due to multiple failed login attempts",
                "ACCOUNT_LOCKED");
    }

    public static AuthException emailNotVerified() {
        return new AuthException(HttpStatus.FORBIDDEN,
                "Please verify your email before logging in",
                "EMAIL_NOT_VERIFIED");
    }

    public static AuthException refreshTokenMissing() {
        return new AuthException(HttpStatus.UNAUTHORIZED,
                "Refresh token is missing",
                "REFRESH_TOKEN_MISSING");
    }

    public static AuthException invalidRefreshToken() {
        return new AuthException(HttpStatus.UNAUTHORIZED,
                "Refresh token is invalid or expired",
                "INVALID_REFRESH_TOKEN");
    }

    public static AuthException refreshTokenCompromised() {
        return new AuthException(HttpStatus.UNAUTHORIZED,
                "Security alert: token reuse detected. All sessions have been revoked.",
                "REFRESH_TOKEN_COMPROMISED");
    }

    public static AuthException invalidVerificationToken() {
        return new AuthException(HttpStatus.BAD_REQUEST,
                "Invalid or expired email verification token",
                "INVALID_VERIFICATION_TOKEN");
    }

    public static AuthException expiredVerificationToken() {
        return new AuthException(HttpStatus.BAD_REQUEST,
                "Email verification token has expired. Please request a new one.",
                "EXPIRED_VERIFICATION_TOKEN");
    }

    public static AuthException invalidResetToken() {
        return new AuthException(HttpStatus.BAD_REQUEST,
                "Invalid or expired password reset token",
                "INVALID_RESET_TOKEN");
    }

    public static AuthException expiredResetToken() {
        return new AuthException(HttpStatus.BAD_REQUEST,
                "Password reset token has expired. Please request a new one.",
                "EXPIRED_RESET_TOKEN");
    }

    public static AuthException userNotFound(String identifier) {
        return new AuthException(HttpStatus.NOT_FOUND,
                "User not found: " + identifier,
                "USER_NOT_FOUND");
    }
}
