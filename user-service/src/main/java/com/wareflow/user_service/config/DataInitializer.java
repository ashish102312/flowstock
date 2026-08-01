package com.wareflow.user_service.config;

import com.wareflow.user_service.entity.UserProfile;
import com.wareflow.user_service.repository.UserProfileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Random;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserProfileRepository repository;
    private final Random random = new Random();

    public DataInitializer(UserProfileRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            List<UserProfile> demoProfiles = List.of(
                new UserProfile("10001", generateIndianPhoneNumber(), 
                    "Plot No. 45, Industrial Area Phase-I, Chandigarh - 160002", 
                    "Chandigarh Central Logistics & Distribution Hub"),
                
                new UserProfile("10002", generateIndianPhoneNumber(), 
                    "Focal Point Phase VIII, Mangli, Ludhiana, Punjab - 141010", 
                    "Ludhiana Textile & Heavy Machinery Fulfillment Hub"),
                
                new UserProfile("10003", generateIndianPhoneNumber(), 
                    "Plot 204, Industrial Area Phase VII, SAS Nagar (Mohali), Punjab - 160055", 
                    "Mohali High-Tech & IT Procurement Center"),
                
                new UserProfile("10004", generateIndianPhoneNumber(), 
                    "Sector 12, SIDCUL Industrial Area, Baddi, Himachal Pradesh - 173205", 
                    "Baddi Pharmaceutical & Cold Storage Warehouse"),
                
                new UserProfile("10005", generateIndianPhoneNumber(), 
                    "GT Road, Near Jalandhar Bye-Pass, Amritsar, Punjab - 143001", 
                    "Amritsar Agri-Supply & Border Transit Terminal"),
                
                new UserProfile("10006", generateIndianPhoneNumber(), 
                    "Plot 56, Industrial Estate, Barotiwala, Solan, Himachal Pradesh - 174103", 
                    "Solan Packaging & Electronics Assembly Depot")
            );

            repository.saveAll(demoProfiles);
        }
    }

    /**
     * Generates an authentic random Indian 10-digit mobile phone number prefixed with +91.
     * Starts with an Indian carrier mobile prefix digit (7, 8, or 9).
     */
    private String generateIndianPhoneNumber() {
        int firstDigit = 7 + random.nextInt(3); // 7, 8, or 9
        int remainingDigits = random.nextInt(1_000_000_000); // 9 digits (000000000 to 999999999)
        return String.format("+91-%d%09d", firstDigit, remainingDigits);
    }
}
