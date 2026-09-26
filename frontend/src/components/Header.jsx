import React from 'react'
import {
  ShieldCheck,
  BookOpen,
  Search,
  Settings,
  Award,
  Home,
  ChevronDown
} from 'lucide-react'
import logoImg from '../assets/manaksetu-logo.jpg'

export default function Header({ activeTab, setActiveTab, systemStats, userRole, onOpenLogin }) {
  const isOfficer = userRole === 'officer'

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Sleek Top Banner */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white tracking-wide">Smart India Hackathon 2026</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 text-[11px]">Problem Statement SIH26108: Standards Engine</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Hallucination Retrieval Lock</span>
            </span>
            {systemStats && (
              <span className="text-slate-400 hidden sm:inline text-[11px]">
                <strong className="text-white font-mono">{systemStats.total_standards}</strong> BIS Standards Loaded
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('landing')}
        >
          <img
            src={logoImg}
            alt="ManakSetu"
            className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Clean Nav Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'landing'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'analysis'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Tender Engine
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'catalog'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Catalogue
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Admin & QCO
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'architecture'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Why ManakSetu Wins
          </button>
        </nav>

        {/* Compact User Persona Switcher */}
        <div
          onClick={onOpenLogin}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition-all shadow-2xs"
          title="Click to switch persona"
        >
          <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs ${
            isOfficer ? 'bg-blue-600' : 'bg-purple-600'
          }`}>
            {isOfficer ? 'PO' : 'BA'}
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-900">
              <span>{isOfficer ? 'Procurement Officer' : 'BIS Admin'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-[10px] text-slate-500">
              {isOfficer ? 'CPWD / GeM' : 'Bureau of Indian Stds'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
