"""NLP Extraction Service with Multilingual Normalization & Structured Requirement Extraction
Prepares raw user input or tender excerpts for hybrid retrieval without hallucination.
"""
import re
from typing import Dict, Any, List, Optional

# Multilingual Hindi/Hinglish to English technical domain lexicon
HINDI_DOMAIN_LEXICON = {
    # PPE & Safety
    "सुरक्षा हेलमेट": "industrial safety helmet head protection",
    "हेलमेट": "safety helmet",
    "helmat": "safety helmet",
    "सुरक्षा जूते": "industrial safety footwear steel toe shoes",
    "सेफ्टी शूज": "safety footwear steel toe shoes",
    "सेफ्टी शूज़": "safety footwear steel toe shoes",
    "सुरक्षा चश्मा": "eye protector safety goggles",
    "चश्मा": "eye protector spectacles",
    "गॉगल्स": "safety goggles",
    "मास्क": "respiratory protective mask FFP2",
    "रेस्पिरेटर": "respiratory protective device",
    "दस्ताने": "industrial protective safety gloves",
    "ग्ल्व्स": "protective gloves",
    "सुरक्षा बेल्ट": "safety harness fall arrest belt",
    "हार्नेस": "full body harness fall protection",
    "रिफ्लेक्टिव जैकेट": "high visibility warning jacket vest",
    "कान का सुरक्षा": "hearing protector ear muff",

    # Electrical & Power
    "बिजली का तार": "PVC insulated copper electrical cable wire 1100V",
    "बिजली तार": "electrical wire cable",
    "तार": "wire cable conductor",
    "केबल": "power cable insulated",
    "बिजली केबल": "electrical power cable",
    "taar": "electrical wire cable",
    "bijli": "electrical power",
    "ट्रांसफार्मर": "distribution transformer oil immersed",
    "बिजली मीटर": "AC static watt hour electricity energy meter",
    "मीटर": "electric energy meter",
    "स्विच": "electrical switch domestic fixed",
    "प्लग": "plug 3-pin 6A 16A",
    "सॉकेट": "socket-outlet 250V",
    "अर्थिंग": "earthing pipe plate grounding electrode",
    "ग्राउंडिंग": "grounding earthing electrode",
    "एलईडी": "LED luminaire lamp bulb",
    "बत्ती": "luminaire light lamp",

    # Civil & Construction
    "सीमेंट": "ordinary portland cement concrete",
    "सीमेंट 53": "ordinary portland cement 53 grade OPC",
    "सीमेंट 43": "ordinary portland cement 43 grade OPC",
    "सरिया": "TMT high strength deformed steel rebar Fe 500D",
    "लोहा": "structural steel sections plates",
    "sariya": "TMT steel rebar concrete reinforcement",
    "पानी का पाइप": "potable water supply pipe uPVC HDPE",
    "पाइप": "water supply pipe",
    "नल": "water pipe fittings",
    "कंक्रीट": "plain and reinforced concrete RCC",
    "रोड़ी": "coarse aggregate concrete",
    "बजरी": "coarse fine aggregate",
    "बालू": "fine aggregate sand M-sand",
    "रेत": "fine aggregate sand",
    "नाला पाइप": "precast concrete RCC hume pipe culvert",
    "वाटरप्रूफिंग": "waterproofing bitumen felt damp proofing"
}

# Sector indicators
SECTOR_KEYWORDS = {
    "PPE & Safety Equipment": [
        "helmet", "footwear", "shoes", "boots", "toe", "respirator", "mask", "goggle",
        "spectacle", "harness", "lanyard", "gloves", "hi-vis", "visibility", "ear-muff",
        "ear-protector", "firefighter", "ppe", "protective", "chinstrap", "fall arrest",
        "2925", "15298"
    ],
    "Electrical & Power": [
        "cable", "wire", "conductor", "copper", "aluminium", "pvc insulated", "xlpe",
        "mcb", "rccb", "mccb", "circuit breaker", "transformer", "kva", "1100v", "11kv",
        "33kv", "plug", "socket", "luminaire", "led", "energy meter", "smart meter",
        "earthing", "grounding", "switchgear", "conduit", "watt-hour", "inverter",
        "1554", "694", "7098"
    ],
    "Civil & Construction": [
        "cement", "opc", "ppc", "concrete", "rebar", "tmt", "fe 500d", "fe 550d",
        "structural steel", "is 2062", "aggregate", "sand", "m-sand", "pipe", "upvc",
        "hdpe", "ductile iron", "di pipe", "rmc", "culvert", "hume pipe", "blocks",
        "masonry", "waterproofing", "bitumen", "seismic", "earthquake",
        "1786", "269", "12269", "4984"
    ]
}

