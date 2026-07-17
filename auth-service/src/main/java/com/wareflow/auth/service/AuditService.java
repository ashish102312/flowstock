package com.wareflow.auth.service;

import com.wareflow.auth.entity.AuditLog;
import com.wareflow.auth.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(AuditLog.AuditAction action, UUID userId, String email,
                    String ipAddress, String userAgent,
                    String details, AuditLog.AuditResult result) {
        try {
            AuditLog entry = AuditLog.builder()
                    .action(action)
                    .userId(userId)
                    .email(email)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .details(details)
                    .result(result)
                    .build();
            auditLogRepository.save(entry);
        } catch (Exception e) {
            log.error("Failed to write audit log for action {}: {}", action, e.getMessage());
        }
    }

    @Async
    public void logSuccess(AuditLog.AuditAction action, UUID userId, String email,
                           HttpServletRequest request, String details) {
        log(action, userId, email,
                com.wareflow.auth.util.RequestUtil.extractIpAddress(request),
                com.wareflow.auth.util.RequestUtil.extractUserAgent(request),
                details, AuditLog.AuditResult.SUCCESS);
    }

    @Async
    public void logFailure(AuditLog.AuditAction action, String email,
                           HttpServletRequest request, String details) {
        log(action, null, email,
                com.wareflow.auth.util.RequestUtil.extractIpAddress(request),
                com.wareflow.auth.util.RequestUtil.extractUserAgent(request),
                details, AuditLog.AuditResult.FAILURE);
    }
}
