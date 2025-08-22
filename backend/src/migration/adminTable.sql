-- Up migration
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- ex: admin, superadmin
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Down migration
DROP TABLE admins;
