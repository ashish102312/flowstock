package com.wareflow.auth.security.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "application.jwt")
@Getter
@Setter
public class JwtProperties {
    private String secretKey;
    private long accessTokenExpiration;   // seconds (default: 900)
    private long refreshTokenExpiration;  // seconds (default: 2592000 = 30 days)
    private String issuer;
}
