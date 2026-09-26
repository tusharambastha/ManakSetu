import React from 'react'
import { ShieldCheck, AlertOctagon, CheckCircle2, Cpu, Database, Network, Scale, FileText } from 'lucide-react'

export default function ArchitectureModal() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            ManakSetu Architectural Core: Retrieval-First, Zero-Hallucination Design
          </h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Why public e-procurement (GeM, CPWD, Railways, Defence, State PWDs) cannot rely on generic LLM chatbots — and how ManakSetu guarantees regulatory precision.
        </p>
      </div>

      {/* The Danger of Hallucination vs SETU Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Naive LLM Risk */}
        <div className="p-5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950 space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold">
            <AlertOctagon className="w-4 h-4" />
            <span>The Risk: Naive LLM Free-Text Generation</span>
          </div>
          <ul className="space-y-2 text-rose-900 leading-relaxed list-disc list-inside">
            <li>
              <strong>Fabricated Standards:</strong> LLMs hallucinate non-existent standard numbers (e.g. inventing <em>"IS 9999"</em> or misapplying ISO standards).
            </li>
            <li>
              <strong>Superseded Versions:</strong> Recommends outdated editions (e.g. citing <em>IS 12269:2013</em> for 53 Grade OPC instead of the active unified <em>IS 269:2015</em>), causing tender rejection during technical evaluation.
            </li>
            <li>
              <strong>Missing Allied Standards:</strong> Omits mandatory testing methods (such as <em>IS 15298 Pt 1</em> toe impact test or <em>IS 10810</em> cable spark tests).
            </li>
            <li>
              <strong>Audit & Compliance Liability:</strong> Quoting an invalid standard in a government contract leads to audit objections, disputes, and sub-standard public infrastructure.
            </li>
          </ul>
        </div>

        {/* SETU Solution */}
        <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>The Solution: ManakSetu Retrieval-First Architecture</span>
          </div>
          <ul className="space-y-2 text-emerald-900 leading-relaxed list-disc list-inside">
            <li>
              <strong>Answers grounded in KB records:</strong> Standard numbers, titles, scopes, versions, and certification mandates are populated strictly from the local verified BIS database.
            </li>
            <li>
              <strong>Dual-Track Hybrid Search:</strong> Combines domain-tuned Rank-BM25 keyword search with self-hosted <em>BAAI/bge-small-en-v1.5</em> embeddings (zero cloud API dependency).
            </li>
            <li>
              <strong>Grounded Explanations:</strong> The "Why Recommended" justifications quote directly from the candidate standard's official scope clause in the database.
            </li>
            <li>
              <strong>Statutory QCO Enforcement:</strong> Instantly alerts procurement officers when a product category falls under mandatory BIS Product Certification or CRS orders.
            </li>
          </ul>
        </div>
      </div>

      {/* Pipeline Diagram */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Network className="w-4 h-4 text-gov-700" />
          <span>End-to-End Pipeline Execution Topology</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-gov-700 block mb-1">1. Ingestion & NLP</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Extracts technical specs from PDF/DOCX tenders. Normalizes Hindi and technical domain terms and extracts numerical parameters (voltage, strength, material).
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-gov-700 block mb-1">2. Hybrid Retrieval</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Executes parallel BM25 Okapi & dense vector similarity (FastEmbed). Fuses candidate pools using Reciprocal Rank Fusion (RRF).
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-gov-700 block mb-1">3. Grounded Re-Ranking</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Verifies candidate scopes against extracted tender parameters. Computes parameter match bonuses and flags superseded standards.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-gov-700 block mb-1">4. Allied Expansion</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Traverses relational graph to pull normative references, mandatory test methods, safety rules, and statutory QCO certifications.
            </p>
          </div>
        </div>
      </div>

      {/* Production Readiness & BIS Scalability */}
      <div className="p-4 bg-slate-100/70 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
        <span className="font-bold text-slate-900">Extensibility & Full-Scale BIS Integration:</span>
        <p className="text-[11px] leading-relaxed">
          While the current hackathon deployment features a curated dataset of ~50 verified Indian Standards across 3 core sectors (PPE, Electrical, Civil), ManakSetu is architected with PostgreSQL and pgvector schema to scale seamlessly to all 21,000+ published Indian Standards and integrate directly into government e-procurement portals via REST API.
        </p>
      </div>
    </div>
  )
}
