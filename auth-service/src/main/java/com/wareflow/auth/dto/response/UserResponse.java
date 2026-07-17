package com.wareflow.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String profilePictureUrl,
        boolean emailVerified,
        Set<String> roles,
        Instant createdAt,
        Instant lastLoginAt
) {}
