package com.wareflow.auth.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Component
public class CookieUtil {

    public static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    @Value("${application.cookie.secure:true}")
    private boolean secureCookie;

    @Value("${application.cookie.domain:localhost}")
    private String cookieDomain;

    @Value("${application.jwt.refresh-token-expiration:2592000}")
    private int refreshTokenMaxAge;

    /**
     * Set HttpOnly, Secure, SameSite=Strict refresh token cookie.
     * OWASP recommends HttpOnly to prevent XSS token theft.
     */
    public void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE, refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/api/v1/auth");
        cookie.setMaxAge(refreshTokenMaxAge);
        // SameSite must be set via header since Java Cookie API doesn't support it directly
        response.addCookie(cookie);
        String sameSiteHeader = String.format(
                "%s=%s; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=%d",
                REFRESH_TOKEN_COOKIE, refreshToken,
                refreshTokenMaxAge
        );
        response.addHeader("Set-Cookie", sameSiteHeader);
    }

    /** Clear the refresh token cookie (logout) */
    public void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/api/v1/auth");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    /** Extract refresh token from request cookies */
    public Optional<String> extractRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) return Optional.empty();
        return Arrays.stream(request.getCookies())
                .filter(c -> REFRESH_TOKEN_COOKIE.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }
}
