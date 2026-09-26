import React, { useState } from 'react'
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileWarning,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  GitBranch,
  X,
  FileText,
  Building,
  Scale,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react'

export default function ComplianceIntelligenceView({ complianceReport, onSelectStandard }) {
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  if (!complianceReport) return null

  const {
    health_indicator,
    health_label,
    health_description,
    summary_metrics,
    outdated_standards = [],
    qco_findings = [],
    conflicts = [],
    missing_requirements = [],
    evidence_chain = [],
    relationship_graph,
    insufficient_evidence = false,
    evidence_disclaimer
  } = complianceReport

  const getHealthBadge = () => {
    switch (health_indicator) {
      case 'critical_review':
        return {
          badge: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
          banner: 'from-rose-50/90 via-amber-50/50 to-white dark:from-rose-950/30 dark:via-[#1A2535] dark:to-[#1A2535] border-rose-300 dark:border-rose-900',
          icon: ShieldAlert,
          iconColor: 'text-rose-600 dark:text-rose-400'
        }
      case 'review_recommended':
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
          banner: 'from-amber-50/90 via-orange-50/40 to-white dark:from-amber-950/30 dark:via-[#1A2535] dark:to-[#1A2535] border-amber-300 dark:border-amber-800',
          icon: AlertTriangle,
          iconColor: 'text-amber-600 dark:text-amber-400'
        }
      case 'insufficient_evidence':
        return {
          badge: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          banner: 'from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-[#1A2535] dark:to-[#1A2535] border-slate-300 dark:border-slate-700',
          icon: Info,
          iconColor: 'text-slate-500 dark:text-slate-400'
        }
      case 'no_issues':
      default:
        return {
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
          banner: 'from-emerald-50/90 via-teal-50/40 to-white dark:from-emerald-950/30 dark:via-[#1A2535] dark:to-[#1A2535] border-emerald-300 dark:border-emerald-800',
          icon: ShieldCheck,
          iconColor: 'text-emerald-600 dark:text-emerald-400'
        }
    }
  }

  const healthCfg = getHealthBadge()
  const HealthIcon = healthCfg.icon

  return (
    <div className="bg-white dark:bg-[#1A2535] rounded-2xl border border-[#E3DDD5] dark:border-[#2E3F4F] shadow-sm p-6 sm:p-7 space-y-6">

      {/* ── 1. Header with Health Indicator ── */}
      <div className={`p-5 rounded-2xl border bg-gradient-to-r ${healthCfg.banner} space-y-3`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-white dark:bg-[#16212B] shadow-2xs ${healthCfg.iconColor}`}>
              <HealthIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#1B4965] dark:text-[#5B9CC9]">
                  ManakSetu Tender Compliance Intelligence
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${healthCfg.badge}`}>
                  {health_label}
                </span>
              </div>
              <h2 className="text-base font-bold text-[#1C1C1E] dark:text-white mt-0.5">
                Automated Procurement Standards Audit
              </h2>
            </div>
          </div>
        </div>
        <p className="text-xs text-[#4A4A4A] dark:text-[#C0C5CA] leading-relaxed">
          {health_description}
        </p>
      </div>

      {/* ── 2. Summary Metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#F7F5F1] dark:bg-[#16212B] border border-[#E3DDD5] dark:border-[#2E3F4F] text-center">
          <div className="text-2xl font-mono font-black text-[#1B4965] dark:text-[#5B9CC9]">
            {summary_metrics.standards_identified || 0}
          </div>
          <div className="text-[11px] font-semibold text-[#7A7A7A] dark:text-[#9A9A9E] mt-0.5">
            Standards Identified
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F7F5F1] dark:bg-[#16212B] border border-[#E3DDD5] dark:border-[#2E3F4F] text-center">
          <div className={`text-2xl font-mono font-black ${outdated_standards.length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-[#1C1C1E] dark:text-white'}`}>
            {summary_metrics.review_items || 0}
          </div>
          <div className="text-[11px] font-semibold text-[#7A7A7A] dark:text-[#9A9A9E] mt-0.5">
            Review Items
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F7F5F1] dark:bg-[#16212B] border border-[#E3DDD5] dark:border-[#2E3F4F] text-center">
          <div className="text-2xl font-mono font-black text-indigo-600 dark:text-indigo-400">
            {summary_metrics.qco_checks || 0}
          </div>
          <div className="text-[11px] font-semibold text-[#7A7A7A] dark:text-[#9A9A9E] mt-0.5">
            QCO Order Checks
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F7F5F1] dark:bg-[#16212B] border border-[#E3DDD5] dark:border-[#2E3F4F] text-center">
          <div className={`text-2xl font-mono font-black ${conflicts.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {summary_metrics.potential_conflicts || 0}
          </div>
          <div className="text-[11px] font-semibold text-[#7A7A7A] dark:text-[#9A9A9E] mt-0.5">
            Potential Conflicts
          </div>
        </div>
      </div>

      {/* ── 3. Filter Navigation Tabs ── */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E3DDD5] dark:border-[#2E3F4F] pb-3 text-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
            activeCategory === 'all'
              ? 'bg-[#1B4965] text-white shadow-2xs'
              : 'text-[#4A4A4A] dark:text-[#9A9A9E] hover:bg-[#F2EFE9] dark:hover:bg-[#16212B]'
          }`}
        >
          All Findings
        </button>

        {outdated_standards.length > 0 && (
          <button
            onClick={() => setActiveCategory('outdated')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
              activeCategory === 'outdated'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            <span>⚠️ Outdated References</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{outdated_standards.length}</span>
          </button>
        )}

        {qco_findings.length > 0 && (
          <button
            onClick={() => setActiveCategory('qco')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
              activeCategory === 'qco'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-indigo-800 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
            }`}
          >
            <span>🟠 QCO Mandates</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{qco_findings.length}</span>
          </button>
        )}

        {conflicts.length > 0 && (
          <button
            onClick={() => setActiveCategory('conflicts')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
              activeCategory === 'conflicts'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-800 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
          >
            <span>🟡 Potential Conflicts</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{conflicts.length}</span>
          </button>
        )}

        {missing_requirements.length > 0 && (
          <button
            onClick={() => setActiveCategory('missing')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
              activeCategory === 'missing'
                ? 'bg-slate-700 text-white shadow-2xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>🟡 Missing Requirements</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{missing_requirements.length}</span>
          </button>
        )}
      </div>

      {/* ── 4. Findings Cards List ── */}
      <div className="space-y-4">

        {/* (A) Outdated Standards Findings */}
        {(activeCategory === 'all' || activeCategory === 'outdated') && outdated_standards.map((finding) => (
          <div
            key={finding.id}
            className="p-5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 space-y-3.5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-amber-600 text-white flex items-center gap-1 shadow-2xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    OUTDATED STANDARD REFERENCED
                  </span>
                  <span className="font-mono font-bold text-sm text-[#1C1C1E] dark:text-white">
                    {finding.standard_no}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase">
                    {finding.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#1C1C1E] dark:text-white">
                  {finding.title}
                </p>
              </div>

              {finding.evidence && (
                <button
                  type="button"
                  onClick={() => setSelectedEvidence(finding.evidence)}
                  className="px-3 py-1.5 bg-white dark:bg-[#16212B] hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Evidence</span>
                </button>
              )}
            </div>

            {/* Replacement Banner */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#16212B] border border-amber-200 dark:border-amber-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ArrowRight className="w-4 h-4 text-emerald-600 font-bold shrink-0" />
                <div>
                  <span className="text-[#7A7A7A] dark:text-[#9A9A9E]">Current Verified Replacement Standard: </span>
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 ml-1">
                    {finding.current_reference}
                  </span>
                  {finding.current_title && (
                    <span className="text-[#4A4A4A] dark:text-[#D0D5DA] ml-1.5 font-medium">({finding.current_title})</span>
                  )}
                </div>
              </div>

              {finding.current_reference && onSelectStandard && (
                <button
                  type="button"
                  onClick={() => onSelectStandard(finding.current_reference)}
                  className="text-xs font-bold text-[#1B4965] dark:text-[#5B9CC9] hover:underline flex items-center gap-1"
                >
                  <span>Open Current Standard</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Affected Clauses & Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="space-y-1">
                <span className="font-bold text-[#7A7A7A] dark:text-[#9A9A9E] uppercase tracking-wider text-[10px] block">
                  Change Impact (Affected Clauses)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {finding.affected_clauses.map((clause, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-amber-100/80 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded font-mono font-semibold text-[11px]"
                    >
                      {clause}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#7A7A7A] dark:text-[#9A9A9E] uppercase tracking-wider text-[10px] block">
                  Recommended Action
                </span>
                <p className="text-amber-950 dark:text-amber-200 font-medium">
                  {finding.recommended_action}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* (B) QCO Findings */}
        {(activeCategory === 'all' || activeCategory === 'qco') && qco_findings.map((finding) => (
          <div
            key={finding.id}
            className={`p-5 rounded-xl border ${
              finding.gap_detected
                ? 'border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20'
                : 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/20'
            } space-y-3.5`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-black text-white flex items-center gap-1 shadow-2xs ${
                      finding.gap_detected ? 'bg-rose-600' : 'bg-indigo-600'
                    }`}
                  >
                    {finding.gap_detected ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    {finding.gap_detected ? 'POTENTIAL COMPLIANCE GAP' : 'QCO APPLICABLE'}
                  </span>
                  <span className="font-mono font-bold text-sm text-[#1C1C1E] dark:text-white">
                    {finding.standard_no}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-[#16212B] text-[#1B4965] dark:text-[#5B9CC9] border border-[#E3DDD5] dark:border-[#2E3F4F] font-bold">
                    {finding.scheme || 'BIS Certification'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#1C1C1E] dark:text-white">
                  Statutory Order: {finding.qco_reference} ({finding.notifying_ministry})
                </p>
              </div>

              {finding.evidence && (
                <button
                  type="button"
                  onClick={() => setSelectedEvidence(finding.evidence)}
                  className="px-3 py-1.5 bg-white dark:bg-[#16212B] hover:bg-[#F2EFE9] dark:hover:bg-[#2E3F4F] text-[#1C1C1E] dark:text-white border border-[#E3DDD5] dark:border-[#2E3F4F] rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Evidence</span>
                </button>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#16212B] border border-[#E3DDD5] dark:border-[#2E3F4F] space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#1B4965] dark:text-[#5B9CC9] shrink-0 mt-0.5" />
                <p className="text-[#1C1C1E] dark:text-[#D0D5DA] font-medium leading-relaxed">
                  {finding.observation}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E3DDD5] dark:border-[#2E3F4F] flex items-center gap-2">
                <span className="font-bold text-[#7A7A7A] dark:text-[#9A9A9E]">Recommended Action:</span>
                <span className="text-[#1C1C1E] dark:text-[#D0D5DA]">{finding.recommended_action}</span>
              </div>
            </div>
          </div>
        ))}

        {/* (C) Clause Conflicts */}
        {(activeCategory === 'all' || activeCategory === 'conflicts') && conflicts.map((finding) => (
          <div
            key={finding.id}
            className="p-5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20 space-y-3.5"
          >
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-amber-600 text-white flex items-center gap-1 shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                POTENTIAL SPECIFICATION CONFLICT
              </span>
              <span className="text-sm font-bold text-[#1C1C1E] dark:text-white">
                {finding.conflict_type}
              </span>
            </div>

            <p className="text-xs text-[#1C1C1E] dark:text-[#D0D5DA] font-medium">
              {finding.observation}
            </p>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {finding.clauses_involved.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white dark:bg-[#16212B] rounded-xl border border-amber-200 dark:border-amber-900 space-y-1"
                >
                  <div className="flex items-center justify-between font-mono font-bold text-[#1B4965] dark:text-[#5B9CC9]">
                    <span>{item.clause_label}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[11px]">
                      {item.value}
                    </span>
                  </div>
                  <p className="text-[#4A4A4A] dark:text-[#9A9A9E] text-[11px] line-clamp-2 italic">
                    "{item.snippet}"
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-amber-200 dark:border-amber-900/60 text-xs flex items-center gap-2">
              <span className="font-bold text-amber-900 dark:text-amber-300">Recommended Action:</span>
              <span className="text-[#1C1C1E] dark:text-[#D0D5DA]">{finding.recommended_action}</span>
            </div>
          </div>
        ))}

        {/* (D) Missing Requirements */}
        {(activeCategory === 'all' || activeCategory === 'missing') && missing_requirements.map((finding) => (
          <div
            key={finding.id}
            className="p-5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-slate-700 text-white flex items-center gap-1 shadow-2xs">
                  <Info className="w-3.5 h-3.5" />
                  POTENTIAL MISSING REQUIREMENT
                </span>
                <span className="text-xs font-bold text-[#1C1C1E] dark:text-white">
                  {finding.requirement_type} ({finding.item_name})
                </span>
              </div>

              {finding.evidence && (
                <button
                  type="button"
                  onClick={() => setSelectedEvidence(finding.evidence)}
                  className="px-3 py-1.5 bg-white dark:bg-[#16212B] hover:bg-[#F2EFE9] dark:hover:bg-[#2E3F4F] text-[#1C1C1E] dark:text-white border border-[#E3DDD5] dark:border-[#2E3F4F] rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Evidence</span>
                </button>
              )}
            </div>

            <p className="text-xs text-[#1C1C1E] dark:text-[#D0D5DA] font-medium leading-relaxed">
              {finding.observation}
            </p>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2">
              <span className="font-bold text-[#7A7A7A] dark:text-[#9A9A9E]">Recommended Action:</span>
              <span className="text-[#1C1C1E] dark:text-[#D0D5DA]">{finding.recommended_action}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── 5. Standards Relationship Visual Tree ── */}
      {relationship_graph && relationship_graph.nodes.length > 1 && (
        <div className="p-5 rounded-2xl bg-[#F7F5F1] dark:bg-[#16212B] border border-[#E3DDD5] dark:border-[#2E3F4F] space-y-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#1B4965] dark:text-[#5B9CC9]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1E] dark:text-white">
              Verified Standards & Regulatory Hierarchy
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 py-2 text-xs">
            {relationship_graph.nodes.map((node) => {
              const isPrimary = node.type === 'primary_standard'
              const isQCO = node.type === 'qco_order'
              const isRepl = node.type === 'replacement_standard'
              const isTender = node.type === 'tender_req'

              return (
                <div
                  key={node.id}
                  className={`p-3 rounded-xl border flex items-center gap-2 font-mono font-bold shadow-2xs ${
                    isTender
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                      : isPrimary
                      ? 'bg-[#1B4965] text-white border-[#153a51]'
                      : isQCO
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800'
                      : isRepl
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-[#1A2535] text-[#1C1C1E] dark:text-white border-[#E3DDD5] dark:border-[#2E3F4F]'
                  }`}
                >
                  {isQCO ? <Building className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> : <FileText className="w-3.5 h-3.5" />}
                  <span>{node.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── 6. Evidence Disclaimer ── */}
      <div className="p-3 bg-[#F2EFE9] dark:bg-[#16212B] rounded-xl border border-[#E3DDD5] dark:border-[#2E3F4F] text-[11px] text-[#7A7A7A] dark:text-[#9A9A9E] flex items-center gap-2">
        <Scale className="w-4 h-4 shrink-0 text-[#1B4965] dark:text-[#5B9CC9]" />
        <span>{evidence_disclaimer}</span>
      </div>

      {/* ── 7. Interactive "View Evidence" Modal ── */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A2535] rounded-2xl border border-[#E3DDD5] dark:border-[#2E3F4F] shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DDD5] dark:border-[#2E3F4F]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1B4965] dark:text-[#5B9CC9]" />
                <h3 className="font-bold text-sm text-[#1C1C1E] dark:text-white">
                  {selectedEvidence.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvidence(null)}
                className="p-1 rounded-lg hover:bg-[#F2EFE9] dark:hover:bg-[#2E3F4F] text-[#7A7A7A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-[#F7F5F1] dark:bg-[#16212B] rounded-xl border border-[#E3DDD5] dark:border-[#2E3F4F] space-y-1">
                <span className="font-bold text-[#7A7A7A] dark:text-[#9A9A9E] text-[10px] uppercase">
                  Tender Specification Excerpt
                </span>
                <p className="font-medium text-[#1C1C1E] dark:text-white">
                  "{selectedEvidence.tender_clause}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F7F5F1] dark:bg-[#16212B] rounded-xl border border-[#E3DDD5] dark:border-[#2E3F4F]">
                  <span className="font-bold text-[#7A7A7A] dark:text-[#9A9A9E] text-[10px] uppercase block">
                    Matched Standard
                  </span>
                  <span className="font-mono font-bold text-[#1B4965] dark:text-[#5B9CC9] text-xs">
                    {selectedEvidence.matched_standard}
                  </span>
                </div>

                <div className="p-3 bg-[#F7F5F1] dark:bg-[#16212B] rounded-xl border border-[#E3DDD5] dark:border-[#2E3F4F]">
                  <span className="font-bold text-[#7A7A7A] dark:text-[#9A9A9E] text-[10px] uppercase block">
                    Official Status
                  </span>
                  <span className="font-bold text-xs uppercase text-amber-700 dark:text-amber-400">
                    {selectedEvidence.standard_status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#F7F5F1] dark:bg-[#16212B] rounded-xl border border-[#E3DDD5] dark:border-[#2E3F4F] space-y-1">
                <span className="font-bold text-[#7A7A7A] dark:text-[#9A9A9E] text-[10px] uppercase block">
                  Statutory Order / QCO Relationship
                </span>
                <p className="font-medium text-[#1C1C1E] dark:text-[#D0D5DA]">
                  {selectedEvidence.qco_relationship}
                </p>
              </div>

              <div className="p-3 bg-[#F7F5F1] dark:bg-[#16212B] rounded-xl border border-[#E3DDD5] dark:border-[#2E3F4F] space-y-1">
                <span className="font-bold text-[#7A7A7A] dark:text-[#9A9A9E] text-[10px] uppercase block">
                  Verification Audit Trail
                </span>
                <p className="text-[#4A4A4A] dark:text-[#C0C5CA] leading-relaxed">
                  {selectedEvidence.verification_notes}
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#7A7A7A] dark:text-[#9A9A9E]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Last Verified: {selectedEvidence.last_verified_on}</span>
                </div>
              </div>

              {selectedEvidence.source_url && (
                <div className="pt-2">
                  <a
                    href={selectedEvidence.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1B4965] hover:bg-[#153a51] text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
                  >
                    <span>View Official BIS / Gazette Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
