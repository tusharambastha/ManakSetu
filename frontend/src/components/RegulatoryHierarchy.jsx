import React, { useState } from 'react'
import {
  GitBranch,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react'

export default function RegulatoryHierarchy({ relationshipGraph, onSelectStandard, language = 'en' }) {
  const [collapsed, setCollapsed] = useState(false)
  const isHindi = language === 'hi'

  if (!relationshipGraph || !relationshipGraph.nodes || relationshipGraph.nodes.length === 0) {
    return null
  }

  const { nodes = [], edges = [] } = relationshipGraph

  const getNodeBadge = (type) => {
    switch (type) {
      case 'tender_req':
        return 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]'
      case 'primary_standard':
        return 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] font-bold'
      case 'qco_order':
        return 'bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]'
      case 'replacement_standard':
        return 'bg-[#F0FDFA] text-[#0F766E] border-[#99F6E4] font-bold'
      case 'allied_standard':
      default:
        return 'bg-[#F8FAFC] text-[#334155] border-[#E2E8F0]'
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(20,30,50,0.04)] p-6 space-y-4">
      {/* Header with Collapse Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F0F7FA] text-[#1B4965] border border-[#D0E2ED] flex items-center justify-center">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#0F2942]">
              {isHindi ? 'मानक एवं विनियामक प्रशासन पदानुक्रम' : 'Standards & Regulatory Governance Hierarchy'}
            </h3>
            <span className="text-xs text-[#64748B]">
              {isHindi
                ? 'टेंडर विनिर्देश ➔ प्राथमिक मानक ➔ वैधानिक क्यूसीओ एवं संबद्ध मानकों को जोड़ने वाले सत्यापित संबंध'
                : 'Verified links connecting Tender Specification ➔ Primary Standard ➔ Statutory QCO & Allied Norms'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs text-[#64748B] hover:text-[#0F2942] font-bold flex items-center gap-1 transition-colors bg-[#F8FAFC] hover:bg-[#F1F5F9] px-3 py-1.5 rounded-lg border border-[#E2E8F0]"
        >
          <span>{collapsed ? (isHindi ? 'पदानुक्रम विस्तार करें' : 'Expand Hierarchy') : (isHindi ? 'पदानुक्रम संक्षिप्त करें' : 'Collapse Hierarchy')}</span>
          {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-4 pt-1 text-xs">
          {/* Visual Nodes Grid */}
          <div className="flex flex-wrap gap-2.5">
            {nodes.map((node) => {
              const isStandardClickable = (node.type === 'primary_standard' || node.type === 'replacement_standard' || node.type === 'allied_standard') && onSelectStandard
              return (
                <div
                  key={node.id}
                  onClick={() => {
                    if (isStandardClickable) {
                      const cleanNo = node.label.replace(/^Active:\s*/, '').trim()
                      onSelectStandard(cleanNo)
                    }
                  }}
                  className={`px-3 py-2 rounded-xl border text-xs flex items-center gap-2 transition-all shadow-2xs ${getNodeBadge(
                    node.type
                  )} ${isStandardClickable ? 'cursor-pointer hover:shadow-xs hover:border-[#CBD5E1]' : ''}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                  <span className="font-mono font-bold">{node.label}</span>
                  <span className="text-[10px] uppercase font-bold opacity-75">
                    ({node.type.replace('_', ' ')})
                  </span>
                </div>
              )
            })}
          </div>

          {/* Relationships List */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <span className="font-bold text-[#64748B] text-[10px] uppercase tracking-wider block">
              Grounded Regulatory Connections
            </span>
            <div className="space-y-2">
              {edges.map((edge, idx) => {
                const sourceNode = nodes.find((n) => n.id === edge.source)
                const targetNode = nodes.find((n) => n.id === edge.target)
                return (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-2 text-xs text-[#334155]"
                  >
                    <span className="font-mono font-bold text-[#0F2942]">
                      {sourceNode?.label || edge.source}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                    <span className="px-2.5 py-0.5 rounded-md bg-white border border-[#CBD5E1] font-semibold text-[#1B4965] text-[11px] shadow-2xs">
                      {edge.label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                    <span className="font-mono font-bold text-[#0F2942]">
                      {targetNode?.label || edge.target}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
