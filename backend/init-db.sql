-- Initialize the database with some basic setup
-- This script will run when the PostgreSQL container starts for the first time

-- Create the database if it doesn't exist
-- (This is handled by POSTGRES_DB environment variable)

-- You can add any initial database setup here
-- For example, creating additional users, schemas, or initial data

-- Example: Create a schema for the application
-- CREATE SCHEMA IF NOT EXISTS techcare;

-- Example: Grant permissions
-- GRANT ALL PRIVILEGES ON SCHEMA techcare TO techcare_user;

-- The application will handle table creation via Hibernate DDL
-- since spring.jpa.hibernate.ddl-auto=update is set
