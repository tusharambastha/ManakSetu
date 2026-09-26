"""SQLAlchemy Database Models for ManakSetu Standards Knowledge Base"""
import uuid
import json
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def generate_uuid() -> str:
    return str(uuid.uuid4())

class StandardDB(Base):
    __tablename__ = "standards"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    standard_no = Column(String(120), unique=True, nullable=False, index=True)
    title = Column(Text, nullable=False)
    sector = Column(String(100), nullable=False, index=True)
    scope = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="active", index=True)
    superseded_by = Column(String(120), nullable=True)
    current_version = Column(String(120), nullable=False)
    keywords_json = Column(Text, nullable=False, default="[]")
    source_ref = Column(Text, nullable=True)
    source_url = Column(Text, nullable=True)
    last_verified_on = Column(String(20), nullable=True)
    status_verified = Column(Boolean, default=False, nullable=False)
    status_current = Column(String(30), default="active", nullable=False)
    status_in_text = Column(Text, nullable=True)
    qco_applicable = Column(Boolean, default=True, nullable=False)
    qco_reference = Column(Text, nullable=True)
    qco_verified = Column(Boolean, default=False, nullable=False)
    verification_notes = Column(Text, nullable=True)

    # Authoritative Source Metadata (Hierarchy & Provenance)
    source_type = Column(String(50), default="PENDING_VERIFICATION", nullable=False) # BIS_OFFICIAL, GOVERNMENT_GAZETTE, MINISTRY_OFFICIAL, SECONDARY_REFERENCE, PENDING_VERIFICATION
    source_authority = Column(String(150), nullable=True) # e.g. Bureau of Indian Standards, Gazette of India
    source_verified = Column(Boolean, default=False, nullable=False)
    source_verified_on = Column(String(20), nullable=True)
    source_title = Column(Text, nullable=True)
    source_document_type = Column(String(100), nullable=True) # Indian Standard, Scheme of Testing and Inspection, Gazette Notification
    official_source_url = Column(Text, nullable=True) # Official government/BIS URL only
    secondary_source_url = Column(Text, nullable=True) # Third-party/archive URL
    discovery_source_url = Column(Text, nullable=True) # Initial discovery mirror
    source_verification_status = Column(String(30), default="pending", nullable=False) # verified, pending
    status_source_url = Column(Text, nullable=True)
    status_verified_on = Column(String(20), nullable=True)
    relationship_source_url = Column(Text, nullable=True)
    relationship_verified = Column(Boolean, default=False, nullable=False)
    qco_source_verified = Column(Boolean, default=False, nullable=False)
    gazette_verified = Column(Boolean, default=False, nullable=False)
    gazette_url = Column(Text, nullable=True)
    qco_source_url = Column(Text, nullable=True)

    embedding_json = Column(Text, nullable=True) # Serialized float vector
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    amendments = relationship("AmendmentDB", back_populates="standard", cascade="all, delete-orphan", lazy="selectin")
    certification = relationship("CertificationDB", back_populates="standard", uselist=False, cascade="all, delete-orphan", lazy="selectin")
    related_standards = relationship("RelatedStandardDB", back_populates="standard", cascade="all, delete-orphan", lazy="selectin")

    @property
    def keywords(self):
        try:
            return json.loads(self.keywords_json) if self.keywords_json else []
        except Exception:
            return []

    @keywords.setter
    def keywords(self, val):
        self.keywords_json = json.dumps(val or [])

    @property
    def embedding(self):
        try:
            return json.loads(self.embedding_json) if self.embedding_json else None
        except Exception:
            return None

    @embedding.setter
    def embedding(self, val):
        self.embedding_json = json.dumps(val) if val is not None else None


class AmendmentDB(Base):
    __tablename__ = "amendments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    standard_id = Column(String(36), ForeignKey("standards.id", ondelete="CASCADE"), nullable=False, index=True)
    amendment_no = Column(String(50), nullable=False)
    issue_date = Column(String(50), nullable=True)
    details = Column(Text, nullable=True)

    standard = relationship("StandardDB", back_populates="amendments")


class CertificationDB(Base):
    __tablename__ = "certifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    standard_id = Column(String(36), ForeignKey("standards.id", ondelete="CASCADE"), nullable=False, index=True)
    scheme = Column(String(100), nullable=True)
    is_mandatory = Column(Boolean, default=True)
    order_name = Column(String(255), nullable=True)
    notifying_ministry = Column(String(255), nullable=True)
    details = Column(Text, nullable=True)

    standard = relationship("StandardDB", back_populates="certification")


class RelatedStandardDB(Base):
    __tablename__ = "related_standards"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    source_standard_id = Column(String(36), ForeignKey("standards.id", ondelete="CASCADE"), nullable=False, index=True)
    standard_no = Column(String(120), nullable=True, index=True)
    target_standard_no = Column(String(120), nullable=False, index=True)
    target_title = Column(Text, nullable=True)
    relation_type = Column(String(50), nullable=False, index=True)
    relation_verified = Column(Boolean, default=False, nullable=False)
    description = Column(Text, nullable=True)

    standard = relationship("StandardDB", back_populates="related_standards")


class AnalysisHistoryDB(Base):
    __tablename__ = "analysis_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(100), nullable=True)
    query_text = Column(Text, nullable=False)
    extracted_parameters_json = Column(Text, nullable=True)
    matched_standards_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
