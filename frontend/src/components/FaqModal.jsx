import React, { useState, useEffect } from 'react'
import {
  HelpCircle,
  X,
  Search,
  ChevronDown,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Building,
  Mail,
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

export default function FaqModal({ language = 'en', onClose }) {
  const isHindi = language === 'hi'
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const faqs = [
    {
      id: 1,
      category: 'general',
      q_en: 'What is ManakSetu and what core problem does it solve?',
      q_hi: 'मानकसेतु क्या है और यह किस मुख्य समस्या का समाधान करता है?',
      a_en: 'ManakSetu is an AI-powered procurement intelligence platform engineered for public sector officers across GeM, CPWD, Indian Railways, Defence, State PWDs, and PSUs. It automatically extracts technical requirements from tender documents (in English or Hindi) and maps them to authoritative Bureau of Indian Standards (BIS) specifications, completely eliminating hallucinated standards, outdated codes, and non-compliant specifications under GFR 2017 Rule 144(i).',
      a_hi: 'मानकसेतु एक एआई-संचालित खरीद खुफिया प्लेटफॉर्म है जिसे जीईएम (GeM), सीपीडब्ल्यूडी, भारतीय रेलवे, रक्षा मंत्रालय और राज्य पीडब्ल्यूडी के खरीद अधिकारियों के लिए बनाया गया है। यह निविदा दस्तावेजों से तकनीकी आवश्यकताओं को निकालता है और उन्हें आधिकारिक भारतीय मानक ब्यूरो (BIS) विनिर्देशों से मैप करता है, जिससे गैर-मौजूद मानक और पुराने कोड पूरी तरह से समाप्त हो जाते हैं।'
    },
    {
      id: 2,
      category: 'standards',
      q_en: 'How does ManakSetu detect superseded or withdrawn standards?',
      q_hi: 'मानकसेतु प्रतिस्थापित (Superseded) या वापस लिए गए मानकों की पहचान कैसे करता है?',
      a_en: 'ManakSetu maintains an active supersession graph. For example, if a tender quotes withdrawn standards like IS 12269:2013 (53 Grade OPC) or IS 8112:2013 (43 Grade OPC), ManakSetu immediately triggers a high-severity alert, informs the officer that these were merged into the active unified IS 269:2015, and provides the compliant substitute clause ready for copy-pasting.',
      a_hi: 'मानकसेतु एक सक्रिय प्रतिस्थापन ग्राफ बनाए रखता है। उदाहरण के लिए, यदि कोई निविदा पुराने मानक जैसे IS 12269:2013 या IS 8112:2013 को उद्धृत करती है, तो मानकसेतु तुरंत चेतावनी जारी करता है और सूचित करता है कि इन्हें एकीकृत सक्रिय IS 269:2015 में मिला दिया गया है, साथ ही नया अनुपालन खंड भी प्रदान करता है।'
    },
    {
      id: 3,
      category: 'compliance',
      q_en: 'What are Quality Control Orders (QCOs) and why are they statutory?',
      q_hi: 'गुणवत्ता नियंत्रण आदेश (QCO) क्या हैं और ये अनिवार्य क्यों हैं?',
      a_en: 'Quality Control Orders (QCOs) are statutory regulations issued by DPIIT, Ministry of Power, Ministry of Steel, and other Ministries under Section 16 of the BIS Act, 2016. Under a QCO, manufacturing, importing, storing, or procuring non-ISI certified goods is a punishable legal offense. ManakSetu verifies whether each recommended standard falls under an active QCO and provides direct Gazette S.O. citations.',
      a_hi: 'गुणवत्ता नियंत्रण आदेश (QCO) बीआईएस अधिनियम, 2016 की धारा 16 के तहत डीपीआईआईटी एवं संबंधित मंत्रालयों द्वारा जारी अनिवार्य वैधानिक आदेश हैं। क्यूसीओ के तहत गैर-आईएसआई प्रमाणित सामान खरीदना या उपयोग करना कानूनी अपराध है। मानकसेतु जांचता है कि कौन सा मानक सक्रिय QCO के अंतर्गत आता है और उसका आधिकारिक राजपत्र (Gazette S.O.) संदर्भ प्रदान करता है।'
    },
    {
      id: 4,
      category: 'organizations',
      q_en: 'How does the 13 Government Organizations mapping work?',
      q_hi: '13 सरकारी संगठनों एवं मंत्रालयों के लिए मानक मैपिंग कैसे कार्य करती है?',
      a_en: 'Each of the 13 verified entities (Indian Railways, CPWD, BHEL, SAIL, NTPC, MoRTH/NHAI, Defence, GeM, MoHUA, CEA, DPIIT, State PWD, BIS) has tailored procurement domains and mandated IS codes. When an officer selects their department, ManakSetu highlights department-specific standards, technical benchmarks, and organization-specific domain tags.',
      a_hi: 'प्रत्येक 13 सत्यापित सरकारी संस्थाओं (भारतीय रेलवे, सीपीडब्ल्यूडी, बीएचईएल, सेल, एनटीपीसी, सड़क परिवहन/एनएचएआई, रक्षा, जीईएम आदि) के पास विशिष्ट खरीद डोमेन और अनिवार्य आईएस कोड हैं। जब अधिकारी अपना विभाग चुनते हैं, तो मानकसेतु विभाग-विशिष्ट मानकों और अधिदेशों को प्राथमिकता देता है।'
    },
    {
      id: 5,
      category: 'technical',
      q_en: 'Can ManakSetu analyze tender specifications written in Hindi?',
      q_hi: 'क्या मानकसेतु हिंदी में लिखी गई निविदा विनिर्देशों का विश्लेषण कर सकता है?',
      a_en: 'Yes. ManakSetu features a dedicated Multilingual Normalization Engine that accurately parses technical specifications written in Devanagari Hindi (e.g. "तांबे के तार IS 1554 के अनुसार"), Roman Hindi/Hinglish, and technical English, converting units and domain terms into standardized regulatory search vectors without external translation APIs.',
      a_hi: 'हाँ, मानकसेतु में एक समर्पित बहुभाषी सामान्यीकरण इंजन है जो देवनागरी हिंदी (जैसे "तांबे के तार IS 1554 के अनुसार"), रोमन हिंग्लिश और अंग्रेजी विनिर्देशों का सटीकता से विश्लेषण करता है तथा बिना किसी बाहरी क्लाउड एपीआई के सही मानक खोज निकालता है।'
    },
    {
      id: 6,
      category: 'compliance',
      q_en: 'How are official Gazette citations and source links verified?',
      q_hi: 'आधिकारिक राजपत्र उद्धरण एवं स्रोत लिंक कैसे सत्यापित किए जाते हैं?',
      a_en: 'All QCO notifications are cross-referenced with official Government of India Gazette publications (egazette.gov.in / law.resource.org) with exact S.O. order numbers and issue dates. Officers can click the external link icon on any standard to inspect the primary verified document.',
      a_hi: 'सभी QCO अधिसूचनाओं को भारत के राजपत्र (egazette.gov.in) के आधिकारिक S.O. आदेश संख्याओं और तारीखों के साथ सत्यापित किया जाता है। अधिकारी किसी भी मानक के साथ दिए गए लिंक पर क्लिक करके सीधे आधिकारिक गजट देख सकते हैं।'
    },
    {
      id: 7,
      category: 'support',
      q_en: 'How can I get technical assistance or report an unmapped standard?',
      q_hi: 'तकनीकी सहायता कैसे प्राप्त करें या नए मानक का सुझाव कैसे दें?',
      a_en: 'For technical help, questions, or suggesting new Indian Standards to be indexed in the knowledge base, reach out to our dedicated support desk at manaksetu.in@gmail.com or access the Help & Support modal from the navigation menu.',
      a_hi: 'तकनीकी सहायता, पूछताछ या ज्ञानकोष में नए भारतीय मानकों को जोड़ने का सुझाव देने के लिए, आप हमारी समर्पित हेल्पडेस्क manaksetu.in@gmail.com पर ईमेल भेज सकते हैं या नेविगेशन मेनू से सहायता विकल्प चुन सकते हैं।'
    }
  ]

  const categories = [
    { id: 'all', label_en: 'All Topics', label_hi: 'सभी विषय' },
    { id: 'general', label_en: 'General', label_hi: 'सामान्य' },
    { id: 'standards', label_en: 'Standards & Supersession', label_hi: 'मानक एवं प्रतिस्थापन' },
    { id: 'compliance', label_en: 'QCO & Legal Mandates', label_hi: 'QCO एवं कानूनी अधिदेश' },
    { id: 'organizations', label_en: '13 Govt Departments', label_hi: '13 सरकारी विभाग' },
    { id: 'technical', label_en: 'Bilingual Engine', label_hi: 'द्विभाषी तकनीक' },
    { id: 'support', label_en: 'Support & Helpdesk', label_hi: 'सहायता एवं संपर्क' }
  ]

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const q = searchQuery.trim().toLowerCase()
    if (!q) return matchesCategory
    const textToMatch = `${faq.q_en} ${faq.q_hi} ${faq.a_en} ${faq.a_hi}`.toLowerCase()
    return matchesCategory && textToMatch.includes(q)
  })

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Frequently Asked Questions"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-[#1E2A35] rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-[#E3DDD5] dark:border-[#2E3F4F] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E3DDD5] dark:border-[#2E3F4F] flex items-center justify-between bg-[#FAF7F2] dark:bg-[#16212B] shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#0F2942] dark:bg-[#1B4965] text-white flex items-center justify-center shadow-xs">
              <HelpCircle className="w-5 h-5 text-amber-300" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#0F2942] dark:text-white">
                  {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions (FAQ)'}
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EBF3FA] dark:bg-[#243444] text-[#1B4965] dark:text-sky-300 border border-[#BFDBFE] dark:border-sky-800">
                  v2.4.0
                </span>
              </div>
              <p className="text-xs text-[#7A7A7A] dark:text-[#9A9A9E]">
                {isHindi
                  ? 'मानकसेतु पोर्टल, बीआईएस मानकों एवं QCO अनुपालन से संबंधित आधिकारिक उत्तर'
                  : 'Official guide to ManakSetu, Indian Standards (BIS) & statutory QCO compliance'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close FAQ modal"
            className="p-2 rounded-xl hover:bg-[#EFE7DA] dark:hover:bg-[#2E3F4F] text-[#7A7A7A] dark:text-[#9A9A9E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Pills */}
        <div className="px-6 py-3.5 bg-white dark:bg-[#1E2A35] border-b border-[#E3DDD5] dark:border-[#2E3F4F] space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9A9A9E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'प्रश्न या कीवर्ड खोजें (जैसे QCO, IS 269, सीमेंट, केबल)...' : 'Search questions or keywords (e.g. QCO, IS 269, cement, cables)...'}
              className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] dark:bg-[#16212B] border border-[#E3DDD5] dark:border-[#2E3F4F] rounded-xl text-xs text-[#1C1C1E] dark:text-[#E2E8F0] placeholder:text-[#9A9A9E] focus:outline-none focus:border-[#1B4965] dark:focus:border-sky-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F2942] text-white shadow-2xs'
                      : 'bg-[#FAF7F2] dark:bg-[#16212B] text-[#4A4A4A] dark:text-[#D0D5DA] hover:bg-[#EFE7DA] dark:hover:bg-[#243444] border border-[#E3DDD5] dark:border-[#2E3F4F]'
                  }`}
                >
                  {isHindi ? cat.label_hi : cat.label_en}
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#FAF7F2]/60 dark:bg-[#16212B]/40">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <HelpCircle className="w-8 h-8 text-[#9A9A9E] mx-auto opacity-50" />
              <p className="text-sm font-bold text-[#1C1C1E] dark:text-white">
                {isHindi ? 'कोई प्रश्न नहीं मिला' : 'No matching questions found'}
              </p>
              <p className="text-xs text-[#7A7A7A] dark:text-[#9A9A9E]">
                {isHindi ? 'कृपया अन्य कीवर्ड खोजें या हेल्पडेस्क manaksetu.in@gmail.com पर लिखें।' : 'Try another keyword or reach out directly to manaksetu.in@gmail.com.'}
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === faq.id
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? 'bg-white dark:bg-[#1E2A35] border-[#1B4965]/40 dark:border-sky-500/40 shadow-xs'
                      : 'bg-white dark:bg-[#1E2A35] border-[#E3DDD5] dark:border-[#2E3F4F] hover:border-[#1B4965]/20'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : faq.id)}
                    className="w-full text-left p-4.5 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span className="font-bold text-xs sm:text-sm text-[#0F2942] dark:text-white leading-snug">
                      {isHindi ? faq.q_hi : faq.q_en}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#1B4965] dark:text-sky-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4.5 pb-4 pt-1 text-xs text-[#4A4A4A] dark:text-[#D0D5DA] leading-relaxed border-t border-[#F2ECE1] dark:border-[#2E3F4F]">
                      <p className="mt-2">{isHindi ? faq.a_hi : faq.a_en}</p>
                    </div>
                  )}
                </div>
              )
            })
          )}

          {/* Quick Help Footer Card inside FAQ */}
          <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-[#1E2A35] border border-[#E3DDD5] dark:border-[#2E3F4F] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#E05A00]" />
              <div>
                <h4 className="font-bold text-xs text-[#0F2942] dark:text-white">
                  {isHindi ? 'क्या आपका कोई और प्रश्न है?' : 'Have more questions?'}
                </h4>
                <p className="text-[11px] text-[#7A7A7A] dark:text-[#9A9A9E]">
                  {isHindi ? 'हमारी आधिकारिक तकनीकी हेल्पडेस्क से तुरंत संपर्क करें:' : 'Reach out to our official technical support desk:'}
                </p>
              </div>
            </div>
            <a
              href="mailto:manaksetu.in@gmail.com?subject=ManakSetu%20FAQ%20Query"
              className="px-3.5 py-1.5 rounded-xl bg-[#0F2942] hover:bg-[#1B4965] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>manaksetu.in@gmail.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
