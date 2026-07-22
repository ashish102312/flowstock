package com.wareflow.auth.dto.response;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record AuditLogResponse(
        UUID id,
        String action,
        String entityId,
        String actorEmail,
        String ipAddress,
        String userAgent,
        String details,
        String status,
        Instant createdAt
) {
}