# Technical parameter regex patterns
PARAMETER_PATTERNS = {
    "voltage": r"\b(\d{2,4}\s*(?:v|kv|volt|kilovolt))\b",
    "current": r"\b(\d{1,4}\s*(?:a|amp|ampere|ka))\b",
    "impact_energy": r"\b(\d{2,4}\s*(?:j|joule|kn))\b",
    "steel_grade": r"\b(fe\s*(?:415|500|500d|550|550d|600)|e250|e350|e450)\b",
    "cement_grade": r"\b(opc\s*(?:33|43|53)|ppc|43\s*grade|53\s*grade)\b",
    "pipe_class": r"\b(k7|k9|np1|np2|np3|np4|pn\s*\d{1,2}|pe\s*100|pe\s*80)\b",
    "frequency": r"\b(50\s*hz|60\s*hz)\b",
    "pressure": r"\b(\d+(?:\.\d+)?\s*(?:kgf/cm2|mpa|bar|psi))\b",
    "material": r"\b(copper|aluminium|polyvinyl chloride|pvc|xlpe|hdpe|upvc|ductile iron|polycarbonate|rubber|leather|bitumen)\b",
    "safety_property": r"\b(flame retardant|frls|fire resistant|anti-static|slip resistant|earthquake resistant|dielectric|waterproof|oil resistant)\b"
}

from app.services.multilingual_normalizer import MultilingualNormalizer

