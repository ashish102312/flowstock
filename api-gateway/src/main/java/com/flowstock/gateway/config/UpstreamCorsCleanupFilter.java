package com.flowstock.gateway.config;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Removes any Access-Control-Allow-Origin header added by upstream services so the gateway
 * controls the CORS response header exclusively.
 */
@Component
public class UpstreamCorsCleanupFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            HttpHeaders headers = exchange.getResponse().getHeaders();
            // Only remove wildcard '*' values from upstream services. Preserve
            // the gateway's own specific origin header (e.g. http://localhost:5173).
            var origins = headers.get(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN);
            if (origins != null) {
                boolean hasWildcard = origins.stream().anyMatch(v -> v != null && v.trim().equals("*"));
                if (hasWildcard) {
                    headers.remove(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN);
                }
            }

            // If downstream removed the Access-Control-Allow-Origin header (or it is absent),
            // ensure the gateway provides a specific origin value from the request so browsers
            // receive a valid CORS header for credentialed requests.
            if (!headers.containsKey(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN)) {
                var origin = exchange.getRequest().getHeaders().getOrigin();
                if (origin != null && !origin.isEmpty()) {
                    headers.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, origin);
                    headers.set(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
                }
            }
        }));
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
