import React, { useState, useEffect } from 'react'
import { History, Calendar, ChevronRight, Trash2, Clock, CheckCircle2, ShieldCheck, RefreshCw, BookOpen } from 'lucide-react'
import { safeFetch } from '../utils/api'
import { t } from '../utils/translations'

export default function HistoryView({ onReanalyze, onSelectStandard, user, isAdmin = false, language = 'en' }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // In Admin Portal, admin manages the entire system's audit trail, so sessionId is null
  const sessionId = isAdmin ? null : (user ? `${user.role}-${user.name}` : null)

  const loadHistory = (showSpinner = true) => {
    if (showSpinner) setLoading(true)
    setRefreshing(true)
    const url = sessionId
      ? `/api/v1/analyze/history?limit=30&session_id=${encodeURIComponent(sessionId)}`
      : '/api/v1/analyze/history?limit=30'
    safeFetch(url)
      .then((data) => {
        setHistory(data?.history || [])
        setLoading(false)
        setRefreshing(false)
      })
      .catch((err) => {
        console.error('Error fetching analysis history:', err)
        setLoading(false)
        setRefreshing(false)
      })
  }

  useEffect(() => {
    loadHistory()
  }, [sessionId])

  const handleClearHistory = async () => {
    const confirmMsg = language === 'hi'
      ? (isAdmin ? 'क्या आप संपूर्ण सिस्टम टेंडर ऑडिट इतिहास साफ़ करना चाहते हैं?' : 'क्या आप अपना टेंडर विश्लेषण ऑडिट इतिहास साफ़ करना चाहते हैं?')
      : (isAdmin ? 'Are you sure you want to clear all system tender analysis audit history?' : 'Are you sure you want to clear your tender analysis audit history?')
    if (!window.confirm(confirmMsg)) return
    try {
      const url = sessionId
        ? `/api/v1/analyze/history?session_id=${encodeURIComponent(sessionId)}`
        : '/api/v1/analyze/history'
      await safeFetch(url, { method: 'DELETE' })
      setHistory([])
    } catch (err) {
      console.warn('Backend DELETE error, clearing client view:', err)
      // Clear client state so user is not blocked
      setHistory([])
    }
  }

  return (
    <div className="bg-white dark:bg-[#16222F] rounded-2xl border border-[#E5DDD1] dark:border-[#273849] shadow-xs p-6 sm:p-8 space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E5DDD1] dark:border-[#273849]">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F6F1E7] dark:bg-[#101923] border border-[#E5DDD1] dark:border-[#273849] flex items-center justify-center text-[#0F2942] dark:text-[#5B9CC9] shrink-0 shadow-2xs">
            <History className="w-5 h-5 text-[#0F2942] dark:text-[#5B9CC9]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0F2942] dark:text-white tracking-tight">
              {t('history_title', language)}
            </h2>
            <p className="text-xs text-[#7A7A7A] dark:text-[#94A3B8] mt-0.5">
              {t('history_subtitle', language)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3.5 py-1.5 bg-[#F6F1E7] dark:bg-[#101923] text-[#0F2942] dark:text-[#E2E8F0] rounded-xl text-xs font-bold border border-[#E5DDD1] dark:border-[#273849] shadow-2xs">
            {history.length} {t('runs_logged', language)}
          </span>

          <button
            onClick={() => loadHistory(false)}
            disabled={refreshing}
            className="p-2 bg-white dark:bg-[#101923] hover:bg-[#F6F1E7] dark:hover:bg-[#1E2D3D] text-[#0F2942] dark:text-[#E2E8F0] rounded-xl text-xs font-bold border border-[#E5DDD1] dark:border-[#273849] flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            title={language === 'hi' ? 'ताज़ा करें' : 'Refresh audit log'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#1B4965]' : ''}`} />
          </button>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-900/60 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Clear search history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('clear_history', language)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="py-16 text-center text-[#7A7A7A] dark:text-[#94A3B8] text-xs space-y-2">
          <div className="animate-spin w-7 h-7 border-2 border-[#0F2942] dark:border-[#5B9CC9] border-t-transparent rounded-full mx-auto mb-2"></div>
          <span className="font-semibold text-[#0F2942] dark:text-white">
            {language === 'hi' ? 'ऑडिट इतिहास लोड हो रहा है...' : 'Loading historical audit trail...'}
          </span>
        </div>
      ) : history.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#FBF8F3] dark:bg-[#101923] border-2 border-dashed border-[#C8BEAF] dark:border-[#273849] text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#16222F] border border-[#E5DDD1] dark:border-[#273849] flex items-center justify-center mx-auto text-[#0F2942] shadow-2xs">
            <History className="w-7 h-7 text-[#1B4965] dark:text-[#5B9CC9]" />
          </div>
          <div>
            <p className="font-bold text-[#0F2942] dark:text-white text-sm sm:text-base">
              {t('no_history_title', language)}
            </p>
            <p className="text-xs text-[#7A7A7A] dark:text-[#94A3B8] mt-1 max-w-md mx-auto leading-relaxed">
              {t('no_history_desc', language)}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {history.map((entry) => {
            const queryToRun = entry.query_text || entry.query_preview
            return (
              <div
                key={entry.id}
                className="p-5 bg-white dark:bg-[#101923] hover:bg-[#FBF8F3] dark:hover:bg-[#1E2D3D] rounded-xl border border-[#E5DDD1] dark:border-[#273849] hover:border-[#1B4965] dark:hover:border-[#5B9CC9] transition-all flex flex-wrap items-center justify-between gap-4 shadow-2xs hover:shadow-xs group"
              >
                <div className="space-y-2 flex-1 min-w-[280px] max-w-3xl">
                  {/* Meta Row: Timestamp & Session */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#4A4A4A] dark:text-[#94A3B8] font-mono">
                    <span className="inline-flex items-center gap-1.5 bg-[#F6F1E7] dark:bg-[#16222F] px-2.5 py-1 rounded-md border border-[#E5DDD1] dark:border-[#273849]">
                      <Clock className="w-3.5 h-3.5 text-[#0F2942] dark:text-[#5B9CC9]" />
                      <span>{new Date(entry.created_at).toLocaleString()}</span>
                    </span>
                    <span className="text-[#A0988E] dark:text-[#64748B]">•</span>
                    <span className="bg-[#F6F1E7] dark:bg-[#16222F] px-2.5 py-1 rounded-md border border-[#E5DDD1] dark:border-[#273849]">
                      {t('session_label', language)}: <strong className="text-[#0F2942] dark:text-white">{entry.session_id}</strong>
                    </span>
                  </div>

                  {/* Tender Specification Snippet */}
                  <p className="text-[#1C1C1E] dark:text-[#F8FAFC] text-xs sm:text-sm font-semibold leading-relaxed line-clamp-2">
                    "{entry.query_preview || entry.query_text}"
                  </p>

                  {/* Matched Standards List with clickable standard details */}
                  {entry.matched_standards && entry.matched_standards.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] font-bold text-[#7A7A7A] dark:text-[#94A3B8] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2E8B57] dark:text-emerald-400" />
                        <span>{t('matched_standards_label', language)}</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.matched_standards.map((m, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onSelectStandard && onSelectStandard(m.standard_no)}
                            className="px-2.5 py-0.5 rounded-lg font-mono font-bold bg-[#F6F1E7] dark:bg-[#16222F] text-[#0F2942] dark:text-[#5B9CC9] border border-[#E5DDD1] dark:border-[#273849] hover:border-[#1B4965] dark:hover:border-sky-400 hover:text-[#1B4965] dark:hover:text-white text-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                            title={`Click to view ${m.standard_no} full BIS details`}
                          >
                            <BookOpen className="w-3 h-3 text-[#1B4965] dark:text-sky-400" />
                            <span>{m.standard_no}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onReanalyze(queryToRun)}
                  className="px-4 py-2.5 bg-[#0F2942] hover:bg-[#1B4965] dark:bg-[#1B4965] dark:hover:bg-[#286795] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs group-hover:shadow-xs cursor-pointer"
                  title={language === 'hi' ? 'इस टेंडर का पुनः विश्लेषण करें' : 'Re-run analysis with this tender specification'}
                >
                  <span>{t('reanalyze_btn', language)}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
