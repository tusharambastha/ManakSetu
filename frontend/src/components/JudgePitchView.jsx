import React from 'react'
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Award,
  Zap,
  Check,
  X,
  TrendingUp,
  FileCheck,
  ArrowLeft
} from 'lucide-react'

export default function JudgePitchView({ onBackToDashboard }) {
  const comparison = [
    {
      criteria: 'Standard Number Authenticity',
      naiveLLM: '❌ High Risk (hallucinates fake IS codes like IS 9999)',
      keywordOnly: '⚠️ Safe (only matching words)',
      setu: '✅ Answers grounded in KB records (Zero Hallucination)'
    },
    {
      criteria: 'Technical Parameter Preservation (1100V, Fe 500D)',
      naiveLLM: '❌ Poor (often altered during generation)',
      keywordOnly: '⚠️ Requires exact string match',
      setu: '✅ Parameter-Preserving Tokenizer + Match Bonus'
    },
    {
      criteria: 'Superseded Standard Auto-Detection',
      naiveLLM: '❌ Cites obsolete 1980s editions',
      keywordOnly: '❌ Cannot differentiate version status',
      setu: '✅ Automated Deprecation Shield & Active Routing'
    },
    {
      criteria: 'Mandatory QCO & Certification Compliance',
      naiveLLM: '❌ Unaware of Gazette notifications',
      keywordOnly: '❌ No regulatory awareness',
      setu: '✅ Statutory BIS ISI-Mark & CRS Enforcement'
    },
    {
      criteria: 'Allied Standards Graph Traversal',
      naiveLLM: '❌ Omits mandatory test methods',
      keywordOnly: '❌ None',
      setu: '✅ Multi-Relational Normative & Test Method Graph'
    },
    {
      criteria: 'Data Sovereignty & Air-Gapped Deployment',
      naiveLLM: '❌ Requires external commercial cloud APIs',
      keywordOnly: '✅ Local',
      setu: '✅ Self-Hosted Embeddings (FastEmbed BGE ONNX)'
    }
  ]

  return (
    <div className="space-y-6">
      {/* 0. Back to Dashboard Button */}
      {onBackToDashboard && (
        <div>
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E5DDD1] dark:border-[#334155] text-xs font-bold text-[#1B4965] dark:text-[#5B9CC9] hover:bg-[#F6F1E7] dark:hover:bg-[#2E3F4F] transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Return to Tender Engine / Dashboard</span>
          </button>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold uppercase tracking-wider">
            SIH 2026 Evaluation Deck
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 text-xs font-semibold">Problem Statement SIH26108: Standards Engine</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f2942]">
          Why ManakSetu Wins: The Decision-Support Differentiator
        </h2>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          Public procurement in India exceeds <strong>₹20 Lakh Crore</strong> annually. A standard recommendation engine cannot be a generic chatbot guessing standards — it must be an audit-grade, deterministic decision-support tool.
        </p>
      </div>

      {/* 2. Three Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Zero-Hallucination Retrieval</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            All standard codes, titles, scopes, and amendments are retrieved solely from verified local database records. The system never synthesizes fake standard numbers.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Superseded Version Shield</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Automatically detects obsolete standards (e.g. IS 12269:2013 or IS 8112:2013) and directs procurement officers to the active unified standard IS 269:2015.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Statutory QCO Enforcement</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enforces mandatory BIS ISI-Mark and Compulsory Registration Scheme (CRS) orders to ensure bid specifications comply with Government of India quality mandates.
          </p>
        </div>
      </div>

      {/* 3. Comparison Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Technical Comparison: ManakSetu vs Naive LLM vs Keyword Search
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrating why ManakSetu's retrieval-first architecture is the only compliant paradigm for government procurement.
          </p>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4 w-1/4">Evaluation Criterion</th>
                <th className="py-3 px-4 w-1/4 text-rose-800 bg-rose-50/60">Generic LLM (ChatGPT / Claude)</th>
                <th className="py-3 px-4 w-1/5 text-slate-600">Keyword Search</th>
                <th className="py-3 px-4 w-1/3 text-emerald-900 bg-emerald-50/80 font-bold">
                  ManakSetu Recommendation Engine
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {comparison.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {row.criteria}
                  </td>
                  <td className="py-3 px-4 text-rose-700 bg-rose-50/20 text-xs">
                    {row.naiveLLM}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    {row.keywordOnly}
                  </td>
                  <td className="py-3 px-4 text-emerald-950 bg-emerald-50/40 font-bold text-xs">
                    {row.setu}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. National Economic Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
          <span className="text-xl font-black text-blue-900 font-mono">85% Faster</span>
          <h5 className="font-bold text-slate-900 text-xs">Tender Specification Drafting</h5>
          <p className="text-[11px] text-slate-600">Replaces hours of manual gazette searching with instant verified matching.</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
          <span className="text-xl font-black text-emerald-900 font-mono">Zero Audit Rejections</span>
          <h5 className="font-bold text-slate-900 text-xs">CAG Compliance</h5>
          <p className="text-[11px] text-slate-600">Eliminates litigation and post-award contract disputes from superseded standards.</p>
        </div>

        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1">
          <span className="text-xl font-black text-purple-900 font-mono">Mandatory QCO Compliance</span>
          <h5 className="font-bold text-slate-900 text-xs">Statutory Quality Orders</h5>
          <p className="text-[11px] text-slate-600">Enforces mandatory BIS ISI-Mark requirements on all critical safety tenders.</p>
        </div>
      </div>
    </div>
  )
}
