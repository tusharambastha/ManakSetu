import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  ShieldCheck,
  Search,
  BookOpen,
  History,
  Award,
  Building2,
  User,
  Sparkles,
  Menu,
  X,
  Home,
  LayoutDashboard,
  PlayCircle,
  Info,
  Globe,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  Check,
  Building,
  BadgeCheck,
  Layers,
  FileSearch,
  Video,
  HelpCircle,
  Headphones
} from 'lucide-react'
import AnalysisWorkspace from './AnalysisWorkspace'
import ResultsView from './ResultsView'
import StandardsCatalog from './StandardsCatalog'
import HistoryView from './HistoryView'
import JudgePitchView from './JudgePitchView'
import FaqModal from './FaqModal'
import HelpSupportModal from './HelpSupportModal'
import { t, TRANSLATIONS } from '../utils/translations'
import logoImg from '../assets/manaksetu-logo.jpg'
import { safeFetch } from '../utils/api'
import { getOrgBenchmarks } from '../utils/localEngine'

// ─── Dark Mode helpers ────────────────────────────────────────────────────────
function getInitialDark() {
  return false
}

if (typeof window !== 'undefined') {
  try {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('manaksetu_darkmode', 'false')
  } catch (_) {}
}

// ─── Modal: About ManakSetu ─────────────────────────────────────────────────
function AboutModal({ onClose }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const features = [
    { icon: FileSearch, title: 'AI-Powered Tender Analysis', desc: 'Extracts technical requirements from tender specifications written in English or Hindi (हिन्दी).' },
    { icon: BadgeCheck, title: 'Indian Standards (BIS) Recommendation', desc: 'Retrieves the correct IS standards from a curated knowledge base of 49+ Indian Standards — zero hallucination.' },
    { icon: Layers, title: 'Allied Standards Graph', desc: 'Automatically traverses normative references to surface mandatory test methods, safety standards, and related IS codes.' },
    { icon: ShieldCheck, title: 'Supersession & QCO Detection', desc: 'Flags withdrawn/superseded standards and enforces QCO, ISI-Mark, and CRS compliance requirements from Gazette notifications.' },
    { icon: Search, title: 'Hybrid RAG Retrieval', desc: 'Combines BM25 keyword ranking + semantic vector search for precision recall that outperforms keyword-only or LLM-only approaches.' },
    { icon: Building, title: 'Government Procurement Ready', desc: 'Built for GeM, CPWD, Railways, Defence, and State PWD procurement workflows under GFR 2017 mandates.' },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="About ManakSetu">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-[#1E2A35] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E3DDD5] dark:border-[#2E3F4F]">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1E2A35] px-6 pt-6 pb-4 border-b border-[#E3DDD5] dark:border-[#2E3F4F] flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-xl bg-[#1B4965] flex items-center justify-center">
                <Info className="w-4 h-4 text-white" />
              </span>
              <h2 className="text-lg font-bold text-[#1C1C1E] dark:text-white">About ManakSetu</h2>
            </div>
            <p className="text-xs text-[#7A7A7A] dark:text-[#9A9A9E]">
              Smart India Hackathon 2026 · Problem SIH26108 · Bureau of Indian Standards
            </p>
          </div>
          <button onClick={onClose} aria-label="Close about modal" className="p-1.5 rounded-lg hover:bg-[#F2EFE9] dark:hover:bg-[#2E3F4F] text-[#7A7A7A] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* What is ManakSetu */}
          <div className="p-4 bg-[#F7F5F1] dark:bg-[#16212B] rounded-xl border border-[#E3DDD5] dark:border-[#2E3F4F]">
            <p className="text-sm text-[#1C1C1E] dark:text-[#D0D5DA] leading-relaxed">
              <span className="font-bold text-[#1B4965] dark:text-[#5B9CC9]">ManakSetu</span> (मानकसेतु) is an AI-powered procurement intelligence platform that bridges government tender officers with the correct Bureau of Indian Standards (BIS) specifications — eliminating hallucinated IS codes, outdated editions, and missing allied standards from procurement documents.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-3.5 bg-white dark:bg-[#16212B] rounded-xl border border-[#E3DDD5] dark:border-[#2E3F4F] flex gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#EBF4FA] dark:bg-[#1B4965]/40 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#1B4965] dark:text-[#5B9CC9]" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1C1E] dark:text-white mb-0.5">{title}</h4>
                  <p className="text-[11px] text-[#7A7A7A] dark:text-[#9A9A9E] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div className="text-center pt-1">
            <span className="text-[11px] font-bold text-[#1B4965] dark:text-[#5B9CC9] uppercase tracking-widest">
              Zero Hallucination · Retrieval-First · Made for Bharat
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Modal: How It Works ────────────────────────────────────────────────────
function HowItWorksModal({ onClose, language = 'en' }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      step: '1',
      title: 'Tender Specification & Requirements Ingestion',
      badge: 'NLP Preprocessor',
      desc: 'Officer inputs raw clauses, item descriptions, or uploads full PDF/DOCX tenders. ManakSetu identifies technical attributes without sending data to public clouds.',
      highlights: ['Devanagari & Roman Hindi Normalization', 'Zero external API dependence', 'Parameter tokenization (voltage, grades, classes)']
    },
    {
      step: '2',
      title: 'Deterministic Parameter Extraction',
      badge: 'Parameter Guard',
      desc: 'Extracts exact engineering parameters (1100V, Fe 500D, 440V, 200J steel toe impact, PN 10 pressure) to anchor the retrieval space.',
      highlights: ['Extracts exact numerical ratings', 'Preserves safety properties (FRLS, dielectric)', 'Identifies canonical sector and product category']
    },
    {
      step: '3',
      title: 'Hybrid Knowledge Base Retrieval (BM25 + Dense Vectors)',
      badge: 'Local Hybrid Search',
      desc: 'Sparse keyword indexing (BM25) and dense ONNX embeddings (FastEmbed BGE-small) run simultaneously and are fused using Reciprocal Rank Fusion (RRF).',
      highlights: ['Zero LLM hallucinations', 'Official BIS catalog records only', 'Instant sub-50ms hybrid retrieval']
    },
    {
      step: '4',
      title: 'Automated Deprecation Shield & Version Verification',
      badge: 'Statutory Shield',
      desc: 'Checks if referenced standard is superseded or withdrawn, and automatically routes procurement officer to the current active edition with gazette citation.',
      highlights: ['Example: Obsolete IS 12269 routed to IS 269:2015', 'Full amendment tracking', 'Official BIS gazette cross-reference']
    },
    {
      step: '5',
      title: 'Mandatory QCO Enforcement & Compliance Report',
      badge: 'Audit-Ready Report',
      desc: 'Checks whether product has statutory Quality Control Orders (QCO) mandating ISI mark or CRS licensing, surfacing an audit-grade evidence trail.',
      highlights: ['Ministry Gazette order tracking', 'Pre-publication risk and conflict audit', 'Ready-to-copy standard clauses for GeM/CPWD']
    }
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="How ManakSetu Works">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-[#132230] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-[#E3DDD5] dark:border-[#243647]">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-[#132230]/95 backdrop-blur-md px-6 pt-6 pb-4 border-b border-[#E3DDD5] dark:border-[#243647] flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-8 h-8 rounded-xl bg-[#E05A00] flex items-center justify-center shadow-xs">
                <PlayCircle className="w-4 h-4 text-white" />
              </span>
              <h2 className="text-lg font-bold text-[#1C1C1E] dark:text-white">
                How ManakSetu Works (End-to-End Architecture)
              </h2>
            </div>
            <p className="text-xs text-[#7A7A7A] dark:text-[#94A3B8]">
              Deterministic, zero-hallucination standards retrieval and compliance intelligence workflow
            </p>
          </div>
          <button onClick={onClose} aria-label="Close how it works modal" className="p-2 rounded-xl hover:bg-[#F2EFE9] dark:hover:bg-[#1A2E40] text-[#7A7A7A] dark:text-[#94A3B8] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Interactive Pipeline Stage Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {steps.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeStep === idx
                    ? 'bg-[#0F2942] dark:bg-[#1E3A5F] text-white border-[#0F2942] dark:border-[#1E3A5F] shadow-sm'
                    : 'bg-[#FBF8F3] dark:bg-[#162736] border-[#E5DDD1] dark:border-[#243647] text-[#475569] dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#1E3244]'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Stage {s.step}</div>
                <div className="text-xs font-bold truncate mt-0.5">{s.badge}</div>
              </button>
            ))}
          </div>

          {/* Active Stage Spotlight Card */}
          <div className="p-5 rounded-2xl bg-[#F6F1E7] dark:bg-[#162736] border border-[#E5DDD1] dark:border-[#243647] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E05A00]/10 text-[#E05A00] border border-[#E05A00]/30">
                Active Stage {steps[activeStep].step}: {steps[activeStep].badge}
              </span>
              <span className="text-xs font-semibold text-[#1B4965] dark:text-[#5B9CC9]">
                Zero Hallucination Guaranteed
              </span>
            </div>

            <h3 className="text-base font-bold text-[#1C1C1E] dark:text-white">
              {steps[activeStep].title}
            </h3>

            <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
              {steps[activeStep].desc}
            </p>

            <div className="pt-2 border-t border-[#E5DDD1] dark:border-[#243647] flex flex-wrap gap-2">
              {steps[activeStep].highlights.map((h, i) => (
                <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-[#0D1520] border border-[#E5DDD1] dark:border-[#243647] text-[#1C1C1E] dark:text-[#CBD5E1] flex items-center gap-1.5 shadow-2xs">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{h}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Full Pipeline Step-by-Step Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4965] dark:text-[#5B9CC9]">
              Complete Pipeline Flow
            </h4>
            {steps.map(({ step, title, desc, badge }, idx) => (
              <div
                key={step}
                onClick={() => setActiveStep(idx)}
                className={`flex gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'border-[#1B4965] dark:border-[#5B9CC9] bg-white dark:bg-[#1A2E40] shadow-xs'
                    : 'border-[#E5DDD1] dark:border-[#243647] bg-white/70 dark:bg-[#162736]/70 hover:bg-white dark:hover:bg-[#162736]'
                }`}
              >
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  activeStep === idx ? 'bg-[#E05A00] text-white shadow-2xs' : 'bg-[#1B4965] text-white'
                }`}>
                  {step}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h5 className="text-xs font-bold text-[#1C1C1E] dark:text-white">{title}</h5>
                    <span className="text-[10px] font-semibold text-[#7A7A7A] dark:text-[#94A3B8]">{badge}</span>
                  </div>
                  <p className="text-xs text-[#7A7A7A] dark:text-[#94A3B8] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Modal: View Profile ────────────────────────────────────────────────────
function ProfileModal({ user, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'PO'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="User Profile">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-[#1E2A35] rounded-2xl shadow-2xl max-w-sm w-full border border-[#E3DDD5] dark:border-[#2E3F4F]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#E3DDD5] dark:border-[#2E3F4F] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C1C1E] dark:text-white">My Profile</h2>
          <button onClick={onClose} aria-label="Close profile" className="p-1.5 rounded-lg hover:bg-[#F2EFE9] dark:hover:bg-[#2E3F4F] text-[#7A7A7A] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#1B4965] text-white flex items-center justify-center font-bold text-xl">
              {initials}
            </div>
            <div className="text-center">
              <p className="font-bold text-[#1C1C1E] dark:text-white text-sm">{user?.name || 'Registered Officer'}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#1B4965]/10 dark:bg-[#1B4965]/30 text-[#1B4965] dark:text-[#5B9CC9] text-[11px] font-bold">
                {user?.role === 'officer' ? 'Procurement Officer' : 'BIS Admin'}
              </span>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-2 text-xs">
            {[
              { label: 'Full Name', value: user?.name || 'Registered Officer' },
              { label: 'Role', value: user?.role === 'officer' ? 'Procurement Officer' : 'BIS Admin' },
              { label: 'Organization', value: user?.department || 'Public Procurement Division' },
              { label: 'Portal Access', value: user?.role === 'officer' ? 'Officer Portal — Tender Engine' : 'Admin Portal — Standards Management' },
              { label: 'Email', value: user?.email || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-2 py-2 border-b border-[#F2EFE9] dark:border-[#2E3F4F] last:border-0">
                <span className="text-[#7A7A7A] dark:text-[#9A9A9E] font-medium shrink-0">{label}</span>
                <span className="text-[#1C1C1E] dark:text-[#D0D5DA] font-semibold text-right truncate max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Modal: Sign Out Confirmation ───────────────────────────────────────────
function SignOutConfirmModal({ onCancel, onConfirm }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Sign out confirmation">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 bg-white dark:bg-[#1E2A35] rounded-2xl shadow-2xl max-w-xs w-full border border-[#E3DDD5] dark:border-[#2E3F4F] p-6 space-y-5">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-sm font-bold text-[#1C1C1E] dark:text-white">Sign Out?</h2>
          <p className="text-xs text-[#7A7A7A] dark:text-[#9A9A9E]">
            Are you sure you want to sign out of ManakSetu? Your session will end.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-[#E3DDD5] dark:border-[#2E3F4F] bg-white dark:bg-[#16212B] text-[#1C1C1E] dark:text-white text-xs font-bold hover:bg-[#F2EFE9] dark:hover:bg-[#2E3F4F] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── LANGUAGES (Official Government Languages: English & Hindi) ─────────────
const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
]

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function OfficerPortal({
  user,
  onLogout,
  onResetAnalysis,
  onAnalyze,
  loading,
  analysisResults,
  demoQueries,
  onSelectStandard
}) {
  const [activeTab, setActiveTab] = useState('engine')

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Language (Only official 'en' and 'hi' supported)
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('manaksetu_language') || localStorage.getItem('manaksetu_lang')
      return (saved === 'hi' || saved === 'en') ? saved : 'en'
    } catch (_) {
      return 'en'
    }
  })
  const [langOpen, setLangOpen] = useState(false)

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false)

  // Modals
  const [showAbout, setShowAbout] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showSignOut, setShowSignOut] = useState(false)
  const [showFaq, setShowFaq] = useState(false)
  const [showHelpSupport, setShowHelpSupport] = useState(false)

  const profileRef = useRef(null)
  const sidebarRef = useRef(null)

  // Dark Mode state
  const [dark, setDark] = useState(getInitialDark)
  const [reanalyzeQuery, setReanalyzeQuery] = useState('')

  const officerInitials = user?.name
    ? user.name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
    : 'PO'

  // ── Organization-specific benchmark scenarios ──────────────────────────────
  // Pre-seeded from local fallback immediately so cards render without delay.
  // Backend fetch replaces them instantly if available.
  const [orgBenchmarks, setOrgBenchmarks] = useState(() => {
    return getOrgBenchmarks(user?.department || '')
  })

  useEffect(() => {
    // Re-seed local benchmarks whenever user changes (e.g. different login)
    setOrgBenchmarks(getOrgBenchmarks(user?.department || ''))

    // Try to fetch from backend for authoritative org resolution
    if (!user?.department) return
    const encoded = encodeURIComponent(user.department)
    safeFetch(`/api/v1/benchmarks?organization=${encoded}`)
      .then((data) => {
        if (data && Array.isArray(data.benchmarks) && data.benchmarks.length > 0) {
          setOrgBenchmarks(data.benchmarks)
        }
      })
      .catch(() => {
        // Backend unavailable — local fallback already set above
      })
  }, [user?.department])

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      try {
        localStorage.setItem('manaksetu_darkmode', 'true')
      } catch (_) {}
    } else {
      root.classList.remove('dark')
      try {
        localStorage.setItem('manaksetu_darkmode', 'false')
      } catch (_) {}
    }
  }, [dark])

  const toggleDark = () => setDark(prev => !prev)

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close sidebar / dropdowns on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false)
        setProfileOpen(false)
        setLangOpen(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const handleReanalyze = (queryText) => {
    setReanalyzeQuery(queryText)
    setActiveTab('engine')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    onAnalyze({ type: 'text', text: queryText, sector: null, top_k: 5 })
  }

  const handleConfirmSignOut = () => {
    setShowSignOut(false)
    onLogout()
  }

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const sidebarNavItems = [
    {
      tab: 'engine',
      icon: Search,
      label: t('tender_engine', language),
      action: () => {
        setActiveTab('engine')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        closeSidebar()
      }
    },
    {
      tab: 'catalog',
      icon: BookOpen,
      label: t('standards_directory', language),
      action: () => {
        setActiveTab('catalog')
        closeSidebar()
      }
    },
    {
      icon: PlayCircle,
      label: t('how_it_works', language),
      action: () => {
        setShowHowItWorks(true)
        closeSidebar()
      }
    },
    {
      icon: Info,
      label: t('about_manaksetu', language),
      action: () => {
        setShowAbout(true)
        closeSidebar()
      }
    },
    {
      tab: 'pitch',
      icon: Award,
      label: t('why_setu_wins', language),
      action: () => {
        setActiveTab('pitch')
        closeSidebar()
      }
    },
    {
      icon: HelpCircle,
      label: language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'FAQ & Knowledge Base',
      action: () => {
        setShowFaq(true)
        closeSidebar()
      }
    },
    {
      icon: Headphones,
      label: language === 'hi' ? 'सहायता एवं संपर्क (Help & Support)' : 'Help & Support',
      action: () => {
        setShowHelpSupport(true)
        closeSidebar()
      }
    },
  ]

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  return (
    <div className="min-h-screen bg-[#F6F1E7] dark:bg-[#111B24] flex flex-col font-sans text-[#1C1C1E] dark:text-[#E2E8F0] transition-colors duration-200 overflow-x-hidden">

      {/* ── National Tricolor Strip ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shrink-0" />

      {/* ── HEADER ── */}
      <header className="bg-white/95 dark:bg-[#1A2535]/95 backdrop-blur-md border-b border-[#E5DDD1] dark:border-[#2E3F4F] sticky top-0 z-40 shadow-[0_2px_12px_rgba(20,30,50,0.03)] transition-colors duration-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 sm:gap-4">

          {/* LEFT: Hamburger + Logo + Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label={t('open_nav', language)}
              className="p-2 sm:p-2.5 rounded-xl border border-[#E5DDD1] dark:border-[#2E3F4F] bg-[#F6F1E7] dark:bg-[#1E2A35] hover:bg-[#EFE7DA] dark:hover:bg-[#243444] text-[#0F2942] dark:text-[#E2E8F0] transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Menu className="w-5 h-5 text-[#0F2942] dark:text-[#E2E8F0]" />
            </button>

            <div
              onClick={() => { setActiveTab('engine'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
              title="Return to Tender Engine"
            >
              <img
                src={logoImg}
                alt="ManakSetu"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain rounded-xl group-hover:opacity-90 transition-opacity drop-shadow-xs"
              />

              <div className="hidden xl:block border-l border-[#E5DDD1] dark:border-[#2E3F4F] pl-3 ml-0.5">
                <div className="text-xs font-bold text-[#0F2942] dark:text-white tracking-tight group-hover:text-[#1B4965] dark:group-hover:text-sky-300 transition-colors">
                  {t('tender_intelligence', language)}
                </div>
                <div className="text-[10px] font-medium text-[#7A7A7A] dark:text-[#9A9A9E]">
                  {t('ministry_sub', language)}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: History Button + Dark Mode Toggle + Profile dropdown */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* My History Tab / Action moved to the right */}
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold transition-all text-xs sm:text-sm border shadow-2xs cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#0F2942] text-white border-[#0F2942] shadow-xs'
                  : 'bg-white dark:bg-[#1E2A35] text-[#475569] dark:text-[#E2E8F0] hover:text-[#0F2942] hover:bg-[#F6F1E7] dark:hover:bg-[#2E3F4F] border-[#E5DDD1] dark:border-[#2E3F4F]'
              }`}
            >
              <History className={`w-4 h-4 ${activeTab === 'history' ? 'text-white' : 'text-[#1B4965] dark:text-sky-400'}`} />
              <span>{t('my_history', language)}</span>
            </button>

            {/* Profile dropdown */}
            <div className="relative shrink-0" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(prev => !prev)}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-white dark:bg-[#1E2A35] border border-[#E5DDD1] dark:border-[#2E3F4F] rounded-xl shadow-2xs hover:bg-[#F6F1E7] dark:hover:bg-[#2E3F4F] text-[#0F2942] dark:text-[#E2E8F0] transition-colors max-w-[190px] sm:max-w-[230px] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0F2942] dark:bg-[#1B4965] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  {officerInitials}
                </div>
                <div className="text-left hidden sm:block min-w-0">
                  <div className="font-bold text-[#0F2942] dark:text-white text-xs leading-tight truncate">
                    {user?.name || 'Registered Officer'}
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#9A9A9E] leading-tight truncate">
                    {user?.department || 'Public Procurement Division'}
                  </div>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#64748B] dark:text-[#9A9A9E] shrink-0 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1E2A35] border border-[#E5DDD1] dark:border-[#2E3F4F] rounded-xl shadow-xl overflow-hidden z-50 text-[#0F2942] dark:text-[#E2E8F0]"
                  role="menu"
                >
                  <button
                    role="menuitem"
                    onClick={() => { setShowProfile(true); setProfileOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-[#0F2942] dark:text-[#E2E8F0] hover:bg-[#F6F1E7] dark:hover:bg-[#243444] transition-colors text-left cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[#64748B] dark:text-[#9A9A9E]" />
                    {t('view_profile', language)}
                  </button>

                  <div className="h-px bg-[#E5DDD1] dark:bg-[#2E3F4F]" />

                  <button
                    role="menuitem"
                    onClick={() => { setShowSignOut(true); setProfileOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t('sign_out', language)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* ── SIDEBAR OVERLAY ── */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!sidebarOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeSidebar}
        />

        {/* Sidebar Panel */}
        <aside
          ref={sidebarRef}
          className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white dark:bg-[#1A2535] border-r border-[#E3DDD5] dark:border-[#2E3F4F] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="navigation"
          aria-label="Sidebar navigation"
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3DDD5] dark:border-[#2E3F4F]">
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="ManakSetu" className="h-10 sm:h-11 w-auto object-contain rounded-lg shadow-2xs" />
              <span className="text-base font-bold text-[#1B4965] dark:text-sky-300">ManakSetu</span>
            </div>
            <button
              onClick={closeSidebar}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-lg hover:bg-[#F2EFE9] dark:hover:bg-[#2E3F4F] text-[#7A7A7A] dark:text-[#9A9A9E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Divider label */}
          <p className="px-5 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9A9A9E]">
            {t('navigation', language)}
          </p>

          {/* Nav items */}
          <div className="px-3 space-y-1">
            {sidebarNavItems.map(({ tab, icon: Icon, label, action }) => {
              const isActive = tab && activeTab === tab
              return (
                <button
                  key={label}
                  onClick={action}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#0F2942] text-white shadow-2xs font-bold'
                      : 'text-[#1C1C1E] dark:text-[#E2E8F0] hover:bg-[#F2EFE9] dark:hover:bg-[#243444]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#1B4965] dark:text-sky-400'}`} />
                    <span>{label}</span>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mx-5 my-3 h-px bg-[#E3DDD5] dark:border-[#2E3F4F]" />

          {/* Language selector */}
          <div className="px-3">
            <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9A9A9E]">
              {t('language_header', language)}
            </p>

            <div className="space-y-0.5">
              {LANGUAGES.map(({ code, label, native }) => (
                <button
                  key={code}
                  onClick={() => {
                    setLanguage(code)
                    try {
                      localStorage.setItem('manaksetu_language', code)
                    } catch (_) {}
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                    language === code
                      ? 'bg-[#EBF4FA] dark:bg-[#243444] text-[#1B4965] dark:text-sky-300 font-bold'
                      : 'text-[#1C1C1E] dark:text-[#E2E8F0] hover:bg-[#F2EFE9] dark:hover:bg-[#243444] font-semibold'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 shrink-0" />
                    <span>{native}</span>
                  </span>
                  {language === code && (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Spacer pushes theme toggle to bottom */}
          <div className="flex-1" />

          {/* Dark Mode toggle in Sidebar */}
          <div className="border-t border-[#E3DDD5] dark:border-[#2E3F4F] px-5 py-4">
            <button
              onClick={toggleDark}
              type="button"
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F2EFE9] dark:hover:bg-[#243444] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-xs font-semibold text-[#1C1C1E] dark:text-[#E2E8F0]">
                {dark ? (
                  <Moon className="w-4 h-4 text-amber-400" />
                ) : (
                  <Sun className="w-4 h-4 text-[#E05A00]" />
                )}
                <span>{t('dark_mode', language)}</span>
              </span>

              {/* Toggle switch */}
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  dark ? 'bg-[#1B4965]' : 'bg-[#CBD5E1]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    dark ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* ManakSetu Version & Support Footer */}
          <div className="border-t border-[#E3DDD5] dark:border-[#2E3F4F] px-5 py-3.5 text-center bg-[#FAF7F2] dark:bg-[#14202C]">
            <p className="text-[11px] font-bold text-[#0F2942] dark:text-[#E2E8F0] font-mono">
              ManakSetu v1.0.0
            </p>
            <p className="text-[10px] text-[#7A7A7A] dark:text-[#9A9A9E] mt-0.5">
              {language === 'hi' ? 'राष्ट्रीय मानक अनुपालन पोर्टल' : 'National Standards Compliance Shield'}
            </p>
            <a
              href="mailto:manaksetu.in@gmail.com"
              className="text-[10.5px] text-[#1B4965] dark:text-sky-400 hover:underline font-mono font-semibold block mt-1"
            >
              manaksetu.in@gmail.com
            </a>
          </div>
        </aside>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {activeTab === 'engine' && (
          <div>
            <AnalysisWorkspace
              onAnalyze={onAnalyze}
              loading={loading}
              demoQueries={demoQueries}
              language={language}
              initialQuery={reanalyzeQuery}
              orgBenchmarks={orgBenchmarks}
              userDepartment={user?.department || ''}
            />
            {analysisResults && (
              <ResultsView
                results={analysisResults}
                onSelectStandard={onSelectStandard}
                language={language}
              />
            )}
          </div>
        )}

        {activeTab === 'catalog' && (
          <StandardsCatalog
            onSelectStandard={onSelectStandard}
            language={language}
            userDepartment={user?.department || ''}
            user={user}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            onReanalyze={handleReanalyze}
            onSelectStandard={onSelectStandard}
            user={user}
            language={language}
          />
        )}

        {activeTab === 'pitch' && (
          <JudgePitchView onBackToDashboard={() => setActiveTab('engine')} />
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-white dark:bg-[#1A2535] border-t border-[#E3DDD5] dark:border-[#2E3F4F] py-4 px-4 sm:px-8 text-xs text-[#7A7A7A] dark:text-[#9A9A9E] mt-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#1C1C1E] dark:text-white">ManakSetu Procurement Officer Portal</span>
            <span> • Smart India Hackathon 2026 (SIH26108)</span>
          </div>
          <div>
            <span>Bureau of Indian Standards (BIS) Recommendation System</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-2 text-center text-[#9A9A9E] dark:text-[#6B7280]">
          © 2026 ManakSetu | Independent SIH Prototype | For Reference &amp; Verification Only
        </div>
      </footer>

      {/* ── MODALS ── */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showHowItWorks && <HowItWorksModal language={language} onClose={() => setShowHowItWorks(false)} />}
      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
      {showFaq && <FaqModal language={language} onClose={() => setShowFaq(false)} />}
      {showHelpSupport && (
        <HelpSupportModal
          language={language}
          user={user}
          onClose={() => setShowHelpSupport(false)}
        />
      )}
      {showSignOut && (
        <SignOutConfirmModal
          onCancel={() => setShowSignOut(false)}
          onConfirm={handleConfirmSignOut}
        />
      )}
    </div>
  )
}
