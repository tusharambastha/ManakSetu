import React, { useState, useEffect } from 'react'
import { X, ExternalLink, ShieldCheck, Scale, Award, Calendar, BookOpen, AlertTriangle } from 'lucide-react'
import { safeFetch } from '../utils/api'
import { getLocalStandardByCode } from '../utils/localEngine'

export default function StandardModal({ standardNo, onClose, onSelectAnother }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!standardNo) return
    setLoading(true)
    setError(null)

    // 1. Immediately look up in verified local knowledge base (0ms instant response)
    const localRecord = getLocalStandardByCode(standardNo)
    if (localRecord) {
      setData(localRecord)
      setLoading(false)
    }

    // 2. Also attempt backend fetch to sync any live updates if available
    const encoded = encodeURIComponent(standardNo)
    safeFetch(`/api/v1/standards/code/${encoded}`)
      .then((resData) => {
        if (resData) {
          setData(resData)
          setLoading(false)
          setError(null)
        }
      })
      .catch((err) => {
        // If we already have the local record, do not show any network error
        if (!localRecord) {
          setError(err.message || 'Standard not found in verified database.')
          setLoading(false)
        }
      })
  }, [standardNo])

  if (!standardNo) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-mono font-bold text-gov-950">
                {data ? data.standard_no : standardNo}
              </span>
              {data && (
                <>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      data.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {data.status.toUpperCase()}
                  </span>
                  {data.status_verified ? (
                    <span className="text-xs px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                      Verified {data.last_verified_on || ''}
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-600 border border-slate-300">
                      Unverified
                    </span>
                  )}
                  {data.qco_applicable === false && (
                    <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-600 border border-slate-300">
                      No QCO (code of practice)
                    </span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-medium">
                    {data.sector}
                  </span>
                </>
              )}
            </div>
            <h3 className="text-sm font-semibold text-slate-800 leading-snug">
              {data ? data.title : 'Loading standard record...'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {loading && (
            <div className="py-12 text-center text-slate-500">
              <div className="animate-spin w-6 h-6 border-2 border-gov-700 border-t-transparent rounded-full mx-auto mb-2"></div>
              <span>Fetching verified record from BIS database...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {data && (
            <>
              {/* Superseded Warning */}
              {data.status === 'superseded' && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold">Notice to Procurement Officers: </span>
                    {data.superseded_by && data.status_verified ? (
                      <span>This standard is superseded. The active specification to be cited is <strong>{data.superseded_by}</strong>.</span>
                    ) : (
                      <span>Status could not be confirmed - check the latest status on BIS portal.</span>
                    )}
                  </div>
                  {data.superseded_by && data.status_verified && (
                    <button
                      onClick={() => onSelectAnother(data.superseded_by)}
                      className="px-2 py-1 bg-amber-200 hover:bg-amber-300 font-semibold text-amber-900 rounded shrink-0 ml-2"
                    >
                      Open {data.superseded_by}
                    </button>
                  )}
                </div>
              )}

              {/* Version & Source Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-0.5">
                    Latest Published Version / Revision
                  </span>
                  <span className="font-mono text-slate-800 font-medium">{data.current_version}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-0.5">
                    Official Reference
                  </span>
                  {data.source_ref ? (
                    <a
                      href={data.source_ref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gov-700 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Bureau of Indian Standards Connect</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-500">BIS Catalogue Gazette</span>
                  )}
                </div>
              </div>

              {/* Official Scope */}
              <div>
                <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-gov-700" />
                  Official BIS Scope & Application
                </h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-lg border border-slate-200 text-xs font-sans">
                  {data.scope}
                </p>
              </div>

              {/* Mandatory Certification Requirement */}
              {data.qco_applicable === false ? (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Code of Practice / Design Standard</span>
                    <span>Engineering codes and design guidelines do not fall under statutory product QCO mandates.</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 font-semibold text-[11px] shrink-0 ml-3">
                    No QCO (code of practice)
                  </span>
                </div>
              ) : data.certification && data.certification.scheme && data.certification.scheme !== 'None' ? (
                <div className="p-3.5 bg-gov-50/60 border border-gov-200 rounded-lg text-gov-950">
                  <h4 className="font-bold mb-1 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-gov-700" />
                    Mandatory Regulatory Scheme: {data.certification.scheme}
                  </h4>
                  <p className="text-slate-700 text-xs">
                    {data.certification.order_name} ({data.certification.notifying_ministry}) —{' '}
                    {data.certification.details}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs">
                  <span className="font-medium">Certification Scheme: </span>
                  Voluntary standard unless specifically mandated in tender Special Conditions of Contract (SCC).
                </div>
              )}

              {/* Amendments List */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gov-700" />
                  Published Amendments ({data.amendments?.length || 0})
                </h4>
                {data.amendments && data.amendments.length > 0 ? (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase font-semibold">
                        <tr>
                          <th className="py-2 px-3">Amendment</th>
                          <th className="py-2 px-3">Year</th>
                          <th className="py-2 px-3">Clauses Altered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.amendments.map((am, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-semibold text-slate-800">{am.amendment_no}</td>
                            <td className="py-2 px-3 text-slate-600 font-mono">{am.issue_date || 'N/A'}</td>
                            <td className="py-2 px-3 text-slate-700">{am.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 italic p-3 bg-slate-50 rounded border border-slate-200">
                    No amendments published against this revision.
                  </p>
                )}
              </div>

              {/* Allied Standards & Normative Relationships */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-gov-700" />
                  Allied & Associated Standards ({data.related_standards?.length || 0})
                </h4>
                {data.related_standards && data.related_standards.length > 0 ? (
                  <div className="space-y-2">
                    {data.related_standards.map((rel, i) => (
                      <div
                        key={i}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-gov-900">{rel.target_standard_no}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white text-slate-700 border border-slate-200">
                              {rel.relation_type.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs">
                            {rel.target_title || rel.description || 'Allied standard requirement'}
                          </p>
                        </div>
                        <button
                          onClick={() => onSelectAnother(rel.target_standard_no)}
                          className="text-xs px-2.5 py-1 bg-white hover:bg-gov-50 text-gov-700 border border-slate-200 rounded font-semibold transition-colors shrink-0"
                        >
                          View →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic p-3 bg-slate-50 rounded border border-slate-200">
                    No allied relationships mapped for this standard.
                  </p>
                )}
              </div>

              {/* Keywords */}
              {data.keywords && data.keywords.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Indexed Technical Keywords
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {data.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-mono">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Bureau of Indian Standards Database Record</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
