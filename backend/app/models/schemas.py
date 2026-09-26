"""Pydantic Models and Request/Response Schemas for ManakSetu"""
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field, ConfigDict

# Core Enums
RelationType = Literal[
    "normative_reference",
    "test_method",
    "terminology",
    "safety",
    "installation",
    "related_product",
    "sampling",
    "international_equivalent",
    "supersedes",
    "superseded_by"
]

StandardStatus = Literal["active", "superseded", "withdrawn", "revised", "unknown"]

SourceType = Literal[
    "BIS_OFFICIAL",
    "GOVERNMENT_GAZETTE",
    "MINISTRY_OFFICIAL",
    "SECONDARY_REFERENCE",
    "PENDING_VERIFICATION"
]

CertificationScheme = Literal[
    "BIS Product Certification",
    "CRS",
    "Hallmarking",
    "QCO Mandatory",
    "None"
]

# Related Standards
class RelatedStandardBase(BaseModel):
    standard_no: Optional[str] = Field(None, description="IS standard code")
    target_standard_no: Optional[str] = Field(None, description="IS standard code e.g. IS 15298 (Part 1):2016")
    target_title: Optional[str] = Field(None, description="Title of the related standard")
    relation_type: str = Field(..., description="Type of relationship")
    relation_verified: bool = Field(False, description="Whether relationship is verified against official source")
    description: Optional[str] = Field(None, description="Scope or reason for relationship")

    def __init__(self, **data: Any):
        if "target_standard_no" not in data and "standard_no" in data:
            data["target_standard_no"] = data["standard_no"]
        elif "standard_no" not in data and "target_standard_no" in data:
            data["standard_no"] = data["target_standard_no"]
        super().__init__(**data)

class RelatedStandardCreate(RelatedStandardBase):
    pass

class RelatedStandardResponse(RelatedStandardBase):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[str] = None
    source_standard_id: Optional[str] = None

# Amendments
class AmendmentBase(BaseModel):
    amendment_no: str
    issue_date: Optional[str] = None
    details: Optional[str] = None

class AmendmentResponse(AmendmentBase):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[str] = None

# Certifications
class CertificationBase(BaseModel):
    scheme: Optional[str] = Field(None, description="BIS Product Certification, CRS, Hallmarking, etc.")
    is_mandatory: bool = True
    order_name: Optional[str] = Field(None, description="Quality Control Order or statutory reference")
    notifying_ministry: Optional[str] = Field(None, description="e.g. DPIIT, Ministry of Power, MeitY")
    details: Optional[str] = None

class CertificationResponse(CertificationBase):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[str] = None

# Standard Core Schemas
class StandardBase(BaseModel):
    standard_no: str = Field(..., description="Unique code e.g. IS 2925:1984")
    title: str = Field(..., description="Official BIS title")
    sector: str = Field(..., description="Sector or industry domain")
    scope: str = Field(..., description="Official BIS scope description")
    status: StandardStatus = Field("active", description="active, superseded, withdrawn")
    superseded_by: Optional[str] = Field(None, description="Replacement standard code if superseded")
    current_version: str = Field(..., description="e.g. IS 2925:1984 (Reaffirmed 2020)")
    keywords: List[str] = Field(default_factory=list, description="Keywords for indexing and matching")
    source_ref: Optional[str] = Field(None, description="Official BIS portal/standards link")
    
    # Step 1 Verification Fields
    source_url: Optional[str] = Field(None, description="Authoritative BIS/eGazette URL")
    last_verified_on: Optional[str] = Field(None, description="Verification date YYYY-MM-DD")
    status_verified: bool = Field(False, description="Whether status is verified from allowed source")
    status_current: Optional[str] = Field("active", description="Current status in official registry")
    status_in_text: Optional[str] = Field(None, description="Official edition/reaffirmation text")
    qco_applicable: bool = Field(True, description="Whether Quality Control Orders apply to this type of standard")
    qco_reference: Optional[str] = Field(None, description="Statutory QCO gazette notification reference")
    qco_verified: bool = Field(False, description="Whether mandatory QCO order is verified")
    verification_notes: Optional[str] = Field(None, description="Audit and verification notes")

    # Authoritative Source Metadata (Hierarchy & Provenance)
    source_type: Optional[str] = Field("PENDING_VERIFICATION", description="BIS_OFFICIAL, GOVERNMENT_GAZETTE, MINISTRY_OFFICIAL, SECONDARY_REFERENCE, PENDING_VERIFICATION")
    source_authority: Optional[str] = Field(None, description="e.g. Bureau of Indian Standards, Gazette of India, DPIIT")
    source_verified: bool = Field(False, description="Whether authoritative source has been verified")
    source_verified_on: Optional[str] = Field(None, description="Date source verified YYYY-MM-DD")
    source_title: Optional[str] = Field(None, description="Title of the source document")
    source_document_type: Optional[str] = Field(None, description="Indian Standard, Scheme of Testing and Inspection, Gazette Notification")
    official_source_url: Optional[str] = Field(None, description="Authoritative government / BIS URL")
    secondary_source_url: Optional[str] = Field(None, description="Secondary reference / third-party mirror URL")
    discovery_source_url: Optional[str] = Field(None, description="Initial discovery mirror URL")
    source_verification_status: Optional[str] = Field("pending", description="verified, pending")
    status_source_url: Optional[str] = Field(None, description="Authoritative URL for standard status")
    status_verified_on: Optional[str] = Field(None, description="Date standard status verified")
    relationship_source_url: Optional[str] = Field(None, description="Evidence URL for supersession/replacement")
    relationship_verified: bool = Field(False, description="Whether supersession/allied relationship is verified")
    qco_source_verified: bool = Field(False, description="Whether QCO source document is verified")
    gazette_verified: bool = Field(False, description="Whether Gazette notification PDF has been read")
    gazette_url: Optional[str] = Field(None, description="Authoritative Gazette URL")
    qco_source_url: Optional[str] = Field(None, description="Authoritative QCO URL")

