package com.wareflow.user_service.controller;

import com.wareflow.user_service.entity.UserProfile;
import com.wareflow.user_service.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService service;

    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserProfile> getProfile(@PathVariable UUID userId) {
        return ResponseEntity.ok(service.getProfile(userId));
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserProfile> updateProfile(
            @PathVariable UUID userId,
            @RequestBody UserProfile profile) {
        return ResponseEntity.ok(service.updateProfile(userId, profile));
    }
}
