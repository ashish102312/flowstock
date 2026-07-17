package com.wareflow.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_logs",
        indexes = {
                @Index(name = "idx_audit_logs_user_id", columnList = "user_id"),
                @Index(name = "idx_audit_logs_action", columnList = "action"),
                @Index(name = "idx_audit_logs_created_at", columnList = "created_at")
        })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "email", length = 255)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AuditAction action;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "details", length = 1000)
    private String details;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AuditResult result = AuditResult.SUCCESS;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    public enum AuditAction {
        REGISTER, LOGIN, LOGOUT, REFRESH_TOKEN,
        FORGOT_PASSWORD, RESET_PASSWORD,
        EMAIL_VERIFICATION, RESEND_VERIFICATION,
        CHANGE_PASSWORD, UPDATE_PROFILE,
        OAUTH2_LOGIN, SESSION_REVOKED,
        LOGIN_FAILED, ACCOUNT_LOCKED
    }

    public enum AuditResult {
        SUCCESS, FAILURE
    }
}
