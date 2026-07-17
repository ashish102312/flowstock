package com.wareflow.auth.service;

import com.wareflow.auth.security.UserPrincipal;
import com.wareflow.auth.security.jwt.JwtProperties;
import com.wareflow.auth.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenService {

    private static final String BLACKLIST_PREFIX = "auth:blacklist:";

    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;
    private final RedisTemplate<String, Object> redisTemplate;

    public String generateAccessToken(UserPrincipal principal) {
        return jwtUtil.generateAccessToken(principal);
    }

    public String generateRefreshToken(UserPrincipal principal) {
        return jwtUtil.generateRefreshToken(principal);
    }

    /** Blacklist an access token in Redis until it naturally expires */
    public void blacklistAccessToken(String token) {
        try {
            String tokenId = jwtUtil.extractTokenId(token);
            Date expiry = jwtUtil.extractExpiration(token);
            long ttl = expiry.getTime() - System.currentTimeMillis();
            if (ttl > 0) {
                redisTemplate.opsForValue().set(
                        BLACKLIST_PREFIX + tokenId,
                        "revoked",
                        Duration.ofMillis(ttl)
                );
                log.debug("Access token {} blacklisted for {}ms", tokenId, ttl);
            }
        } catch (Exception e) {
            log.error("Failed to blacklist token: {}", e.getMessage());
        }
    }

    /** Check if an access token has been blacklisted */
    public boolean isAccessTokenBlacklisted(String token) {
        try {
            String tokenId = jwtUtil.extractTokenId(token);
            return Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + tokenId));
        } catch (Exception e) {
            log.warn("Redis blacklist check failed, defaulting to not-blacklisted: {}", e.getMessage());
            return false;
        }
    }

    public long getAccessTokenExpirySeconds() {
        return jwtProperties.getAccessTokenExpiration();
    }

    public long getRefreshTokenExpirySeconds() {
        return jwtProperties.getRefreshTokenExpiration();
    }
}
