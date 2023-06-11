SELECT 'CREATE DATABASE cine-ticket-manager-test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'cine-ticket-manager-test')\gexec
