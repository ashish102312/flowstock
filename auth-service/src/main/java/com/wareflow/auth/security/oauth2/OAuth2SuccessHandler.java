package com.wareflow.auth.security.oauth2;

import com.wareflow.auth.entity.AuditLog;
import com.wareflow.auth.service.AuditService;
import com.wareflow.auth.service.TokenService;
import com.wareflow.auth.util.CookieUtil;
import com.wareflow.auth.util.RequestUtil;
import com.wareflow.auth.util.TokenHashUtil;
import com.wareflow.auth.entity.RefreshToken;
import com.wareflow.auth.entity.LoginSession;
import com.wareflow.auth.entity.User;
import com.wareflow.auth.repository.RefreshTokenRepository;
import com.wareflow.auth.repository.LoginSessionRepository;
import com.wareflow.auth.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final TokenService tokenService;
    private final CookieUtil cookieUtil;
    private final AuditService auditService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final LoginSessionRepository loginSessionRepository;
    private final UserRepository userRepository;

    @Value("${application.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${application.jwt.refresh-token-expiration:2592000}")
    private long refreshTokenExpirySeconds;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2UserWrapper principal = (OAuth2UserWrapper) authentication.getPrincipal();

        String accessToken = tokenService.generateAccessToken(principal);
        String rawRefreshToken = tokenService.generateRefreshToken(principal);

        // Store refresh token hash
        User user = principal.getUser();
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(TokenHashUtil.hash(rawRefreshToken))
                .ipAddress(RequestUtil.extractIpAddress(request))
                .userAgent(RequestUtil.extractUserAgent(request))
                .expiresAt(Instant.now().plusSeconds(refreshTokenExpirySeconds))
                .build();
        refreshToken = refreshTokenRepository.save(refreshToken);

        // Create login session
        String userAgent = RequestUtil.extractUserAgent(request);
        loginSessionRepository.save(LoginSession.builder()
                .user(user)
                .refreshTokenId(refreshToken.getId())
                .ipAddress(RequestUtil.extractIpAddress(request))
                .userAgent(userAgent)
                .deviceName(RequestUtil.parseDeviceName(userAgent))
                .browser(RequestUtil.parseBrowser(userAgent))
                .os(RequestUtil.parseOs(userAgent))
                .lastActiveAt(Instant.now())
                .build());

        // Update last login
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        cookieUtil.setRefreshTokenCookie(response, rawRefreshToken);

        auditService.logSuccess(AuditLog.AuditAction.OAUTH2_LOGIN,
                principal.getUserId(), principal.getUsername(), request, "OAuth2 login via Google");

        // Redirect to frontend with access token as query param (short-lived)
        String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/callback")
                .queryParam("token", accessToken)
                .build().toUriString();

        log.info("OAuth2 login successful for {}", principal.getUsername());
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
