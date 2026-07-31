package com.wareflow.user_service.service;

import com.wareflow.user_service.entity.UserProfile;
import com.wareflow.user_service.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository repository;

    public UserProfile getProfile(UUID userId) {
        return repository.findById(userId)
                .orElseGet(() -> {
                    UserProfile profile = new UserProfile();
                    profile.setUserId(userId);
                    return repository.save(profile);
                });
    }

    public UserProfile updateProfile(UUID userId, UserProfile updatedProfile) {
        UserProfile profile = getProfile(userId);
        profile.setPhoneNumber(updatedProfile.getPhoneNumber());
        profile.setAddress(updatedProfile.getAddress());
        profile.setDepartment(updatedProfile.getDepartment());
        return repository.save(profile);
    }
}
