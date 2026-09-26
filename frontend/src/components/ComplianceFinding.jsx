import React from 'react'
import {
  FileText,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Info,
  ArrowRight,
  ExternalLink,
  CheckCircle
} from 'lucide-react'
import { t } from '../utils/translations'

export default function ComplianceFinding({
  finding,
  category, // 'outdated' | 'qco' | 'conflict' | 'missing'
  onSelectStandard,
  onViewEvidence,
  language = 'en'
}) {
  if (!finding) return null

  const isHindi = language === 'hi'

  // Determine finding status styling & semantics with realistic government advisory tone
  const getStatusConfig = () => {
    if (category === 'outdated') {
      return {
        badgeBg: 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]',
        badgeText: isHindi ? 'अप्रचलित मानक उद्धृत' : 'Superseded Standard Cited',
        badgeIcon: AlertTriangle,
        badgeIconColor: 'text-[#DC2626]',
        leftStripe: 'border-l-4 border-l-[#DC2626]',
        standardNo: finding.standard_no,
        replacementText: finding.current_reference
          ? (isHindi ? `${finding.current_reference} द्वारा प्रतिस्थापित` : `Replaced by ${finding.current_reference}`)
          : null,
        clauseTitle: finding.affected_clauses && finding.affected_clauses.length > 0
          ? (isHindi
              ? `${finding.affected_clauses.join(', ')} में ${finding.standard_no} निर्दिष्ट है, जो ${finding.current_reference} द्वारा अप्रचलित हो चुका है।`
              : `${finding.affected_clauses.join(', ')} specifies ${finding.standard_no}, which is superseded by ${finding.current_reference}.`)
          : (isHindi
              ? `टेंडर विनिर्देश में ${finding.standard_no} उद्धृत है, जो औपचारिक रूप से ${finding.current_reference} द्वारा प्रतिस्थापित है।`
              : `Tender specification cites ${finding.standard_no}, which has been formally superseded by ${finding.current_reference}.`),
        riskText: isHindi
          ? 'जीएफआर 2017 एवं सीएजी/सीवीओ ऑडिट के तहत अप्रचलित या निरस्त मानकों का संदर्भ देने वाले टेंडर बोलीदाता विवादों और ऑडिट आपत्तियों के अधीन होते हैं।'
          : 'Procurement specifications referencing withdrawn or superseded standards are subject to bidder disqualification disputes and CAG / CVO audit objections under GFR 2017.',
        actionText: isHindi
          ? (finding.recommended_action || `सक्रिय भारतीय मानक ${finding.current_reference} को शामिल करने हेतु तकनीकी अनुसूची को अपडेट करें।`)
          : (finding.recommended_action || `Update technical schedule to reference active Indian Standard ${finding.current_reference}.`),
        evidence: finding.evidence
      }
    }

    if (category === 'qco') {
      const isGap = finding.gap_detected
      return {
        badgeBg: isGap ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]' : 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
        badgeText: isGap
          ? (isHindi ? 'अनिवार्य क्यूसीओ प्रमाणन अनुपलब्ध' : 'Mandatory QCO Certification Missing')
          : (isHindi ? 'सत्यापित क्यूसीओ अनुपालन' : 'Verified QCO Compliance'),
        badgeIcon: isGap ? ShieldAlert : ShieldCheck,
        badgeIconColor: isGap ? 'text-[#D97706]' : 'text-[#16A34A]',
        leftStripe: isGap ? 'border-l-4 border-l-[#D97706]' : 'border-l-4 border-l-[#16A34A]',
        standardNo: finding.standard_no,
        replacementText: finding.qco_reference
          ? (isHindi ? `वैधानिक आदेश: ${finding.qco_reference}` : `Statutory Order: ${finding.qco_reference}`)
          : null,
        clauseTitle: isGap
          ? (isHindi
              ? 'टेंडर विनिर्देश में अनिवार्य बीआईएस उत्पाद प्रमाणन (आईएसआई मार्क) की शर्त शामिल नहीं है।'
              : 'Tender specification lacks an explicit mandatory BIS Product Certification (ISI Mark) requirement.')
          : (isHindi
              ? `अनिवार्य ${finding.scheme || 'बीआईएस प्रमाणन'} शर्त टेंडर में विधिवत निर्धारित है।`
              : `Mandatory ${finding.scheme || 'BIS Certification'} requirement is properly stipulated in the tender.`),
        riskText: isHindi
          ? (finding.qco_reference
              ? `वैधानिक गुणवत्ता नियंत्रण आदेश (${finding.qco_reference}) गैर-प्रमाणित सामग्री की खरीद या उपयोग को प्रतिबंधित करता है। अनिवार्य आईएसआई मार्क न होने से गैर-अनुपालन विक्रेता भाग ले सकते हैं।`
              : 'वैधानिक गुणवत्ता नियंत्रण आदेश इस श्रेणी के लिए बीआईएस उत्पाद प्रमाणन को अनिवार्य करता है।')
          : (finding.qco_reference
              ? `Statutory Quality Control Order (${finding.qco_reference}) prohibits the manufacture, import, sale, or public procurement of non-certified goods. Absence of mandatory ISI mark criteria allows non-compliant vendors to bid.`
              : 'Statutory Quality Control Order mandates BIS Product Certification for this category.'),
        actionText: isHindi
          ? (finding.recommended_action || (isGap
              ? 'तकनीकी योग्यता मानदंड के रूप में वैध बीआईएस लाइसेंस / आईएसआई मार्क को अनिवार्य शर्त के रूप में शामिल करें।'
              : 'तकनीकी मूल्यांकन के दौरान बोलीदाता द्वारा वैध बीआईएस सीएमएल लाइसेंस प्रस्तुत करना सुनिश्चित करें।'))
          : (finding.recommended_action || (isGap
              ? 'Incorporate an explicit clause requiring valid BIS license / ISI mark as a mandatory technical qualification criterion.'
              : 'Ensure bidder submits valid BIS CML license during technical evaluation.')),
        evidence: finding.evidence
      }
    }

    if (category === 'conflict') {
      const clausesSnippet = finding.clauses_involved && finding.clauses_involved.length >= 2
        ? `${finding.clauses_involved[0].clause_label} stipulates ${finding.clauses_involved[0].value}, whereas ${finding.clauses_involved[1].clause_label} stipulates ${finding.clauses_involved[1].value}.`
        : finding.observation
      return {
        badgeBg: 'bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]',
        badgeText: isHindi ? 'क्लॉज के बीच विनिर्देश विसंगति' : 'Specification Discrepancy Across Clauses',
        badgeIcon: AlertTriangle,
        badgeIconColor: 'text-[#CA8A04]',
        leftStripe: 'border-l-4 border-l-[#CA8A04]',
        standardNo: finding.parameter_name || (isHindi ? 'निर्धारित पैरामीटर' : 'Rated Parameter'),
        replacementText: isHindi ? 'परस्पर विरोधी मान' : 'Conflicting Clause Values',
        clauseTitle: isHindi
          ? (finding.observation || 'टेंडर दस्तावेज़ के विभिन्न क्लॉज के बीच परस्पर विरोधी तकनीकी मान पाए गए।')
          : (clausesSnippet || 'Contradictory technical parameter values identified between clauses in the tender document.'),
        riskText: isHindi
          ? 'अनुसूचियों के बीच असंगत तकनीकी मानों के कारण ठेकेदार विवाद और गलत उपकरणों की आपूर्ति का जोखिम होता है।'
          : 'Inconsistent technical values across schedules lead to contractor disputes, ambiguity during pre-bid meetings, and delivery of mismatched equipment.',
        actionText: isHindi
          ? (finding.recommended_action || 'विरोधाभासी क्लॉज की समीक्षा करें और टेंडर जारी करने से पहले इंजीनियरिंग पैरामीटर को एकसमान करें।')
          : (finding.recommended_action || 'Review conflicting clauses and unify engineering parameters before tender issuance.'),
        evidence: null
      }
    }

    // Default / Missing Requirements
    return {
      badgeBg: 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]',
      badgeText: isHindi ? 'विनिर्देश विवरण अनुपलब्ध' : 'Missing Specification Detail',
      badgeIcon: Info,
      badgeIconColor: 'text-[#475569]',
      leftStripe: 'border-l-4 border-l-[#475569]',
      standardNo: finding.item_name || (isHindi ? 'तकनीकी आवश्यकता' : 'Technical Requirement'),
      replacementText: isHindi ? 'संशोधन वर्ष / योजना अनिर्दिष्ट' : 'Revision / Scheme Unstated',
      clauseTitle: isHindi
        ? (finding.observation || 'विनिर्देश में संशोधन वर्ष या अनिवार्य परीक्षण आवश्यकताओं का उल्लेख नहीं है।')
        : (finding.observation || 'Specification omits revision year or mandatory testing requirements.'),
      riskText: isHindi
        ? 'संशोधन वर्ष का उल्लेख न होने से गुणवत्ता निरीक्षण के दौरान मानक के किस संस्करण को लागू किया जाए, इस पर अस्पष्टता बनी रहती है।'
        : 'Unspecified revision dates create ambiguity over which edition of the Indian Standard applies during quality inspection.',
      actionText: isHindi
        ? (finding.recommended_action || 'वर्तमान संस्करण/संशोधन वर्ष और अनिवार्य परीक्षण सत्यापन क्लॉज निर्दिष्ट करें।')
        : (finding.recommended_action || 'Specify current edition/revision year and mandatory test verification clauses.'),
      evidence: finding.evidence
    }
  }

  const cfg = getStatusConfig()
  const BadgeIcon = cfg.badgeIcon

  return (
    <div
      className={`bg-white rounded-xl border border-[#E2E8F0] ${cfg.leftStripe} p-5 space-y-4 shadow-[0_2px_10px_rgba(20,30,50,0.03)] hover:shadow-md transition-shadow`}
    >
      {/* ── Top Header: Status Badge, Standard Name, Replacement Tag, View Evidence ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-2xs ${cfg.badgeBg}`}>
            <BadgeIcon className={`w-3.5 h-3.5 ${cfg.badgeIconColor}`} />
            <span>{cfg.badgeText}</span>
          </span>

          <span className="font-mono font-bold text-sm text-[#0F2942]">
            {cfg.standardNo}
          </span>

          {cfg.replacementText && (
            <span className="text-xs font-medium text-[#475569] bg-[#F8FAFC] px-2.5 py-0.5 rounded-md border border-[#E2E8F0]">
              {cfg.replacementText}
            </span>
          )}
        </div>

        {cfg.evidence && onViewEvidence && (
          <button
            type="button"
            onClick={() => onViewEvidence(cfg.evidence)}
            className="text-xs text-[#0F2942] hover:text-[#1B4965] font-bold flex items-center gap-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] px-3 py-1.5 rounded-lg border border-[#CBD5E1] transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#1B4965]" />
            <span>{t('inspect_evidence_btn', language)}</span>
          </button>
        )}
      </div>

      {/* ── 3 Clean, Human Procurement Rows (No robotic AI headings) ── */}
      <div className="space-y-3 text-xs">
        {/* Row 1: Identified in Tender */}
        <div className="flex items-start gap-2.5">
          <span className="font-bold text-[#64748B] min-w-[130px] shrink-0 pt-0.5">
            {t('clause_ref_label', language)}
          </span>
          <p className="text-[#1E293B] font-medium leading-relaxed">
            "{cfg.clauseTitle}"
          </p>
        </div>

        {/* Row 2: Regulatory & Audit Risk */}
        <div className="flex items-start gap-2.5">
          <span className="font-bold text-[#64748B] min-w-[130px] shrink-0 pt-0.5">
            {t('audit_risk_label', language)}
          </span>
          <p className="text-[#475569] leading-relaxed">
            {cfg.riskText}
          </p>
        </div>

        {/* Row 3: Corrective Action */}
        <div className="flex items-start gap-2.5">
          <span className="font-bold text-[#0F2942] min-w-[130px] shrink-0 pt-0.5">
            {t('rec_action_label', language)}
          </span>
          <p className="text-[#0F2942] font-semibold leading-relaxed">
            {cfg.actionText}
          </p>
        </div>
      </div>

      {/* ── One-Click Action Banner if Superseded ── */}
      {category === 'outdated' && finding.current_reference && onSelectStandard && (
        <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs bg-[#F8FAFC] -mx-5 -mb-5 p-4 rounded-b-xl">
          <div className="flex items-center gap-2 text-[#475569]">
            <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>
              {t('official_replacement_label', language)}{' '}
              <strong className="font-mono text-[#0F2942]">{finding.current_reference}</strong> ({finding.current_title || (isHindi ? 'सक्रिय मानक विनिर्देश' : 'Active Specification')})
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelectStandard(finding.current_reference)}
            className="px-3 py-1.5 rounded-lg bg-[#0F2942] hover:bg-[#1B4965] text-white font-bold transition-colors flex items-center gap-1.5 shadow-2xs text-xs"
          >
            <span>{isHindi ? `${finding.current_reference} मानक खोलें` : `Open ${finding.current_reference} Standard`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
