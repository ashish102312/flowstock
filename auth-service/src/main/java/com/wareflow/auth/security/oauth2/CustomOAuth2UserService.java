package com.wareflow.auth.security.oauth2;

import com.wareflow.auth.entity.User;
import com.wareflow.auth.repository.UserRepository;
import com.wareflow.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.getOrDefault("name", "");
        String[] nameParts = name.split(" ", 2);
        String firstName = nameParts.length > 0 ? nameParts[0] : "User";
        String lastName = nameParts.length > 1 ? nameParts[1] : "";
        String picture = (String) attributes.get("picture");
        String providerId = String.valueOf(attributes.get("sub"));

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            var role = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new IllegalStateException("ROLE_USER not found"));
            return User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .provider(User.AuthProvider.GOOGLE)
                    .providerId(providerId)
                    .profilePictureUrl(picture)
                    .emailVerified(true)
                    .roles(Set.of(role))
                    .build();
        });

        // Update profile picture if changed
        user.setProfilePictureUrl(picture);
        userRepository.save(user);

        log.info("OAuth2 user loaded: {}", email);
        return new OAuth2UserWrapper(user, attributes);
    }
}
