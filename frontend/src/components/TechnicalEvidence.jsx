import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  Search,
  Clock,
  Globe,
  FileText
} from 'lucide-react'

export default function TechnicalEvidence({
  standard,
  allStandards = [],
  extractedRequirements = {},
  executionTimeMs = 0,
  documentMetadata = null,
  antiHallucinationGuarantee = '',
  language = 'en'
}) {
  const [expanded, setExpanded] = useState(false)
  const isHindi = language === 'hi'

  const primaryStd = standard || (allStandards.length > 0 ? allStandards[0] : null)

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(20,30,50,0.04)] overflow-hidden">
      {/* Header Button */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-[#F0F7FA] text-[#1B4965] border border-[#D0E2ED] flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#0F2942]">
                {isHindi ? 'तकनीकी साक्ष्य एवं पुनर्प्राप्ति टेलीमेट्री' : 'Technical Evidence & Retrieval Telemetry'}
              </h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
                {isHindi ? 'ऑडिट रिकॉर्ड' : 'Audit Record'}
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              {isHindi
                ? 'BM25 कीवर्ड रैंकिंग, सघन वेक्टर समानता, एनएलपी इकाइयां और निष्पादन समय की जांच करें'
                : 'Inspect BM25 keyword rankings, dense vector similarities, NLP entities, and system performance'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B4965] bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
          <span>{expanded ? (isHindi ? 'टेलीमेट्री छिपाएं' : 'Hide Telemetry') : (isHindi ? 'ऑडिट टेलीमेट्री देखें' : 'View Audit Telemetry')}</span>
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Content Body */}
      {expanded && (
        <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]/50 space-y-5 text-xs animate-in fade-in duration-150">
          {/* 1. Retrieval Scoring Telemetry */}
          <div className="space-y-2">
            <span className="font-bold text-[#64748B] text-[10px] uppercase tracking-wider block">
              Multi-Stage Retrieval Fusion
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-0.5">
                <span className="text-[#64748B] text-[10px] block font-semibold">BM25 Keyword Score</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {primaryStd?.bm25_score != null ? primaryStd.bm25_score : '—'}
                </span>
                <span className="text-[10px] text-[#64748B] block">Weight: 0.45</span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-0.5">
                <span className="text-[#64748B] text-[10px] block font-semibold">Dense Vector Similarity</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {primaryStd?.vector_score != null ? primaryStd.vector_score : '—'}
                </span>
                <span className="text-[10px] text-[#64748B] block">BGE-Small 384d (0.55)</span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-0.5">
                <span className="text-[#64748B] text-[10px] block font-semibold">Fusion Method</span>
                <span className="font-bold text-[#0F2942] text-xs block truncate">
                  RRF (Reciprocal Rank)
                </span>
                <span className="text-[10px] text-[#64748B] block">Rank Fusion</span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-0.5">
                <span className="text-[#64748B] text-[10px] block font-semibold">Pipeline Latency</span>
                <span className="font-mono font-bold text-[#16A34A] text-sm">
                  {executionTimeMs} ms
                </span>
                <span className="text-[10px] text-[#64748B] block">End-to-End</span>
              </div>
            </div>
          </div>

          {/* 2. Database Record Metadata */}
          {primaryStd && (
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-2">
              <span className="font-bold text-[#64748B] text-[10px] uppercase tracking-wider block">
                Database Record & Verification Provenance
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[#64748B] text-[11px] block">Database Record ID:</span>
                  <span className="font-mono text-slate-800 truncate block font-medium">
                    {primaryStd.id || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[11px] block">Revision / Amendments:</span>
                  <span className="font-mono text-slate-800 block font-medium">
                    {primaryStd.current_version || 'N/A'} ({primaryStd.amendments?.length || 0} amendments)
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[11px] block">Verification Status:</span>
                  <span className="font-semibold text-[#16A34A] block">
                    {primaryStd.status_verified ? `Verified Record (${primaryStd.last_verified_on || 'Current'})` : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Extracted NLP Parameters Matrix */}
          <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-[#64748B] text-[10px] uppercase tracking-wider">
                Extracted Specification Parameters & Metadata
              </span>
              {extractedRequirements.was_multilingual && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>Hindi / Multilingual Query Translated</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[#64748B] text-[11px] block">Inferred Product Type:</span>
                <span className="font-bold text-[#0F2942]">
                  {extractedRequirements.product_type || 'General Engineering Item'}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] text-[11px] block">Inferred Sector Domain:</span>
                <span className="font-semibold text-[#1B4965]">
                  {extractedRequirements.inferred_sector || 'General / Multi-Sector'}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] text-[11px] block">Document Source:</span>
                <span className="text-slate-700">
                  {documentMetadata ? `${documentMetadata.filename} (${documentMetadata.total_pages} Pages)` : 'Direct Text Input'}
                </span>
              </div>
            </div>

            {/* Numerical Parameters */}
            {extractedRequirements.technical_parameters && Object.keys(extractedRequirements.technical_parameters).length > 0 && (
              <div className="pt-2 border-t border-[#E2E8F0] space-y-1.5">
                <span className="text-[#64748B] text-[10px] font-semibold block">
                  Extracted Numerical Constraints:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(extractedRequirements.technical_parameters).flatMap(([param, vals]) =>
                    vals.map((v, i) => (
                      <span
                        key={`${param}-${i}`}
                        className="px-2.5 py-1 rounded bg-[#F8FAFC] border border-[#CBD5E1] font-mono text-[11px] text-slate-800"
                      >
                        {param}: <strong className="text-[#0F2942]">{v}</strong>
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. Anti-Hallucination Guarantee */}
          {antiHallucinationGuarantee && (
            <div className="p-3.5 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] flex items-start gap-3 text-xs text-[#14532D]">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#166534]">
                  Anti-Hallucination Guarantee
                </span>
                <p className="mt-0.5 leading-relaxed text-[#14532D]">
                  {antiHallucinationGuarantee}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
