package com.wareflow.auth.dto.response;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record SessionResponse(
        UUID id,
        String ipAddress,
        String deviceName,
        String browser,
        String os,
        String status,
        Instant lastActiveAt,
        Instant createdAt
) {
}
