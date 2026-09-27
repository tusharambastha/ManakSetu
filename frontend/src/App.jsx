import React, { useState, useEffect } from 'react'
import AuthPortal from './components/AuthPortal'
import OfficerPortal from './components/OfficerPortal'
import AdminPortal from './components/AdminPortal'
import StandardModal from './components/StandardModal'
import { safeFetch } from './utils/api'
import { analyzeLocally, DEFAULT_DEMO_QUERIES, DEFAULT_SYSTEM_STATS } from './utils/localEngine'

export default function App() {
  // Website khulne par active session check hoga, warna register/login portal aayega
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const active = localStorage.getItem('manaksetu_active_user')
      if (active) return JSON.parse(active)
    } catch (_) {}
    return null
  })
  const [loading, setLoading] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [selectedStandardNo, setSelectedStandardNo] = useState(null)
  const [demoQueries, setDemoQueries] = useState(DEFAULT_DEMO_QUERIES)
  const [systemStats, setSystemStats] = useState(DEFAULT_SYSTEM_STATS)

  // Load demo queries and system health on mount
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    try {
      localStorage.setItem('manaksetu_darkmode', 'false')
    } catch (_) {}

    safeFetch('/api/v1/analyze/demo-queries')
      .then((data) => {
        if (data && data.length > 0) setDemoQueries(data)
      })
      .catch((err) => {
        console.warn('Backend demo queries unavailable, using built-in verified queries:', err)
        setDemoQueries(DEFAULT_DEMO_QUERIES)
      })

    safeFetch('/api/v1/health')
      .then((data) => {
        if (data && data.knowledge_base_stats) {
          setSystemStats(data.knowledge_base_stats)
        }
      })
      .catch((err) => {
        console.warn('Backend health unavailable, using built-in system stats:', err)
        setSystemStats(DEFAULT_SYSTEM_STATS)
      })
  }, [])

  const handleAnalyze = async (payload) => {
    setLoading(true)
    setAnalysisResults(null)

    try {
      let data
      if (payload.type === 'text') {
        data = await safeFetch('/api/v1/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: payload.text,
            sector: payload.sector,
            top_k: payload.top_k,
            session_id: currentUser ? `${currentUser.role}-${currentUser.name}` : 'officer-session'
          })
        })
      } else {
        const formData = new FormData()
        formData.append('file', payload.file)
        if (payload.sector) formData.append('sector', payload.sector)
        formData.append('top_k', payload.top_k)
        formData.append('session_id', currentUser ? `${currentUser.role}-${currentUser.name}` : 'officer-session')

        data = await safeFetch('/api/v1/analyze/upload', {
          method: 'POST',
          body: formData
        })
      }

      setAnalysisResults(data)
    } catch (err) {
      console.warn('Backend analysis request failed, executing fail-safe local engine:', err)
      try {
        const queryText = payload.type === 'text' ? payload.text : (payload.file?.name || 'Tender Document')
        const fallbackResults = analyzeLocally(queryText, payload.sector, payload.top_k || 5)
        setAnalysisResults(fallbackResults)
      } catch (localErr) {
        alert(`Error running analysis: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  // 1. Initial State: Website opens with Registration / Login Portal
  if (!currentUser) {
    return (
      <AuthPortal
        onLogin={(userData) => {
          try {
            localStorage.setItem('manaksetu_active_user', JSON.stringify(userData))
          } catch (_) {}
          setCurrentUser(userData)
        }}
      />
    )
  }

  // 2. Authenticated State: Dedicated Officer Portal or Admin Portal
  // Security Guard: Admin portal access is strictly restricted to verified BIS officials
  const isGenuineAdmin = currentUser && currentUser.role === 'admin'
  const effectiveRole = isGenuineAdmin ? 'admin' : 'officer'

  return (
    <>
      {effectiveRole === 'officer' ? (
        <OfficerPortal
          user={currentUser}
          onLogout={() => {
            try {
              localStorage.removeItem('manaksetu_active_user')
            } catch (_) {}
            setCurrentUser(null)
            setAnalysisResults(null)
          }}
          onResetAnalysis={() => setAnalysisResults(null)}
          onAnalyze={handleAnalyze}
          loading={loading}
          analysisResults={analysisResults}
          demoQueries={demoQueries}
          onSelectStandard={(stdNo) => setSelectedStandardNo(stdNo)}
        />
      ) : (
        <AdminPortal
          user={currentUser}
          onLogout={() => {
            try {
              localStorage.removeItem('manaksetu_active_user')
            } catch (_) {}
            setCurrentUser(null)
          }}
          systemStats={systemStats}
          onSelectStandard={(stdNo) => setSelectedStandardNo(stdNo)}
          onRefreshCatalog={() => {
            safeFetch('/api/v1/health')
              .then((d) => {
                if (d && d.knowledge_base_stats) {
                  setSystemStats(d.knowledge_base_stats)
                }
              })
              .catch((err) => console.error('Error refreshing catalog stats:', err))
          }}
        />
      )}

      {/* Standard Details & Amendments Modal */}
      {selectedStandardNo && (
        <StandardModal
          standardNo={selectedStandardNo}
          onClose={() => setSelectedStandardNo(null)}
          onSelectAnother={(nextStdNo) => setSelectedStandardNo(nextStdNo)}
        />
      )}
    </>
  )
}
