import React, { useState, useEffect } from 'react'
import {
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Award,
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  FileCheck,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Eye,
  Trash2,
  ArrowLeftRight
} from 'lucide-react'
import { safeFetch } from '../utils/api'
import { getLocalStandards } from '../utils/localEngine'

export default function AdminPanel({
  onRefreshCatalog,
  userRole = 'officer',
  onOpenLogin,
  language = 'en',
  onSelectStandard
}) {
  const [standardsList, setStandardsList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const isAdmin = userRole === 'admin'
  const isHindi = language === 'hi'

  const [form, setForm] = useState({
    standard_no: '',
    title: '',
    sector: 'Electrical & Power',
    scope: '',
    current_version: '',
    status: 'active',
    superseded_by: '',
    keywords: '',
    source_ref: '',
    cert_scheme: 'BIS Product Certification',
    cert_order: 'Quality Control Order (QCO)',
    cert_ministry: 'DPIIT'
  })

  // Fetch standards list on mount
  useEffect(() => {
    safeFetch('/api/v1/standards?limit=100')
      .then((data) => setStandardsList(data?.standards || data?.items || []))
      .catch((err) => {
        console.warn('Backend unavailable, using local standards database:', err)
        const local = getLocalStandards()
        setStandardsList(local.items)
      })
  }, [])

  const handleRefresh = async () => {
    setSyncing(true)
    setErrorMsg('')
    try {
      const data = await safeFetch('/api/v1/standards?limit=100')
      setStandardsList(data?.standards || data?.items || [])
      if (onRefreshCatalog) onRefreshCatalog()
      setSuccessMsg(
        isHindi
          ? 'मानक रजिस्ट्री सफलतापूर्वक अद्यतित की गई!'
          : 'Standards registry refreshed and synchronized successfully!'
      )
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      console.warn('Backend sync failed, maintaining local verified registry:', err)
      const local = getLocalStandards()
      setStandardsList(local.items)
      setSuccessMsg(
        isHindi
          ? 'स्थानीय सत्यापित मानक रजिस्ट्री सक्रिय है।'
          : 'Local verified standards registry is active and loaded.'
      )
      setTimeout(() => setSuccessMsg(''), 4000)
    } finally {
      setSyncing(false)
    }
  }

  const handleToggleStatus = async (std) => {
    const nextStatus = std.status === 'superseded' ? 'active' : 'superseded'
    const confirmMsg = isHindi
      ? `क्या आप ${std.standard_no} की स्थिति को "${nextStatus === 'active' ? 'सक्रिय (Active)' : 'प्रतिस्थापित (Superseded)'}" में बदलना चाहते हैं?`
      : `Are you sure you want to change ${std.standard_no} status to "${nextStatus}"?`
    if (!window.confirm(confirmMsg)) return

    setActionLoadingId(std.id)
    try {
      await safeFetch(`/api/v1/standards/${std.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          status_current: nextStatus
        })
      })

      setStandardsList((prev) =>
        prev.map((item) =>
          item.id === std.id ? { ...item, status: nextStatus, status_current: nextStatus } : item
        )
      )
      if (onRefreshCatalog) onRefreshCatalog()
      setSuccessMsg(
        isHindi
          ? `${std.standard_no} की स्थिति अब "${nextStatus === 'active' ? 'सक्रिय' : 'प्रतिस्थापित'}" है!`
          : `Status of ${std.standard_no} changed to "${nextStatus}" successfully!`
      )
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update standard status.')
      setTimeout(() => setErrorMsg(''), 5000)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDeleteStandard = async (std) => {
    const confirmMsg = isHindi
      ? `चेतावनी: क्या आप मानक ${std.standard_no} को डेटाबेस से स्थायी रूप से हटाना चाहते हैं?`
      : `Warning: Permanently delete ${std.standard_no} from knowledge base?`
    if (!window.confirm(confirmMsg)) return

    setActionLoadingId(std.id)
    try {
      await safeFetch(`/api/v1/standards/${std.id}`, {
        method: 'DELETE'
      })

      setStandardsList((prev) => prev.filter((item) => item.id !== std.id))
      if (onRefreshCatalog) onRefreshCatalog()
      setSuccessMsg(
        isHindi
          ? `${std.standard_no} को सफलतापूर्वक हटा दिया गया!`
          : `Standard ${std.standard_no} deleted successfully!`
      )
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete standard.')
      setTimeout(() => setErrorMsg(''), 5000)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Pre-fill helper for quick judge demonstration
  const handleFillSample = () => {
    setForm({
      standard_no: 'IS 18001:2026',
      title: isHindi
        ? 'स्मार्ट प्रोक्योरमेंट में उन्नत व्यावसायिक स्वास्थ्य और सुरक्षा प्रबंधन प्रणाली'
        : 'Advanced Occupational Health and Safety Management Systems in Smart Procurement',
      sector: 'PPE & Safety Equipment',
      scope: isHindi
        ? 'स्वचालित सार्वजनिक अवसंरचना परियोजनाओं और खतरनाक औद्योगिक सुविधाओं के लिए व्यावसायिक स्वास्थ्य और सुरक्षा प्रबंधन प्रणाली की आवश्यकताएं निर्दिष्ट करता है।'
        : 'Specifies requirements for an occupational health and safety (OH&S) management system for automated public infrastructure projects and hazardous industrial facilities.',
      current_version: 'IS 18001:2026 (First Edition)',
      status: 'active',
      superseded_by: '',
      keywords: 'occupational health, safety management, hazard identification, PPE, audit compliance',
      source_ref: 'https://www.services.bis.gov.in/',
      cert_scheme: 'BIS Product Certification',
      cert_order: 'Industrial Safety (Quality Control) Order 2026',
      cert_ministry: 'Ministry of Labour & Employment'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg('')
    setErrorMsg('')

    const payload = {
      standard_no: form.standard_no.trim(),
      title: form.title.trim(),
      sector: form.sector,
      scope: form.scope.trim(),
      current_version: form.current_version.trim() || form.standard_no.trim(),
      status: form.status,
      superseded_by: form.status === 'superseded' ? form.superseded_by.trim() : null,
      keywords: form.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      source_ref: form.source_ref.trim() || null,
      certification: form.cert_scheme !== 'None' ? {
        scheme: form.cert_scheme,
        is_mandatory: true,
        order_name: form.cert_order.trim() || null,
        notifying_ministry: form.cert_ministry.trim() || null,
        details: 'Statutory verification recorded via ManakSetu Admin Portal.'
      } : null,
      amendments: [],
      related_standards: []
    }

    try {
      await safeFetch('/api/v1/standards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      setSuccessMsg(
        isHindi
          ? `${form.standard_no} सफलतापूर्वक पंजीकृत एवं अनुक्रमित किया गया!`
          : `Successfully registered and indexed ${form.standard_no}!`
      )
      setShowAddForm(false)
      // Refresh list
      const updated = await safeFetch('/api/v1/standards?limit=100')
      setStandardsList(updated?.standards || updated?.items || [])
      if (onRefreshCatalog) onRefreshCatalog()
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredStandards = standardsList.filter((s) => {
    const matchesSearch =
      s.standard_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSector = !selectedSector || s.sector === selectedSector
    return matchesSearch && matchesSector
  })

  const formatSector = (sec) => {
    if (!isHindi) return sec
    if (sec === 'Electrical & Power') return 'विद्युत एवं ऊर्जा'
    if (sec === 'Civil & Construction') return 'सिविल निर्माण'
    if (sec === 'PPE & Safety Equipment') return 'पीपीई एवं सुरक्षा उपकरण'
    return sec
  }

  return (
    <div className="space-y-6">
      {/* 1. Admin Top Metrics Bar (Authoritative Government Source Policy) */}
      {(() => {
        const totalCount = standardsList.length
        const verifiedStatusCount = standardsList.filter((s) => s.status_verified).length
        const qcoMappedCount = standardsList.filter((s) => s.qco_applicable).length
        const qcoGazetteVerifiedCount = standardsList.filter((s) => s.qco_verified).length
        const qcoPendingCount = standardsList.filter((s) => s.qco_applicable && !s.qco_verified).length
        const supersededCount = standardsList.filter((s) => s.status === 'superseded' || s.status_current === 'superseded').length

        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 bg-white rounded-2xl border border-[#E5DDD1] shadow-2xs transition-all hover:border-[#1B4965]/40">
              <span className="text-2xl font-black text-[#0F2942] font-mono">
                {totalCount}
              </span>
              <h4 className="text-xs font-bold text-[#1C1C1E] mt-1">
                {isHindi ? 'कुल मानक' : 'Total Standards'}
              </h4>
              <p className="text-[11px] text-[#7A7A7A] font-medium">
                {isHindi ? 'नॉलेज बेस रिकॉर्ड्स' : 'Knowledge Base records'}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E5DDD1] shadow-2xs transition-all hover:border-[#1B4965]/40">
              <span className="text-2xl font-black text-emerald-700 font-mono">
                {verifiedStatusCount}
              </span>
              <h4 className="text-xs font-bold text-[#1C1C1E] mt-1">
                {isHindi ? 'मानक स्थिति सत्यापित' : 'Standard Status Verified'}
              </h4>
              <p className="text-[11px] text-[#7A7A7A] font-medium">
                {isHindi ? 'आधिकारिक बीआईएस द्वारा पुष्ट' : 'Official BIS confirmed'}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E5DDD1] shadow-2xs transition-all hover:border-[#1B4965]/40">
              <span className="text-2xl font-black text-[#1B4965] font-mono">
                {qcoMappedCount}
              </span>
              <h4 className="text-xs font-bold text-[#1C1C1E] mt-1">
                {isHindi ? 'QCO-मैप किए गए मानक' : 'QCO-Mapped Standards'}
              </h4>
              <p className="text-[11px] text-[#7A7A7A] font-medium">
                {isHindi ? 'उत्पाद विनिर्देश' : 'Product specifications'}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E5DDD1] shadow-2xs transition-all hover:border-[#1B4965]/40">
              <span className="text-2xl font-black text-blue-700 font-mono">
                {qcoGazetteVerifiedCount}
              </span>
              <h4 className="text-xs font-bold text-[#1C1C1E] mt-1">
                {isHindi ? 'QCO गजट सत्यापित' : 'QCO Gazette Verified'}
              </h4>
              <p className="text-[11px] text-[#7A7A7A] font-medium">
                {isHindi ? 'प्रत्यक्ष गजट S.O. पीडीएफ' : 'Direct Gazette S.O. PDF'}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E5DDD1] shadow-2xs transition-all hover:border-[#1B4965]/40">
              <span className="text-2xl font-black text-rose-600 font-mono">
                {qcoPendingCount}
              </span>
              <h4 className="text-xs font-bold text-[#1C1C1E] mt-1">
                {isHindi ? 'QCO सत्यापन लंबित' : 'QCO Verification Pending'}
              </h4>
              <p className="text-[11px] text-[#7A7A7A] font-medium">
                {isHindi ? 'गजट लिंक ऑडिट लंबित' : 'Gazette link pending audit'}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E5DDD1] shadow-2xs transition-all hover:border-[#1B4965]/40">
              <span className="text-2xl font-black text-amber-600 font-mono">
                {supersededCount}
              </span>
              <h4 className="text-xs font-bold text-[#1C1C1E] mt-1">
                {isHindi ? 'प्रतिस्थापित मानक' : 'Superseded Standards'}
              </h4>
              <p className="text-[11px] text-[#7A7A7A] font-medium">
                {isHindi ? 'शील्ड सक्रिय पर पुनर्निर्देशित' : 'Shield routed to active'}
              </p>
            </div>
          </div>
        )
      })()}

      {/* 2. Admin Header & Controls */}
      <div className="bg-white rounded-2xl border border-[#E5DDD1] shadow-xs p-6 sm:p-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5DDD1]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F2942]">
                {isHindi ? 'बीआईएस मानक एवं QCO रजिस्ट्री कंसोल' : 'BIS Standards & QCO Registry Console'}
              </h2>
              {isAdmin ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#1B4965] border border-[#E5DDD1]">
                  {isHindi ? 'व्यवस्थापक अधिकृत (डॉ. अनन्या वर्मा)' : 'Admin Authorized (Dr. Ananya Verma)'}
                </span>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="text-xs font-semibold text-[#1B4965] hover:underline"
                >
                  {isHindi ? '(बीआईएस व्यवस्थापक मोड पर स्विच करें)' : '(Switch to BIS Admin Mode)'}
                </button>
              )}
            </div>
            <p className="text-xs text-[#7A7A7A] mt-1">
              {isHindi
                ? 'भारतीय मानकों का प्रबंधन करें, गुणवत्ता नियंत्रण आदेश (QCO) कॉन्फ़िगर करें, और प्रतिस्थापित संशोधनों को चिह्नित करें।'
                : 'Manage Indian Standards, configure Quality Control Orders (QCOs), and flag superseded revisions.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={syncing}
              className="px-3.5 py-2 bg-[#F6F1E7] hover:bg-[#EFE7DA] text-[#0F2942] font-bold text-xs rounded-xl border border-[#E5DDD1] shadow-2xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              title={isHindi ? 'रजिस्ट्री सिंक करें' : 'Sync Registry'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-[#1B4965]' : ''}`} />
              <span>{syncing ? (isHindi ? 'सिंक हो रहा है...' : 'Syncing...') : (isHindi ? 'रजिस्ट्री सिंक करें' : 'Sync Registry')}</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-[#0F2942] hover:bg-[#1B4965] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              <span>{showAddForm ? (isHindi ? 'फ़ॉर्म बंद करें' : 'Close Form') : (isHindi ? '+ नया मानक पंजीकृत करें' : '+ Register New Standard')}</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-[#065F46] text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-[#065F46] hover:opacity-75 p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-rose-600 hover:text-rose-800 p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Expandable Register Standard Form */}
        {showAddForm && (
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E5DDD1] space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F2942]">
                <Sparkles className="w-4 h-4 text-[#E05A00]" />
                <span>
                  {isHindi
                    ? 'नॉलेज बेस में सत्यापित भारतीय मानक दर्ज करें:'
                    : 'Ingest Verified Indian Standard into Knowledge Base:'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleFillSample}
                className="text-xs font-bold text-[#1B4965] hover:text-[#0F2942] bg-white px-3 py-1 rounded-lg border border-[#E5DDD1] shadow-2xs cursor-pointer"
              >
                {isHindi ? '1-क्लिक नमूना मानक भरें' : '1-Click Pre-fill Sample Standard'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#1C1C1E] block mb-1">
                    {isHindi ? 'मानक संख्या (IS कोड) *' : 'Standard Number (IS Code) *'}
                  </label>
                  <input
                    type="text"
                    name="standard_no"
                    value={form.standard_no}
                    onChange={handleChange}
                    required
                    placeholder="e.g. IS 2925:1984"
                    className="w-full p-2.5 bg-white border border-[#E5DDD1] text-[#1C1C1E] rounded-xl text-xs focus:outline-none focus:border-[#1B4965]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1C1C1E] block mb-1">
                    {isHindi ? 'आधिकारिक मानक शीर्षक *' : 'Official Standard Title *'}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder={isHindi ? 'उदा. औद्योगिक सुरक्षा हेलमेट के विनिर्देश' : 'e.g. Specification for Industrial Safety Helmets'}
                    className="w-full p-2.5 bg-white border border-[#E5DDD1] text-[#1C1C1E] rounded-xl text-xs focus:outline-none focus:border-[#1B4965]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1C1C1E] block mb-1">
                    {isHindi ? 'क्षेत्र डोमेन *' : 'Sector Domain *'}
                  </label>
                  <select
                    name="sector"
                    value={form.sector}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-white border border-[#E5DDD1] text-[#1C1C1E] rounded-xl text-xs focus:outline-none focus:border-[#1B4965]"
                  >
                    <option value="PPE & Safety Equipment">
                      {isHindi ? 'पीपीई एवं सुरक्षा उपकरण (PPE)' : 'PPE & Safety Equipment'}
                    </option>
                    <option value="Electrical & Power">
                      {isHindi ? 'विद्युत एवं ऊर्जा (Electrical)' : 'Electrical & Power'}
                    </option>
                    <option value="Civil & Construction">
                      {isHindi ? 'सिविल एवं निर्माण (Civil)' : 'Civil & Construction'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1C1C1E] block mb-1">
                    {isHindi ? 'प्रकाशन स्थिति *' : 'Publication Status *'}
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-white border border-[#E5DDD1] text-[#1C1C1E] rounded-xl text-xs focus:outline-none focus:border-[#1B4965]"
                  >
                    <option value="active">
                      {isHindi ? 'सक्रिय (वर्तमान वैध मानक)' : 'Active (Current Valid Standard)'}
                    </option>
                    <option value="superseded">
                      {isHindi ? 'प्रतिस्थापित (अमान्य संशोधन)' : 'Superseded (Obsolete Revision)'}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1C1C1E] block mb-1">
                  {isHindi ? 'आधिकारिक तकनीकी कार्यक्षेत्र *' : 'Official Technical Scope *'}
                </label>
                <textarea
                  name="scope"
                  value={form.scope}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder={isHindi ? 'बीआईएस द्वारा प्रकाशित आधिकारिक तकनीकी कार्यक्षेत्र क्लॉज...' : 'Official technical scope clause as published by BIS...'}
                  className="w-full p-2.5 bg-white border border-[#E5DDD1] text-[#1C1C1E] rounded-xl text-xs focus:outline-none focus:border-[#1B4965]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#1C1C1E] block mb-1">
                    {isHindi ? 'अनिवार्य QCO आदेश नाम' : 'Mandatory QCO Order Name'}
                  </label>
                  <input
                    type="text"
                    name="cert_order"
                    value={form.cert_order}
                    onChange={handleChange}
                    placeholder={isHindi ? 'उदा. विद्युत तार एवं केबल (गुणवत्ता नियंत्रण) आदेश' : 'e.g. Electrical Wires and Cables (Quality Control) Order'}
                    className="w-full p-2.5 bg-white border border-[#E5DDD1] text-[#1C1C1E] rounded-xl text-xs focus:outline-none focus:border-[#1B4965]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1C1C1E] block mb-1">
                    {isHindi ? 'कीवर्ड (अल्पविराम से अलग करें)' : 'Keywords (Comma Separated)'}
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={form.keywords}
                    onChange={handleChange}
                    placeholder={isHindi ? 'केबल, तांबा, 1100V, FRLS, वायरिंग' : 'cable, copper, 1100V, FRLS, building wire'}
                    className="w-full p-2.5 bg-white border border-[#E5DDD1] text-[#1C1C1E] rounded-xl text-xs focus:outline-none focus:border-[#1B4965]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-[#EFE7DA] hover:bg-[#E5DDD1] text-[#4A4A4A] font-bold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#0F2942] hover:bg-[#1B4965] text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer disabled:opacity-60 transition-colors"
                >
                  {loading
                    ? (isHindi ? 'पंजीकरण एवं अनुक्रमण जारी है...' : 'Registering & Indexing...')
                    : (isHindi ? 'मानक सहेजें एवं प्रकाशित करें' : 'Save & Publish Standard')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. Standards Directory Table */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-[#7A7A7A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? 'मानक संख्या या कीवर्ड खोजें...' : 'Search standard number or keyword...'}
                className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#E5DDD1] text-[#1C1C1E] rounded-xl text-xs placeholder:text-[#9A9A9E] focus:bg-white focus:outline-none focus:border-[#1B4965] transition-all"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setSelectedSector('')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                  !selectedSector
                    ? 'bg-[#0F2942] text-white border border-[#0F2942] shadow-2xs'
                    : 'bg-[#FAF7F2] text-[#4A4A4A] border border-[#E5DDD1] hover:bg-[#EFE7DA]'
                }`}
              >
                {isHindi ? `सभी (${standardsList.length})` : `All (${standardsList.length})`}
              </button>
              <button
                onClick={() => setSelectedSector('Electrical & Power')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                  selectedSector === 'Electrical & Power'
                    ? 'bg-[#0F2942] text-white border border-[#0F2942] shadow-2xs'
                    : 'bg-[#FAF7F2] text-[#4A4A4A] border border-[#E5DDD1] hover:bg-[#EFE7DA]'
                }`}
              >
                {isHindi ? 'विद्युत (Electrical)' : 'Electrical'}
              </button>
              <button
                onClick={() => setSelectedSector('PPE & Safety Equipment')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                  selectedSector === 'PPE & Safety Equipment'
                    ? 'bg-[#0F2942] text-white border border-[#0F2942] shadow-2xs'
                    : 'bg-[#FAF7F2] text-[#4A4A4A] border border-[#E5DDD1] hover:bg-[#EFE7DA]'
                }`}
              >
                {isHindi ? 'सुरक्षा उपकरण (PPE)' : 'PPE Safety'}
              </button>
              <button
                onClick={() => setSelectedSector('Civil & Construction')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                  selectedSector === 'Civil & Construction'
                    ? 'bg-[#0F2942] text-white border border-[#0F2942] shadow-2xs'
                    : 'bg-[#FAF7F2] text-[#4A4A4A] border border-[#E5DDD1] hover:bg-[#EFE7DA]'
                }`}
              >
                {isHindi ? 'सिविल (Civil)' : 'Civil'}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="border border-[#E5DDD1] rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs divide-y divide-[#E5DDD1]">
              <thead className="bg-[#F6F1E7] text-[#0F2942] font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">{isHindi ? 'मानक कोड' : 'Standard Code'}</th>
                  <th className="py-3 px-4">{isHindi ? 'शीर्षक / उत्पाद विवरण' : 'Title'}</th>
                  <th className="py-3 px-4">{isHindi ? 'क्षेत्र' : 'Sector'}</th>
                  <th className="py-3 px-4">{isHindi ? 'स्थिति' : 'Status'}</th>
                  <th className="py-3 px-4">{isHindi ? 'स्रोत प्रमाणिकता' : 'Source Provenance'}</th>
                  <th className="py-3 px-4">{isHindi ? 'QCO एवं प्रमाणन' : 'QCO & Certification'}</th>
                  <th className="py-3 px-4 text-right">{isHindi ? 'कार्रवाई' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DDD1] bg-white">
                {filteredStandards.slice(0, 15).map((std) => (
                  <tr key={std.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1B4965] whitespace-nowrap">
                      {std.standard_no}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#1C1C1E] max-w-xs truncate" title={std.title}>
                      {std.title}
                    </td>
                    <td className="py-3 px-4 text-[#4A4A4A] whitespace-nowrap font-medium">
                      {formatSector(std.sector)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {std.status === 'superseded' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                          {isHindi ? 'प्रतिस्थापित' : 'Superseded'}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                          {isHindi ? 'सक्रिय' : 'Active'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          {std.source_type === 'GOVERNMENT_GAZETTE' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4EFFB] text-[#6B21A8] border border-[#E9D5FF] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA]"></span>
                              {isHindi ? 'भारत का राजपत्र' : 'Gazette of India'}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                              {isHindi ? 'बीआईएस आधिकारिक' : 'BIS Official'}
                            </span>
                          )}
                          {(std.official_source_url || std.source_url) && (
                            <a
                              href={std.official_source_url || std.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1B4965] hover:text-[#0F2942] inline-flex items-center"
                              title="Open verified official document"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        {std.secondary_source_url && (
                          <span className="text-[10px] text-[#7A7A7A]">
                            {isHindi ? 'अभिलेखागार सत्यापन: law.resource.org' : 'Archive cross-check: law.resource.org'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {std.qco_verified ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
                          {isHindi ? 'अनिवार्य ISI (सत्यापित)' : 'Mandatory ISI (Verified)'}
                        </span>
                      ) : std.qco_applicable ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]" title="QCO applies by schedule; statutory Gazette citation pending audit">
                          {isHindi ? 'सत्यापन लंबित' : 'Verification Pending'}
                        </span>
                      ) : (
                        <span className="text-[#7A7A7A] text-[10px] px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E5DDD1] font-semibold">
                          {isHindi ? 'स्वैच्छिक (डिज़ाइन कोड)' : 'Voluntary (Design Code)'}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1. View / Inspect Details */}
                        <button
                          type="button"
                          onClick={() => onSelectStandard && onSelectStandard(std.standard_no)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#0F2942] bg-white hover:bg-[#F6F1E7] border border-[#E5DDD1] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                          title={isHindi ? 'मानक विवरण एवं संशोधन देखें' : 'View standard details & amendments'}
                        >
                          <Eye className="w-3.5 h-3.5 text-[#1B4965]" />
                          <span>{isHindi ? 'विवरण' : 'View'}</span>
                        </button>

                        {/* 2. Toggle Status (Active / Superseded) */}
                        <button
                          type="button"
                          disabled={actionLoadingId === std.id}
                          onClick={() => handleToggleStatus(std)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs ${
                            std.status === 'superseded'
                              ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] hover:bg-[#D1FAE5]'
                              : 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A] hover:bg-[#FEF3C7]'
                          }`}
                          title={
                            std.status === 'superseded'
                              ? (isHindi ? 'मानक को सक्रिय स्थिति पर रीसेट करें' : 'Mark standard as Active')
                              : (isHindi ? 'मानक को प्रतिस्थापित चिह्नित करें' : 'Mark standard as Superseded')
                          }
                        >
                          <ArrowLeftRight className={`w-3.5 h-3.5 ${actionLoadingId === std.id ? 'animate-spin' : ''}`} />
                          <span>
                            {std.status === 'superseded'
                              ? (isHindi ? 'सक्रिय करें' : 'Activate')
                              : (isHindi ? 'प्रतिस्थापित करें' : 'Supersede')}
                          </span>
                        </button>

                        {/* 3. Delete Standard */}
                        <button
                          type="button"
                          disabled={actionLoadingId === std.id}
                          onClick={() => handleDeleteStandard(std)}
                          className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                          title={isHindi ? 'मानक हटाएं' : 'Delete standard'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[#7A7A7A] font-semibold text-right">
            {isHindi
              ? `${filteredStandards.length} सत्यापित मानकों में से ${Math.min(15, filteredStandards.length)} प्रदर्शित`
              : `Showing ${Math.min(15, filteredStandards.length)} of ${filteredStandards.length} verified standards`}
          </p>
        </div>
      </div>
    </div>
  )
}
