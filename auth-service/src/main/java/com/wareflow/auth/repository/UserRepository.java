package com.wareflow.auth.repository;

import com.wareflow.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = u.failedLoginAttempts + 1 WHERE u.id = :id")
    void incrementFailedAttempts(UUID id);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = 0, u.locked = false, u.lockedUntil = null WHERE u.id = :id")
    void resetFailedAttempts(UUID id);
}
