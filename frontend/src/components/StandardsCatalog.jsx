import React, { useState, useEffect } from 'react'
import { Search, Filter, BookOpen, ExternalLink, ChevronRight, Award, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { safeFetch } from '../utils/api'
import { t } from '../utils/translations'
import { getLocalStandards } from '../utils/localEngine'

export default function StandardsCatalog({ onSelectStandard, language = 'en' }) {
  const [standards, setStandards] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sectorFilter, setSectorFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [total, setTotal] = useState(0)

  const isHindi = language === 'hi'

  const fetchStandards = () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('limit', '100')
    if (searchQuery.trim()) params.set('query', searchQuery.trim())
    if (sectorFilter) params.set('sector', sectorFilter)
    if (statusFilter) params.set('status', statusFilter)

    safeFetch(`/api/v1/standards?${params.toString()}`)
      .then((data) => {
        setStandards(data?.items || [])
        setTotal(data?.total || 0)
        setLoading(false)
      })
      .catch((err) => {
        console.warn('Backend unavailable, using local standards dataset:', err)
        const local = getLocalStandards(searchQuery, sectorFilter, statusFilter, 100)
        setStandards(local.items)
        setTotal(local.total)
        setLoading(false)
      })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStandards()
    }, 250)
    return () => clearTimeout(timer)
  }, [searchQuery, sectorFilter, statusFilter])

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header & Description */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gov-700" />
            <span>{t('catalog_title', language)}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('catalog_subtitle', language)}
          </p>
        </div>

        <span className="px-3 py-1 bg-gov-50 text-gov-800 border border-gov-200 rounded-full text-xs font-semibold">
          {total} {t('catalog_registered', language)}
        </span>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? "मानक संख्या, उत्पाद या कीवर्ड द्वारा खोजें (उदा. 'IS 2925', 'cement', 'MCB')..." : t('search_placeholder', language)}
            className="w-full pl-9 pr-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-500/20 focus:border-gov-600 transition-all font-sans"
          />
        </div>

        <div>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-gov-600 font-medium"
          >
            <option value="">{isHindi ? 'सभी क्षेत्र' : 'All Sectors'}</option>
            <option value="PPE & Safety Equipment">{isHindi ? 'पीपीई एवं सुरक्षा उपकरण' : 'PPE & Safety Equipment'}</option>
            <option value="Electrical & Power">{isHindi ? 'इलेक्ट्रिकल एवं पावर' : 'Electrical & Power'}</option>
            <option value="Civil & Construction">{isHindi ? 'सिविल एवं निर्माण' : 'Civil & Construction'}</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-gov-600 font-medium"
          >
            <option value="">{t('filter_status_all', language)}</option>
            <option value="active">{t('filter_status_active', language)}</option>
            <option value="superseded">{t('filter_status_superseded', language)}</option>
          </select>
        </div>
      </div>

      {/* Standards List / Table */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs">
          <div className="animate-spin w-6 h-6 border-2 border-gov-700 border-t-transparent rounded-full mx-auto mb-2"></div>
          <span>{isHindi ? 'डेटाबेस रिकॉर्ड लोड हो रहे हैं...' : 'Loading knowledge base records...'}</span>
        </div>
      ) : standards.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          {t('no_standards_found', language)}
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">{isHindi ? 'मानक कोड' : 'Standard Code'}</th>
                <th className="py-3 px-4">{isHindi ? 'शीर्षक एवं कार्यक्षेत्र' : 'Title & Scope Overview'}</th>
                <th className="py-3 px-4">{isHindi ? 'क्षेत्र' : 'Sector'}</th>
                <th className="py-3 px-4">{isHindi ? 'प्रमाणन' : 'Certification'}</th>
                <th className="py-3 px-4">{isHindi ? 'स्थिति' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{isHindi ? 'कार्यवाही' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {standards.map((s) => {
                const isSuperseded = s.status === 'superseded'
                return (
                  <tr
                    key={s.id || s.standard_no}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => onSelectStandard(s.standard_no)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-gov-950 whitespace-nowrap">
                      {s.standard_no}
                    </td>

                    <td className="py-3 px-4 max-w-md">
                      <div className="font-semibold text-slate-800 line-clamp-1">{s.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{s.scope}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {s.sector}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {s.certification && s.certification.scheme && s.certification.scheme !== 'None' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gov-800 bg-gov-50 border border-gov-200 px-2 py-0.5 rounded">
                          <Award className="w-3 h-3 text-gov-700" />
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
                        className="text-gov-700 hover:text-gov-900 font-semibold text-xs inline-flex items-center gap-1"
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
