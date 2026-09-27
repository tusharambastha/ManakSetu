import React, { useState, useEffect, useRef } from 'react'
import {
  PlayCircle,
  X,
  Check,
  Video,
  Layers,
  ShieldCheck,
  FileText,
  Sparkles,
  Cpu,
  Clock,
  CheckCircle2
} from 'lucide-react'

export default function HowItWorksModal({ onClose, language = 'en' }) {
  const [activeStep, setActiveStep] = useState(0)
  const videoRef = useRef(null)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const steps = [
    {
      step: '1',
      title: language === 'hi' ? 'निविदा आवश्यकता एवं स्पेसिफिकेशन विश्लेषण' : 'Tender Specification & Requirements Ingestion',
      badge: language === 'hi' ? 'एनएलपी प्रीप्रोसेसर' : 'NLP Preprocessor',
      desc: language === 'hi'
        ? 'अधिकारी सीधे तकनीकी विवरण या टेंडर क्लॉज इनपुट करते हैं अथवा पीडीएफ/डॉक्यूमेंट अपलोड करते हैं। मानकसेतु बिना डेटा सार्वजनिक क्लाउड पर भेजे तकनीकी विशेषताओं की पहचान करता है।'
        : 'Officer inputs raw clauses, item descriptions, or uploads full PDF/DOCX tenders. ManakSetu identifies technical attributes without sending data to public clouds.',
      highlights: [
        language === 'hi' ? 'देवनागरी एवं रोमन हिंदी सामान्यीकरण' : 'Devanagari & Roman Hindi Normalization',
        language === 'hi' ? 'शून्य बाहरी एपीआई निर्भरता' : 'Zero external API dependence',
        language === 'hi' ? 'पैरामीटर टोकनाइज़ेशन (वोल्टेज, ग्रेड, क्लास)' : 'Parameter tokenization (voltage, grades, classes)'
      ]
    },
    {
      step: '2',
      title: language === 'hi' ? 'सटीक इंजीनियरिंग पैरामीटर निष्कर्षण' : 'Deterministic Parameter Extraction',
      badge: language === 'hi' ? 'पैरामीटर गार्ड' : 'Parameter Guard',
      desc: language === 'hi'
        ? 'सटीक इंजीनियरिंग पैरामीटर्स (1100V, Fe 500D, 440V, 200J इम्पैक्ट, PN 10) का निष्कर्षण करके प्रासंगिक मानकों की खोज सुनिश्चित की जाती है।'
        : 'Extracts exact engineering parameters (1100V, Fe 500D, 440V, 200J steel toe impact, PN 10 pressure) to anchor the retrieval space.',
      highlights: [
        language === 'hi' ? 'सटीक संख्यात्मक रेटिंग निष्कर्षण' : 'Extracts exact numerical ratings',
        language === 'hi' ? 'सुरक्षा गुणधर्म संरक्षण (FRLS, डाइइलेक्ट्रिक)' : 'Preserves safety properties (FRLS, dielectric)',
        language === 'hi' ? 'कैनोनिकल उत्पाद श्रेणी पहचान' : 'Identifies canonical sector and product category'
      ]
    },
    {
      step: '3',
      title: language === 'hi' ? 'हाइब्रिड नॉलेज बेस खोज (BM25 + वेक्टर एम्बेडिंग्स)' : 'Hybrid Knowledge Base Retrieval (BM25 + Dense Vectors)',
      badge: language === 'hi' ? 'हाइब्रिड सर्च' : 'Local Hybrid Search',
      desc: language === 'hi'
        ? 'स्पार्स कीवर्ड इंडेक्सिंग (BM25) और डेंस वेक्टर एम्बेडिंग्स (BGE) एक साथ चलते हैं और आरसीएफ (RRF) द्वारा सर्वश्रेष्ठ परिणाम देते हैं।'
        : 'Sparse keyword indexing (BM25) and dense ONNX embeddings (FastEmbed BGE-small) run simultaneously and are fused using Reciprocal Rank Fusion (RRF).',
      highlights: [
        language === 'hi' ? 'शून्य भ्रम (Zero Hallucination)' : 'Zero LLM hallucinations',
        language === 'hi' ? 'केवल आधिकारिक बीआईएस कैटलॉग डेटा' : 'Official BIS catalog records only',
        language === 'hi' ? 'त्वरित सब-50ms हाइब्रिड खोज' : 'Instant sub-50ms hybrid retrieval'
      ]
    },
    {
      step: '4',
      title: language === 'hi' ? 'स्वचालित अप्रचलित/निरस्त मानक सुरक्षा शील्ड' : 'Automated Deprecation Shield & Version Verification',
      badge: language === 'hi' ? 'कानूनी शील्ड' : 'Statutory Shield',
      desc: language === 'hi'
        ? 'यदि कोई संदर्भित मानक निरस्त या संशोधित है, तो सिस्टम अधिकारी को आधिकारिक गजट अधिसूचना के साथ सक्रिय वर्तमान संस्करण पर निर्देशित करता है।'
        : 'Checks if referenced standard is superseded or withdrawn, and automatically routes procurement officer to the current active edition with gazette citation.',
      highlights: [
        language === 'hi' ? 'उदाहरण: IS 12269 के स्थान पर सक्रिय IS 269:2015' : 'Example: Obsolete IS 12269 routed to IS 269:2015',
        language === 'hi' ? 'पूर्ण संशोधन एवं अमेंडमेंट ट्रैकिंग' : 'Full amendment tracking',
        language === 'hi' ? 'आधिकारिक बीआईएस गजट संदर्भ' : 'Official BIS gazette cross-reference'
      ]
    },
    {
      step: '5',
      title: language === 'hi' ? 'अनिवार्य क्यूसीओ प्रवर्तन एवं ऑडिट रिपोर्ट' : 'Mandatory QCO Enforcement & Compliance Report',
      badge: language === 'hi' ? 'ऑडिट-रेडी रिपोर्ट' : 'Audit-Ready Report',
      desc: language === 'hi'
        ? 'उत्पाद पर लागू अनिवार्य क्वालिटी कंट्रोल ऑर्डर (QCO) की पुष्टि करके कानूनी साक्ष्य एवं ऑडिट-तैयार रिपोर्ट प्रस्तुत करता है।'
        : 'Checks whether product has statutory Quality Control Orders (QCO) mandating ISI mark or CRS licensing, surfacing an audit-grade evidence trail.',
      highlights: [
        language === 'hi' ? 'मंत्रालय गजट आदेश ट्रैकिंग' : 'Ministry Gazette order tracking',
        language === 'hi' ? 'पूर्व-प्रकाशन टेंडर जोखिम ऑडिट' : 'Pre-publication risk and conflict audit',
        language === 'hi' ? 'GeM/CPWD के लिए रेडी-टू-कॉपी क्लॉज' : 'Ready-to-copy standard clauses for GeM/CPWD'
      ]
    }
  ]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="How ManakSetu Works"
    >
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-white dark:bg-[#132230] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#E3DDD5] dark:border-[#243647] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-[#132230]/95 backdrop-blur-md px-6 pt-5 pb-4 border-b border-[#E3DDD5] dark:border-[#243647] flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-8 h-8 rounded-xl bg-[#E05A00] flex items-center justify-center shadow-xs">
                <PlayCircle className="w-4 h-4 text-white" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#1C1C1E] dark:text-white">
                {language === 'hi'
                  ? 'मानकसेतु कैसे काम करता है (लाइव डेमो एवं कार्यप्रणाली)'
                  : 'How ManakSetu Works (Live Demo & System Architecture)'}
              </h2>
            </div>
            <p className="text-xs text-[#7A7A7A] dark:text-[#94A3B8]">
              {language === 'hi'
                ? 'लाइव स्क्रीन वॉकथ्रू वीडियो एवं संपूर्ण शून्य-भ्रम (Zero-Hallucination) अनुशंसा प्रक्रिया'
                : 'Live screen walkthrough demonstration and deterministic standards intelligence workflow'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close how it works modal"
            className="p-2 rounded-xl hover:bg-[#F2EFE9] dark:hover:bg-[#1A2E40] text-[#7A7A7A] dark:text-[#94A3B8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* ── VIDEO PLAYER SECTION ── */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F6F1E7] dark:bg-[#0D1520] border border-[#E5DDD1] dark:border-[#243647] shadow-xs space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E05A00]/15 dark:bg-[#E05A00]/25 text-[#E05A00] text-xs font-bold border border-[#E05A00]/30">
                  <span className="w-2 h-2 rounded-full bg-[#E05A00] animate-pulse" />
                  <Video className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'लाइव स्क्रीन डेमो वीडियो' : 'Live Screen Demo Video'}
                </span>
                <span className="text-[11px] font-semibold text-[#1B4965] dark:text-[#5B9CC9] bg-white dark:bg-[#1A2E40] px-2 py-0.5 rounded-md border border-[#E5DDD1] dark:border-[#2E3F4F] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#E05A00]" />
                  9:43 Min (1080p Full HD)
                </span>
              </div>
              <span className="text-xs font-semibold text-[#138808] dark:text-[#2ECC71] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {language === 'hi' ? 'पूर्ण कार्यप्रणाली प्रदर्शित' : 'Full Workflow Demonstrated'}
              </span>
            </div>

            {/* Video Container */}
            <div className="relative rounded-xl overflow-hidden bg-black shadow-lg aspect-video w-full border border-black/20">
              <video
                ref={videoRef}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
                poster="./manaksetu-video-poster.jpg"
              >
                <source src="./manaksetu-demo.mp4" type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            </div>

            {/* Video Features Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-[#475569] dark:text-[#94A3B8]">
              <div className="p-2 rounded-lg bg-white dark:bg-[#162736] border border-[#E5DDD1] dark:border-[#243647] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E05A00]" />
                <span className="truncate">{language === 'hi' ? 'अधिकारी ऑनबोर्डिंग' : 'Officer Onboarding'}</span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-[#162736] border border-[#E5DDD1] dark:border-[#243647] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B4965]" />
                <span className="truncate">{language === 'hi' ? 'टेंडर क्लॉज सर्च' : 'Tender NLP Search'}</span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-[#162736] border border-[#E5DDD1] dark:border-[#243647] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
                <span className="truncate">{language === 'hi' ? 'सक्रिय मानक शील्ड' : 'Deprecation Shield'}</span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-[#162736] border border-[#E5DDD1] dark:border-[#243647] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                <span className="truncate">{language === 'hi' ? 'क्यूसीओ व अनुपालन' : 'QCO Compliance'}</span>
              </div>
            </div>
          </div>

          {/* ── ARCHITECTURE PIPELINE SELECTOR ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4965] dark:text-[#5B9CC9] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#E05A00]" />
                {language === 'hi' ? 'सिस्टम आर्किटेक्चर एवं पाइपलाइन चरण' : 'System Architecture & Pipeline Stages'}
              </h4>
              <span className="text-[11px] text-[#7A7A7A] dark:text-[#94A3B8]">
                {language === 'hi' ? 'किसी भी चरण पर क्लिक करें' : 'Click stage to inspect'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {steps.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    activeStep === idx
                      ? 'bg-[#0F2942] dark:bg-[#1E3A5F] text-white border-[#0F2942] dark:border-[#1E3A5F] shadow-sm'
                      : 'bg-[#FBF8F3] dark:bg-[#162736] border-[#E5DDD1] dark:border-[#243647] text-[#475569] dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#1E3244]'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Stage {s.step}</div>
                  <div className="text-xs font-bold truncate mt-0.5">{s.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Stage Spotlight Card */}
          <div className="p-5 rounded-2xl bg-[#F6F1E7] dark:bg-[#162736] border border-[#E5DDD1] dark:border-[#243647] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E05A00]/10 text-[#E05A00] border border-[#E05A00]/30">
                Active Stage {steps[activeStep].step}: {steps[activeStep].badge}
              </span>
              <span className="text-xs font-semibold text-[#138808] dark:text-[#2ECC71] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {language === 'hi' ? 'शून्य-भ्रम गारंटी' : 'Zero Hallucination Guaranteed'}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#1C1C1E] dark:text-white">
              {steps[activeStep].title}
            </h3>

            <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
              {steps[activeStep].desc}
            </p>

            <div className="pt-2 border-t border-[#E5DDD1] dark:border-[#243647] flex flex-wrap gap-2">
              {steps[activeStep].highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-[#0D1520] border border-[#E5DDD1] dark:border-[#243647] text-[#1C1C1E] dark:text-[#CBD5E1] flex items-center gap-1.5 shadow-2xs"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{h}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Complete Pipeline Step-by-Step Overview */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4965] dark:text-[#5B9CC9]">
              {language === 'hi' ? 'समग्र वर्कफ़्लो विवरण' : 'Complete Pipeline Flow'}
            </h4>
            {steps.map(({ step, title, desc, badge }, idx) => (
              <div
                key={step}
                onClick={() => setActiveStep(idx)}
                className={`flex gap-3.5 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'border-[#1B4965] dark:border-[#5B9CC9] bg-white dark:bg-[#1A2E40] shadow-xs'
                    : 'border-[#E5DDD1] dark:border-[#243647] bg-white/70 dark:bg-[#162736]/70 hover:bg-white dark:hover:bg-[#162736]'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    activeStep === idx ? 'bg-[#E05A00] text-white shadow-2xs' : 'bg-[#1B4965] text-white'
                  }`}
                >
                  {step}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h5 className="text-xs font-bold text-[#1C1C1E] dark:text-white truncate">{title}</h5>
                    <span className="text-[10px] font-semibold text-[#7A7A7A] dark:text-[#94A3B8] shrink-0">{badge}</span>
                  </div>
                  <p className="text-xs text-[#7A7A7A] dark:text-[#94A3B8] leading-relaxed line-clamp-2">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
