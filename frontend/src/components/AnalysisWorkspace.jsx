import React, { useState, useEffect } from 'react'
import {
  Upload,
  FileText,
  Search,
  Sparkles,
  Zap,
  HardHat,
  Building,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react'
import { t } from '../utils/translations'

export default function AnalysisWorkspace({ onAnalyze, loading, demoQueries, language = 'en', initialQuery = '' }) {
  const [mode, setMode] = useState('text') // 'text' or 'file'
  const [inputText, setInputText] = useState(initialQuery || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [sector, setSector] = useState('')
  const [topK, setTopK] = useState(5)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      setInputText(initialQuery)
      setMode('text')
    }
  }, [initialQuery])

  // 4 curated quick scenarios that trigger instant test run
  const quickScenarios = [
    {
      id: 'cement-amber',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-300',
      title: '53 Grade OPC → IS 269:2015',
      sectorBadge: 'Deprecation Shield',
      query: 'Supply of 53 Grade Ordinary Portland Cement conforming to IS 12269 for multi-storey prestressed concrete construction works.'
    },
    {
      id: 'helmet',
      icon: HardHat,
      iconColor: 'text-blue-500 bg-blue-50 border-blue-200',
      title: 'Safety Helmet 440V',
      sectorBadge: 'PPE Safety',
      query: 'Supply of heavy-duty industrial safety helmets with electrical insulation up to 440V, chinstrap, harness, and shock absorption for construction site engineers.'
    },
    {
      id: 'tmt',
      icon: Building,
      iconColor: 'text-emerald-500 bg-emerald-50 border-emerald-200',
      title: 'Fe 500D TMT Rebar',
      sectorBadge: 'Civil',
      query: 'Supply of high strength deformed steel bars Fe 500D with minimum 16% elongation and seismic ductile detailing for reinforced concrete bridge piers.'
    },
    {
      id: 'compliance-demo',
      icon: ShieldAlert,
      iconColor: 'text-rose-600 bg-rose-50 border-rose-300',
      title: 'Compliance Audit Demo',
      sectorBadge: 'Multi-Issue Scan',
      query: 'Clause 4: Supply of 53 Grade Ordinary Portland Cement conforming to IS 12269 for multi-storey prestressed concrete construction works.\nClause 8: Supply of PVC insulated copper electrical wiring for site installation.\nClause 12: Heavy-duty industrial safety helmets with electrical insulation rating up to 415V.\nClause 16: Supply of industrial electrical equipment with rated operating voltage of 440V.'
    }
  ]

  const handleInstantRun = (scenario) => {
    setInputText(scenario.query)
    setMode('text')
    onAnalyze({
      type: 'text',
      text: scenario.query,
      sector: null,
      top_k: topK
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (mode === 'text') {
      if (!inputText.trim()) {
        alert('Please enter or select a tender specification.')
        return
      }
      onAnalyze({ type: 'text', text: inputText.trim(), sector: sector || null, top_k: topK })
    } else {
      if (!selectedFile) {
        alert('Please select or drag a tender PDF/DOCX file.')
        return
      }
      onAnalyze({ type: 'file', file: selectedFile, sector: sector || null, top_k: topK })
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const name = file.name.toLowerCase()
      if (name.endsWith('.pdf') || name.endsWith('.docx')) {
        setSelectedFile(file)
      } else {
        alert('Please upload a PDF or DOCX file.')
      }
    }
  }

  // Pre-load demo file helper
  const handleLoadSampleTender = async () => {
    try {
      const res = await fetch('/demo_tenders/Sample_CPWD_Electrical_Cable_Tender.docx')
      const blob = await res.blob()
      const sampleFile = new File([blob], 'Sample_CPWD_Electrical_Cable_Tender.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })
      setSelectedFile(sampleFile)
    } catch (err) {
      alert('Could not auto-load sample tender.')
    }
  }

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Instant 1-Click Evaluation Scenarios */}
      <div className="bg-white rounded-2xl border border-[#E5DDD1] p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-[#1C1C1E]">
            <Sparkles className="w-5 h-5 text-[#E05A00]" />
            <span className="text-sm sm:text-[15px]">
              {t('benchmark_title', language)} <span className="font-medium text-[#7A7A7A]">{t('benchmark_subtitle', language)}</span>
            </span>
          </div>
          <span className="text-xs text-[#7A7A7A] font-semibold hidden sm:block">
            {t('instant_runs', language)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickScenarios.map((sc) => {
            const Icon = sc.icon
            return (
              <div
                key={sc.id}
                onClick={() => handleInstantRun(sc)}
                className="group p-5 rounded-xl border border-[#E5DDD1] hover:border-[#1B4965] bg-[#FFFFFF] hover:bg-[#F6F1E7] transition-all cursor-pointer flex flex-col justify-between min-h-[160px] shadow-2xs hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${sc.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[17px] font-bold text-[#1C1C1E] group-hover:text-[#1B4965] transition-colors leading-snug">
                      {sc.title}
                    </h4>
                    <span className="text-[14px] text-[#7A7A7A] font-medium">{sc.sectorBadge}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[15px] font-semibold text-[#1B4965] pt-3 mt-3 border-t border-[#E5DDD1]">
                  <span>{t('run_live', language)}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Main Input Card */}
      <div className="bg-white rounded-2xl border border-[#E5DDD1] shadow-xs p-6 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5DDD1]">
          <div>
            <h2 className="text-lg font-bold text-[#1C1C1E]">
              {t('input_card_title', language)}
            </h2>
            <p className="text-xs text-[#7A7A7A] mt-0.5">
              {t('input_card_subtitle', language)}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-[#EFE7DA] p-1 rounded-xl text-xs border border-[#E5DDD1]">
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                mode === 'text'
                  ? 'bg-white text-[#1B4965] shadow-2xs'
                  : 'text-[#4A4A4A] hover:text-[#1C1C1E]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> {t('text_spec_tab', language)}
            </button>
            <button
              type="button"
              onClick={() => setMode('file')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                mode === 'file'
                  ? 'bg-white text-[#1B4965] shadow-2xs'
                  : 'text-[#4A4A4A] hover:text-[#1C1C1E]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> {t('upload_doc_tab', language)}
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'text' ? (
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={4}
                  placeholder={t('textarea_placeholder', language)}
                  className="w-full p-4 text-sm text-[#1C1C1E] bg-[#FBF8F3] border border-[#E5DDD1] rounded-xl focus:bg-white focus:outline-none focus:border-[#1B4965] transition-all font-sans placeholder:text-[#7A7A7A]"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#7A7A7A]">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#1B4965]" />
                  <span>{t('support_note', language)}</span>
                </div>
                <span className="font-mono text-[11px] text-[#7A7A7A]">
                  {inputText.length} {t('characters', language)}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <Upload className="w-9 h-9 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">
                  {t('upload_drag_title', language)}
                </p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  {t('upload_drag_sub', language)}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg cursor-pointer transition-colors shadow-xs">
                    <span>{t('browse_files', language)}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0])
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleLoadSampleTender}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-700 rounded-lg transition-colors"
                  >
                    {t('sample_file_btn', language)}
                  </button>
                </div>

                {selectedFile && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#E5DDD1]">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t('filter_by_sector', language)}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 rounded-xl bg-[#1B4965] hover:bg-[#153a51] text-white font-bold text-sm shadow-xs transition-colors flex items-center gap-2 disabled:opacity-75"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('analyzing_btn', language)}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{t('analyze_btn', language)} →</span>
                </>
              )}
            </button>
          </div>

          {/* Collapsible Advanced Parameters */}
          {showAdvanced && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t('filter_by_sector', language)}
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
                >
                  <option value="">{t('all_sectors', language)}</option>
                  <option value="PPE & Safety Equipment">PPE & Safety Equipment</option>
                  <option value="Electrical & Power">Electrical & Power</option>
                  <option value="Civil & Construction">Civil & Construction</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t('results_count', language)} (top_k)
                </label>
                <select
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
                >
                  <option value={3}>Top 3 Candidate Standards</option>
                  <option value={5}>Top 5 Candidate Standards (Default)</option>
                  <option value={10}>Top 10 Candidate Standards (Broad Search)</option>
                </select>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
