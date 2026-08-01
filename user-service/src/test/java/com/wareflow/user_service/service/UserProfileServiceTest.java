package com.wareflow.user_service.service;

import com.wareflow.user_service.entity.UserProfile;
import com.wareflow.user_service.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserProfileServiceTest {

    @Mock
    private UserProfileRepository repository;

    @InjectMocks
    private UserProfileService service;

    private String testUserId;
    private UserProfile testProfile;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testUserId = "10001";
        testProfile = new UserProfile(testUserId, "+91-9876543210", "Plot No. 45, Industrial Area Phase-I, Chandigarh - 160002", "Chandigarh Central Logistics");
    }

    @Test
    void testGetProfile_Existing() {
        when(repository.findById(testUserId)).thenReturn(Optional.of(testProfile));

        UserProfile result = service.getProfile(testUserId);

        assertNotNull(result);
        assertEquals(testUserId, result.getUserId());
        assertEquals("+91-9876543210", result.getPhoneNumber());
        assertEquals("Chandigarh Central Logistics", result.getDepartment());
        verify(repository, times(1)).findById(testUserId);
        verify(repository, never()).save(any());
    }

    @Test
    void testGetProfile_NonExisting_CreatesDefault() {
        when(repository.findById(testUserId)).thenReturn(Optional.empty());
        when(repository.save(any(UserProfile.class))).thenAnswer(i -> i.getArgument(0));

        UserProfile result = service.getProfile(testUserId);

        assertNotNull(result);
        assertEquals(testUserId, result.getUserId());
        assertNull(result.getPhoneNumber());
        verify(repository, times(1)).findById(testUserId);
        verify(repository, times(1)).save(any(UserProfile.class));
    }

    @Test
    void testUpdateProfile() {
        UserProfile updateRequest = new UserProfile(null, "+91-8888877777", "Focal Point, Ludhiana, Punjab", "Ludhiana Fulfillment Hub");
        when(repository.findById(testUserId)).thenReturn(Optional.of(testProfile));
        when(repository.save(any(UserProfile.class))).thenAnswer(i -> i.getArgument(0));

        UserProfile updated = service.updateProfile(testUserId, updateRequest);

        assertEquals("+91-8888877777", updated.getPhoneNumber());
        assertEquals("Focal Point, Ludhiana, Punjab", updated.getAddress());
        assertEquals("Ludhiana Fulfillment Hub", updated.getDepartment());
        verify(repository, times(1)).save(testProfile);
    }
}
