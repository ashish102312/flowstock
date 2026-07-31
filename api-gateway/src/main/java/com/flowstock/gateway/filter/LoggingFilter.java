package com.flowstock.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Global Gateway filter that logs incoming requests and outgoing responses with execution time.
 */
@Component
public class LoggingFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String method = request.getMethod() != null ? request.getMethod().name() : "";
        String uri = request.getURI().getPath();
        log.info("Incoming Request: {} {}", method, uri);
        final long start = System.currentTimeMillis();

        return chain.filter(exchange).doFinally(signal -> {
            ServerHttpResponse response = exchange.getResponse();
            long time = System.currentTimeMillis() - start;
            String status = response.getStatusCode() != null ? String.valueOf(response.getStatusCode().value()) : "-";
            log.info("Outgoing Response: {}", status);
            log.info("Execution Time: {} ms", time);
        });
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE - 1;
    }
}
