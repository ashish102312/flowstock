package com.wareflow.user_service.service;

import com.wareflow.user_service.entity.UserProfile;
import com.wareflow.user_service.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    private final UserProfileRepository repository;

    public UserProfileService(UserProfileRepository repository) {
        this.repository = repository;
    }

    public UserProfile getProfile(String userId) {
        return repository.findById(userId)
                .orElseGet(() -> {
                    UserProfile profile = new UserProfile();
                    profile.setUserId(userId);
                    return repository.save(profile);
                });
    }

    public UserProfile updateProfile(String userId, UserProfile updatedProfile) {
        UserProfile profile = getProfile(userId);
        profile.setPhoneNumber(updatedProfile.getPhoneNumber());
        profile.setAddress(updatedProfile.getAddress());
        profile.setDepartment(updatedProfile.getDepartment());
        return repository.save(profile);
    }
}
