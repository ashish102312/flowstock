package com.wareflow.inventory.lock;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Distributed Lock Manager using Redis.
 * Prevents race conditions when multiple JVM instances try to reserve stock concurrently.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DistributedLockManager {

    private final RedisTemplate<String, String> redisTemplate;

    @Value("${inventory.lock.ttl-seconds:30}")
    private long lockTtl;

    @Value("${inventory.lock.retry-attempts:5}")
    private int maxRetries;

    @Value("${inventory.lock.retry-delay-ms:200}")
    private long retryDelayMs;

    /**
     * Executes the provided supplier block safely inside a Redis distributed lock.
     *
     * @param lockKey The Redis key to lock (e.g., "lock:inventory:PRODUCT_ID:WH_ID").
     * @param action  The business logic to execute while holding the lock.
     * @param <T>     Return type of the action.
     * @return Result of the action.
     */
    public <T> T executeWithLock(String lockKey, Supplier<T> action) {
        String lockValue = UUID.randomUUID().toString();
        int attempts = 0;
        boolean acquired = false;

        while (attempts < maxRetries) {
            acquired = Boolean.TRUE.equals(
                    redisTemplate.opsForValue().setIfAbsent(lockKey, lockValue, Duration.ofSeconds(lockTtl))
            );

            if (acquired) {
                log.debug("Acquired distributed lock for key: {}", lockKey);
                try {
                    return action.get();
                } finally {
                    String currentValue = redisTemplate.opsForValue().get(lockKey);
                    if (lockValue.equals(currentValue)) {
                        redisTemplate.delete(lockKey);
                        log.debug("Released distributed lock for key: {}", lockKey);
                    }
                }
            }

            attempts++;
            log.warn("Lock acquisition failed for key: {}. Attempt {}/{}", lockKey, attempts, maxRetries);
            try {
                Thread.sleep(retryDelayMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Interrupted while waiting for lock", e);
            }
        }

        throw new RuntimeException("Failed to acquire distributed lock for key: " + lockKey + " after " + maxRetries + " attempts");
    }
}