class NLPExtractorService:
    @classmethod
    def normalize_multilingual_input(cls, text: str) -> tuple[str, bool]:
        """Detect and translate Hindi/Hinglish domain terms to standardized English terms"""
        if not text:
            return "", False
        normalized_text, lang, detected_standards, was_multilingual = MultilingualNormalizer.normalize_text(text)
        return normalized_text, was_multilingual

    @classmethod
    def extract_structured_requirements(cls, raw_input: str) -> Dict[str, Any]:
        """Extract product type, technical parameters, sector, detected standards and normalized search query"""
        normalized_text, lang, detected_standards, was_multilingual = MultilingualNormalizer.normalize_text(raw_input)
        text_lower = normalized_text.lower()

        # 1. Infer Sector
        sector_scores = {sector: 0 for sector in SECTOR_KEYWORDS}
        for sector, kws in SECTOR_KEYWORDS.items():
            for kw in kws:
                if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
                    sector_scores[sector] += 1

        inferred_sector = max(sector_scores, key=sector_scores.get)
        if sector_scores[inferred_sector] == 0:
            inferred_sector = None

        # 2. Extract Technical Parameters
        extracted_params: Dict[str, List[str]] = {}
        for param_name, pattern in PARAMETER_PATTERNS.items():
            matches = re.findall(pattern, normalized_text, re.IGNORECASE)
            if matches:
                # Deduplicate while preserving order
                unique_matches = list(dict.fromkeys([m.strip() for m in matches]))
                extracted_params[param_name] = unique_matches

        # 3. Infer Product Name / Title
        # Extract the first sentence or prominent noun phrase
        first_clause = re.split(r'[.,;\n]', normalized_text)[0].strip()
        product_type = cls._infer_product_type(first_clause, text_lower)

        # 4. Generate Normalized Keywords for Search
        # Filter stopwords
        stopwords = {
            "a", "an", "the", "and", "or", "for", "with", "of", "to", "in", "on",
            "at", "by", "as", "is", "are", "be", "this", "that", "shall", "must",
            "required", "supply", "procurement", "specification", "tender", "bid",
            "from", "into", "through", "under", "over", "quality", "type", "types",
            "item", "items", "work", "works", "contractor", "such", "all", "any",
            "used", "using", "use", "purposes", "general", "other", "part", "parts"
        }
        words = re.findall(r'[a-zA-Z0-9]+(?:[-/][a-zA-Z0-9]+)*', normalized_text)
        keywords = [w for w in words if w.lower() not in stopwords and len(w) > 1]
        unique_kws = list(dict.fromkeys(keywords))[:15]

        # 5. Build clean search query
        # Focus on detected standards + product type + extracted key parameters
        param_values = []
        for v in extracted_params.values():
            param_values.extend(v)
        standards_prefix = " ".join(detected_standards) if detected_standards else ""
        enhanced_search_query = f"{standards_prefix} {product_type} {' '.join(param_values)} {normalized_text[:150]}"

        return {
            "original_input": raw_input,
            "normalized_text": normalized_text,
            "detected_language": lang,
            "detected_standards": detected_standards,
            "was_multilingual": was_multilingual,
            "inferred_sector": inferred_sector,
            "product_type": product_type,
            "technical_parameters": extracted_params,
            "keywords": unique_kws,
            "search_query": enhanced_search_query.strip(),
            "summary": f"Procurement requirement for {product_type} in {inferred_sector or 'General'} sector."
        }

    @classmethod
    def _infer_product_type(cls, clause: str, text_lower: str) -> str:
        """Infer canonical product category from text"""
        # Specific known product mappings
        if "helmet" in text_lower or "hard hat" in text_lower:
            return "Industrial Safety Helmets"
        if "footwear" in text_lower or "shoes" in text_lower or "boots" in text_lower:
            return "Safety Footwear / Shoes"
        if "wire" in text_lower or "cable" in text_lower or "1554" in text_lower or "694" in text_lower:
            if "xlpe" in text_lower or "ht" in text_lower or "11kv" in text_lower or "33kv" in text_lower or "7098" in text_lower:
                return "XLPE Power Cables"
            return "PVC Insulated Electric Cables"
        if "rebar" in text_lower or "tmt" in text_lower or "sariya" in text_lower or "1786" in text_lower:
            return "TMT Steel Reinforcement Bars"
        if "helmet" in text_lower or "hard hat" in text_lower or "2925" in text_lower:
            return "Industrial Safety Helmets"
        if "footwear" in text_lower or "shoes" in text_lower or "boots" in text_lower or "15298" in text_lower:
            return "Safety Footwear / Shoes"
        if "cement" in text_lower or "269" in text_lower or "12269" in text_lower:
            if "53" in text_lower:
                return "Ordinary Portland Cement (53 Grade)"
            if "43" in text_lower:
                return "Ordinary Portland Cement (43 Grade)"
            if "ppc" in text_lower or "fly ash" in text_lower:
                return "Portland Pozzolana Cement (PPC)"
            return "Portland Cement"
        if "pipe" in text_lower:
            if "upvc" in text_lower:
                return "uPVC Potable Water Pipes"
            if "hdpe" in text_lower:
                return "HDPE Water Supply Pipes"
            if "ductile" in text_lower or "di pipe" in text_lower:
                return "Ductile Iron (DI) Pipes"
            if "culvert" in text_lower or "hume" in text_lower or "rcc pipe" in text_lower:
                return "Precast Concrete Culvert Pipes"
            return "Water Supply & Drainage Pipes"
        if "mcb" in text_lower or "circuit breaker" in text_lower:
            if "mccb" in text_lower:
                return "Moulded Case Circuit Breakers (MCCB)"
            if "rccb" in text_lower or "earth leakage" in text_lower:
                return "Residual Current Circuit Breakers (RCCB)"
            return "Miniature Circuit Breakers (MCB)"
        if "transformer" in text_lower:
            return "Oil Immersed Distribution Transformers"
        if "meter" in text_lower:
            if "smart" in text_lower:
                return "Smart Electricity Meters"
            return "AC Static Energy Meters"
        if "led" in text_lower or "luminaire" in text_lower:
            return "LED Luminaires & Lamps"
        if "earthing" in text_lower or "grounding" in text_lower:
            return "Electrical Earthing System"

        # Default to sanitized clause
        return clause[:50].strip() or "General Engineering Item"
