"""Multilingual Normalization & Language Detection Service for ManakSetu

Supports:
1. English (en)
2. Hindi Devanagari (hi)
3. Hinglish / Roman Hindi (hinglish)
4. Mixed Hindi + English + Technical specs (mixed)

Preserves:
- Technical parameters (voltage, current, dimensions)
- IS standard numbers (e.g., IS 1554, IS 694, IS 2925)
- Units and material specifications
- Authoritative zero-hallucination verification
"""
import re
from typing import Dict, Any, List, Tuple

# Devanagari Unicode range
DEVANAGARI_REGEX = re.compile(r'[\u0900-\u097F]')

# Common Hinglish / Roman Hindi marker tokens
HINGLISH_MARKERS = {
    "hume", "humey", "chahiye", "chaahiye", "chahie", "hona", "wali", "wala", "wale",
    "ke", "ki", "ka", "ko", "se", "me", "mein", "par", "pe", "hai", "hain", "kya",
    "aur", "ya", "bhi", "liye", "anusar", "according", "taar", "bijli", "sariya",
    "paani", "loha", "kaise", "hoga", "zaroorat", "zaroori", "kharid", "thekedaar",
    "dastane", "chasma", "juta", "jute"
}

# Standard number patterns (English & Devanagari)
STANDARD_REGEX = re.compile(
    r'\b(?:IS|ISI|आई\s*एस|आई\.एस\.)\s*[-:/]?\s*([0-9]{2,5}(?:\s*\([Pp]art\s*[0-9A-Za-z]+\))?(?::[0-9]{4})?)\b',
    re.IGNORECASE
)

# Number extraction for IS codes directly
BARE_IS_NUMBERS = {
    "1554": "IS 1554 (Part 1):1988",
    "694": "IS 694:2010",
    "7098": "IS 7098 (Part 1):1988",
    "2925": "IS 2925:1984",
    "2745": "IS 2745:1983",
    "9562": "IS 9562:1980",
    "269": "IS 269:2015",
    "12269": "IS 12269:2013",
    "8112": "IS 8112:2013",
    "1786": "IS 1786:2008",
    "2062": "IS 2062:2011",
    "456": "IS 456:2000",
    "800": "IS 800:2007",
    "4984": "IS 4984:2016",
    "4985": "IS 4985:2000",
    "8329": "IS 8329:2000",
    "15298": "IS 15298 (Part 2):2016",
    "1989": "IS 1989 (Part 1):1986",
    "60898": "IS/IEC 60898-1:2015",
}

# Unit normalizations (Devanagari -> English)
DEVANAGARI_UNITS = [
    (re.compile(r'(\d+)\s*(?:वोल्ट|बोल्ट)', re.IGNORECASE), r'\1V'),
    (re.compile(r'(\d+)\s*(?:केवी|किलोवोल्ट)', re.IGNORECASE), r'\1kV'),
    (re.compile(r'(\d+)\s*(?:एम्पीयर|एम्प|एमपीयर)', re.IGNORECASE), r'\1A'),
    (re.compile(r'(\d+)\s*(?:मिमी|मिलीमीटर)', re.IGNORECASE), r'\1mm'),
    (re.compile(r'(\d+)\s*(?:मीटर)', re.IGNORECASE), r'\1 meter'),
    (re.compile(r'(\d+)\s*(?:ग्रेड)', re.IGNORECASE), r'\1 Grade'),
    (re.compile(r'(\d+)\s*(?:जूल)', re.IGNORECASE), r'\1 Joules'),
]

