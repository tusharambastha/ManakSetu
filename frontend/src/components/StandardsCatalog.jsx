import React, { useState, useEffect, useMemo } from 'react'
import {
  Search,
  BookOpen,
  ChevronRight,
  Award,
  Sparkles,
  Building2,
  CheckCircle2,
  Filter
} from 'lucide-react'
import { safeFetch } from '../utils/api'
import { t } from '../utils/translations'
import { getLocalStandards } from '../utils/localEngine'
import {
  getTaxonomyForOrg,
  getCuratedStandardNosForOrg,
  getOrgTagForStandard
} from '../utils/organizationStandards'

export default function StandardsCatalog({
  onSelectStandard,
  language = 'en',
  userDepartment = '',
  user = null
}) {
  const isHindi = language === 'hi'
  const effectiveOrg = userDepartment || user?.department || ''
  const taxonomy = useMemo(() => getTaxonomyForOrg(effectiveOrg), [effectiveOrg])
  const curatedStandardNos = useMemo(() => getCuratedStandardNosForOrg(effectiveOrg), [effectiveOrg])

  const [allRawStandards, setAllRawStandards] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [scopeFilter, setScopeFilter] = useState(() => (effectiveOrg ? 'curated' : 'all'))
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // If user department changes, update scopeFilter
  useEffect(() => {
    if (effectiveOrg) {
      setScopeFilter('curated')
      setCategoryFilter('')
    }
  }, [effectiveOrg])

  // Fetch all standards once from API or local fallback
  useEffect(() => {
    setLoading(true)
    safeFetch('/api/v1/standards?limit=100')
      .then((data) => {
        if (data?.items && data.items.length > 0) {
          setAllRawStandards(data.items)
        } else {
          const local = getLocalStandards('', '', '', 100)
          setAllRawStandards(local.items)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.warn('Backend unavailable, using local standards dataset:', err)
        const local = getLocalStandards('', '', '', 100)
        setAllRawStandards(local.items)
        setLoading(false)
      })
  }, [])

  // Filter standards client-side based on scope, category/domain, status, and search query
  const filteredStandards = useMemo(() => {
    let list = [...allRawStandards]

    // 1. Scope filter (Curated for organization vs All national standards)
    if (scopeFilter === 'curated' && curatedStandardNos.length > 0) {
      list = list.filter((s) => curatedStandardNos.includes(s.standard_no))
    }

    // 2. Category / Domain filter
    if (categoryFilter) {
      if (scopeFilter === 'curated') {
        // Find domain in taxonomy
        const selectedDomain = taxonomy.domains.find((d) => d.id === categoryFilter)
        if (selectedDomain) {
          list = list.filter((s) => selectedDomain.standard_nos.includes(s.standard_no))
        }
      } else {
        // Technical Sector filter
        list = list.filter(
          (s) => s.sector && s.sector.toLowerCase().includes(categoryFilter.toLowerCase())
        )
      }
    }

    // 3. Status filter
    if (statusFilter) {
      list = list.filter((s) => s.status && s.status.toLowerCase() === statusFilter.toLowerCase())
    }

    // 4. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(
        (s) =>
          (s.standard_no && s.standard_no.toLowerCase().includes(q)) ||
          (s.title && s.title.toLowerCase().includes(q)) ||
          (s.scope && s.scope.toLowerCase().includes(q)) ||
          (s.keywords && s.keywords.some((k) => k.toLowerCase().includes(q)))
      )
    }

    return list
  }, [allRawStandards, scopeFilter, curatedStandardNos, categoryFilter, statusFilter, searchQuery, taxonomy])

  return (
    <div className="bg-white dark:bg-[#1E2A35] rounded-xl border border-slate-200 dark:border-[#2E3F4F] shadow-sm p-6 space-y-6">
      {/* ── Header & Description ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#2E3F4F]">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1B4965] dark:text-sky-300" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isHindi ? 'सत्यापित मानक निर्देशिका' : t('catalog_title', language)}
            </h2>
            {effectiveOrg && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1B4965]/10 dark:bg-[#1B4965]/30 text-[#1B4965] dark:text-sky-300 border border-[#1B4965]/20">
                <span>{taxonomy.icon}</span>
                <span>{taxonomy.shortName}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {effectiveOrg
              ? isHindi
                ? `${taxonomy.shortName} के खरीद एवं तकनीकी विशिष्टताओं के लिए क्यूरेटेड आधिकारिक बीआईएस मानक निर्देशिका।`
                : `Official BIS standards directory curated for ${taxonomy.shortName} procurement & engineering mandate.`
              : isHindi
                ? 'सभी 49 सत्यापित आधिकारिक भारतीय मानक (पीपीई, इलेक्ट्रिकल एवं सिविल क्षेत्र)।'
                : t('catalog_subtitle', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-50 dark:bg-[#16222F] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#2E3F4F] rounded-full text-xs font-semibold">
            {filteredStandards.length} {isHindi ? 'मानक प्रदर्शित' : 'Standards Listed'}
          </span>
        </div>
      </div>

      {/* ── Organization Scope Filter Pills ── */}
      {effectiveOrg && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{isHindi ? 'निर्देशिका कार्यक्षेत्र:' : 'Catalog Scope:'}</span>
          </span>

          <button
            type="button"
            onClick={() => {
              setScopeFilter('curated')
              setCategoryFilter('')
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              scopeFilter === 'curated'
                ? 'bg-[#1B4965] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#16222F] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#243444]'
            }`}
          >
            <span>{taxonomy.icon}</span>
            <span>
              {isHindi ? `${taxonomy.shortName} के लिए क्यूरेटेड` : `Curated for ${taxonomy.shortName}`}
            </span>
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                scopeFilter === 'curated' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-[#2E3F4F] text-slate-700 dark:text-slate-200'
              }`}
            >
              {curatedStandardNos.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setScopeFilter('all')
              setCategoryFilter('')
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              scopeFilter === 'all'
                ? 'bg-[#1B4965] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#16222F] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#243444]'
            }`}
          >
            <span>📚</span>
            <span>{isHindi ? 'सभी राष्ट्रीय मानक (संपूर्ण डायरेक्टरी)' : 'All National BIS Standards'}</span>
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                scopeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-[#2E3F4F] text-slate-700 dark:text-slate-200'
              }`}
            >
              {allRawStandards.length || 49}
            </span>
          </button>
        </div>
      )}

      {/* ── Search and Filters Bar ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isHindi
                ? "मानक संख्या, उत्पाद या कीवर्ड द्वारा खोजें (उदा. 'IS 2925', 'cables', 'steel')..."
                : t('search_placeholder', language)
            }
            className="w-full pl-9 pr-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-[#16222F] border border-slate-200 dark:border-[#2E3F4F] rounded-lg focus:bg-white dark:focus:bg-[#1A2535] focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#1B4965] transition-all font-sans"
          />
        </div>

        {/* Dynamic Category / Domain Dropdown */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-[#16222F] border border-slate-200 dark:border-[#2E3F4F] rounded-lg focus:bg-white dark:focus:bg-[#1A2535] focus:outline-none focus:border-[#1B4965] font-medium cursor-pointer"
          >
            {scopeFilter === 'curated' && effectiveOrg ? (
              <>
                <option value="">
                  {isHindi
                    ? `सभी ${taxonomy.shortName} डोमेन (${curatedStandardNos.length} मानक)`
                    : `All ${taxonomy.shortName} Domains (${curatedStandardNos.length})`}
                </option>
                {taxonomy.domains.map((dom) => (
                  <option key={dom.id} value={dom.id}>
                    {taxonomy.icon} {isHindi ? dom.name_hi : dom.name} ({dom.standard_nos.length})
                  </option>
                ))}
              </>
            ) : (
              <>
                <option value="">
                  {isHindi ? 'सभी क्षेत्र (49 मानक)' : 'All Technical Sectors (49 Standards)'}
                </option>
                <option value="Electrical & Power">
                  ⚡ {isHindi ? 'इलेक्ट्रिकल एवं पावर' : 'Electrical & Power'} (19)
                </option>
                <option value="Civil & Construction">
                  🏗️ {isHindi ? 'सिविल एवं निर्माण' : 'Civil & Construction'} (16)
                </option>
                <option value="PPE & Safety Equipment">
                  🦺 {isHindi ? 'पीपीई एवं सुरक्षा उपकरण' : 'PPE & Safety Equipment'} (14)
                </option>
              </>
            )}
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-[#16222F] border border-slate-200 dark:border-[#2E3F4F] rounded-lg focus:bg-white dark:focus:bg-[#1A2535] focus:outline-none focus:border-[#1B4965] font-medium cursor-pointer"
          >
            <option value="">{t('filter_status_all', language)}</option>
            <option value="active">{t('filter_status_active', language)}</option>
            <option value="superseded">{t('filter_status_superseded', language)}</option>
          </select>
        </div>
      </div>

      {/* ── Standards List Table ── */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs">
          <div className="animate-spin w-6 h-6 border-2 border-[#1B4965] border-t-transparent rounded-full mx-auto mb-2"></div>
          <span>{isHindi ? 'डेटाबेस रिकॉर्ड लोड हो रहे हैं...' : 'Loading knowledge base records...'}</span>
        </div>
      ) : filteredStandards.length === 0 ? (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
          <p>{t('no_standards_found', language)}</p>
          {scopeFilter === 'curated' && (
            <button
              type="button"
              onClick={() => {
                setScopeFilter('all')
                setCategoryFilter('')
              }}
              className="text-[#1B4965] dark:text-sky-400 font-bold hover:underline"
            >
              {isHindi ? 'सभी राष्ट्रीय मानक देखें (All 49 Standards)' : 'View All 49 National Standards'}
            </button>
          )}
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-[#2E3F4F] rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-[#2E3F4F]">
            <thead className="bg-slate-100 dark:bg-[#16222F] text-slate-600 dark:text-slate-300 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">{isHindi ? 'मानक कोड' : 'Standard Code'}</th>
                <th className="py-3 px-4">{isHindi ? 'शीर्षक एवं विवरण' : 'Title & Scope Overview'}</th>
                {effectiveOrg && (
                  <th className="py-3 px-4">{isHindi ? 'संस्था डोमेन' : `${taxonomy.shortName} Domain`}</th>
                )}
                <th className="py-3 px-4">{isHindi ? 'क्षेत्र' : 'Technical Sector'}</th>
                <th className="py-3 px-4">{isHindi ? 'प्रमाणन' : 'Certification'}</th>
                <th className="py-3 px-4">{isHindi ? 'स्थिति' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{isHindi ? 'कार्यवाही' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2E3F4F] bg-white dark:bg-[#1E2A35]">
              {filteredStandards.map((s) => {
                const isSuperseded = s.status === 'superseded'
                const orgTag = effectiveOrg ? getOrgTagForStandard(s.standard_no, effectiveOrg) : null

                return (
                  <tr
                    key={s.id || s.standard_no}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#243444] transition-colors cursor-pointer"
                    onClick={() => onSelectStandard(s.standard_no)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-sky-200 whitespace-nowrap">
                      {s.standard_no}
                    </td>

                    <td className="py-3 px-4 max-w-md">
                      <div className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                        {s.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {s.scope}
                      </div>
                    </td>

                    {effectiveOrg && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        {orgTag ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#1B4965]/10 dark:bg-[#1B4965]/30 text-[#1B4965] dark:text-sky-300 border border-[#1B4965]/20">
                            {orgTag.tag}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                    )}

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#16222F] text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                        {s.sector}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {s.certification && s.certification.scheme && s.certification.scheme !== 'None' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B4965] dark:text-sky-300 bg-[#1B4965]/10 dark:bg-[#1B4965]/20 border border-[#1B4965]/20 px-2 py-0.5 rounded">
                          <Award className="w-3 h-3 text-[#1B4965] dark:text-sky-300" />
                          {s.certification.scheme}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">{isHindi ? 'स्वैच्छिक' : 'Voluntary'}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {isSuperseded ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                          {isHindi ? 'अप्रचलित' : 'Superseded'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {isHindi ? 'सक्रिय' : 'Active'}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectStandard(s.standard_no)
                        }}
                        className="text-[#1B4965] dark:text-sky-400 hover:underline font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isHindi ? 'विवरण' : 'Details'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
