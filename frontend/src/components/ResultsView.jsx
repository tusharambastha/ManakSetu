import React, { useState, useRef } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Scale
} from 'lucide-react'
import ComplianceSummary from './ComplianceSummary'
import StandardSummary from './StandardSummary'
import ComplianceFinding from './ComplianceFinding'
import RegulatoryHierarchy from './RegulatoryHierarchy'
import TechnicalEvidence from './TechnicalEvidence'
import EvidenceModal from './EvidenceModal'
import { t } from '../utils/translations'

export default function ResultsView({ results, onSelectStandard, language = 'en' }) {
  const [copiedId, setCopiedId] = useState(null)
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showSecondaryStandards, setShowSecondaryStandards] = useState(false)

  const findingsRef = useRef(null)

  if (!results) return null

  const {
    pipeline_message,
    confident_match_found,
    extracted_requirements,
    document_metadata,
    recommended_standards = [],
    execution_time_ms,
    anti_hallucination_guarantee,
    compliance_report
  } = results

  const primaryStandard = recommended_standards[0]
  const secondaryStandards = recommended_standards.slice(1)

  const handleCopyClause = (std) => {
    const scheme = std.certification?.scheme || 'BIS Product Certification'
    const textToCopy = `Tender Compliance Clause: The material/product supplied shall strictly conform to Indian Standard ${std.standard_no} ("${std.title}"), current revision ${std.current_version}. Mandatory certification requirement: ${scheme}.`
    navigator.clipboard.writeText(textToCopy)
    setCopiedId(std.standard_no)
    setTimeout(() => setCopiedId(null), 2500)
  }

  const handleScrollToFindings = () => {
    if (findingsRef.current) {
      findingsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Aggregate findings from compliance report
  const outdatedList = compliance_report?.outdated_standards || []
  const qcoList = compliance_report?.qco_findings || []
  const conflictList = compliance_report?.conflicts || []
  const missingList = compliance_report?.missing_requirements || []

  const totalFindings =
    outdatedList.length + qcoList.length + conflictList.length + missingList.length

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-14 pt-2">
      {/* ── 1. Zero-Hallucination Guard Warning (If no confident match) ── */}
      {!confident_match_found && (
        <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] flex items-start gap-3.5 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-[#78350F]">{t('zero_hallucination_title', language)}</h3>
            <p className="text-xs text-[#92400E] leading-relaxed">
              {pipeline_message || t('zero_hallucination_sub', language)}
            </p>
          </div>
        </div>
      )}

      {/* ── 2. Top Decision Banner: TENDER COMPLIANCE SUMMARY ── */}
      {compliance_report && (
        <ComplianceSummary
          complianceReport={compliance_report}
          onScrollToFindings={totalFindings > 0 ? handleScrollToFindings : null}
          language={language}
        />
      )}

      {/* ── 3. RELEVANT STANDARD (Decision-First Simplified Card) ── */}
      {primaryStandard && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="font-bold text-xs uppercase tracking-wider text-[#1B4965]">
              {t('rec_governing_standard', language)}
            </span>
            <span className="text-xs text-[#64748B]">
              {t('primary_spec_benchmark', language)}
            </span>
          </div>

          <StandardSummary
            standard={primaryStandard}
            index={0}
            extractedRequirements={extracted_requirements}
            onSelectStandard={onSelectStandard}
            onViewEvidence={(ev) => setSelectedEvidence(ev)}
            onCopyClause={handleCopyClause}
            copiedId={copiedId}
            isPrimary={true}
            language={language}
          />
        </div>
      )}

      {/* ── Secondary Relevant Standards (Collapsible Accordion) ── */}
      {secondaryStandards.length > 0 && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowSecondaryStandards(!showSecondaryStandards)}
            className="w-full px-5 py-3 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#0F2942] hover:bg-[#F8FAFC] transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1B4965]" />
              <span>{t('alt_standards_title', language)} ({secondaryStandards.length})</span>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
              {showSecondaryStandards ? t('hide_alternatives', language) : t('view_alternatives', language)}
              {showSecondaryStandards ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          </button>

          {showSecondaryStandards && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {secondaryStandards.map((secStd, idx) => (
                <StandardSummary
                  key={secStd.id || secStd.standard_no}
                  standard={secStd}
                  index={idx + 1}
                  extractedRequirements={extracted_requirements}
                  onSelectStandard={onSelectStandard}
                  onViewEvidence={(ev) => setSelectedEvidence(ev)}
                  onCopyClause={handleCopyClause}
                  copiedId={copiedId}
                  isPrimary={false}
                  language={language}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 4. COMPLIANCE FINDINGS (Directly Follows the Standard) ── */}
      {compliance_report && (
        <div ref={findingsRef} id="compliance-findings" className="space-y-4 pt-1">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-lg font-bold text-[#0F2942]">
                {t('compliance_findings_title', language)}
              </h2>
              <p className="text-xs text-[#64748B]">
                {t('compliance_findings_sub', language)}
              </p>
            </div>

            {totalFindings === 0 && (
              <span className="text-xs px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] font-bold flex items-center gap-1.5 shadow-2xs">
                <CheckCircle className="w-3.5 h-3.5 text-[#16A34A]" />
                {t('zero_compliance_issues', language)}
              </span>
            )}
          </div>

          {/* Filter Pills if findings exist */}
          {totalFindings > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeCategory === 'all'
                    ? 'bg-[#0F2942] text-white shadow-2xs'
                    : 'text-[#475569] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1]'
                }`}
              >
                {t('filter_all_items', language)} ({totalFindings})
              </button>

              {outdatedList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('outdated')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activeCategory === 'outdated'
                      ? 'bg-[#DC2626] text-white shadow-2xs'
                      : 'text-[#991B1B] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5]'
                  }`}
                >
                  <span>{t('filter_superseded', language)}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/25">
                    {outdatedList.length}
                  </span>
                </button>
              )}

              {qcoList.some((q) => q.gap_detected) && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('qco_gap')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activeCategory === 'qco_gap'
                      ? 'bg-[#D97706] text-white shadow-2xs'
                      : 'text-[#92400E] bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A]'
                  }`}
                >
                  <span>{t('filter_qco_gaps', language)}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/25">
                    {qcoList.filter((q) => q.gap_detected).length}
                  </span>
                </button>
              )}

              {conflictList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('conflict')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activeCategory === 'conflict'
                      ? 'bg-[#CA8A04] text-white shadow-2xs'
                      : 'text-[#854D0E] bg-[#FEFCE8] hover:bg-[#FEF9C3] border border-[#FEF08A]'
                  }`}
                >
                  <span>{t('filter_conflicts', language)}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/25">
                    {conflictList.length}
                  </span>
                </button>
              )}

              {missingList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('missing')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activeCategory === 'missing'
                      ? 'bg-[#475569] text-white shadow-2xs'
                      : 'text-[#334155] bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1]'
                  }`}
                >
                  <span>{t('filter_missing', language)}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/25">
                    {missingList.length}
                  </span>
                </button>
              )}

              {qcoList.some((q) => !q.gap_detected) && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('qco_verified')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activeCategory === 'qco_verified'
                      ? 'bg-[#16A34A] text-white shadow-2xs'
                      : 'text-[#065F46] bg-[#ECFDF5] hover:bg-[#DCFCE7] border border-[#A7F3D0]'
                  }`}
                >
                  <span>{t('filter_verified_qco', language)}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/25">
                    {qcoList.filter((q) => !q.gap_detected).length}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Findings Cards List */}
          <div className="space-y-4">
            {/* Outdated Standards */}
            {(activeCategory === 'all' || activeCategory === 'outdated') &&
              outdatedList.map((item) => (
                <ComplianceFinding
                  key={item.id}
                  finding={item}
                  category="outdated"
                  onSelectStandard={onSelectStandard}
                  onViewEvidence={(ev) => setSelectedEvidence(ev)}
                  language={language}
                />
              ))}

            {/* QCO Findings (Gaps) */}
            {(activeCategory === 'all' || activeCategory === 'qco_gap') &&
              qcoList
                .filter((q) => q.gap_detected)
                .map((item) => (
                  <ComplianceFinding
                    key={item.id}
                    finding={item}
                    category="qco"
                    onSelectStandard={onSelectStandard}
                    onViewEvidence={(ev) => setSelectedEvidence(ev)}
                    language={language}
                  />
                ))}

            {/* Specification Conflicts */}
            {(activeCategory === 'all' || activeCategory === 'conflict') &&
              conflictList.map((item) => (
                <ComplianceFinding
                  key={item.id}
                  finding={item}
                  category="conflict"
                  onSelectStandard={onSelectStandard}
                  onViewEvidence={(ev) => setSelectedEvidence(ev)}
                  language={language}
                />
              ))}

            {/* Missing Requirements */}
            {(activeCategory === 'all' || activeCategory === 'missing') &&
              missingList.map((item) => (
                <ComplianceFinding
                  key={item.id}
                  finding={item}
                  category="missing"
                  onSelectStandard={onSelectStandard}
                  onViewEvidence={(ev) => setSelectedEvidence(ev)}
                  language={language}
                />
              ))}

            {/* QCO Findings (Verified Compliant) */}
            {(activeCategory === 'all' || activeCategory === 'qco_verified') &&
              qcoList
                .filter((q) => !q.gap_detected)
                .map((item) => (
                  <ComplianceFinding
                    key={item.id}
                    finding={item}
                    category="qco"
                    onSelectStandard={onSelectStandard}
                    onViewEvidence={(ev) => setSelectedEvidence(ev)}
                    language={language}
                  />
                ))}

            {totalFindings === 0 && (
              <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] text-center space-y-2 shadow-xs">
                <CheckCircle className="w-8 h-8 text-[#16A34A] mx-auto" />
                <h3 className="font-bold text-base text-[#0F2942]">
                  {t('clean_audit_title', language)}
                </h3>
                <p className="text-xs text-[#64748B] max-w-md mx-auto">
                  {t('clean_audit_sub', language)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 5. VERIFIED STANDARDS & REGULATORY HIERARCHY ── */}
      {compliance_report?.relationship_graph && (
        <RegulatoryHierarchy
          relationshipGraph={compliance_report.relationship_graph}
          onSelectStandard={onSelectStandard}
          language={language}
        />
      )}

      {/* ── 6. TECHNICAL EVIDENCE & RETRIEVAL TELEMETRY (Collapsible) ── */}
      <TechnicalEvidence
        standard={primaryStandard}
        allStandards={recommended_standards}
        extractedRequirements={extracted_requirements}
        executionTimeMs={execution_time_ms}
        documentMetadata={document_metadata}
        antiHallucinationGuarantee={anti_hallucination_guarantee}
        language={language}
      />

      {/* ── 7. Shared Inspectable Evidence Modal ── */}
      {selectedEvidence && (
        <EvidenceModal
          evidence={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
          language={language}
        />
      )}
    </div>
  )
}
