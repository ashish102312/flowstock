package com.wareflow.auth.security.oauth2;

import com.wareflow.auth.entity.User;
import com.wareflow.auth.security.UserPrincipal;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class OAuth2UserWrapper extends UserPrincipal implements OAuth2User {

    private final Map<String, Object> attributes;

    public OAuth2UserWrapper(User user, Map<String, Object> attributes) {
        super(user);
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return super.getAuthorities();
    }

    @Override
    public String getName() {
        return super.getUsername();
    }
}
