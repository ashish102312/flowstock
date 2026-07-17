package com.wareflow.auth.repository;

import com.wareflow.auth.entity.LoginSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LoginSessionRepository extends JpaRepository<LoginSession, UUID> {
    List<LoginSession> findAllByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<LoginSession> findByRefreshTokenId(UUID refreshTokenId);

    @Modifying
    @Query("UPDATE LoginSession s SET s.status = 'LOGGED_OUT', s.terminatedAt = CURRENT_TIMESTAMP WHERE s.user.id = :userId AND s.status = 'ACTIVE'")
    void terminateAllActiveSessionsByUserId(UUID userId);
}