# Domain-specific phrase translation dictionary (Order: multi-word phrases first)
DOMAIN_PHRASES = [
    # Multi-word Hindi phrases
    ("तांबे के बिजली के तार", "copper conductor PVC insulated electrical wire cable 1100V"),
    ("तांबे का बिजली का तार", "copper conductor PVC insulated electrical wire cable 1100V"),
    ("बिजली के तार", "PVC insulated electrical wire cable 1100V"),
    ("बिजली का तार", "PVC insulated electrical wire cable 1100V"),
    ("तांबे के तार", "copper conductor wire cable"),
    ("तांबे का तार", "copper conductor wire cable"),
    ("सुरक्षा हेलमेट", "industrial safety helmet head protection 440V"),
    ("सुरक्षा जूते", "industrial safety footwear steel toe shoes 200J"),
    ("सुरक्षा चश्मा", "eye protector safety goggles spectacles"),
    ("सुरक्षा बेल्ट", "safety harness fall arrest belt"),
    ("एमसीबी स्विच", "miniature circuit breaker MCB electrical switch"),
    ("पानी का पाइप", "potable water supply pipe HDPE uPVC"),
    ("पीने के पानी का पाइप", "potable drinking water supply pipe HDPE"),
    ("सीमेंट 53", "ordinary portland cement 53 grade OPC"),
    ("सीमेंट 43", "ordinary portland cement 43 grade OPC"),
    ("हाईवे सरिया", "TMT high strength deformed steel rebar Fe 500D"),
    ("अर्थिंग इलेक्ट्रोड", "earthing pipe plate grounding electrode"),
    ("कान का सुरक्षा", "hearing protector ear muff"),

    # Multi-word Hinglish phrases
    ("tambe ke bijli ke taar", "copper conductor PVC insulated electrical wire cable 1100V"),
    ("bijli ke taar", "PVC insulated electrical wire cable 1100V"),
    ("bijli ka taar", "PVC insulated electrical wire cable 1100V"),
    ("tambe ke taar", "copper conductor wire cable"),
    ("tambe ka wire", "copper conductor wire cable"),
    ("tambe ka taar", "copper conductor wire cable"),
    ("copper ka wire", "copper conductor wire cable"),
    ("suraksha helmet", "industrial safety helmet head protection 440V"),
    ("safety helmet", "industrial safety helmet head protection 440V"),
    ("safety joota", "industrial safety footwear steel toe shoes"),
    ("safety joote", "industrial safety footwear steel toe shoes"),
    ("safety shoes", "industrial safety footwear steel toe shoes 200J"),
    ("paani ka pipe", "potable water supply pipe HDPE uPVC"),
    ("drinking water pipe", "potable water supply pipe HDPE"),
    ("panni ka pipe", "potable water supply pipe HDPE uPVC"),
    ("earthing electrode", "earthing pipe plate grounding electrode"),

    # Single-word Technical Hindi
    ("तांबा", "copper conductor"),
    ("तांबे", "copper conductor"),
    ("तार", "wire cable"),
    ("केबल", "power cable"),
    ("हेलमेट", "safety helmet"),
    ("दस्ताने", "industrial safety gloves"),
    ("ग्ल्व्स", "protective gloves"),
    ("जूते", "safety footwear shoes"),
    ("शूज", "safety footwear"),
    ("शूज़", "safety footwear"),
    ("चश्मा", "safety goggles eye protection"),
    ("मास्क", "respiratory protective mask FFP2"),
    ("रेस्पिरेटर", "respiratory protective device"),
    ("हार्नेस", "safety harness fall protection"),
    ("जैकेट", "high visibility warning jacket"),
    ("ट्रांसफार्मर", "distribution transformer oil immersed"),
    ("मीटर", "electric watt-hour energy meter"),
    ("स्विच", "electrical switch"),
    ("सॉकेट", "socket-outlet"),
    ("प्लग", "plug socket"),
    ("अर्थिंग", "earthing grounding"),
    ("ग्राउंडिंग", "grounding earthing"),
    ("कंड्यूट", "conduit pipe electrical"),
    ("सीमेंट", "ordinary portland cement concrete"),
    ("सरिया", "TMT steel rebar Fe 500D"),
    ("लोहा", "structural steel"),
    ("पाइप", "water pipe"),
    ("कंक्रीट", "reinforced concrete RCC"),
    ("रोड़ी", "coarse aggregate"),
    ("बजरी", "fine aggregate"),
    ("बालू", "fine aggregate sand"),
    ("रेत", "sand aggregate"),
    ("वाटरप्रूफिंग", "waterproofing bitumen membrane"),

    # Single-word Technical Hinglish
    ("taar", "wire cable"),
    ("bijli", "electrical power"),
    ("sariya", "TMT steel rebar Fe 500D"),
    ("loha", "structural steel"),
    ("dastane", "safety gloves"),
    ("joota", "safety footwear shoes"),
    ("joote", "safety footwear shoes"),
    ("chasma", "safety goggles spectacles"),

    # Intent & Conformance Phrases (Hindi)
    ("के अनुसार", "conforming to according to specification"),
    ("के मुताबिक", "conforming to according to"),
    ("के तहत", "under accordance with"),
    ("मानक", "Indian Standard"),
    ("गुणवत्ता", "quality specification"),
    ("प्रमाणन", "BIS certification"),
    ("आवश्यकता है", "requirement specification"),
    ("चाहिए", "required"),
    ("होना चाहिए", "mandatory compliance required"),
    ("आपूर्ति", "supply procurement"),
    ("अनिवार्य", "mandatory compulsory"),

    # Intent & Conformance Phrases (Hinglish)
    ("ke according", "conforming to according to"),
    ("ke anusar", "conforming to according to"),
    ("ke mutabik", "conforming to according to"),
    ("standard ke", "standard according to"),
    ("isi mark wala", "mandatory BIS ISI mark certification"),
    ("isi mark", "mandatory BIS ISI mark certification"),
    ("mandatory hona chahiye", "mandatory compliance required"),
    ("chahiye", "required"),
    ("chaahiye", "required"),
    ("chahie", "required"),
    ("hona chahiye", "mandatory requirement"),
    ("zaroorat hai", "requirement specification"),
    ("supply chahiye", "supply procurement requirement"),
    ("zaruri hai", "mandatory requirement"),
    ("zaroori hai", "mandatory requirement")
]

