import React, { useState, useEffect } from 'react'
import {
  Headphones,
  Mail,
  Copy,
  Check,
  Send,
  X,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react'

export default function HelpSupportModal({ language = 'en', user, onClose }) {
  const isHindi = language === 'hi'
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'standards_query'
  })
  const [sentSuccess, setSentSuccess] = useState(false)

  const SUPPORT_EMAIL = 'manaksetu.in@gmail.com'

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    // Open user's native email client with pre-filled subject and body addressed to manaksetu.in@gmail.com
    const subjectLine = encodeURIComponent(`[ManakSetu Support] ${formData.subject || 'Support Request'}`)
    const bodyContent = encodeURIComponent(
      `Officer Name: ${user?.name || 'Authorized Officer'}\nDepartment: ${user?.department || 'Public Procurement'}\nCategory: ${formData.category}\n\nMessage:\n${formData.message}\n\n---\nSent via ManakSetu Helpdesk Portal v2.4.0`
    )
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subjectLine}&body=${bodyContent}`
    setSentSuccess(true)
    setTimeout(() => setSentSuccess(false), 5000)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Help and Support"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-[#1E2A35] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-[#E3DDD5] dark:border-[#2E3F4F] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E3DDD5] dark:border-[#2E3F4F] flex items-center justify-between bg-[#FAF7F2] dark:bg-[#16212B] shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#E05A00] text-white flex items-center justify-center shadow-xs">
              <Headphones className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#0F2942] dark:text-white">
                  {isHindi ? 'सहायता एवं समर्थन (Help & Support)' : 'Help & Support Desk'}
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isHindi ? 'सक्रिय हेल्पडेस्क' : 'Live Desk'}
                </span>
              </div>
              <p className="text-xs text-[#7A7A7A] dark:text-[#9A9A9E]">
                {isHindi
                  ? 'तकनीकी सहायता, मानक अनुक्रमण एवं QCO सत्यापन हेतु आधिकारिक डेस्क'
                  : 'Official support for technical queries, standards indexing & QCO compliance'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close help modal"
            className="p-2 rounded-xl hover:bg-[#EFE7DA] dark:hover:bg-[#2E3F4F] text-[#7A7A7A] dark:text-[#9A9A9E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FAF7F2]/50 dark:bg-[#16212B]/40">
          {/* Primary Email Support Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E2A35] border border-[#E5DDD1] dark:border-[#2E3F4F] shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FA] dark:bg-[#243444] text-[#1B4965] dark:text-sky-300 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#7A7A7A] dark:text-[#9A9A9E]">
                    {isHindi ? 'समर्पित आधिकारिक ईमेल' : 'Dedicated Support Email'}
                  </h3>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="text-base sm:text-lg font-mono font-bold text-[#0F2942] dark:text-sky-300 hover:underline block"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#16212B] hover:bg-[#EFE7DA] dark:hover:bg-[#243444] border border-[#E5DDD1] dark:border-[#2E3F4F] text-xs font-bold text-[#1C1C1E] dark:text-[#E2E8F0] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">{isHindi ? 'कॉपी हो गया!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#1B4965] dark:text-sky-400" />
                      <span>{isHindi ? 'कॉपी करें' : 'Copy'}</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=ManakSetu%20Support%20Request`}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0F2942] hover:bg-[#1B4965] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'ईमेल भेजें' : 'Send Mail'}</span>
                </a>
              </div>
            </div>
            <p className="text-[11px] text-[#7A7A7A] dark:text-[#9A9A9E] leading-relaxed">
              {isHindi
                ? 'सभी तकनीकी समस्याओं, नए भारतीय मानकों को जोड़ने के अनुरोध, या QCO गजट सत्यापन के लिए आप सीधे इस ईमेल पते पर संपर्क कर सकते हैं। 24 कार्य घंटों के भीतर उत्तर दिया जाता है।'
                : 'For technical bugs, custom IS code requests, gazette citation verification, or enterprise procurement onboarding, reach out directly. SLA response within 24 working hours.'}
            </p>
          </div>

          {/* Quick Draft In-App Message */}
          <form onSubmit={handleFormSubmit} className="p-5 rounded-2xl bg-white dark:bg-[#1E2A35] border border-[#E5DDD1] dark:border-[#2E3F4F] shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F2942] dark:text-white">
              <MessageSquare className="w-4 h-4 text-[#1B4965] dark:text-sky-400" />
              <span>{isHindi ? 'त्वरित सहायता संदेश भेजें' : 'Send Quick Support Inquiry'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#1C1C1E] dark:text-[#E2E8F0] mb-1">
                  {isHindi ? 'विषय / श्रेणी' : 'Inquiry Category'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 bg-[#FAF7F2] dark:bg-[#16212B] border border-[#E5DDD1] dark:border-[#2E3F4F] rounded-xl text-xs text-[#1C1C1E] dark:text-[#E2E8F0] focus:outline-none focus:border-[#1B4965]"
                >
                  <option value="standards_query">{isHindi ? 'मानक एवं विनिर्देश संबंधी प्रश्न' : 'Indian Standards & Specifications'}</option>
                  <option value="qco_compliance">{isHindi ? 'QCO एवं राजपत्र अनुपालन' : 'QCO Mandate & Gazette Verification'}</option>
                  <option value="missing_standard">{isHindi ? 'नए मानक को जोड़ने का अनुरोध' : 'Request Indexing of New Standard'}</option>
                  <option value="technical_bug">{isHindi ? 'तकनीकी समस्या / बग रिपोर्ट' : 'Technical Bug / System Error'}</option>
                  <option value="general_feedback">{isHindi ? 'सामान्य सुझाव एवं फीडबैक' : 'General Feedback & Enhancements'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1C1C1E] dark:text-[#E2E8F0] mb-1">
                  {isHindi ? 'संक्षिप्त शीर्षक' : 'Subject Summary'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isHindi ? 'उदा. IS 694 केबल विनिर्देश में संशोधन' : 'e.g. Query on IS 694 cable testing clause'}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-2 bg-[#FAF7F2] dark:bg-[#16212B] border border-[#E5DDD1] dark:border-[#2E3F4F] rounded-xl text-xs text-[#1C1C1E] dark:text-[#E2E8F0] focus:outline-none focus:border-[#1B4965]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1C1C1E] dark:text-[#E2E8F0] mb-1 text-xs">
                {isHindi ? 'विस्तृत संदेश / प्रश्न' : 'Detailed Message'}
              </label>
              <textarea
                rows={3}
                required
                placeholder={isHindi ? 'कृपया अपनी समस्या, निविदा संख्या, या मानक कोड का विस्तार से विवरण दें...' : 'Provide details regarding your tender requirement, standard number, or query...'}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#16212B] border border-[#E5DDD1] dark:border-[#2E3F4F] rounded-xl text-xs text-[#1C1C1E] dark:text-[#E2E8F0] focus:outline-none focus:border-[#1B4965]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#7A7A7A] dark:text-[#9A9A9E]">
                {isHindi ? 'क्लिक करने पर आपका ईमेल क्लाइंट खुल जाएगा' : 'Directly drafts email to manaksetu.in@gmail.com'}
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0F2942] hover:bg-[#1B4965] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isHindi ? 'सहायता अनुरोध भेजें' : 'Launch Email Client'}</span>
              </button>
            </div>
          </form>

          {/* Institutional Contact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2A35] border border-[#E5DDD1] dark:border-[#2E3F4F] shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#1B4965] dark:text-sky-400 font-bold">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{isHindi ? 'राष्ट्रीय हेल्पलाइन' : 'National Helpline'}</span>
              </div>
              <p className="font-mono font-bold text-[#0F2942] dark:text-white text-xs">1800 11 0001</p>
              <p className="text-[10px] text-[#7A7A7A] dark:text-[#9A9A9E]">
                {isHindi ? 'बीआईएस टोल-फ्री (सोम-शुक्र)' : 'BIS Toll-Free (Mon-Fri)'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2A35] border border-[#E5DDD1] dark:border-[#2E3F4F] shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{isHindi ? 'कार्य समय' : 'Operational Hours'}</span>
              </div>
              <p className="font-bold text-[#0F2942] dark:text-white text-xs">09:00 - 17:30 IST</p>
              <p className="text-[10px] text-[#7A7A7A] dark:text-[#9A9A9E]">
                {isHindi ? 'कार्यदिवसों पर' : 'Govt of India Working Days'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2A35] border border-[#E5DDD1] dark:border-[#2E3F4F] shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{isHindi ? 'मुख्यालय' : 'Headquarters'}</span>
              </div>
              <p className="font-bold text-[#0F2942] dark:text-white text-xs">Manak Bhavan, New Delhi</p>
              <p className="text-[10px] text-[#7A7A7A] dark:text-[#9A9A9E]">
                9 Bahadur Shah Zafar Marg
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#FAF7F2] dark:bg-[#16212B] border-t border-[#E3DDD5] dark:border-[#2E3F4F] flex items-center justify-between text-[11px] text-[#7A7A7A] dark:text-[#9A9A9E] shrink-0">
          <span>ManakSetu Procurement Assistance System · v2.4.0</span>
          <span className="font-mono text-[#0F2942] dark:text-sky-400 font-semibold">{SUPPORT_EMAIL}</span>
        </div>
      </div>
    </div>
  )
}
