import React, { useState, useEffect } from 'react'
import AuthPortal from './components/AuthPortal'
import OfficerPortal from './components/OfficerPortal'
import AdminPortal from './components/AdminPortal'
import StandardModal from './components/StandardModal'
import { safeFetch } from './utils/api'

export default function App() {
  // Website khulne par sabse pehle register/login portal aayega
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [selectedStandardNo, setSelectedStandardNo] = useState(null)
  const [demoQueries, setDemoQueries] = useState([])
  const [systemStats, setSystemStats] = useState(null)

  // Load demo queries and system health on mount
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    try {
      localStorage.setItem('manaksetu_darkmode', 'false')
    } catch (_) {}

    safeFetch('/api/v1/analyze/demo-queries')
      .then((data) => setDemoQueries(data || []))
      .catch((err) => console.error('Error fetching demo queries:', err))

    safeFetch('/api/v1/health')
      .then((data) => {
        if (data && data.knowledge_base_stats) {
          setSystemStats(data.knowledge_base_stats)
        }
      })
      .catch((err) => console.error('Error fetching system health:', err))
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
      alert(`Error running analysis: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // 1. Initial State: Website opens with Registration / Login Portal
  if (!currentUser) {
    return (
      <AuthPortal
        onLogin={(userData) => {
          setCurrentUser(userData)
        }}
      />
    )
  }

  // 2. Authenticated State: Dedicated Officer Portal or Admin Portal
  return (
    <>
      {currentUser.role === 'officer' ? (
        <OfficerPortal
          user={currentUser}
          onLogout={() => {
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