class MultilingualNormalizer:
    @classmethod
    def detect_language(cls, text: str) -> str:
        """Detect language category: 'hi' | 'en' | 'hinglish' | 'mixed'"""
        if not text or not text.strip():
            return "en"

        cleaned = text.strip()
        has_devanagari = bool(DEVANAGARI_REGEX.search(cleaned))

        # Words breakdown
        latin_words = re.findall(r'[a-zA-Z]+', cleaned.lower())
        total_latin = len(latin_words)

        # Check Hinglish markers
        hinglish_count = sum(1 for w in latin_words if w in HINGLISH_MARKERS)

        if has_devanagari:
            # If English/Latin words or codes accompany Devanagari (e.g. 'IS 1554', 'copper wire')
            if total_latin >= 1:
                return "mixed"
            return "hi"
        else:
            if hinglish_count >= 1:
                return "hinglish"
            return "en"

    @classmethod
    def extract_is_standards(cls, text: str) -> List[str]:
        """Extract explicit Indian Standard references from input (e.g., IS 1554, IS 694)"""
        detected = []
        if not text:
            return detected

        # Regex match
        matches = STANDARD_REGEX.findall(text)
        for num in matches:
            clean_num = num.strip()
            # Normalize to standard format
            clean_num = re.sub(r'\s+', ' ', clean_num)
            code = f"IS {clean_num}"
            if code not in detected:
                detected.append(code)

        # Check for bare standard numbers near keywords
        for bare_num, canonical_code in BARE_IS_NUMBERS.items():
            pattern = re.compile(r'\b(?:IS|standard|code|number|conforming to|ke according)?\s*' + bare_num + r'\b', re.IGNORECASE)
            if pattern.search(text) and f"IS {bare_num}" not in detected:
                detected.append(f"IS {bare_num}")

        return detected

    @classmethod
    def normalize_text(cls, raw_text: str) -> Tuple[str, str, List[str], bool]:
        """Normalize multilingual input while preserving technical parameters and IS codes.
        
        Returns:
            normalized_text (str): Clean retrieval-ready representation
            detected_language (str): 'hi' | 'en' | 'hinglish' | 'mixed'
            detected_standards (List[str]): Extracted IS standard numbers
            was_multilingual (bool): True if language is not pure English
        """
        if not raw_text:
            return "", "en", [], False

        lang = cls.detect_language(raw_text)
        was_multilingual = lang != "en"

        # 1. Extract explicit IS numbers
        detected_standards = cls.extract_is_standards(raw_text)

        working_text = raw_text

        # 2. Normalize Devanagari units to standard technical symbols
        for unit_regex, replacement in DEVANAGARI_UNITS:
            working_text = unit_regex.sub(replacement, working_text)

        # 3. Apply domain phrase replacements (Case-insensitive)
        for source_phrase, target_translation in DOMAIN_PHRASES:
            # Use regex word boundaries for Latin or direct match for Devanagari
            if re.search(r'[a-zA-Z]', source_phrase):
                pattern = re.compile(r'\b' + re.escape(source_phrase) + r'\b', re.IGNORECASE)
            else:
                pattern = re.compile(re.escape(source_phrase), re.IGNORECASE)

            if pattern.search(working_text):
                working_text = pattern.sub(f" {target_translation} ", working_text)

        # 4. Clean extra spaces
        normalized = re.sub(r'\s+', ' ', working_text).strip()

        return normalized, lang, detected_standards, was_multilingual
