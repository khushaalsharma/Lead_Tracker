CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'WON');

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  status lead_status NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_name ON leads (LOWER(name));
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
