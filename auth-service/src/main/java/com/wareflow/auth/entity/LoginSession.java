package com.wareflow.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "login_sessions",
        indexes = {
                @Index(name = "idx_login_sessions_user_id", columnList = "user_id"),
                @Index(name = "idx_login_sessions_refresh_token_id", columnList = "refresh_token_id")
        })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "refresh_token_id")
    private UUID refreshTokenId;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "device_name", length = 200)
    private String deviceName;

    @Column(name = "os", length = 100)
    private String os;

    @Column(name = "browser", length = 100)
    private String browser;

    @Column(name = "location", length = 200)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SessionStatus status = SessionStatus.ACTIVE;

    @Column(name = "last_active_at")
    private Instant lastActiveAt;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "terminated_at")
    private Instant terminatedAt;

    public enum SessionStatus {
        ACTIVE, LOGGED_OUT, EXPIRED, REVOKED
    }
}