class StandardCreate(StandardBase):
    amendments: List[AmendmentBase] = Field(default_factory=list)
    certification: Optional[CertificationBase] = None
    related_standards: List[RelatedStandardBase] = Field(default_factory=list)

class StandardUpdate(BaseModel):
    title: Optional[str] = None
    sector: Optional[str] = None
    scope: Optional[str] = None
    status: Optional[StandardStatus] = None
    superseded_by: Optional[str] = None
    current_version: Optional[str] = None
    keywords: Optional[List[str]] = None
    source_ref: Optional[str] = None
    source_url: Optional[str] = None
    last_verified_on: Optional[str] = None
    status_verified: Optional[bool] = None
    status_current: Optional[str] = None
    status_in_text: Optional[str] = None
    qco_applicable: Optional[bool] = None
    qco_reference: Optional[str] = None
    qco_verified: Optional[bool] = None
    verification_notes: Optional[str] = None

    source_type: Optional[str] = None
    source_authority: Optional[str] = None
    source_verified: Optional[bool] = None
    source_verified_on: Optional[str] = None
    source_title: Optional[str] = None
    source_document_type: Optional[str] = None
    official_source_url: Optional[str] = None
    secondary_source_url: Optional[str] = None
    discovery_source_url: Optional[str] = None
    source_verification_status: Optional[str] = None
    status_source_url: Optional[str] = None
    status_verified_on: Optional[str] = None
    relationship_source_url: Optional[str] = None
    relationship_verified: Optional[bool] = None
    qco_source_verified: Optional[bool] = None
    gazette_verified: Optional[bool] = None
    gazette_url: Optional[str] = None
    qco_source_url: Optional[str] = None

