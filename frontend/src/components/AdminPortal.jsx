import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  BarChart3,
  BookOpen,
  History,
  Award,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  Sun,
  Moon,
  Globe,
  Check,
  ShieldCheck,
  Building,
  HelpCircle,
  Headphones
} from 'lucide-react'
import AdminPanel from './AdminPanel'
import StandardsCatalog from './StandardsCatalog'
import HistoryView from './HistoryView'
import JudgePitchView from './JudgePitchView'
import FaqModal from './FaqModal'
import HelpSupportModal from './HelpSupportModal'
import { t } from '../utils/translations'
import logoImg from '../assets/manaksetu-logo.jpg'

// ─── Dark Mode Helper ─────────────────────────────────────────────────────────
function getInitialDark() {
  return false
}

if (typeof window !== 'undefined') {
  try {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('manaksetu_darkmode', 'false')
  } catch (_) {}
}

// ─── Modal: Admin Profile ─────────────────────────────────────────────────────
function ProfileModal({ user, language = 'en', onClose }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'BA'

  const infoRows = [
    { label: language === 'hi' ? 'पूरा नाम' : 'Full Name', value: user?.name || 'Dr. Ananya Verma' },
    { label: language === 'hi' ? 'पद / भूमिका' : 'Role', value: language === 'hi' ? 'बीआईएस व्यवस्थापक' : 'BIS Administrator' },
    { label: language === 'hi' ? 'विभाग' : 'Department', value: user?.department || 'Bureau of Indian Standards (BIS)' },
    { label: language === 'hi' ? 'सुरक्षा स्तर' : 'Clearance Level', value: 'Level 3 — Technical Standards Authority' },
    { label: language === 'hi' ? 'पोर्टल एक्सेस' : 'Portal Access', value: 'Admin Portal (Standards Registry & QCO)' },
    { label: language === 'hi' ? 'ईमेल' : 'Official Email', value: user?.email || 'ananya.verma@bis.gov.in' }
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Admin Profile">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-[#1E2A35] rounded-2xl shadow-2xl max-w-sm w-full border border-[#E3DDD5] dark:border-[#2E3F4F] transition-colors">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#E3DDD5] dark:border-[#2E3F4F] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C1C1E] dark:text-white">
            {language === 'hi' ? 'व्यवस्थापक प्रोफ़ाइल' : 'Administrator Profile'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close profile modal"
            className="p-1.5 rounded-lg hover:bg-[#F2EFE9] dark:hover:bg-[#2E3F4F] text-[#7A7A7A] dark:text-[#9A9A9E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#E05A00] text-white flex items-center justify-center font-bold text-xl shadow-xs">
              {initials}
            </div>
            <div className="text-center">
              <p className="font-bold text-[#1C1C1E] dark:text-white text-sm">
                {user?.name || 'Dr. Ananya Verma'}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#E05A00] dark:text-orange-400 text-[11px] font-bold border border-orange-200 dark:border-orange-800">
                {language === 'hi' ? 'बीआईएस मुख्य प्रशासक' : 'BIS Chief Administrator'}
              </span>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-2 text-xs">
            {infoRows.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-2 py-2 border-b border-[#F2EFE9] dark:border-[#2E3F4F] last:border-0">
                <span className="text-[#7A7A7A] dark:text-[#9A9A9E] font-medium shrink-0">{label}</span>
                <span className="text-[#1C1C1E] dark:text-[#D0D5DA] font-semibold text-right truncate max-w-[62%]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Modal: Sign Out Confirmation ───────────────────────────────────────────
function SignOutConfirmModal({ onCancel, onConfirm, language = 'en' }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Sign out confirmation">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 bg-white dark:bg-[#1E2A35] rounded-2xl shadow-2xl max-w-xs w-full border border-[#E3DDD5] dark:border-[#2E3F4F] p-6 space-y-5 transition-colors">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-sm font-bold text-[#1C1C1E] dark:text-white">
            {language === 'hi' ? 'लॉग आउट करें?' : 'Sign Out?'}
          </h2>
          <p className="text-xs text-[#7A7A7A] dark:text-[#9A9A9E] leading-relaxed">
            {language === 'hi'
              ? 'क्या आप मानकसेतु व्यवस्थापक सत्र से लॉग आउट करना चाहते हैं?'
              : 'Are you sure you want to sign out of the ManakSetu Admin Console? Your current session will end.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-[#E3DDD5] dark:border-[#2E3F4F] bg-white dark:bg-[#16212B] text-[#1C1C1E] dark:text-white text-xs font-bold hover:bg-[#F2EFE9] dark:hover:bg-[#2E3F4F] transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'लॉग आउट' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main AdminPortal Component ──────────────────────────────────────────────
export default function AdminPortal({
  user,
  onLogout,
  systemStats,
  onSelectStandard,
  onRefreshCatalog
}) {
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard', 'catalog', 'audit', 'pitch'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showSignOut, setShowSignOut] = useState(false)
  const [showFaq, setShowFaq] = useState(false)
  const [showHelpSupport, setShowHelpSupport] = useState(false)

  const profileRef = useRef(null)
  const sidebarRef = useRef(null)

  // Dark Mode State
  const [dark, setDark] = useState(false)

  // Force reset dark mode on mount so the original creamy theme always loads
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    try {
      localStorage.setItem('manaksetu_darkmode', 'false')
    } catch (_) {}
  }, [])

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

  // Language State
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('manaksetu_language') || 'en'
      } catch (_) {}
    }
    return 'en'
  })

  const changeLanguage = (lang) => {
    setLanguage(lang)
    try {
      localStorage.setItem('manaksetu_language', lang)
    } catch (_) {}
  }

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
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'BA'

  const sidebarNavItems = [
    {
      tab: 'dashboard',
      icon: BarChart3,
      label: language === 'hi' ? 'मानक एवं QCO कंसोल' : 'Standards & QCO Console',
      action: () => {
        setActiveTab('dashboard')
        closeSidebar()
      }
    },
    {
      tab: 'catalog',
      icon: BookOpen,
      label: language === 'hi' ? 'संपूर्ण मानक निर्देशिका' : 'Full Standards Catalogue',
      action: () => {
        setActiveTab('catalog')
        closeSidebar()
      }
    },
    {
      tab: 'audit',
      icon: History,
      label: language === 'hi' ? 'सिस्टम ऑडिट लॉग्स' : 'System Audit Logs',
      action: () => {
        setActiveTab('audit')
        closeSidebar()
      }
    },
    {
      tab: 'pitch',
      icon: Award,
      label: language === 'hi' ? 'मानकसेतु की विशेषताएं' : 'Why ManakSetu Wins',
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
    }
  ]

  return (
    <div className="min-h-screen bg-[#F6F1E7] dark:bg-[#111B24] flex flex-col font-sans text-[#1C1C1E] dark:text-[#E2E8F0] transition-colors duration-200 overflow-x-hidden">
      {/* ── 1. National Tricolor Strip ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shrink-0" />

      {/* ── 2. Official Header Strip ── */}
      <header className="bg-white/95 dark:bg-[#1A2535]/95 backdrop-blur-md border-b border-[#E5DDD1] dark:border-[#2E3F4F] sticky top-0 z-40 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">

          {/* LEFT: Menu Hamburger + Logo + Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 sm:p-2.5 rounded-xl border border-[#E5DDD1] dark:border-[#2E3F4F] bg-[#F6F1E7] dark:bg-[#1E2A35] hover:bg-[#EFE7DA] dark:hover:bg-[#243444] text-[#0F2942] dark:text-[#E2E8F0] transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Menu className="w-5 h-5 text-[#0F2942] dark:text-[#E2E8F0]" />
            </button>

            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
              title="Return to Admin Dashboard"
            >
              <img
                src={logoImg}
                alt="ManakSetu"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain rounded-xl group-hover:opacity-90 transition-opacity drop-shadow-xs"
              />

              <div className="hidden xl:block border-l border-[#E5DDD1] dark:border-[#2E3F4F] pl-3 ml-0.5">
                <div className="text-xs font-bold text-[#0F2942] dark:text-white tracking-tight">
                  {language === 'hi' ? 'बीआईएस मानक प्रशासन पोर्टल' : 'BIS Standards Administration Portal'}
                </div>
                <div className="text-[10px] font-medium text-[#7A7A7A] dark:text-[#9A9A9E]">
                  {language === 'hi' ? 'भारतीय मानक ब्यूरो • तकनीकी नियंत्रण कक्ष' : 'Bureau of Indian Standards • Technical Control'}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ONLY Login Profile Popup Menu */}
          <div className="relative shrink-0" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(prev => !prev)}
              aria-label="Open admin profile menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-white dark:bg-[#1E2A35] border border-[#E5DDD1] dark:border-[#2E3F4F] rounded-xl shadow-2xs hover:bg-[#F6F1E7] dark:hover:bg-[#2E3F4F] text-[#0F2942] dark:text-[#E2E8F0] transition-colors max-w-[210px] sm:max-w-[260px] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#E05A00] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {initials}
              </div>
              <div className="text-left hidden sm:block min-w-0">
                <div className="font-bold text-[#0F2942] dark:text-white text-xs leading-tight truncate">
                  {user?.name || 'Dr. Ananya Verma'}
                </div>
                <div className="text-[10px] text-[#7A7A7A] dark:text-[#9A9A9E] leading-tight truncate">
                  {user?.department || 'Bureau of Indian Standards (BIS)'}
                </div>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#64748B] dark:text-[#9A9A9E] shrink-0 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Profile Dropdown Popup */}
            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#1E2A35] border border-[#E5DDD1] dark:border-[#2E3F4F] rounded-xl shadow-xl overflow-hidden z-50 text-[#0F2942] dark:text-[#E2E8F0]"
                role="menu"
              >
                <div className="px-4 py-3 bg-[#F6F1E7]/50 dark:bg-[#16212B] border-b border-[#E5DDD1] dark:border-[#2E3F4F]">
                  <p className="text-xs font-bold text-[#0F2942] dark:text-white truncate">
                    {user?.name || 'Dr. Ananya Verma'}
                  </p>
                  <p className="text-[10px] text-[#E05A00] dark:text-orange-400 font-semibold mt-0.5">
                    {language === 'hi' ? 'बीआईएस मुख्य प्रशासक' : 'BIS Administrator'}
                  </p>
                </div>

                <button
                  role="menuitem"
                  onClick={() => { setShowProfile(true); setProfileOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#0F2942] dark:text-[#E2E8F0] hover:bg-[#F6F1E7] dark:hover:bg-[#243444] transition-colors text-left cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#64748B] dark:text-[#9A9A9E]" />
                  <span>{language === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile'}</span>
                </button>

                <div className="h-px bg-[#E5DDD1] dark:bg-[#2E3F4F]" />

                <button
                  role="menuitem"
                  onClick={() => { setShowSignOut(true); setProfileOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'लॉग आउट' : 'Sign Out'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── 3. Sidebar Menu Drawer ── */}
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
          aria-label="Admin navigation"
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3DDD5] dark:border-[#2E3F4F]">
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="ManakSetu" className="h-10 sm:h-11 w-auto object-contain rounded-lg shadow-2xs" />
              <div>
                <span className="text-sm font-bold text-[#1B4965] dark:text-sky-300 block leading-tight">ManakSetu</span>
                <span className="text-[10px] font-bold text-[#E05A00] uppercase tracking-wider">Admin Portal</span>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-lg hover:bg-[#F2EFE9] dark:hover:bg-[#2E3F4F] text-[#7A7A7A] dark:text-[#9A9A9E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section: Navigation items */}
          <p className="px-5 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9A9A9E]">
            {language === 'hi' ? 'नेविगेशन मेनू' : 'Navigation'}
          </p>

          <div className="px-3 space-y-1">
            {sidebarNavItems.map(({ tab, icon: Icon, label, action }) => {
              const isActive = tab && activeTab === tab
              return (
                <button
                  key={tab || label}
                  onClick={action}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#0F2942] text-white shadow-2xs font-bold'
                      : 'text-[#1C1C1E] dark:text-[#E2E8F0] hover:bg-[#F2EFE9] dark:hover:bg-[#243444]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#E05A00] dark:text-orange-400'}`} />
                    <span>{label}</span>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mx-5 my-3 h-px bg-[#E3DDD5] dark:bg-[#2E3F4F]" />

          {/* Section: Language Selector */}
          <div className="px-3">
            <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9A9A9E]">
              {language === 'hi' ? 'भाषा / Language' : 'Language / भाषा'}
            </p>

            <div className="space-y-0.5">
              {[
                { code: 'en', native: 'English (India)' },
                { code: 'hi', native: 'हिन्दी (भारत)' }
              ].map(({ code, native }) => (
                <button
                  key={code}
                  onClick={() => changeLanguage(code)}
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

          {/* Spacer */}
          <div className="flex-1" />

          {/* Section: Dark Mode Toggle at Bottom of Menu Bar */}
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
                <span>{language === 'hi' ? 'डार्क मोड' : 'Dark Mode'}</span>
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
              ManakSetu v2.4.0
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

      {/* ── 4. Main Content Area ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {/* Tab 1: Admin Dashboard & QCO Console */}
        {activeTab === 'dashboard' && (
          <AdminPanel
            user={user}
            userRole="admin"
            onRefreshCatalog={onRefreshCatalog}
            onSelectStandard={onSelectStandard}
            language={language}
          />
        )}

        {/* Tab 2: Full Standards Catalogue */}
        {activeTab === 'catalog' && (
          <StandardsCatalog
            onSelectStandard={onSelectStandard}
            language={language}
            userDepartment={user?.department || 'Bureau of Indian Standards (BIS)'}
            user={user}
          />
        )}

        {/* Tab 3: System Audit Logs */}
        {activeTab === 'audit' && (
          <HistoryView
            onReanalyze={(query) => {
              setActiveTab('catalog')
            }}
            onSelectStandard={onSelectStandard}
            user={user}
            isAdmin={true}
            language={language}
          />
        )}

        {/* Tab 4: Judges Pitch */}
        {activeTab === 'pitch' && (
          <JudgePitchView onBackToDashboard={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* ── 5. Official Footer ── */}
      <footer className="bg-white dark:bg-[#1A2535] border-t border-[#E3DDD5] dark:border-[#2E3F4F] py-4 px-4 sm:px-8 text-xs text-[#7A7A7A] dark:text-[#9A9A9E] mt-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#1C1C1E] dark:text-white">ManakSetu BIS Standards Admin Portal</span>
            <span> • Smart India Hackathon 2026 (SIH26108)</span>
          </div>
          <div>
            <span>Bureau of Indian Standards (BIS) Technical Administration</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-2 text-center text-[#9A9A9E] dark:text-[#6B7280]">
          © 2026 ManakSetu | Independent SIH Prototype | For Reference &amp; Verification Only
        </div>
      </footer>

      {/* ── 6. Modals ── */}
      {showProfile && (
        <ProfileModal
          user={user}
          language={language}
          onClose={() => setShowProfile(false)}
        />
      )}

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
          language={language}
          onCancel={() => setShowSignOut(false)}
          onConfirm={() => {
            setShowSignOut(false)
            onLogout()
          }}
        />
      )}
    </div>
  )
}
