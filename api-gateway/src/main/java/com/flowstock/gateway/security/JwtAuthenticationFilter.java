package com.flowstock.gateway.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

/**
 * Placeholder JWT filter for the Gateway.
 *
 * This is a reactive WebFilter that inspects Authorization headers and provides
 * a clear place to implement JWT parsing/validation in the future.
 */
@Component
public class JwtAuthenticationFilter implements WebFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String auth = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            // TODO: parse and validate JWT token, set SecurityContext with Authentication
            log.debug("Received Bearer token of length {}", token.length());
        } else {
            log.debug("No Authorization token present on request {}", exchange.getRequest().getURI());
        }

        // For now, just continue the chain. Authentication will be enforced by SecurityConfig when implemented.
        return chain.filter(exchange);
    }
}
