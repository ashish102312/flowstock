-- V1: Users, Roles, Permissions, and junction tables
CREATE TABLE permissions (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(200)
);

CREATE TABLE roles (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description VARCHAR(200)
);

CREATE TABLE role_permissions (
    role_id       BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
    id                     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name             VARCHAR(100) NOT NULL,
    last_name              VARCHAR(100) NOT NULL,
    email                  VARCHAR(255) NOT NULL UNIQUE,
    password_hash          VARCHAR(255),
    provider               VARCHAR(20)  NOT NULL DEFAULT 'LOCAL',
    provider_id            VARCHAR(255),
    profile_picture_url    VARCHAR(500),
    email_verified         BOOLEAN      NOT NULL DEFAULT FALSE,
    enabled                BOOLEAN      NOT NULL DEFAULT TRUE,
    locked                 BOOLEAN      NOT NULL DEFAULT FALSE,
    failed_login_attempts  INT          NOT NULL DEFAULT 0,
    locked_until           TIMESTAMPTZ,
    last_login_at          TIMESTAMPTZ,
    created_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at             TIMESTAMPTZ
);

CREATE TABLE user_roles (
    user_id UUID   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Indexes
CREATE INDEX idx_users_email      ON users(email);
CREATE INDEX idx_users_provider_id ON users(provider_id);
