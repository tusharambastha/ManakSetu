import React, { useEffect } from 'react'
import {
  FileText,
  X,
  ExternalLink,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Scale,
  ShieldCheck
} from 'lucide-react'

export default function EvidenceModal({ evidence, onClose, language = 'en' }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!evidence) return null

  const isSuperseded = evidence.standard_status === 'SUPERSEDED'

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Inspectable Verification Evidence"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F0F7FA] text-[#1B4965] border border-[#D0E2ED] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F2942] leading-tight">
                {evidence.title || 'Official BIS Verification Evidence'}
              </h3>
              <span className="text-xs text-[#64748B]">
                Government Gazette & Bureau of Indian Standards Audit Trail
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-3.5 text-xs">
          {/* Tender Specification Clause */}
          {evidence.tender_clause && (
            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="font-bold text-[#64748B] text-[10px] uppercase tracking-wider block">
                Tender Specification Excerpt
              </span>
              <p className="font-medium text-[#1E293B] leading-relaxed">
                "{evidence.tender_clause}"
              </p>
            </div>
          )}

          {/* Standard & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="font-bold text-[#64748B] text-[10px] uppercase tracking-wider block">
                Matched Standard
              </span>
              <span className="font-mono font-bold text-[#0F2942] text-sm mt-0.5 block">
                {evidence.matched_standard}
              </span>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="font-bold text-[#64748B] text-[10px] uppercase tracking-wider block">
                Official BIS Registry Status
              </span>
              <span
                className={`font-bold text-xs uppercase flex items-center gap-1.5 mt-1 ${
                  isSuperseded ? 'text-[#DC2626]' : 'text-[#16A34A]'
                }`}
              >
                {isSuperseded ? (
                  <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-[#16A34A]" />
                )}
                {evidence.standard_status || 'ACTIVE'}
              </span>
            </div>
          </div>

          {/* Regulatory / QCO Relationship */}
          {evidence.qco_relationship && (
            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="font-bold text-[#64748B] text-[10px] uppercase tracking-wider block">
                Statutory Gazette Order / QCO Mandate
              </span>
              <p className="font-medium text-[#1E293B]">
                {evidence.qco_relationship}
              </p>
            </div>
          )}

          {/* Verification Audit Trail */}
          <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1.5">
            <span className="font-bold text-[#64748B] text-[10px] uppercase tracking-wider block">
              Official Verification Audit Notes
            </span>
            <p className="text-[#334155] leading-relaxed">
              {evidence.verification_notes || 'Verified against local BIS Standards Database registry.'}
            </p>
            {evidence.last_verified_on && (
              <div className="flex items-center gap-1.5 pt-1.5 text-xs text-[#64748B] border-t border-[#E2E8F0]">
                <Calendar className="w-3.5 h-3.5 text-[#1B4965]" />
                <span>Last Verified Date: <strong className="text-slate-900">{evidence.last_verified_on}</strong></span>
              </div>
            )}
          </div>

          {/* Direct External Link */}
          {evidence.source_url && (
            <div className="pt-1">
              <a
                href={evidence.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0F2942] hover:bg-[#1B4965] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                <span>Open Official BIS / Gazette Document</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
