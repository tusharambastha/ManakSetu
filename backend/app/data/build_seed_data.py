"""Curated Real Indian Standards (BIS) Seed Data Generator
Covers 3 core procurement sectors:
1. Personal Protective Equipment (PPE) & Industrial Safety
2. Electrical Fittings, Switchgear & Cables
3. Civil, Piping & Construction Materials
"""
import json
from pathlib import Path

DATA_FILE = Path(__file__).parent / "standards_dataset.json"

STANDARDS_DATA = [
    # =========================================================================
    # SECTOR 1: PPE & INDUSTRIAL SAFETY EQUIPMENT
    # =========================================================================
    {
        "standard_no": "IS 2925:1984",
        "title": "Specification for Industrial Safety Helmets",
        "sector": "PPE & Safety Equipment",
        "scope": "Covers requirements for industrial safety helmets providing protection against falling objects, mechanical impact, penetration, flame resistance, and electrical insulation up to 440 V for workers in construction, mining, shipbuilding, and heavy industry.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 2925:1984 (Reaffirmed 2020) with Amendment 1-3",
        "keywords": [
            "safety helmet", "hard hat", "head protection", "industrial helmet",
            "construction helmet", "impact absorption", "penetration resistance",
            "chinstrap", "harness", "electrical insulation", "PPE"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/1258",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Personal Protective Equipment (Quality Control) Order",
            "notifying_ministry": "Ministry of Commerce and Industry / DPIIT",
            "details": "Mandatory ISI mark under BIS Scheme-I for manufacture, import and supply for hazardous worksites."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "1988", "details": "Modification of shock absorption testing criteria and drop tower specifications."},
            {"amendment_no": "Amendment No. 2", "issue_date": "1993", "details": "Specification on ventilation holes and crown clearance."},
            {"amendment_no": "Amendment No. 3", "issue_date": "2000", "details": "Flammability and electrical insulation resistance test updates."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 9873 (Part 1)", "target_title": "Safety of Toys / Mechanical Impact Test Methods", "relation_type": "test_method", "description": "Drop impact and mechanical energy measurement procedures"},
            {"target_standard_no": "IS 2314", "target_title": "Specification for Hard Hat Chinstraps", "relation_type": "normative_reference", "description": "Tensile breaking strength and buckle release requirements for chinstraps"},
            {"target_standard_no": "IS 16890:2018", "target_title": "Helmets for Firefighters - Structural Firefighting", "relation_type": "related_product", "description": "High-temperature radiant heat resistant helmets for firefighting teams"},
            {"target_standard_no": "IS 4151:2015", "target_title": "Protective Helmets for Two-Wheeler Motorcyclists", "relation_type": "related_product", "description": "Vehicular crash protective helmets (distinct from industrial falling-object helmets)"},
            {"target_standard_no": "IS 5983:1980", "target_title": "Eye Protectors", "relation_type": "safety", "description": "Normative eye and face shield integration for head-gear assemblies"}
        ]
    },
    {
        "standard_no": "IS 15298 (Part 2):2016",
        "title": "Personal Protective Equipment - Part 2: Safety Footwear",
        "sector": "PPE & Safety Equipment",
        "scope": "Specifies basic and additional (optional) requirements for safety footwear used for general industrial purposes, including mechanical hazards, slip resistance, steel toe-cap impact resistance of 200 Joules, penetration-resistant midsoles, and anti-static properties.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 15298 (Part 2):2016 / ISO 20345:2011",
        "keywords": [
            "safety footwear", "safety shoes", "safety boots", "steel toe", "toe cap",
            "impact 200J", "anti static", "oil resistant", "slip resistance",
            "penetration resistant midsole", "leather shoes", "industrial footwear"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/28954",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Footwear made from Leather and other materials (Quality Control) Order, 2020",
            "notifying_ministry": "DPIIT, Ministry of Commerce and Industry",
            "details": "Mandatory ISI Mark certification under Scheme-I of BIS Act, 2016. No uncertified industrial safety footwear may be procured."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2018", "details": "Incorporation of SRA/SRB/SRC slip resistance classification on ceramic tile and glycerol steel floor."},
            {"amendment_no": "Amendment No. 2", "issue_date": "2021", "details": "Clarification on dielectric sole resistance testing parameters."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 15298 (Part 1):2011", "target_title": "Personal Protective Equipment - Test Methods for Footwear", "relation_type": "test_method", "description": "Normative test methods for toe impact (200J), compression resistance (15kN), outsole flex and tear strength"},
            {"target_standard_no": "IS 15298 (Part 3):2019", "target_title": "Personal Protective Equipment - Part 3: Protective Footwear (100J impact)", "relation_type": "related_product", "description": "Protective footwear standard for lower impact requirement of 100 Joules"},
            {"target_standard_no": "IS 15298 (Part 4):2017", "target_title": "Personal Protective Equipment - Part 4: Occupational Footwear", "relation_type": "related_product", "description": "Footwear without safety toe-caps, designed for slip resistance and anti-fatigue"},
            {"target_standard_no": "IS 5852:2004", "target_title": "Specification for Protective Steel Toe Caps for Footwear", "relation_type": "normative_reference", "description": "Dimensions, hardness, and corrosion resistance of metallic toe-caps"}
        ]
    },
    {
        "standard_no": "IS 1989 (Part 1):1986",
        "title": "Leather Safety Boots and Shoes - Part 1: For Miners",
        "sector": "PPE & Safety Equipment",
        "scope": "Legacy Indian Standard covering safety leather boots and ankle shoes specifically for mining operations.",
        "status": "superseded",
        "superseded_by": "IS 15298 (Part 2):2016",
        "current_version": "Superseded by IS 15298 (Part 2):2016",
        "keywords": [
            "leather safety boots", "mining boots", "ankle boots", "miners footwear", "superseded standard"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/3412",
        "certification": {
            "scheme": "None",
            "is_mandatory": False,
            "order_name": None,
            "notifying_ministry": None,
            "details": "Superseded standard. Procurement tenders must reference IS 15298 Part 2."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 15298 (Part 2):2016", "target_title": "Safety Footwear Specification", "relation_type": "related_product", "description": "Direct active replacement standard adhering to harmonized ISO 20345 specs"}
        ]
    },
    {
        "standard_no": "IS 9473:2002",
        "title": "Respiratory Protective Devices - Filtering Half Masks to Protect Against Particles",
        "sector": "PPE & Safety Equipment",
        "scope": "Specifies minimum requirements for particle-filtering half masks (FFP1, FFP2, FFP3 class respirators) for protection against non-toxic, low-to-average toxicity, and highly toxic solid and liquid aerosols. Covers penetration of filter material, inward leakage, breathing resistance, and biocompatibility.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 9473:2002 (Reaffirmed 2019)",
        "keywords": [
            "respiratory protection", "mask", "N95", "FFP2", "FFP3", "filtering half mask",
            "particulate respirator", "aerosol filtration", "breathing resistance",
            "dust mask", "inward leakage", "pollution mask"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/4502",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Respiratory Protective Devices (Quality Control) Order",
            "notifying_ministry": "Ministry of Commerce and Industry / DPIIT",
            "details": "Mandatory ISI mark under BIS Scheme-I for filtering half masks and industrial respirators."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2006", "details": "Testing parameters with paraffin oil aerosol and sodium chloride aerosol."},
            {"amendment_no": "Amendment No. 2", "issue_date": "2020", "details": "Re-usable (R) vs single shift (NR) classification protocol."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 8347:1977", "target_title": "Glossary of Terms Relating to Respiratory Protective Devices", "relation_type": "terminology", "description": "Definitions for respiratory protection terms and hazard classifications"},
            {"target_standard_no": "IS 15321:2003", "target_title": "Respiratory Protective Devices - Full Face Masks", "relation_type": "related_product", "description": "Full face respirators providing both respiratory and facial/eye coverage"},
            {"target_standard_no": "IS 15322:2003", "target_title": "Respiratory Protective Devices - Half Masks and Quarter Masks", "relation_type": "related_product", "description": "Replaceable elastomeric half mask bodies fitted with external particulate/gas filters"},
            {"target_standard_no": "IS 9623:2008", "target_title": "Code of Practice for Selection, Operation and Maintenance of Respiratory Protective Devices", "relation_type": "installation", "description": "Guidelines for fit testing, workplace protection factor calculation, and maintenance"}
        ]
    },
    {
        "standard_no": "IS 5983:1980",
        "title": "Specification for Eye-Protectors",
        "sector": "PPE & Safety Equipment",
        "scope": "Covers requirements for safety goggles, spectacles, face shields, and eye protectors intended to protect against optical radiation, flying particles, chemical splashes, molten metal splashes, and mechanical impacts in industrial environments.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 5983:1980 (Reaffirmed 2021) with Amendments 1-2",
        "keywords": [
            "eye protector", "safety goggles", "safety glasses", "face shield",
            "polycarbonate lens", "impact resistance", "optical clarity", "chemical splash",
            "welding goggles", "anti-fog", "UV protection"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/3180",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Personal Protective Equipment - Eye and Face Protection (QCO)",
            "notifying_ministry": "DPIIT",
            "details": "Mandatory BIS certification for industrial safety eyewear and eye protectors."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "1984", "details": "Optical power tolerance limits and refractive error tolerances."},
            {"amendment_no": "Amendment No. 2", "issue_date": "2002", "details": "High velocity particle impact ballistics test update (steel ball 6mm at 45m/s)."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 7524 (Part 1):1979", "target_title": "Methods of Test for Eye-Protectors - Non-Optical Tests", "relation_type": "test_method", "description": "Normative test methods for mechanical impact, thermal stability, and corrosion"},
            {"target_standard_no": "IS 8521 (Part 1):1977", "target_title": "Industrial Face Shields - With Plastic Visor", "relation_type": "related_product", "description": "Full face plastic visors for chemical splashes and grinding sparks"},
            {"target_standard_no": "IS 1179:1967", "target_title": "Specification for Equipment for Eye and Face Protection During Welding", "relation_type": "safety", "description": "Welding shields, filters, and radiation absorbing lenses"}
        ]
    },
    {
        "standard_no": "IS 3521 (Part 1):1999",
        "title": "Industrial Safety Belts and Harnesses - Part 1: Full Body Harness",
        "sector": "PPE & Safety Equipment",
        "scope": "Specifies requirements, test methods, marking and user instructions for full body harnesses used as fall arrest components when working at heights, telecommunication towers, overhead electric lines, and structural steel erection.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 3521 (Part 1):1999 (Reaffirmed 2020)",
        "keywords": [
            "full body harness", "safety harness", "safety belt", "working at height",
            "fall arrest", "fall protection", "lanyard", "d-ring", "dorsal attachment",
            "webbing harness", "scaffolding safety"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2143",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Personal Fall Protection Equipment (Quality Control) Order",
            "notifying_ministry": "DPIIT",
            "details": "Mandatory ISI marking for fall arrest harnesses and lifelines used in industrial sites."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2005", "details": "Dynamic drop test with 100 kg torso dummy and impact deceleration limits (max 6 kN)."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 3521 (Part 2):2002", "target_title": "Industrial Safety Belts and Harnesses - Part 2: Work Positioning Belts", "relation_type": "related_product", "description": "Belts and lanyards for work restraint and pole-climbing positioning"},
            {"target_standard_no": "IS 17354:2020", "target_title": "Personal Fall Protection Equipment - Guided Type Fall Arresters", "relation_type": "normative_reference", "description": "Fall arresters including a rigid or flexible anchor line"},
            {"target_standard_no": "IS 4910 (Part 1)", "target_title": "Methods of Test for Synthetic Webbing Straps", "relation_type": "test_method", "description": "Tensile strength and elongation tests for polyamide and polyester webbing"}
        ]
    },
    {
        "standard_no": "IS 6994 (Part 1):1973",
        "title": "Specification for Industrial Safety Gloves - Part 1: Leather and Cotton Gloves",
        "sector": "PPE & Safety Equipment",
        "scope": "Prescribes requirements for protective industrial gloves made from leather, split leather, and cotton fabric designed to protect hands against mechanical abrasions, cuts, puncture, friction, and mild burns during industrial handling.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 6994 (Part 1):1973 (Reaffirmed 2021)",
        "keywords": [
            "safety gloves", "industrial gloves", "leather gloves", "cut resistance",
            "abrasion resistance", "hand protection", "welding gloves", "work gloves"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/3982",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Protective Gloves (Quality Control) Order",
            "notifying_ministry": "DPIIT",
            "details": "Mandatory ISI mark for industrial protective gloves."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "1981", "details": "Stitching thread seam strength and sizing measurements."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 4770:1991", "target_title": "Rubber Gloves for Electrical Purposes", "relation_type": "safety", "description": "Dielectric insulating gloves for live electrical working (classes 00 to 4)"},
            {"target_standard_no": "IS 15071:2001", "target_title": "Gloves for Protection Against Chemicals and Micro-organisms", "relation_type": "related_product", "description": "Chemical permeation and breakthrough resistance requirements"}
        ]
    },
    {
        "standard_no": "IS 4770:1991",
        "title": "Rubber Gloves for Electrical Purposes - Specification",
        "sector": "PPE & Safety Equipment",
        "scope": "Covers requirements for insulating gloves made of natural rubber or elastomer for protection of electrical workers against electric shock during live electrical line maintenance up to 36 kV AC.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 4770:1991 (Reaffirmed 2020)",
        "keywords": [
            "electrical gloves", "insulating gloves", "rubber gloves", "high voltage",
            "dielectric strength", "electrician PPE", "proof voltage", "breakdown voltage"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2641",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Electrical Equipment Safety QCO",
            "notifying_ministry": "Ministry of Power / DPIIT",
            "details": "Mandatory ISI certification for all electrical insulating hand-wear."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "1997", "details": "Mechanical puncture resistance and ozone ageing exposure test protocol."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 13774:1993", "target_title": "Specification for Insulating Sleeves for Electrical Work", "relation_type": "related_product", "description": "Elastomeric arm and shoulder insulating sleeves for electrical technicians"},
            {"target_standard_no": "IS 694:2010", "target_title": "PVC Insulated Cables", "relation_type": "safety", "description": "Cable insulation voltage coordination"}
        ]
    },
    {
        "standard_no": "IS 15809:2017",
        "title": "High Visibility Warning Clothes - Specification",
        "sector": "PPE & Safety Equipment",
        "scope": "Specifies requirements for high visibility clothing capable of signaling the user's presence visually in all light conditions and under illumination by vehicle headlights in the dark. Defines fluorescent background and retroreflective band surface areas.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 15809:2017 (ISO 20471:2013)",
        "keywords": [
            "high visibility jacket", "reflective jacket", "safety vest", "hi-vis",
            "retroreflective tape", "fluorescent fabric", "road safety", "traffic warden",
            "construction vest", "night visibility"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/30114",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": False,
            "order_name": "MoRTH High Visibility Apparel Specifications for Road Workers",
            "notifying_ministry": "Ministry of Road Transport and Highways",
            "details": "Mandatory for highway construction tenders, NHAI and municipal corporation workforce contracts."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 15298 (Part 2):2016", "target_title": "Safety Footwear", "relation_type": "safety", "description": "Combined PPE ensemble for roadway workers"},
            {"target_standard_no": "IS 2925:1984", "target_title": "Industrial Safety Helmets", "relation_type": "safety", "description": "Protective helmet integration for traffic and highway construction crews"}
        ]
    },
    {
        "standard_no": "IS 9167:1979",
        "title": "Specification for Ear-Protectors",
        "sector": "PPE & Safety Equipment",
        "scope": "Prescribes requirements for ear-muffs and ear-plugs designed to provide hearing protection in environments with high noise exposure above 85 dBA. Covers sound attenuation over standard octave bands from 125 Hz to 8000 Hz.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 9167:1979 (Reaffirmed 2021)",
        "keywords": [
            "ear protector", "ear muff", "ear plug", "hearing protection", "noise attenuation",
            "decibel reduction", "industrial noise", "audiometric safety"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/4123",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Personal Protective Equipment Hearing Protectors QCO",
            "notifying_ministry": "DPIIT",
            "details": "Mandatory ISI mark for ear-muffs and hearing protectors."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "1985", "details": "Testing method for insertion loss and headband clamping force stability."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 6229:1980", "target_title": "Method for Measurement of Sound Attenuation of Hearing Protectors", "relation_type": "test_method", "description": "Subjective and objective insertion loss measurement in diffuse acoustic fields"}
        ]
    },

    # =========================================================================
    # SECTOR 2: ELECTRICAL FITTINGS, SWITCHGEAR, CABLES & LIGHTING
    # =========================================================================
    {
        "standard_no": "IS 694:2010",
        "title": "Polyvinyl Chloride Insulated Unsheathed and Sheathed Cables/Cords with Rigid and Flexible Conductor for Working Voltages up to and Including 450/750 V",
        "sector": "Electrical & Power",
        "scope": "Covers requirements and test methods for single and multicore PVC insulated cables and flexible cords for electric power, lighting, internal wiring of domestic appliances, and control panels with rated voltages up to and including 1100 V (450/750 V AC).",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 694:2010 (Fifth Revision, Reaffirmed 2020)",
        "keywords": [
            "PVC cable", "copper wire", "electrical wire", "building wire", "flexible cable",
            "house wiring", "single core cable", "multicore flexible cable", "1100V",
            "flame retardant", "FR wire", "FRLS cable", "conductor resistance"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/420",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Electrical Wires and Cables (Quality Control) Order",
            "notifying_ministry": "Ministry of Commerce and Industry / DPIIT",
            "details": "Mandatory ISI certification mark under Scheme-I. No building wire may be marketed or procured without IS 694 mark."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2013", "details": "Inclusion of halogen-free flame retardant compounds and oxygen index test."},
            {"amendment_no": "Amendment No. 2", "issue_date": "2016", "details": "Specifications for flexible conductor class 5 copper stranding tolerances."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 8130:2013", "target_title": "Conductors for Insulated Electric Cables and Flexible Cords", "relation_type": "normative_reference", "description": "Standard copper and aluminium conductor sizes, material purity, and resistance limits"},
            {"target_standard_no": "IS 5831:1984", "target_title": "PVC Insulation and Sheath of Electric Cables", "relation_type": "normative_reference", "description": "Formulation specifications for Type A, C, and ST1/ST2 PVC insulation and sheathing"},
            {"target_standard_no": "IS 10810 (Series)", "target_title": "Methods of Test for Cables", "relation_type": "test_method", "description": "Spark test, insulation resistance, flame retardance, and aging tests"},
            {"target_standard_no": "IS 7098 (Part 1):1988", "target_title": "XLPE Insulated Electric Cables for Working Voltages up to 1100V", "relation_type": "related_product", "description": "High current carrying capacity crosslinked polyethylene cable alternative"},
            {"target_standard_no": "IS 9537 (Part 3):1983", "target_title": "Conduits for Electrical Installations - Rigid Plain PVC", "relation_type": "installation", "description": "Protective conduits for routing IS 694 building wires"}
        ]
    },
    {
        "standard_no": "IS 7098 (Part 1):1988",
        "title": "Cross-linked Polyethylene Insulated Thermoplastic Sheathed Cables - Part 1: For Working Voltages up to and Including 1100 V",
        "sector": "Electrical & Power",
        "scope": "Covers requirements and test methods for single, twin, three, four-core and multicore cross-linked polyethylene (XLPE) insulated and PVC sheathed armoured and unarmoured power and control cables for utility distribution up to 1100 V AC.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 7098 (Part 1):1988 (Reaffirmed 2020)",
        "keywords": [
            "XLPE cable", "armoured cable", "power cable", "underground cable",
            "1.1 kV cable", "aluminium conductor", "crosslinked polyethylene",
            "galvanised steel armour", "utility cable", "distribution cable"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/4042",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Cables (Quality Control) Order",
            "notifying_ministry": "Ministry of Power / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I for all LT power distribution cables."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "1991", "details": "Armour wire and strip dimensions and galvanizing coating weight."},
            {"amendment_no": "Amendment No. 2", "issue_date": "1997", "details": "Hot set test for degree of crosslinking in XLPE matrix."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 7098 (Part 2):2011", "target_title": "XLPE Insulated Cables for Working Voltages from 3.3 kV up to 33 kV", "relation_type": "related_product", "description": "Medium and high voltage HT underground distribution cables"},
            {"target_standard_no": "IS 3975:1999", "target_title": "Low Carbon Galvanized Steel Wires, Formed Wires and Tapes for Armouring of Cables", "relation_type": "normative_reference", "description": "Tensile strength and zinc coating standards for cable armouring"},
            {"target_standard_no": "IS 10810 (Part 30):1984", "target_title": "Methods of Test for Cables - Part 30: Hot Set Test", "relation_type": "test_method", "description": "Verification of thermal elongation and permanent set for XLPE"}
        ]
    },
    {
        "standard_no": "IS 1554 (Part 1):1988",
        "title": "PVC Insulated (Heavy Duty) Electric Cables - Part 1: For Working Voltages up to and Including 1100 V",
        "sector": "Electrical & Power",
        "scope": "Legacy specification for PVC heavy duty power cables up to 1100V, largely replaced in modern high-load and utility distribution tenders by XLPE cables under IS 7098 (Part 1).",
        "status": "superseded",
        "superseded_by": "IS 7098 (Part 1):1988",
        "current_version": "Superseded by IS 7098 (Part 1) for higher thermal rating applications",
        "keywords": [
            "PVC heavy duty cable", "power cable", "1100V PVC cable", "superseded"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/882",
        "certification": {
            "scheme": "None",
            "is_mandatory": False,
            "order_name": None,
            "notifying_ministry": None,
            "details": "Superseded for modern heavy-duty distribution tenders; IS 7098 Part 1 recommended for continuous 90 deg C conductor operation."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 7098 (Part 1):1988", "target_title": "XLPE Insulated Power Cables up to 1100 V", "relation_type": "related_product", "description": "Recommended superior active standard offering 90C thermal rating vs 70C for PVC"}
        ]
    },
    {
        "standard_no": "IS/IEC 60898-1:2015",
        "title": "Electrical Accessories - Circuit-Breakers for Overcurrent Protection for Household and Similar Installations - Part 1: Circuit-Breakers for AC Operation (MCB)",
        "sector": "Electrical & Power",
        "scope": "Applies to AC air-break miniature circuit-breakers (MCBs) for operation at 50 Hz or 60 Hz, rated voltage not exceeding 440 V (phase to phase), rated current not exceeding 125 A, and rated short-circuit capacity not exceeding 25 000 A (typical 6kA and 10kA).",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS/IEC 60898-1:2015 (Reaffirmed 2020)",
        "keywords": [
            "MCB", "circuit breaker", "miniature circuit breaker", "overcurrent protection",
            "short circuit protection", "distribution board", "tripping curve",
            "B curve", "C curve", "D curve", "10kA breaker", "switchgear"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/27854",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Low-Voltage Switchgear and Controlgear (Quality Control) Order",
            "notifying_ministry": "Ministry of Heavy Industries / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I for all MCBs sold or procured in India."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2018", "details": "Harmonization with IEC 60898-1 Ed. 2.0 temperature-rise and endurance cycle limits."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 12640 (Part 1):2016", "target_title": "Residual Current Operated Circuit Breakers (RCCBs)", "relation_type": "safety", "description": "Normative earth leakage and shock protection companion breaker"},
            {"target_standard_no": "IS/IEC 60947-2:2016", "target_title": "Low-Voltage Switchgear and Controlgear - Part 2: Circuit-Breakers (MCCB)", "relation_type": "related_product", "description": "Industrial Moulded Case Circuit Breakers (MCCB) for currents exceeding 125A"},
            {"target_standard_no": "IS 13032:1991", "target_title": "Miniature Circuit Breaker Boards for Voltages up to 1000 V AC", "relation_type": "installation", "description": "Enclosures and distribution boards for mounting MCBs"}
        ]
    },
    {
        "standard_no": "IS 12640 (Part 1):2016",
        "title": "Residual Current Operated Circuit-Breakers Without Integral Overcurrent Protection for Household and Similar Uses (RCCBs) - Part 1: General Rules",
        "sector": "Electrical & Power",
        "scope": "Applies to residual current operated circuit-breakers functionally independent of, or functionally dependent on, line voltage, for rated voltages not exceeding 440 V AC and rated currents not exceeding 125 A, primarily intended for protection against electric shock hazard (30 mA) and fire hazard (100 mA/300 mA).",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 12640 (Part 1):2016 / IEC 61008-1:2012",
        "keywords": [
            "RCCB", "ELCB", "earth leakage circuit breaker", "residual current",
            "shock protection", "30mA RCCB", "human safety", "fire protection 300mA",
            "electrical safety", "switchgear"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/28412",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Low-Voltage Switchgear Safety QCO",
            "notifying_ministry": "Ministry of Power / Central Electricity Authority (CEA)",
            "details": "Mandatory under CEA Regulations and BIS Scheme-I for all electrical service installations."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS/IEC 60898-1:2015", "target_title": "Miniature Circuit Breakers (MCB)", "relation_type": "normative_reference", "description": "Upstream overcurrent backup protection required for RCCBs"},
            {"target_standard_no": "IS 12640 (Part 2):2016", "target_title": "Residual Current Operated Circuit-Breakers with Integral Overcurrent Protection (RCBO)", "relation_type": "related_product", "description": "Combined RCCB + MCB unit protecting against shock, overload, and short-circuit"},
            {"target_standard_no": "IS 732:2019", "target_title": "Code of Practice for Electrical Wiring Installations", "relation_type": "installation", "description": "National Electrical Code wiring guidelines requiring 30mA residual current protection"}
        ]
    },
    {
        "standard_no": "IS 1180 (Part 1):2014",
        "title": "Outdoor Type Oil Immersed Distribution Transformers up to and Including 2 500 kVA, 33 kV - Specification - Part 1: Mineral Oil Immersed",
        "sector": "Electrical & Power",
        "scope": "Specifies requirements for outdoor three-phase 50 Hz mineral oil immersed distribution transformers up to 2500 kVA for primary nominal system voltages up to and including 33 kV. Mandates maximum permissible total losses at 50% and 100% loading for Energy Efficiency Level 1, 2, and 3 (BEE 3, 4, 5 star).",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 1180 (Part 1):2014 (Fourth Revision, Reaffirmed 2021)",
        "keywords": [
            "distribution transformer", "oil transformer", "transformer 2500kVA",
            "11kV transformer", "33kV transformer", "BEE star rating", "loss levels",
            "copper winding", "aluminium winding", "step down transformer", "substation"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/26451",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Distribution Transformers (Quality Control) Order",
            "notifying_ministry": "Ministry of Power / DPIIT / BEE",
            "details": "Mandatory ISI mark and Bureau of Energy Efficiency (BEE) Standards & Labeling Star Label."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2016", "details": "Revised total loss limits aligned with BEE Star Levels 1 to 3."},
            {"amendment_no": "Amendment No. 2", "issue_date": "2019", "details": "Short circuit withstand thermal and dynamic mechanical calculation rules."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 2026 (Part 1):2011", "target_title": "Power Transformers - Part 1: General", "relation_type": "normative_reference", "description": "Foundational power transformer terminology, temperature rise, and rating definitions"},
            {"target_standard_no": "IS 335:2018", "target_title": "New Insulating Oils - Specification", "relation_type": "normative_reference", "description": "Dielectric mineral insulating transformer oil breakdown voltage and moisture limits"},
            {"target_standard_no": "IS 10028 (Part 2):1981", "target_title": "Code of Practice for Selection, Installation and Maintenance of Transformers", "relation_type": "installation", "description": "Plinth mounting, earthing, lightning arrestor protection, and breather maintenance"}
        ]
    },
    {
        "standard_no": "IS 1293:2019",
        "title": "Plugs and Socket-Outlets for Household and Similar Purposes of Rated Voltage up to and Including 250 V and Rated Current up to and Including 16 A - Specification",
        "sector": "Electrical & Power",
        "scope": "Applies to plugs and fixed or portable socket-outlets for AC only, with a rated voltage not exceeding 250 V and rated current up to and including 16 A (6A and 16A standard Indian 3-pin configuration), intended for household and similar internal or external electrical installations.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 1293:2019 (Fifth Revision)",
        "keywords": [
            "plug", "socket", "power outlet", "16A socket", "6A socket", "3 pin plug",
            "switch socket combined", "shuttered socket", "earth pin", "electrical fitting"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/31045",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Plugs and Socket-Outlets and Alternating Current Direct Connected Static Prepayment Electricity Meters (Quality Control) Order",
            "notifying_ministry": "DPIIT, Ministry of Commerce and Industry",
            "details": "Mandatory ISI mark under Scheme-I. Uncertified plugs and sockets are prohibited from sale or government tenders."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2020", "details": "Introduction of safety shutter requirements for children protection against finger probing."},
            {"amendment_no": "Amendment No. 2", "issue_date": "2021", "details": "Gauge dimensions for non-solid brass pins."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 3854:1988", "target_title": "Switches for Domestic and Similar Fixed Electrical Installations", "relation_type": "related_product", "description": "Companion domestic flush switches matching modular wall plates"},
            {"target_standard_no": "IS 9537 (Part 2):1981", "target_title": "Conduits for Electrical Installations - Rigid Steel", "relation_type": "installation", "description": "Metal conduit boxes for concealed mounting"}
        ]
    },
    {
        "standard_no": "IS 10322 (Part 5/Sec 1):2012",
        "title": "Luminaires - Part 5: Particular Requirements - Section 1: Fixed General Purpose Luminaires (Including LED Luminaires)",
        "sector": "Electrical & Power",
        "scope": "Specifies requirements for fixed general purpose luminaires (including LED batten lights, downlights, street lights, and industrial high-bay fittings) for use with supply voltages not exceeding 1000 V. Covers photometric performance, insulation resistance, thermal endurance, and ingress protection (IP ratings).",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 10322 (Part 5/Sec 1):2012 (First Revision, Reaffirmed 2018)",
        "keywords": [
            "LED luminaire", "LED light", "street light", "LED downlight", "high bay light",
            "luminaire", "light fixture", "IP65 luminaire", "photometric test", "energy efficient lighting"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/26102",
        "certification": {
            "scheme": "CRS",
            "is_mandatory": True,
            "order_name": "Electronics and Information Technology Goods (Compulsory Registration Scheme) Order",
            "notifying_ministry": "MeitY / Ministry of Power",
            "details": "Mandatory CRS (Compulsory Registration Scheme) registration under BIS for all LED luminaires and lighting fixtures."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2015", "details": "Mandatory integration with IS 16103 LED controlgear safety requirements."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 16102 (Part 1):2012", "target_title": "Self-Ballasted LED Lamps for General Lighting - Safety Requirements", "relation_type": "related_product", "description": "Safety requirements for retrofit LED bulbs (B22/E27 caps)"},
            {"target_standard_no": "IS 16103 (Part 1):2012", "target_title": "Controlgear for LED Modules - Safety Requirements", "relation_type": "normative_reference", "description": "Constant current / constant voltage electronic LED drivers and surge protection"},
            {"target_standard_no": "IS/IEC 60529:2001", "target_title": "Degrees of Protection Provided by Enclosures (IP Code)", "relation_type": "test_method", "description": "Ingress protection test against dust and water (e.g. IP65 / IP66)"}
        ]
    },
    {
        "standard_no": "IS 13779:1999",
        "title": "AC Static Polyphase Watt-Hour Meters, Class 1 and 2 - Specification",
        "sector": "Electrical & Power",
        "scope": "Applies to newly manufactured AC static watt-hour meters of accuracy classes 1 and 2 for measurement of alternating current electrical active energy of frequency in the range 45 Hz to 65 Hz in single phase and polyphase utility distribution circuits.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 13779:1999 (Second Revision, Reaffirmed 2019)",
        "keywords": [
            "energy meter", "electric meter", "static watt hour meter", "polyphase meter",
            "substation meter", "power utility meter", "accuracy class 1", "kWh meter"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/6510",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Electricity Meters (Quality Control) Order",
            "notifying_ministry": "Ministry of Power / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I for all commercial and residential electricity meters."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2004", "details": "Tamper and anti-fraud detection logging logic."},
            {"amendment_no": "Amendment No. 2", "issue_date": "2014", "details": "Immunity to external DC magnetic fields up to 0.5 Tesla."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 16444 (Part 1):2015", "target_title": "AC Static Direct Connected Smart Electricity Meter", "relation_type": "related_product", "description": "Advanced metering infrastructure (AMI) smart meters with two-way cellular/RF comms"},
            {"target_standard_no": "IS 15884:2010", "target_title": "Alternating Current Direct Connected Static Prepayment Electricity Meters", "relation_type": "related_product", "description": "Prepaid smart electricity meters"}
        ]
    },

    # =========================================================================
    # SECTOR 3: CIVIL, PIPING & CONSTRUCTION MATERIALS
    # =========================================================================
    {
        "standard_no": "IS 1786:2008",
        "title": "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement - Specification (TMT Rebars)",
        "sector": "Civil & Construction",
        "scope": "Covers requirements for deformed steel bars and wires for use as reinforcement in concrete in three strength grades, namely, Fe 415, Fe 500, Fe 550, and Fe 600, with specialized earthquake-resistant 'D' designations (Fe 500D, Fe 550D) providing minimum 16% elongation and 1.25 TS/YS ratio.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 1786:2008 (Fourth Revision, Reaffirmed 2018)",
        "keywords": [
            "TMT bars", "reinforcement steel", "deformed steel bars", "rebars",
            "Fe 500D", "Fe 550D", "earthquake resistant steel", "concrete reinforcement",
            "tensile strength", "yield strength", "bend test", "structural steel"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/1120",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Steel and Steel Products (Quality Control) Order",
            "notifying_ministry": "Ministry of Steel / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I. No manufacturer or trader can sell TMT bars without valid BIS license."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2012", "details": "Introduction of Fe 600 grade and strict phosphorus and sulphur chemical limits (max 0.040% each)."},
            {"amendment_no": "Amendment No. 2", "issue_date": "2017", "details": "Mandatory mill-marking of BIS license number and grade on rebar ribs."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 456:2000", "target_title": "Plain and Reinforced Concrete - Code of Practice", "relation_type": "normative_reference", "description": "National structural concrete design code governing development length and bar spacing"},
            {"target_standard_no": "IS 1608 (Part 1):2018", "target_title": "Metallic Materials - Tensile Testing", "relation_type": "test_method", "description": "Normative proof stress (0.2%), ultimate tensile strength, and percentage elongation test"},
            {"target_standard_no": "IS 1599:2019", "target_title": "Metallic Materials - Bend Test", "relation_type": "test_method", "description": "Mandatory 180-degree bend and rebend test around specified mandrel diameters"},
            {"target_standard_no": "IS 13920:2016", "target_title": "Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces", "relation_type": "safety", "description": "Code of practice mandating Fe 415D / Fe 500D rebars in earthquake zones III, IV, and V"}
        ]
    },
    {
        "standard_no": "IS 2062:2011",
        "title": "Hot Rolled Medium and High Tensile Structural Steel - Specification",
        "sector": "Civil & Construction",
        "scope": "Covers requirements for hot rolled medium and high tensile structural steel plates, sections (I-beams, channels, angles), flats, bars and strips for use in bridges, buildings, transmission towers, railway rolling stock, and heavy fabrication.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 2062:2011 (Seventh Revision, Reaffirmed 2021)",
        "keywords": [
            "structural steel", "hot rolled steel", "MS plates", "steel beams",
            "channels", "angles", "E250", "E350", "E450", "bridge steel",
            "welded structures", "Charpy V-notch impact"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/1342",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Steel and Steel Products (Quality Control) Order",
            "notifying_ministry": "Ministry of Steel / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I for all structural steel supply."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2015", "details": "Charpy impact test temperature classes (BR, BO, B40 for low temperature toughness down to -40 deg C)."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 800:2007", "target_title": "General Construction in Steel - Code of Practice", "relation_type": "installation", "description": "National design standard for structural steel connections, girders, and trusses"},
            {"target_standard_no": "IS 1757 (Part 1):2014", "target_title": "Charpy Pendulum Impact Test on Metallic Materials", "relation_type": "test_method", "description": "Notch toughness energy absorption test in Joules"}
        ]
    },
    {
        "standard_no": "IS 12269:2013",
        "title": "Ordinary Portland Cement, 53 Grade - Specification",
        "sector": "Civil & Construction",
        "scope": "Covers manufacture, chemical composition, physical properties and testing of 53 Grade Ordinary Portland Cement (OPC 53) exhibiting minimum 28-day compressive strength of 53 MPa (N/mm2), used in high-strength concrete, pre-stressed concrete bridges, and fast-track RCC works.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 12269:2013 (First Revision, Reaffirmed 2019)",
        "keywords": [
            "OPC 53", "cement 53 grade", "ordinary portland cement", "high strength concrete",
            "compressive strength", "prestressed concrete", "fineness", "soundness", "setting time"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/5921",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Cement (Quality Control) Order",
            "notifying_ministry": "Ministry of Commerce and Industry / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I. No cement bag can be manufactured or distributed without BIS license."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2015", "details": "Permissible limit for total chloride content restricted to 0.10 percent for prestressed concrete."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 8112:2013", "target_title": "Ordinary Portland Cement, 43 Grade - Specification", "relation_type": "related_product", "description": "OPC 43 Grade for standard structural RCC elements and plastering"},
            {"target_standard_no": "IS 1489 (Part 1):2015", "target_title": "Portland Pozzolana Cement - Part 1: Fly Ash Based", "relation_type": "related_product", "description": "Eco-friendly low-heat cement for dams, mass concreting and coastal works"},
            {"target_standard_no": "IS 4031 (Part 6):1988", "target_title": "Methods of Physical Tests for Hydraulic Cement - Compressive Strength", "relation_type": "test_method", "description": "Standard 70.6 mm mortar cube compressive strength test at 3, 7, and 28 days"},
            {"target_standard_no": "IS 4031 (Part 5):1988", "target_title": "Determination of Initial and Final Setting Times", "relation_type": "test_method", "description": "Vicat needle penetration test for cement consistency and setting limits"}
        ]
    },
    {
        "standard_no": "IS 8112:2013",
        "title": "Ordinary Portland Cement, 43 Grade - Specification",
        "sector": "Civil & Construction",
        "scope": "Covers manufacture, chemical composition, physical properties and testing of 43 Grade Ordinary Portland Cement (OPC 43) exhibiting minimum 28-day compressive strength of 43 MPa (N/mm2), suitable for all general civil engineering construction works.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 8112:2013 (Second Revision, Reaffirmed 2019)",
        "keywords": [
            "OPC 43", "cement 43 grade", "ordinary portland cement", "structural concrete",
            "masonry mortar", "plastering", "28 day strength"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/3910",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Cement (Quality Control) Order",
            "notifying_ministry": "DPIIT",
            "details": "Mandatory ISI mark under Scheme-I."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 12269:2013", "target_title": "Ordinary Portland Cement, 53 Grade", "relation_type": "related_product", "description": "Higher strength grade OPC (53 MPa)"},
            {"target_standard_no": "IS 4031 (Part 6):1988", "target_title": "Physical Tests for Cement - Compressive Strength", "relation_type": "test_method", "description": "Mortar cube test"}
        ]
    },
    {
        "standard_no": "IS 269:1989",
        "title": "33 Grade Ordinary Portland Cement - Specification",
        "sector": "Civil & Construction",
        "scope": "Specification for 33 Grade Ordinary Portland cement (OPC 33). Now largely obsolete and consolidated into higher grades or unified IS 269:2015 revisions.",
        "status": "superseded",
        "superseded_by": "IS 8112:2013 / IS 269:2015",
        "current_version": "Superseded by IS 269:2015 / IS 8112:2013",
        "keywords": [
            "OPC 33", "cement 33 grade", "obsolete cement standard", "superseded"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/192",
        "certification": {
            "scheme": "None",
            "is_mandatory": False,
            "order_name": None,
            "notifying_ministry": None,
            "details": "Superseded. Tenders specifying 33 grade must be updated to IS 8112 (43 Grade) or IS 1489 (PPC)."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 8112:2013", "target_title": "Ordinary Portland Cement 43 Grade", "relation_type": "related_product", "description": "Modern active replacement for structural applications"}
        ]
    },
    {
        "standard_no": "IS 4985:2000",
        "title": "Unplasticized Polyvinyl Chloride (uPVC) Pipes for Potable Water Supplies - Specification",
        "sector": "Civil & Construction",
        "scope": "Specifies requirements for plain and socket-ended unplasticized polyvinyl chloride (uPVC) pipes intended for potable water transportation, buried water mains, domestic plumbing, and irrigation distribution systems across pressure classes 2.5, 4, 6, 10, and 12.5 kgf/cm2.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 4985:2000 (Third Revision, Reaffirmed 2020)",
        "keywords": [
            "uPVC pipe", "PVC water pipe", "potable water pipe", "drinking water pipe",
            "irrigation pipe", "plumbing pipe", "hydrostatic pressure test", "vicat softening",
            "socket pipe", "elastomeric sealing ring"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2712",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Pipes and Fittings (Quality Control) Order",
            "notifying_ministry": "Ministry of Jal Shakti / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I for water supply and municipal utility procurement."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2006", "details": "Heavy metal lead extraction test limits aligned with WHO drinking water guidelines (max 50 ppb)."},
            {"amendment_no": "Amendment No. 2", "issue_date": "2015", "details": "Elastomeric rubber ring joint dimension specifications."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 4984:2016", "target_title": "High Density Polyethylene (HDPE) Pipes for Water Supply", "relation_type": "related_product", "description": "Flexible butt-fusion welded alternative for rugged terrain and trenchless laying"},
            {"target_standard_no": "IS 12235 (Part 8/Sec 1):2004", "target_title": "Methods of Test for Unplasticized PVC Pipes - Internal Hydrostatic Pressure", "relation_type": "test_method", "description": "1000-hour hydrostatic burst and sustained pressure test at 27 deg C and 60 deg C"},
            {"target_standard_no": "IS 12235 (Part 2):2004", "target_title": "Determination of Vicat Softening Temperature", "relation_type": "test_method", "description": "Thermal resistance test (minimum 80 deg C Vicat point)"},
            {"target_standard_no": "IS 7634 (Part 3):2003", "target_title": "Code of Practice for Laying and Jointing of uPVC Pipes", "relation_type": "installation", "description": "Trench bed preparation, solvent cementing, and pressure testing in field"}
        ]
    },
    {
        "standard_no": "IS 4984:2016",
        "title": "High Density Polyethylene (HDPE) Pipes for Water Supply - Specification",
        "sector": "Civil & Construction",
        "scope": "Covers requirements for high density polyethylene (HDPE) pipes made from PE-63, PE-80 and PE-100 virgin raw material grades for drinking water supply, industrial effluent lines, sub-sea pipelines, and rural water supply schemes under Jal Jeevan Mission.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 4984:2016 (Fifth Revision, Reaffirmed 2021)",
        "keywords": [
            "HDPE pipe", "polyethylene pipe", "PE 100", "PE 80", "Jal Jeevan Mission",
            "water supply pipe", "butt fusion joint", "flexible pipe", "PN 6", "PN 10", "PN 16"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/28912",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Pipes and Fittings (Quality Control) Order",
            "notifying_ministry": "Ministry of Jal Shakti / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2018", "details": "Oxidation induction time (OIT) minimum threshold of 20 minutes at 200 deg C."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 7634 (Part 2):2012", "target_title": "Code of Practice for Laying and Jointing of Polyethylene Pipes", "relation_type": "installation", "description": "Butt welding temperature control and electrofusion guidelines"},
            {"target_standard_no": "IS 2530:1963", "target_title": "Methods of Test for Polyethylene Molding Materials and Compounds", "relation_type": "test_method", "description": "Melt flow index (MFI), carbon black dispersion, and density verification"},
            {"target_standard_no": "IS 4985:2000", "target_title": "uPVC Pipes for Potable Water Supplies", "relation_type": "related_product", "description": "Rigid PVC pipe alternative"}
        ]
    },
    {
        "standard_no": "IS 8329:2000",
        "title": "Centrifugally Cast (Ductile) Iron Pipes for Water, Gas and Sewage - Specification",
        "sector": "Civil & Construction",
        "scope": "Specifies requirements and test methods for centrifugally cast ductile iron pipes (DI pipes) with spigot and socket or flanged ends for transporting drinking water, raw water, and pressurized sewage pipelines in Class K7, K9, and C-series.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 8329:2000 (Third Revision, Reaffirmed 2020)",
        "keywords": [
            "ductile iron pipe", "DI pipe", "centrifugally cast iron", "K9 pipe", "K7 pipe",
            "water transmission main", "sewage pipe", "cement mortar lining", "zinc coating", "water utility"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/3789",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Cast Iron Products (Quality Control) Order",
            "notifying_ministry": "Ministry of Steel / Ministry of Jal Shakti",
            "details": "Mandatory ISI mark under Scheme-I for urban water distribution infrastructure."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2006", "details": "External metallic zinc coating minimum 200 g/m2 with finishing bitumen layer."},
            {"amendment_no": "Amendment No. 2", "issue_date": "2012", "details": "Internal Portland slag cement mortar lining thickness specifications."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 9523:2000", "target_title": "Ductile Iron Fittings for Pressure Pipes for Water, Gas and Sewage", "relation_type": "normative_reference", "description": "Bends, tees, tapers, and flanged adaptors matching IS 8329 pipes"},
            {"target_standard_no": "IS 12288:1987", "target_title": "Code of Practice for Use and Laying of Ductile Iron Pipes", "relation_type": "installation", "description": "Field hydraulic hydrostatic pressure testing and thrust block construction"},
            {"target_standard_no": "IS 5382:2018", "target_title": "Rubber Sealing Rings for Gas Mains, Water Mains and Sewers", "relation_type": "normative_reference", "description": "EPDM/SBR push-on Tyton joint rubber gaskets"}
        ]
    },
    {
        "standard_no": "IS 456:2000",
        "title": "Plain and Reinforced Concrete - Code of Practice",
        "sector": "Civil & Construction",
        "scope": "The national baseline code of practice for design and construction of plain and reinforced concrete structures. Governs cement selection, water-cement ratios, aggregate gradation, structural reinforcement detailing, curing methods, and quality assurance.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 456:2000 (Fourth Revision, Reaffirmed 2021) with Amendments 1-5",
        "keywords": [
            "concrete code", "RCC design", "plain concrete", "reinforced concrete",
            "water cement ratio", "durability", "characteristic strength", "curing",
            "structural design", "CPWD specifications"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/342",
        "certification": {
            "scheme": "None",
            "is_mandatory": False,
            "order_name": "National Building Code of India (NBC) / CPWD Mandate",
            "notifying_ministry": "Ministry of Housing and Urban Affairs",
            "details": "Mandatory structural design code across all Central and State government tenders."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2001", "details": "Clarification on minimum cement content for severe environmental exposure classes."},
            {"amendment_no": "Amendment No. 2", "issue_date": "2005", "details": "Inclusion of fly ash and ground granulated blast furnace slag (GGBS) limits."},
            {"amendment_no": "Amendment No. 5", "issue_date": "2019", "details": "Self-compacting concrete (SCC) and high-performance concrete mix guidelines."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 516 (Part 1/Sec 1):2021", "target_title": "Hardened Concrete - Methods of Test - Compressive Strength", "relation_type": "test_method", "description": "Cube compressive testing of concrete (150 mm cubes)"},
            {"target_standard_no": "IS 1199 (Part 2):2018", "target_title": "Fresh Concrete - Workability Tests (Slump Test)", "relation_type": "test_method", "description": "Slump cone test and flow table test for workability"},
            {"target_standard_no": "IS 4926:2003", "target_title": "Ready-Mixed Concrete - Code of Practice", "relation_type": "related_product", "description": "Batching plant quality standards for commercial RMC supplied to job sites"}
        ]
    },
    {
        "standard_no": "IS 4926:2003",
        "title": "Ready-Mixed Concrete - Code of Practice",
        "sector": "Civil & Construction",
        "scope": "Covers requirements for production, quality control, transportation, sampling and testing of ready-mixed concrete (RMC) delivered in plastic unhardened state by transit mixers to construction sites.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 4926:2003 (Second Revision, Reaffirmed 2017)",
        "keywords": [
            "ready mixed concrete", "RMC", "transit mixer", "batching plant",
            "concrete mix design", "workability retention", "retarders", "CPWD tenders"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2704",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Quality Control Scheme for RMC Plants",
            "notifying_ministry": "DPIIT / Quality Council of India (QCI)",
            "details": "Mandatory third-party plant certification for public infrastructure works."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 456:2000", "target_title": "Plain and Reinforced Concrete", "relation_type": "normative_reference", "description": "Governing mix proportions and concrete strength grades"},
            {"target_standard_no": "IS 9103:1999", "target_title": "Concrete Admixtures - Specification", "relation_type": "normative_reference", "description": "Superplasticizers and accelerating/retarding admixtures for transit retention"}
        ]
    },
    {
        "standard_no": "IS 383:2016",
        "title": "Coarse and Fine Aggregate for Concrete - Specification",
        "sector": "Civil & Construction",
        "scope": "Covers chemical and physical requirements for naturally occurring aggregates, crushed stone, and manufactured sand (M-sand) for use in concrete. Specifies grading limits for Zones I, II, III, IV, flakiness index, elongation index, aggregate crushing value, and alkali-silica reactivity.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 383:2016 (Third Revision, Reaffirmed 2021)",
        "keywords": [
            "aggregates", "coarse aggregate", "fine aggregate", "M-sand", "manufactured sand",
            "crushed sand", "river sand", "concrete aggregate", "flakiness index", "grading zone II"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/218",
        "certification": {
            "scheme": "None",
            "is_mandatory": False,
            "order_name": "CPWD / MoRTH Mandatory Testing Norms",
            "notifying_ministry": "Ministry of Road Transport and Highways",
            "details": "Mandatory compliance for all highway and structural concrete procurement."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2019", "details": "Permits up to 100% replacement of river sand with manufactured sand (M-sand) meeting Zone II grading."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 2386 (Series)", "target_title": "Methods of Test for Aggregates for Concrete", "relation_type": "test_method", "description": "Sieve analysis, flakiness, crushing value, impact value and specific gravity tests"},
            {"target_standard_no": "IS 456:2000", "target_title": "Plain and Reinforced Concrete", "relation_type": "normative_reference", "description": "Permissible chloride and sulphate limits in aggregates"}
        ]
    },
    {
        "standard_no": "IS 1489 (Part 1):2015",
        "title": "Portland Pozzolana Cement - Specification - Part 1: Fly Ash Based",
        "sector": "Civil & Construction",
        "scope": "Covers manufacture and physical and chemical requirements of fly ash based Portland Pozzolana Cement (PPC). Mandates fly ash addition between 15% to 35% by mass of cement, yielding high resistance to sulphate attack and low heat of hydration.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 1489 (Part 1):2015 (Third Revision, Reaffirmed 2020)",
        "keywords": [
            "PPC cement", "portland pozzolana cement", "fly ash cement", "green cement",
            "sulphate resistant", "marine concrete", "low heat cement", "mass concreting"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/812",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Cement (Quality Control) Order",
            "notifying_ministry": "DPIIT",
            "details": "Mandatory ISI mark under Scheme-I."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 3812 (Part 1):2013", "target_title": "Pulverized Fuel Ash for Use as Pozzolana in Cement Concrete", "relation_type": "normative_reference", "description": "Chemical composition and fineness of dry fly ash from thermal power plants"},
            {"target_standard_no": "IS 4031 (Part 6):1988", "target_title": "Physical Tests for Cement - Compressive Strength", "relation_type": "test_method", "description": "Standard 28-day strength test (minimum 33 MPa for PPC)"}
        ]
    },
    {
        "standard_no": "IS 458:2003",
        "title": "Precast Concrete Pipes (With and Without Reinforcement) - Specification",
        "sector": "Civil & Construction",
        "scope": "Covers requirements for reinforced and unreinforced precast concrete pipes in classes NP1 (unreinforced for drainage), NP2 (reinforced light duty), NP3 (reinforced medium duty for culverts), and NP4 (reinforced heavy duty for highways and railways).",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 458:2003 (Fourth Revision, Reaffirmed 2018)",
        "keywords": [
            "RCC pipes", "hume pipes", "precast concrete pipe", "NP2 pipe", "NP3 culvert pipe",
            "NP4 heavy duty pipe", "sewer pipe", "drainage pipe", "spigot and socket"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/264",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Precast Concrete Pipes (Quality Control) Order",
            "notifying_ministry": "DPIIT / Ministry of Housing and Urban Affairs",
            "details": "Mandatory ISI mark for public drainage and highway culvert works."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2008", "details": "Three-edge bearing load test criteria and hydrostatic pressure testing at factory."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 3597:1998", "target_title": "Methods of Test for Concrete Pipes", "relation_type": "test_method", "description": "Three-edge bearing test, permeability test, and hydrostatic proof test"},
            {"target_standard_no": "IS 783:1985", "target_title": "Code of Practice for Laying of Concrete Pipes", "relation_type": "installation", "description": "Excavation, bedding classes, jointing, and backfilling over culvert pipes"}
        ]
    },
    {
        "standard_no": "IS 9537 (Part 2):1981",
        "title": "Conduits for Electrical Installations - Specification - Part 2: Rigid Steel Conduits",
        "sector": "Electrical & Power",
        "scope": "Specifies requirements for rigid mild steel and black enamelled or galvanized steel conduits used for mechanical protection and routing of electrical wires and cables in industrial buildings, power plants, and hazardous locations.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 9537 (Part 2):1981 (Reaffirmed 2021)",
        "keywords": [
            "steel conduit", "rigid conduit", "electrical conduit", "galvanized conduit",
            "GI conduit", "flameproof conduit", "cable management", "industrial wiring"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/4612",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Conduits for Electrical Installations QCO",
            "notifying_ministry": "Ministry of Power / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 9537 (Part 1):1980", "target_title": "Conduits for Electrical Installations - General Requirements", "relation_type": "normative_reference", "description": "Baseline dimensional and mechanical impact thresholds"},
            {"target_standard_no": "IS 9537 (Part 3):1983", "target_title": "Rigid Plain Conduits of Insulating Material (PVC)", "relation_type": "related_product", "description": "Corrosion-resistant PVC conduit alternative for residential and light commercial use"},
            {"target_standard_no": "IS 2667:1988", "target_title": "Fittings for Rigid Steel Conduits for Electrical Wiring", "relation_type": "installation", "description": "Conduit junction boxes, couplers, elbows, and inspection tees"}
        ]
    },
    {
        "standard_no": "IS 9537 (Part 3):1983",
        "title": "Conduits for Electrical Installations - Specification - Part 3: Rigid Plain Conduits of Insulating Material (PVC Conduits)",
        "sector": "Electrical & Power",
        "scope": "Specifies requirements for rigid smooth unplasticized polyvinyl chloride (PVC) conduits for concealed or surface wiring in walls and ceilings. Covers light, medium, and heavy mechanical stress classes, flame retardance, and dielectric insulation.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 9537 (Part 3):1983 (Reaffirmed 2020)",
        "keywords": [
            "PVC conduit", "plastic conduit", "electrical conduit pipe", "concealed conduit",
            "fire retardant conduit", "light mechanical", "medium mechanical", "heavy mechanical"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/4613",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Conduits for Electrical Installations QCO",
            "notifying_ministry": "DPIIT",
            "details": "Mandatory ISI mark under Scheme-I."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "1994", "details": "Drop ball impact resistance test at low temperature (0 deg C)."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 3419:1989", "target_title": "Fittings for Rigid Non-Metallic Conduits", "relation_type": "installation", "description": "PVC junction boxes, deep junction boxes, and solvent-welded bends"},
            {"target_standard_no": "IS 694:2010", "target_title": "PVC Insulated Cables", "relation_type": "normative_reference", "description": "Insulated wiring routed through the conduits"}
        ]
    },
    {
        "standard_no": "IS/IEC 60947-2:2016",
        "title": "Low-Voltage Switchgear and Controlgear - Part 2: Circuit-Breakers (Moulded Case Circuit Breakers - MCCB)",
        "sector": "Electrical & Power",
        "scope": "Applies to circuit-breakers whose main contacts are intended to be connected to circuits, the rated voltage of which does not exceed 1000 V AC or 1500 V DC. Defines industrial Moulded Case Circuit Breakers (MCCB) and Air Circuit Breakers (ACB) with adjustable thermal and magnetic trip units.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS/IEC 60947-2:2016 (First Revision)",
        "keywords": [
            "MCCB", "moulded case circuit breaker", "industrial breaker", "ACB",
            "air circuit breaker", "breaking capacity 50kA", "3 pole MCCB", "4 pole MCCB",
            "thermal magnetic trip", "microprocessor release", "main switchboard"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/29110",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Low-Voltage Switchgear and Controlgear (Quality Control) Order",
            "notifying_ministry": "Ministry of Heavy Industries / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I for all MCCBs up to 1000 V."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS/IEC 60898-1:2015", "target_title": "Miniature Circuit Breakers (MCB)", "relation_type": "related_product", "description": "Downstream branch overcurrent protection for currents up to 125A"},
            {"target_standard_no": "IS/IEC 60947-1:2007", "target_title": "Low-Voltage Switchgear and Controlgear - General Rules", "relation_type": "normative_reference", "description": "Dielectric test voltages, clearance and creepage distance rules"},
            {"target_standard_no": "IS 8623 (Part 1):1993", "target_title": "Low-Voltage Switchgear and Controlgear Assemblies", "relation_type": "installation", "description": "Factory-built assemblies and motor control centers (MCC)"}
        ]
    },
    {
        "standard_no": "IS 16102 (Part 1):2012",
        "title": "Self-Ballasted LED Lamps for General Lighting Services - Part 1: Safety Requirements",
        "sector": "Electrical & Power",
        "scope": "Specifies the safety and interchangeability requirements, together with the test methods and conditions required to show compliance of tubular and bulb LED lamps with integrated ballasts/drivers for supply voltages up to 250 V AC.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 16102 (Part 1):2012 (First Revision, Reaffirmed 2018)",
        "keywords": [
            "LED bulb", "LED lamp", "self ballasted lamp", "B22 cap", "E27 cap",
            "energy efficient bulb", "retrofit lamp", "luminous efficacy"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/26098",
        "certification": {
            "scheme": "CRS",
            "is_mandatory": True,
            "order_name": "Electronics and Information Technology Goods (Compulsory Registration Scheme) Order",
            "notifying_ministry": "MeitY / Ministry of Power",
            "details": "Mandatory CRS registration with BIS and BEE Star Rating labeling."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2015", "details": "Harmonization with IEC 62560 on insulation resistance and high voltage breakdown."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 16102 (Part 2):2012", "target_title": "Self-Ballasted LED Lamps - Performance Requirements", "relation_type": "test_method", "description": "Lumen maintenance, CRI (Colour Rendering Index), and lamp life testing"},
            {"target_standard_no": "IS 10322 (Part 5/Sec 1):2012", "target_title": "Luminaires - Fixed General Purpose", "relation_type": "related_product", "description": "Integrated luminaires and downlight fixtures"}
        ]
    },
    {
        "standard_no": "IS 16444 (Part 1):2015",
        "title": "AC Static Direct Connected Smart Electricity Meter - Specification - Part 1: Electricity Meter",
        "sector": "Electrical & Power",
        "scope": "Specifies requirements for smart AC static direct-connected electricity meters of accuracy classes 1.0 and 2.0 with two-way communication capabilities, connect/disconnect switches, power quality event logging, and remote firmware upgrade features under RDSS and National Smart Grid Mission.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 16444 (Part 1):2015 (Reaffirmed 2020)",
        "keywords": [
            "smart meter", "AMI", "smart electricity meter", "prepaid meter",
            "two-way communication", "disconnector", "tamper detection", "RDSS scheme", "power utility"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/28105",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Electricity Meters (Quality Control) Order",
            "notifying_ministry": "Ministry of Power",
            "details": "Mandatory ISI mark under Scheme-I for all smart meter rollouts in state DISCOMs."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2017", "details": "Integration of DLMS/COSEM communication protocol conformity testing."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 15959 (Part 1):2011", "target_title": "Data Exchange for Electricity Meter Reading - Indian Companion Specification (DLMS/COSEM)", "relation_type": "normative_reference", "description": "Mandatory communication data model and cyber-security encryption for smart meters"},
            {"target_standard_no": "IS 13779:1999", "target_title": "AC Static Polyphase Watt-Hour Meters", "relation_type": "related_product", "description": "Baseline non-communicating electronic energy meter standard"}
        ]
    },
    {
        "standard_no": "IS 3043:2018",
        "title": "Code of Practice for Earthing",
        "sector": "Electrical & Power",
        "scope": "Provides detailed guidelines for design, installation, calculation of earth resistance, and maintenance of electrical earthing systems (pipe earthing, plate earthing, chemical earthing) for generation stations, sub-stations, industrial plants, and commercial buildings. Mandates earthing electrode dimensions, soil resistivity testing, and step/touch potential safety.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 3043:2018 (Second Revision)",
        "keywords": [
            "earthing", "grounding", "earthing electrode", "chemical earthing",
            "pipe earthing", "plate earthing", "earth pit", "GI earthing strip",
            "copper bonded rod", "soil resistivity", "touch potential", "step potential"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/1350",
        "certification": {
            "scheme": "None",
            "is_mandatory": False,
            "order_name": "Central Electricity Authority (Measures relating to Safety and Electric Supply) Regulations",
            "notifying_ministry": "Ministry of Power / CEA",
            "details": "Statutorily mandatory under CEA Safety Regulations for all electrical power and distribution installations."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 732:2019", "target_title": "Code of Practice for Electrical Wiring Installations", "relation_type": "normative_reference", "description": "Building electrical distribution earthing requirements"},
            {"target_standard_no": "IS 2309:1989", "target_title": "Protection of Buildings and Allied Structures Against Lightning", "relation_type": "safety", "description": "Lightning down conductors and dedicated earth termination networks"},
            {"target_standard_no": "IS 12640 (Part 1):2016", "target_title": "Residual Current Operated Circuit Breakers (RCCBs)", "relation_type": "safety", "description": "Earth leakage trip coordination with system earth loop impedance"}
        ]
    },
    {
        "standard_no": "IS 732:2019",
        "title": "Code of Practice for Electrical Wiring Installations",
        "sector": "Electrical & Power",
        "scope": "Prescribes fundamental principles, inspection, testing, and installation design for electrical wiring in residential, commercial, industrial and public buildings up to 1000 V AC. Governs conductor sizing, voltage drop, circuit protection, conduit layout, and verification.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 732:2019 (Fourth Revision)",
        "keywords": [
            "electrical wiring code", "building wiring", "internal electrification",
            "conduit wiring", "circuit sizing", "voltage drop", "distribution board", "CPWD electrical"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/445",
        "certification": {
            "scheme": "None",
            "is_mandatory": False,
            "order_name": "National Electrical Code of India (NEC) / CPWD General Specifications",
            "notifying_ministry": "Ministry of Power / CPWD",
            "details": "Mandatory standard for all CPWD and state PWD electrical tender specifications."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 694:2010", "target_title": "PVC Insulated Cables up to 1100 V", "relation_type": "normative_reference", "description": "Conductors used in building wiring"},
            {"target_standard_no": "IS 3043:2018", "target_title": "Code of Practice for Earthing", "relation_type": "safety", "description": "Protective earthing and bonding of non-current carrying metalwork"},
            {"target_standard_no": "IS/IEC 60898-1:2015", "target_title": "Miniature Circuit Breakers (MCB)", "relation_type": "installation", "description": "Sub-circuit overcurrent protection"}
        ]
    },
    {
        "standard_no": "IS 7098 (Part 2):2011",
        "title": "Cross-linked Polyethylene Insulated Thermoplastic Sheathed Cables - Specification - Part 2: For Working Voltages from 3.3 kV up to and Including 33 kV",
        "sector": "Electrical & Power",
        "scope": "Covers requirements and tests for single and three-core cross-linked polyethylene (XLPE) insulated and PVC or PE sheathed HT power cables for 3.3 kV, 6.6 kV, 11 kV, 22 kV, and 33 kV power transmission and distribution lines.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 7098 (Part 2):2011 (Second Revision, Reaffirmed 2017)",
        "keywords": [
            "HT cable", "11kV cable", "33kV cable", "high voltage cable", "XLPE HT cable",
            "armoured HT cable", "screened cable", "substation cable", "power grid", "distribution network"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/25910",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Cables (Quality Control) Order",
            "notifying_ministry": "Ministry of Power / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I for all HT underground power cables."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2015", "details": "Partial discharge test limits (< 5 pC) and high voltage AC withstand test parameters."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 7098 (Part 1):1988", "target_title": "XLPE Cables up to 1100 V", "relation_type": "related_product", "description": "Low voltage 1.1 kV power cable counterpart"},
            {"target_standard_no": "IS 10810 (Part 46):1984", "target_title": "Methods of Test for Cables - Partial Discharge Test", "relation_type": "test_method", "description": "Normative test for internal voids in high voltage insulation"}
        ]
    },
    {
        "standard_no": "IS 3854:1988",
        "title": "Switches for Domestic and Similar Fixed Electrical Installations - Specification",
        "sector": "Electrical & Power",
        "scope": "Applies to manually operated general purpose switches for AC only, with a rated voltage not exceeding 440 V and a rated current not exceeding 63 A, intended for household and similar fixed electrical installations, both indoors and outdoors.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 3854:1988 (Second Revision, Reaffirmed 2021)",
        "keywords": [
            "modular switch", "light switch", "piano switch", "domestic switch",
            "6A switch", "16A switch", "electrical switch", "flush switch", "switchgear"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2340",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Electrical Accessories (Quality Control) Order",
            "notifying_ministry": "DPIIT",
            "details": "Mandatory ISI mark under Scheme-I."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "1994", "details": "Endurance test of 40,000 operations under rated load."},
            {"amendment_no": "Amendment No. 2", "issue_date": "2001", "details": "Glow wire flammability test for insulating housing."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 1293:2019", "target_title": "Plugs and Socket-Outlets up to 16 A", "relation_type": "related_product", "description": "Paired wall socket outlets in modular switchboards"}
        ]
    },
    {
        "standard_no": "IS 800:2007",
        "title": "General Construction in Steel - Code of Practice",
        "sector": "Civil & Construction",
        "scope": "The national baseline code for design and construction of steel structures (limit state method). Covers member design for tension, compression, flexure, combined forces, bolted and welded connections, fire design, fatigue life, and seismic ductile detailing.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 800:2007 (Third Revision, Reaffirmed 2017)",
        "keywords": [
            "steel design code", "structural steel design", "limit state design",
            "steel truss", "steel columns", "bolted connections", "welded connections", "PEB structure"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/490",
        "certification": {
            "scheme": "None",
            "is_mandatory": False,
            "order_name": "National Building Code / CPWD Specification",
            "notifying_ministry": "Ministry of Housing and Urban Affairs",
            "details": "Mandatory design code for all industrial, warehouse, bridge, and steel structural works."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "2012", "details": "Beam-to-column moment resisting frame connection detailing rules."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 2062:2011", "target_title": "Hot Rolled Medium and High Tensile Structural Steel", "relation_type": "normative_reference", "description": "Material quality specification for plates and structural sections"},
            {"target_standard_no": "IS 4000:1992", "target_title": "Code of Practice for High Strength Bolts in Steel Structures", "relation_type": "installation", "description": "Pre-tensioned friction grip bolt installation"}
        ]
    },
    {
        "standard_no": "IS 13920:2016",
        "title": "Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces - Code of Practice",
        "sector": "Civil & Construction",
        "scope": "Specifies design and detailing requirements for reinforced concrete flexural members, columns, beam-column joints, and shear walls to provide adequate ductility and energy dissipation capacity during major earthquake ground shaking.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 13920:2016 (First Revision, Reaffirmed 2021)",
        "keywords": [
            "earthquake design", "seismic detailing", "ductile detailing", "beam column joint",
            "confinement reinforcement", "shear wall", "seismic zone IV", "seismic zone V"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/27891",
        "certification": {
            "scheme": "None",
            "is_mandatory": False,
            "order_name": "Disaster Management Act / National Building Code Mandate",
            "notifying_ministry": "Ministry of Home Affairs / NDMA",
            "details": "Mandatory structural safety compliance across high seismic risk zones."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 1786:2008", "target_title": "High Strength Deformed Steel Bars (TMT Rebars)", "relation_type": "normative_reference", "description": "Mandates Fe 415D or Fe 500D rebars with minimum 16% elongation"},
            {"target_standard_no": "IS 456:2000", "target_title": "Plain and Reinforced Concrete", "relation_type": "normative_reference", "description": "Parent structural concrete design code"}
        ]
    },
    {
        "standard_no": "IS 2185 (Part 1):2005",
        "title": "Concrete Masonry Units - Specification - Part 1: Hollow and Solid Concrete Blocks",
        "sector": "Civil & Construction",
        "scope": "Covers requirements for solid and hollow precast concrete blocks manufactured with dense aggregates for use in load bearing and non-load bearing exterior and interior masonry walls, retaining walls, and partitions.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 2185 (Part 1):2005 (Third Revision, Reaffirmed 2020)",
        "keywords": [
            "concrete blocks", "hollow blocks", "solid blocks", "concrete masonry",
            "blockwork", "compressive strength", "dry density", "water absorption"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/1410",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": False,
            "order_name": "CPWD Specifications for Building Works",
            "notifying_ministry": "Ministry of Housing and Urban Affairs",
            "details": "ISI marked blocks specified in government building contracts."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 2185 (Part 3):1984", "target_title": "Autoclaved Cellular (Aerated) Concrete Blocks (AAC)", "relation_type": "related_product", "description": "Lightweight AAC thermal insulation block alternative"},
            {"target_standard_no": "IS 2572:2005", "target_title": "Code of Practice for Construction of Hollow Concrete Block Masonry", "relation_type": "installation", "description": "Mortar jointing, bonding, and vertical reinforcement grouting"}
        ]
    },
    {
        "standard_no": "IS 1322:1993",
        "title": "Bitumen Felts for Waterproofing and Damp-Proofing - Specification",
        "sector": "Civil & Construction",
        "scope": "Prescribes requirements for bitumen felts (fibre base and hessian base) used for water-proofing of roofs, basements, swimming pools, canals, and damp-proofing of foundation courses.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 1322:1993 (Fourth Revision, Reaffirmed 2021)",
        "keywords": [
            "waterproofing felt", "bitumen felt", "tar felt", "roof waterproofing",
            "damp proof course", "DPC", "basement waterproofing", "hessian felt"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/845",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Bitumen and Bituminous Products (Quality Control) Order",
            "notifying_ministry": "Ministry of Petroleum and Natural Gas / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I."
        },
        "amendments": [
            {"amendment_no": "Amendment No. 1", "issue_date": "1998", "details": "Pliability at 2 deg C test criteria and water absorption limits."}
        ],
        "related_standards": [
            {"target_standard_no": "IS 1346:1991", "target_title": "Code of Practice for Waterproofing of Roofs with Bitumen Felts", "relation_type": "installation", "description": "Priming, hot bitumen bonding layer, felt flashing, and gravel topping"},
            {"target_standard_no": "IS 1580:1991", "target_title": "Bituminous Compounds for Waterproofing and Caulking Purposes", "relation_type": "related_product", "description": "Cold applied bitumen mastic for joint sealing"}
        ]
    },
    {
        "standard_no": "IS 16890:2018",
        "title": "Helmets for Firefighters - Structural Firefighting - Specification",
        "sector": "PPE & Safety Equipment",
        "scope": "Specifies minimum requirements for structural firefighting helmets designed to protect firefighters' heads from thermal hazards, falling debris, flame engulfment (flashover), radiant heat, and electric shock during rescue and firefighting operations.",
        "status": "active",
        "superseded_by": None,
        "current_version": "IS 16890:2018 (First Revision)",
        "keywords": [
            "firefighter helmet", "fire helmet", "structural firefighting", "flame resistance",
            "thermal radiation", "rescue helmet", "fire brigade PPE"
        ],
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/30420",
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Firefighting Equipment and Protective Gear QCO",
            "notifying_ministry": "Ministry of Home Affairs / DPIIT",
            "details": "Mandatory ISI mark for fire brigade municipal procurement."
        },
        "amendments": [],
        "related_standards": [
            {"target_standard_no": "IS 2925:1984", "target_title": "Industrial Safety Helmets", "relation_type": "related_product", "description": "Standard industrial helmet (unsuitable for structural fire temperatures)"},
            {"target_standard_no": "IS 16891:2018", "target_title": "Protective Clothing for Firefighters", "relation_type": "safety", "description": "Structural firefighting turnout suits"}
        ]
    }
]

def main():
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(STANDARDS_DATA, f, indent=2, ensure_ascii=False)
    print(f"Successfully generated curated standards dataset with {len(STANDARDS_DATA)} standards at {DATA_FILE}")

if __name__ == "__main__":
    main()
