package com.wareflow.auth_service.config;

import com.wareflow.auth_service.entity.Role;
import com.wareflow.auth_service.entity.User;
import com.wareflow.auth_service.repository.RoleRepository;
import com.wareflow.auth_service.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Set;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        List<String> roles = List.of("ADMIN", "MANAGER", "CUSTOMER", "GUEST");

        for (String roleName : roles) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            }
        }

        if (userRepository.findByEmail("guest@flowstock.com").isEmpty()) {
            User guestUser = new User();
            guestUser.setFirstName("Guest");
            guestUser.setLastName("User");
            guestUser.setEmail("guest@flowstock.com");
            guestUser.setPassword(passwordEncoder.encode("guest123"));
            roleRepository.findByName("GUEST").ifPresent(role -> guestUser.setRoles(Set.of(role)));
            userRepository.save(guestUser);
        }

        // Seed default manager user for testing manager dashboard and inventory access
        if (userRepository.findByEmail("manager@flowstock.com").isEmpty()) {
            User managerUser = new User();
            managerUser.setFirstName("Sarah");
            managerUser.setLastName("Connor");
            managerUser.setEmail("manager@flowstock.com");
            managerUser.setPassword(passwordEncoder.encode("manager123"));
            roleRepository.findByName("MANAGER").ifPresent(role -> managerUser.setRoles(Set.of(role)));
            userRepository.save(managerUser);
        }
    }
}
