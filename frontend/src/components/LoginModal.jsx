import React from 'react'
import { UserCheck, Settings, X, Check, ArrowRight } from 'lucide-react'

export default function LoginModal({ isOpen, onClose, currentRole, onSelectRole }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-gov-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight">Select Evaluation Persona</h3>
            <p className="text-xs text-slate-300 mt-0.5">Switch perspective to experience ManakSetu's workflows</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-6 space-y-3">
          {/* Role 1: Procurement Officer */}
          <div
            onClick={() => {
              onSelectRole('officer')
              onClose()
            }}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
              currentRole === 'officer'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                PO
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Procurement Officer</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    GeM / CPWD
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ramesh Sharma — Draft specifications & verify standard compliance
                </p>
              </div>
            </div>

            {currentRole === 'officer' ? (
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 group-hover:text-blue-600">
                Select <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Role 2: BIS Admin */}
          <div
            onClick={() => {
              onSelectRole('admin')
              onClose()
            }}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
              currentRole === 'admin'
                ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                BA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">BIS Standards Admin</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    Bureau of Indian Standards
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dr. Ananya Verma — Manage standards catalogue & QCO compliance
                </p>
              </div>
            </div>

            {currentRole === 'admin' ? (
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 group-hover:text-purple-600">
                Select <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>SIH 2026 Interactive Role Simulation</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
