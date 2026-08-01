package com.wareflow.user_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wareflow.user_service.entity.UserProfile;
import com.wareflow.user_service.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class UserProfileControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private UserProfileRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
        repository.deleteAll();
    }

    @Test
    void testGetAndUpdateProfile() throws Exception {
        String testUserId = "99999";

        // Get profile initially (should auto-create empty profile for 5-digit ID)
        mockMvc.perform(get("/api/users/" + testUserId + "/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId", is(testUserId)));

        // Update profile with Indian phone and regional address
        UserProfile updateInfo = new UserProfile(testUserId, "+91-9876543210", "Sector 12, SIDCUL, Baddi, Himachal Pradesh", "Baddi Pharmaceutical Logistics Hub");

        mockMvc.perform(put("/api/users/" + testUserId + "/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateInfo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phoneNumber", is("+91-9876543210")))
                .andExpect(jsonPath("$.address", is("Sector 12, SIDCUL, Baddi, Himachal Pradesh")))
                .andExpect(jsonPath("$.department", is("Baddi Pharmaceutical Logistics Hub")));

        // Verify updated values via GET
        mockMvc.perform(get("/api/users/" + testUserId + "/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.department", is("Baddi Pharmaceutical Logistics Hub")));
    }
}