class StandardResponse(StandardBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    certification: Optional[CertificationResponse] = None
    amendments: List[AmendmentResponse] = Field(default_factory=list)
    related_standards: List[RelatedStandardResponse] = Field(default_factory=list)

# Search & Retrieval Schemas
class SearchRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Product description, technical spec, or tender excerpt")
    sector: Optional[str] = Field(None, description="Filter by sector")
    top_k: int = Field(10, ge=1, le=50, description="Number of results to return")
    search_mode: Literal["hybrid", "semantic", "keyword"] = Field("hybrid", description="Retrieval method")

class SearchResultItem(BaseModel):
    id: str
    standard_no: str
    title: str
    sector: str
    scope: str
    status: StandardStatus
    superseded_by: Optional[str] = None
    current_version: str
    relevance_score: float = Field(..., description="Normalized score 0.0 - 1.0")
    bm25_score: Optional[float] = None
    vector_score: Optional[float] = None
    matched_keywords: List[str] = Field(default_factory=list)
    matched_requirement: Optional[str] = None
    explanation: Optional[str] = None
    certification: Optional[CertificationResponse] = None
    amendments: List[AmendmentResponse] = Field(default_factory=list)
    allied_standards: List[RelatedStandardResponse] = Field(default_factory=list)
    source_ref: Optional[str] = None
    source_url: Optional[str] = None
    last_verified_on: Optional[str] = None
    status_verified: bool = False
    status_current: Optional[str] = "active"
    status_in_text: Optional[str] = None
    qco_applicable: bool = True
    qco_reference: Optional[str] = None
    qco_verified: bool = False
    verification_notes: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    sector_filter: Optional[str] = None
    total_results: int
    results: List[SearchResultItem]
    retrieval_method: str
    execution_time_ms: float
    anti_hallucination_guarantee: str = (
        "All standard numbers, titles, versions, allied relations, and certification schemes are verified "
        "records retrieved directly from the local BIS database. Zero synthetic standard numbers."
    )

# ─── Tender Compliance Intelligence Schemas ─────────────────────────────────

ComplianceHealth = Literal[
    "no_issues",             # 🟢 No detected issues
    "review_recommended",    # 🟡 Review recommended
    "critical_review",       # 🔴 Critical review required
    "insufficient_evidence"  # ⚪ Insufficient verified evidence
]

class EvidenceItem(BaseModel):
    id: str
    title: str
    tender_clause: str
    extracted_requirement: Optional[str] = None
    matched_standard: Optional[str] = None
    standard_status: Optional[str] = None
    qco_relationship: Optional[str] = None
    source_url: Optional[str] = None
    last_verified_on: Optional[str] = None
    verification_notes: Optional[str] = None

class OutdatedStandardFinding(BaseModel):
    id: str
    standard_no: str
    title: str
    status: str = "superseded"
    current_reference: Optional[str] = None
    current_title: Optional[str] = None
    affected_clauses: List[str] = Field(default_factory=list)
    impact_summary: str
    recommended_action: str
    evidence: Optional[EvidenceItem] = None

class QCOComplianceFinding(BaseModel):
    id: str
    standard_no: str
    title: str
    qco_applicable: bool = True
    qco_reference: Optional[str] = None
    notifying_ministry: Optional[str] = None
    scheme: Optional[str] = None
    gap_detected: bool = False
    finding_type: Literal["qco_applicable", "compliance_gap", "verified_compliant"]
    observation: str
    recommended_action: str
    evidence: Optional[EvidenceItem] = None

class ClauseConflictItem(BaseModel):
    clause_label: str
    parameter: str
    value: str
    snippet: str

class ClauseConflictFinding(BaseModel):
    id: str
    conflict_type: str
    parameter_name: str
    clauses_involved: List[ClauseConflictItem] = Field(default_factory=list)
    severity: Literal["review_recommended", "critical_review"] = "review_recommended"
    observation: str
    recommended_action: str

class MissingRequirementFinding(BaseModel):
    id: str
    requirement_type: str
    item_name: str
    observation: str
    recommended_action: str
    evidence: Optional[EvidenceItem] = None

class RelationshipNode(BaseModel):
    id: str
    label: str
    type: Literal["tender_req", "primary_standard", "allied_standard", "qco_order", "replacement_standard"]
    status: Optional[str] = None

class RelationshipEdge(BaseModel):
    source: str
    target: str
    relation_type: str
    label: str

class StandardsRelationshipGraph(BaseModel):
    nodes: List[RelationshipNode] = Field(default_factory=list)
    edges: List[RelationshipEdge] = Field(default_factory=list)

class TenderComplianceReport(BaseModel):
    health_indicator: ComplianceHealth
    health_label: str
    health_description: str
    summary_metrics: Dict[str, int] = Field(default_factory=dict)
    outdated_standards: List[OutdatedStandardFinding] = Field(default_factory=list)
    qco_findings: List[QCOComplianceFinding] = Field(default_factory=list)
    conflicts: List[ClauseConflictFinding] = Field(default_factory=list)
    missing_requirements: List[MissingRequirementFinding] = Field(default_factory=list)
    evidence_chain: List[EvidenceItem] = Field(default_factory=list)
    relationship_graph: Optional[StandardsRelationshipGraph] = None
    insufficient_evidence: bool = False
    evidence_disclaimer: str = (
        "Compliance intelligence is evidence-grounded against the local verified BIS Knowledge Base. "
        "Review is recommended prior to finalizing procurement decisions."
    )

