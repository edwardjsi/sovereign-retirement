CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    current_age INTEGER,
    retirement_age INTEGER,
    monthly_expenses NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);