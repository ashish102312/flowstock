package com.wareflow.user_service.controller;

import com.wareflow.user_service.entity.UserProfile;
import com.wareflow.user_service.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    private final UserProfileService service;

    public UserProfileController(UserProfileService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<java.util.List<UserProfile>> getAllProfiles() {
        return ResponseEntity.ok(service.getAllProfiles());
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserProfile> getProfile(@PathVariable String userId) {
        return ResponseEntity.ok(service.getProfile(userId));
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserProfile> updateProfile(
            @PathVariable String userId,
            @RequestBody UserProfile profile) {
        return ResponseEntity.ok(service.updateProfile(userId, profile));
    }
}
