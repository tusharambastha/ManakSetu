import React from 'react'
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronDown,
  Building,
  FileCheck
} from 'lucide-react'
import { t } from '../utils/translations'

export default function ComplianceSummary({ complianceReport, onScrollToFindings, language = 'en' }) {
  if (!complianceReport) return null

  const {
    health_indicator,
    health_label,
    health_description,
    summary_metrics = {},
    outdated_standards = [],
    qco_findings = [],
    conflicts = [],
    missing_requirements = []
  } = complianceReport

  const totalIssues = (summary_metrics.review_items || 0) + (conflicts.length || 0)

  const isHindi = language === 'hi'

  const getHealthConfig = () => {
    switch (health_indicator) {
      case 'critical_review':
        return {
          cardBg: 'bg-white',
          bannerBg: 'bg-[#FFF5F5] border-[#FDC4C0]',
          badge: 'bg-[#DC2626] text-white',
          badgeText: isHindi ? 'तत्काल समीक्षा आवश्यक' : (health_label || 'Critical Review Required'),
          titleColor: 'text-[#991B1B]',
          descColor: 'text-[#7F1D1D]',
          icon: ShieldAlert,
          iconBg: 'bg-[#FEE2E2] text-[#DC2626]',
          headline: totalIssues > 0
            ? (isHindi ? `खरीद अनुपालन ऑडिट: ${totalIssues} विषय अधिकारी समीक्षा के लिए आवश्यक` : `Procurement Compliance Audit: ${totalIssues} Issue${totalIssues > 1 ? 's' : ''} Require Officer Review`)
            : (isHindi ? 'तत्काल खरीद समीक्षा आवश्यक' : 'Critical Procurement Review Required'),
          subtext: t('audit_subtext_critical', language)
        }
      case 'review_recommended':
        return {
          cardBg: 'bg-white',
          bannerBg: 'bg-[#FFFBEB] border-[#FDE68A]',
          badge: 'bg-[#D97706] text-white',
          badgeText: isHindi ? 'समीक्षा अनुशंसित' : (health_label || 'Review Recommended'),
          titleColor: 'text-[#92400E]',
          descColor: 'text-[#78350F]',
          icon: AlertTriangle,
          iconBg: 'bg-[#FEF3C7] text-[#D97706]',
          headline: totalIssues > 0
            ? (isHindi ? `समीक्षा अनुशंसित: ${totalIssues} संभावित विनिर्देश स्पष्टीकरण` : `Review Recommended: ${totalIssues} Potential Specification Clarification${totalIssues > 1 ? 's' : ''}`)
            : (isHindi ? 'विनिर्देश समीक्षा अनुशंसित' : 'Specification Review Recommended'),
          subtext: t('audit_subtext_recommended', language)
        }
      case 'insufficient_evidence':
        return {
          cardBg: 'bg-white',
          bannerBg: 'bg-[#F8FAFC] border-[#E2E8F0]',
          badge: 'bg-[#475569] text-white',
          badgeText: isHindi ? 'अपर्याप्त साक्ष्य' : (health_label || 'Insufficient Evidence'),
          titleColor: 'text-[#1E293B]',
          descColor: 'text-[#475569]',
          icon: Info,
          iconBg: 'bg-[#E2E8F0] text-[#475569]',
          headline: isHindi ? 'रजिस्ट्री में अपर्याप्त सत्यापित साक्ष्य' : 'Insufficient Verified Evidence in Registry',
          subtext: t('audit_subtext_insufficient', language)
        }
      case 'no_issues':
      default:
        return {
          cardBg: 'bg-white',
          bannerBg: 'bg-[#F0FDF4] border-[#BBF7D0]',
          badge: 'bg-[#16A34A] text-white',
          badgeText: isHindi ? 'अनुपालन सत्यापित' : (health_label || 'Compliance Verified'),
          titleColor: 'text-[#166534]',
          descColor: 'text-[#14532D]',
          icon: ShieldCheck,
          iconBg: 'bg-[#DCFCE7] text-[#16A34A]',
          headline: isHindi ? 'अनुपालन सत्यापित: सभी पहचाने गए मानक सक्रिय हैं' : 'Compliance Verified: All Identified Standards are Active',
          subtext: t('audit_subtext_clean', language)
        }
    }
  }

  const cfg = getHealthConfig()
  const Icon = cfg.icon

  return (
    <div className={`rounded-2xl border ${cfg.bannerBg} p-5 sm:p-6 shadow-[0_2px_12px_rgba(20,30,50,0.04)] space-y-4`}>
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl ${cfg.iconBg} shadow-xs shrink-0 mt-0.5`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B4965]">
                {t('audit_banner_title', language)}
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${cfg.badge}`}>
                {cfg.badgeText}
              </span>
            </div>
            <h2 className={`text-base sm:text-lg font-bold ${cfg.titleColor} mt-1 leading-snug`}>
              {cfg.headline}
            </h2>
            <p className={`text-xs ${cfg.descColor} mt-1 leading-relaxed max-w-3xl`}>
              {cfg.subtext}
            </p>
          </div>
        </div>

        {/* Jump Button */}
        {totalIssues > 0 && onScrollToFindings && (
          <button
            type="button"
            onClick={onScrollToFindings}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#1B4965] border border-[#CBD5E1] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <span>{t('review_findings_btn', language)} ({totalIssues})</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Realistic Metric Indicator Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
        <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <span className="text-[#64748B] font-medium text-xs">{t('metric_standards_identified', language)}</span>
          <span className="font-mono font-bold text-slate-900 text-sm">
            {summary_metrics.standards_identified || 0}
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <span className="text-[#64748B] font-medium text-xs">{t('metric_superseded_refs', language)}</span>
          <span className={`font-mono font-bold text-sm ${outdated_standards.length > 0 ? 'text-[#DC2626]' : 'text-slate-900'}`}>
            {outdated_standards.length || 0}
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <span className="text-[#64748B] font-medium text-xs">{t('metric_qco_gaps', language)}</span>
          <span className="font-mono font-bold text-sm text-[#D97706]">
            {qco_findings.filter(q => q.gap_detected).length || 0}
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <span className="text-[#64748B] font-medium text-xs">{t('metric_clause_conflicts', language)}</span>
          <span className={`font-mono font-bold text-sm ${conflicts.length > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
            {conflicts.length || 0}
          </span>
        </div>
      </div>
    </div>
  )
}
