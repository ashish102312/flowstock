-- V6: Audit logs (immutable security event trail)
CREATE TABLE audit_logs (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID,
    email      VARCHAR(255),
    action     VARCHAR(50)  NOT NULL,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    details    VARCHAR(1000),
    result     VARCHAR(20)  NOT NULL DEFAULT 'SUCCESS',
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id    ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action     ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_email      ON audit_logs(email);
