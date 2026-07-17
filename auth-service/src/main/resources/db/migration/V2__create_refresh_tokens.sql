-- V2: Refresh tokens (stores SHA-256 hash only — NEVER plaintext)
CREATE TABLE refresh_tokens (
    id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash         VARCHAR(64)  NOT NULL UNIQUE,   -- SHA-256 hex
    device_fingerprint VARCHAR(500),
    user_agent         VARCHAR(500),
    ip_address         VARCHAR(50),
    expires_at         TIMESTAMPTZ  NOT NULL,
    revoked            BOOLEAN      NOT NULL DEFAULT FALSE,
    revoked_at         TIMESTAMPTZ,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id   ON refresh_tokens(user_id);
CREATE UNIQUE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
