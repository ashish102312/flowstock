-- V5: Login sessions (device/session management)
CREATE TABLE login_sessions (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_id UUID,
    ip_address       VARCHAR(50),
    user_agent       VARCHAR(500),
    device_name      VARCHAR(200),
    os               VARCHAR(100),
    browser          VARCHAR(100),
    location         VARCHAR(200),
    status           VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    last_active_at   TIMESTAMPTZ,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    terminated_at    TIMESTAMPTZ
);

CREATE INDEX idx_login_sessions_user_id          ON login_sessions(user_id);
CREATE INDEX idx_login_sessions_refresh_token_id ON login_sessions(refresh_token_id);
CREATE INDEX idx_login_sessions_status           ON login_sessions(status);
