package com.wareflow.auth.controller;

import com.wareflow.auth.dto.response.ApiResponse;
import com.wareflow.auth.dto.response.UserResponse;
import com.wareflow.auth.security.UserPrincipal;
import com.wareflow.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current user's profile")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(
            @AuthenticationPrincipal UserPrincipal principal) {
        UserResponse profile = userService.getProfile(principal);
        return ResponseEntity.ok(ApiResponse.success(profile, "Profile retrieved"));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN_USER_READ') or hasRole('ROLE_ADMIN')")
    @Operation(summary = "Get all users (Admin only)")
    public ResponseEntity<ApiResponse<java.util.List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers(), "Users retrieved"));
    }

    @GetMapping("/sessions")
    @Operation(summary = "Get current user's login sessions")
    public ResponseEntity<ApiResponse<java.util.List<com.wareflow.auth.dto.response.SessionResponse>>> getMySessions(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserSessions(principal.getUserId()), "Sessions retrieved"));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get current user's audit logs")
    public ResponseEntity<ApiResponse<java.util.List<com.wareflow.auth.dto.response.AuditLogResponse>>> getMyAuditLogs(
            @AuthenticationPrincipal UserPrincipal principal,
            org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserAuditLogs(principal.getUserId(), pageable), "Audit logs retrieved"));
    }
}
