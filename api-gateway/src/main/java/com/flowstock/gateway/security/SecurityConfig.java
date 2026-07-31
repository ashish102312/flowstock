package com.flowstock.gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * Security configuration for the Gateway.
 *
 * Current behavior:
 * - Permit all requests under /api/auth/**
 * - Permit actuator and eureka endpoints
 * - Other endpoints are currently permitted to allow iterative development.
 *
 * To enable JWT-based authentication later, change `.anyExchange().permitAll()`
 * to `.anyExchange().authenticated()` and implement a reactive AuthenticationManager
 * together with the `JwtAuthenticationFilter`.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                .cors().and()
                .csrf().disable()
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/api/auth/**").permitAll()
                        .pathMatchers("/actuator/**", "/eureka/**", "/actuator/health", "/actuator/info").permitAll()
                        // TODO: switch to authenticated() to enable JWT enforcement
                        .anyExchange().permitAll()
                )
                .httpBasic().disable();

        return http.build();
    }
}
