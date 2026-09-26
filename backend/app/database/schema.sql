-- ==============================================================================
-- ManakSetu — Standards Engine for Tender & Utility (SIH 2026 / SIH26108)
-- PostgreSQL + pgvector Database Schema
-- ==============================================================================

-- Enable pgvector extension for dense vector similarity search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Enum types (optional / enforced via CHECK constraints for portability)
-- Relation types: 'normative_reference', 'test_method', 'terminology', 'safety', 'installation', 'related_product'
-- Status: 'active', 'superseded', 'withdrawn'
-- Schemes: 'BIS Product Certification', 'CRS', 'Hallmarking', 'QCO Mandatory'

-- 1. Primary Standards Table
CREATE TABLE IF NOT EXISTS standards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    standard_no VARCHAR(120) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    sector VARCHAR(100) NOT NULL,
    scope TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'superseded', 'withdrawn')),
    superseded_by VARCHAR(120),
    current_version VARCHAR(120) NOT NULL,
    keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
    source_ref TEXT,
    embedding vector(384), -- BAAI/bge-small-en-v1.5 / all-MiniLM-L6-v2 384 dimensions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes on Standards table
CREATE INDEX IF NOT EXISTS idx_standards_no ON standards (standard_no);
CREATE INDEX IF NOT EXISTS idx_standards_sector ON standards (sector);
CREATE INDEX IF NOT EXISTS idx_standards_status ON standards (status);
CREATE INDEX IF NOT EXISTS idx_standards_keywords ON standards USING gin (keywords);

-- Vector Cosine Similarity Index (HNSW for rapid approximate nearest neighbors)
CREATE INDEX IF NOT EXISTS idx_standards_embedding_hnsw 
ON standards USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 2. Amendments Table
CREATE TABLE IF NOT EXISTS amendments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    standard_id UUID NOT NULL REFERENCES standards(id) ON DELETE CASCADE,
    amendment_no VARCHAR(50) NOT NULL,
    issue_date VARCHAR(50),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_amendments_standard_id ON amendments (standard_id);

-- 3. Certifications Table (BIS Product Certification / ISI mark, CRS, Hallmarking, QCO)
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    standard_id UUID NOT NULL REFERENCES standards(id) ON DELETE CASCADE,
    scheme VARCHAR(100) NOT NULL CHECK (scheme IN ('BIS Product Certification', 'CRS', 'Hallmarking', 'QCO Mandatory', 'None')),
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    order_name VARCHAR(255),
    notifying_ministry VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_certifications_standard_id ON certifications (standard_id);
CREATE INDEX IF NOT EXISTS idx_certifications_scheme ON certifications (scheme);

-- 4. Related Standards (Allied Standards & Normative Relationships)
CREATE TABLE IF NOT EXISTS related_standards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_standard_id UUID NOT NULL REFERENCES standards(id) ON DELETE CASCADE,
    target_standard_no VARCHAR(120) NOT NULL,
    target_title TEXT,
    relation_type VARCHAR(50) NOT NULL CHECK (
        relation_type IN (
            'normative_reference',
            'test_method',
            'terminology',
            'safety',
            'installation',
            'related_product'
        )
    ),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_standard_relation UNIQUE (source_standard_id, target_standard_no, relation_type)
);

CREATE INDEX IF NOT EXISTS idx_related_source_id ON related_standards (source_standard_id);
CREATE INDEX IF NOT EXISTS idx_related_target_no ON related_standards (target_standard_no);
CREATE INDEX IF NOT EXISTS idx_related_relation_type ON related_standards (relation_type);

-- 5. Search Audit & Analysis Logs (for session history / audit trail)
CREATE TABLE IF NOT EXISTS analysis_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100),
    query_text TEXT NOT NULL,
    extracted_parameters JSONB,
    matched_standards JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history (created_at DESC);
