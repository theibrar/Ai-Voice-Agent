-- =============================================================
-- Chatbot & Voice AI Platform - Complete Database Schema (PostgreSQL 16)
-- Location: d:\Chatbot\database\schema.sql
-- =============================================================

-- 1. Multi-Tenant Organizations & Admin Accounts
CREATE TABLE IF NOT EXISTS tenants (
    id SERIAL PRIMARY KEY,
    tenant_name VARCHAR(255) NOT NULL,
    admin_name VARCHAR(255) DEFAULT 'Lead Admin',
    admin_email VARCHAR(255) DEFAULT 'admin@apexvoice.io',
    status VARCHAR(50) DEFAULT 'production', -- production, trial, suspended
    mrr DECIMAL(10,2) DEFAULT 0.00,
    credits_balance DECIMAL(10,2) DEFAULT 0.00, -- Voice Credits per admin/tenant (defaults to $0.00)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SIP & Carrier Trunks
CREATE TABLE IF NOT EXISTS sip_trunks (
    id SERIAL PRIMARY KEY,
    carrier_name VARCHAR(100) NOT NULL,
    active_channels INT DEFAULT 0,
    max_capacity INT DEFAULT 1000,
    rate_per_min DECIMAL(6,4) DEFAULT 0.0035,
    status VARCHAR(50) DEFAULT 'online' -- online, degraded, offline
);

-- 3. Email & SMS Gateways (SMTP / SES / Twilio)
CREATE TABLE IF NOT EXISTS gateways (
    id SERIAL PRIMARY KEY,
    gateway_name VARCHAR(100) NOT NULL,
    gateway_type VARCHAR(50) DEFAULT 'smtp', -- smtp, ses, twilio
    host VARCHAR(255),
    port INT DEFAULT 587,
    username VARCHAR(255),
    password_hash VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active'
);

-- 4. Voice AI Engines & Models (LLM, STT, TTS)
CREATE TABLE IF NOT EXISTS ai_engines (
    id SERIAL PRIMARY KEY,
    engine_name VARCHAR(100) NOT NULL,
    engine_type VARCHAR(50) DEFAULT 'llm', -- llm, stt, tts
    endpoint_url VARCHAR(255),
    total_calls_executed INT DEFAULT 0,
    tokens_processed BIGINT DEFAULT 0,
    avg_latency_ms INT DEFAULT 280,
    monthly_cost DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'active'
);

-- 5. Platform Monetization & Enterprise Plans
CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    monthly_price DECIMAL(10,2) DEFAULT 0.00,
    included_minutes INT DEFAULT 0,
    concurrency_limit INT DEFAULT 10
);

-- 6. System Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Knowledge Base & Grounding RAG Documents
CREATE TABLE IF NOT EXISTS knowledge_base (
    id SERIAL PRIMARY KEY,
    source_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) DEFAULT 'pdf',
    status VARCHAR(50) DEFAULT 'indexed',
    chunk_count INT DEFAULT 0,
    size_kb INT DEFAULT 0,
    content_preview TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Customer Contacts & Outbound Leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID,
    phone VARCHAR(50) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Call Records & Telemetry Logs
CREATE TABLE IF NOT EXISTS call_records (
    id SERIAL PRIMARY KEY,
    call_id VARCHAR(100) NOT NULL UNIQUE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'completed',
    duration INT DEFAULT 0,
    jitter_ms DECIMAL(6,2) DEFAULT 0.0,
    packet_loss DECIMAL(5,2) DEFAULT 0.0,
    cost_per_hour DECIMAL(6,2) DEFAULT 0.0,
    transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Calendar Bookings & Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    appointment_id VARCHAR(100) NOT NULL UNIQUE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    agent_id VARCHAR(100),
    caller_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 30,
    status VARCHAR(50) DEFAULT 'confirmed',
    calendar_type VARCHAR(50) DEFAULT 'google',
    meeting_link VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Voice Outreach Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id INT REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'outbound',
    agent_id VARCHAR(100),
    phone_number_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    script_template TEXT,
    voice_prompt TEXT,
    total_leads INT DEFAULT 0,
    attempted_leads INT DEFAULT 0,
    successful_leads INT DEFAULT 0,
    concurrency_limit INT DEFAULT 5,
    schedule VARCHAR(100) DEFAULT 'weekdays_9_to_5',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Live Supervisor Interventions
CREATE TABLE IF NOT EXISTS supervisor_interventions (
    id SERIAL PRIMARY KEY,
    call_id VARCHAR(100) NOT NULL,
    supervisor_id VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- whisper, barge_in, takeover
    whisper_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
