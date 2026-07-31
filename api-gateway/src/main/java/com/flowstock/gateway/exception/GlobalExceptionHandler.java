package com.flowstock.gateway.exception;

import com.flowstock.gateway.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ServerWebExchange;

import java.time.OffsetDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception ex, ServerWebExchange exchange) {
        log.error("Unhandled error for request {}", exchange.getRequest().getPath(), ex);
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        ErrorResponse body = new ErrorResponse(
                OffsetDateTime.now().toString(),
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                exchange.getRequest().getPath().value()
        );
        return ResponseEntity.status(status).body(body);
    }
}
