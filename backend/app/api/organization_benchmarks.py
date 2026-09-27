"""Organization-Specific Benchmark Scenarios for ManakSetu
Centralized configuration mapping each registered organization to 4 curated
benchmark tender scenarios. Each scenario has English query and Hindi (query_hi)
variant for the multilingual pipeline. Analysis results always come from the real
ManakSetu retrieval pipeline — never hardcoded.
"""
from fastapi import APIRouter, Query
from typing import List, Dict, Any

router = APIRouter(prefix="/benchmarks", tags=["Organization Benchmarks"])

# ─── Centralized Org → Benchmark Map ─────────────────────────────────────────
# Each org maps to exactly 4 benchmark scenarios.
# iconType must be one of: alert, hardhat, building, shield, zap, bolt
# query     — English tender specification text
# query_hi  — Hindi/Hinglish equivalent for multilingual analysis
# The real pipeline resolves applicable standards from the verified KB.

ORG_BENCHMARKS: Dict[str, List[Dict[str, Any]]] = {

    # ── CPWD ──────────────────────────────────────────────────────────────────
    "Central Public Works Department (CPWD)": [
        {
            "id": "cpwd-cement",
            "title": "OPC Cement for RCC Works",
            "sectorBadge": "Civil · Deprecation Shield",
            "iconType": "alert",
            "query": (
                "Supply of 53 Grade Ordinary Portland Cement conforming to IS 12269 "
                "for multi-storey prestressed concrete construction works and "
                "reinforced concrete structural elements at CPWD project sites."
            ),
            "query_hi": (
                "CPWD pariyojana sthalon par multi-storey prestressed concrete nirman karyon "
                "aur reinforced concrete structural elements ke liye IS 12269 ke anusar "
                "53 Grade Ordinary Portland Cement ki supply karein."
            )
        },
        {
            "id": "cpwd-tmt",
            "title": "Fe 500D TMT Reinforcement Steel",
            "sectorBadge": "Civil · Structural",
            "iconType": "building",
            "query": (
                "Supply of high strength deformed TMT steel bars Fe 500D grade with "
                "minimum 16% elongation and ductile seismic detailing for reinforced "
                "concrete structural members, beams and columns in CPWD construction projects."
            ),
            "query_hi": (
                "CPWD construction projects mein reinforced concrete structural members, beams "
                "aur columns ke liye minimum 16 pratishat elongation aur seismic ductile "
                "detailing wale Fe 500D grade high strength deformed TMT steel bars ki aapurti."
            )
        },
        {
            "id": "cpwd-ppe",
            "title": "Safety Helmets for Construction Sites",
            "sectorBadge": "PPE · Safety",
            "iconType": "hardhat",
            "query": (
                "Supply of industrial safety helmets with electrical insulation up to 440V, "
                "adjustable harness, chin strap and shock absorption for construction "
                "site engineers and workmen at CPWD infrastructure project locations."
            ),
            "query_hi": (
                "CPWD infrastructure project locations par construction site engineers aur "
                "workmen ke liye 440V tak electrical insulation, adjustable harness, chin strap "
                "aur shock absorption sahit industrial safety helmets ki aapurti."
            )
        },
        {
            "id": "cpwd-audit",
            "title": "Construction Tender Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause 4: Supply of 53 Grade Ordinary Portland Cement conforming to IS 12269 "
                "for RCC construction works.\n"
                "Clause 8: Supply of PVC insulated copper electrical wiring and conduits "
                "for site office installation.\n"
                "Clause 12: Heavy-duty industrial safety helmets with electrical insulation "
                "rating up to 415V for site staff.\n"
                "Clause 16: Supply of structural steel sections for fabrication of "
                "site gantry and hoisting structures."
            ),
            "query_hi": (
                "Clause 4: RCC construction ke liye IS 12269 anusar 53 Grade OPC Cement ki supply.\n"
                "Clause 8: Site office installation ke liye PVC insulated copper electrical wiring aur conduits.\n"
                "Clause 12: Site staff ke liye 415V tak electrical insulation rating wale heavy-duty industrial safety helmets.\n"
                "Clause 16: Site gantry aur hoisting structures ke fabrication ke liye structural steel sections."
            )
        }
    ],

    # ── BIS ───────────────────────────────────────────────────────────────────
    "Bureau of Indian Standards (BIS)": [
        {
            "id": "bis-standards-verify",
            "title": "IS Standards Status Verification",
            "sectorBadge": "Standards · Supersession",
            "iconType": "alert",
            "query": (
                "Verify current active status of Ordinary Portland Cement specifications "
                "including IS 12269 and IS 8112 and identify whether they have been "
                "superseded or revised and what the current applicable edition is."
            ),
            "query_hi": (
                "IS 12269 aur IS 8112 jaise Ordinary Portland Cement specifications ki "
                "current active status verify karein aur pata lagaein ki kya ye superseded "
                "ya revised ho chuke hain aur current applicable edition kya hai."
            )
        },
        {
            "id": "bis-qco",
            "title": "QCO / ISI Certification Audit",
            "sectorBadge": "QCO · Mandatory Certification",
            "iconType": "shield",
            "query": (
                "Audit procurement specification for PVC insulated copper electrical "
                "cables rated 1100V for Quality Control Order applicability, mandatory "
                "ISI mark requirements and BIS product certification scheme compliance."
            ),
            "query_hi": (
                "1100V rated PVC insulated copper electrical cables ki procurement specification "
                "ko Quality Control Order applicability, mandatory ISI mark requirements "
                "aur BIS product certification scheme ke liye audit karein."
            )
        },
        {
            "id": "bis-ppe-cert",
            "title": "PPE Certification Standards Audit",
            "sectorBadge": "PPE · Certification",
            "iconType": "hardhat",
            "query": (
                "Verify certification requirements for industrial safety helmets, "
                "safety footwear with steel toe cap and personal protective equipment "
                "including mandatory BIS ISI mark and QCO applicability status."
            ),
            "query_hi": (
                "Industrial safety helmets, steel toe cap wale safety footwear aur "
                "personal protective equipment ki certification requirements verify karein "
                "jisme mandatory BIS ISI mark aur QCO applicability status shamil hai."
            )
        },
        {
            "id": "bis-audit",
            "title": "Multi-Standard Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause 1: Verify IS standard status for 53 Grade OPC Cement and identify "
                "current superseding standard.\n"
                "Clause 2: Verify QCO applicability and ISI certification for PVC insulated "
                "copper building wires and cables.\n"
                "Clause 3: Verify certification scheme for industrial safety helmets.\n"
                "Clause 4: Verify status and current edition for TMT reinforcement steel bars."
            ),
            "query_hi": (
                "Clause 1: 53 Grade OPC Cement ke IS standard status verify karein aur current superseding standard identify karein.\n"
                "Clause 2: PVC insulated copper building wires aur cables ki QCO applicability aur ISI certification verify karein.\n"
                "Clause 3: Industrial safety helmets ki certification scheme verify karein.\n"
                "Clause 4: TMT reinforcement steel bars ka status aur current edition verify karein."
            )
        }
    ],

    # ── GeM ───────────────────────────────────────────────────────────────────
    "Government e-Marketplace (GeM)": [
        {
            "id": "gem-cables",
            "title": "Electrical Cables Procurement",
            "sectorBadge": "Electrical · QCO",
            "iconType": "zap",
            "query": (
                "GeM procurement specification for single core and multicore PVC insulated "
                "copper conductor cables rated 1100V working voltage with flame retardant "
                "FRLS properties for government office installations and building wiring."
            ),
            "query_hi": (
                "Government office installations aur building wiring ke liye 1100V working "
                "voltage rated flame retardant FRLS properties wale single core aur multicore "
                "PVC insulated copper conductor cables ki GeM procurement specification."
            )
        },
        {
            "id": "gem-mcb",
            "title": "Circuit Breakers / MCB Procurement",
            "sectorBadge": "Electrical · Safety",
            "iconType": "bolt",
            "query": (
                "GeM procurement of miniature circuit breakers MCB 10kA breaking capacity "
                "C-curve rated 16A, 32A and 63A for government office electrical distribution "
                "boards, plug and socket outlets and electrical protection systems."
            ),
            "query_hi": (
                "Government office electrical distribution boards, plug aur socket outlets "
                "aur electrical protection systems ke liye 16A, 32A aur 63A rated 10kA "
                "breaking capacity C-curve miniature circuit breakers MCB ki GeM procurement."
            )
        },
        {
            "id": "gem-ppe",
            "title": "PPE Equipment Procurement",
            "sectorBadge": "PPE · Safety",
            "iconType": "hardhat",
            "query": (
                "GeM procurement of personal protective equipment including industrial safety "
                "helmets, safety footwear with 200J steel toe cap impact resistance and "
                "anti-static outsole for government construction and maintenance workers."
            ),
            "query_hi": (
                "Government construction aur maintenance workers ke liye industrial safety "
                "helmets, 200J steel toe cap impact resistance wale safety footwear aur "
                "anti-static outsole sahit personal protective equipment ki GeM procurement."
            )
        },
        {
            "id": "gem-audit",
            "title": "GeM Procurement Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause A: PVC insulated copper building wires and cables for government "
                "office electrical installation — verify QCO and ISI requirements.\n"
                "Clause B: Miniature circuit breakers for distribution boards — verify "
                "applicable IS standard and mandatory certification.\n"
                "Clause C: Industrial safety helmets for government site workers — "
                "verify BIS certification requirements.\n"
                "Clause D: LED lamps and luminaires for government office lighting."
            ),
            "query_hi": (
                "Clause A: Government office electrical installation ke liye PVC insulated copper building wires aur cables — QCO aur ISI requirements verify karein.\n"
                "Clause B: Distribution boards ke liye miniature circuit breakers — applicable IS standard aur mandatory certification verify karein.\n"
                "Clause C: Government site workers ke liye industrial safety helmets — BIS certification requirements verify karein.\n"
                "Clause D: Government office lighting ke liye LED lamps aur luminaires."
            )
        }
    ],

    # ── Railways / RDSO ───────────────────────────────────────────────────────
    "Ministry of Railways / Indian Railways (RDSO)": [
        {
            "id": "railway-cables",
            "title": "Railway Electrical Cables",
            "sectorBadge": "Electrical · Railway",
            "iconType": "zap",
            "query": (
                "Supply of XLPE cross-linked polyethylene insulated power cables rated "
                "1100V for railway traction auxiliary systems, signalling installations "
                "and platform power distribution at Indian Railways stations."
            ),
            "query_hi": (
                "Indian Railways stations par railway traction auxiliary systems, "
                "signalling installations aur platform power distribution ke liye "
                "1100V rated XLPE cross-linked polyethylene insulated power cables ki aapurti."
            )
        },
        {
            "id": "railway-structural",
            "title": "Structural Steel for Railway Works",
            "sectorBadge": "Civil · Structural Steel",
            "iconType": "building",
            "query": (
                "Procurement of hot rolled medium and high tensile structural steel sections "
                "including angles, channels and I-beams for railway station structural "
                "fabrication, foot over bridges, platform roofing and gantry structures."
            ),
            "query_hi": (
                "Railway station structural fabrication, foot over bridges, platform roofing "
                "aur gantry structures ke liye angles, channels aur I-beams sahit hot rolled "
                "medium aur high tensile structural steel sections ki procurement."
            )
        },
        {
            "id": "railway-ppe",
            "title": "Railway Worker Safety Equipment",
            "sectorBadge": "PPE · Safety",
            "iconType": "hardhat",
            "query": (
                "Supply of industrial safety helmets with electrical insulation, high "
                "visibility warning clothing and full body safety harnesses for railway "
                "track maintenance staff, overhead equipment gangs and station construction workers."
            ),
            "query_hi": (
                "Railway track maintenance staff, overhead equipment gangs aur station "
                "construction workers ke liye electrical insulation sahit industrial safety "
                "helmets, high visibility warning clothing aur full body safety harnesses ki aapurti."
            )
        },
        {
            "id": "railway-audit",
            "title": "Railway Procurement Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause 4: Supply of PVC insulated copper cables for railway station "
                "electrical installations.\n"
                "Clause 8: High tensile structural steel for railway station roof "
                "fabrication and platform structures.\n"
                "Clause 12: Industrial safety helmets and high visibility clothing for "
                "track maintenance and signalling staff.\n"
                "Clause 16: HDPE pipes for railway colony water supply distribution."
            ),
            "query_hi": (
                "Clause 4: Railway station electrical installations ke liye PVC insulated copper cables ki supply.\n"
                "Clause 8: Railway station roof fabrication aur platform structures ke liye high tensile structural steel.\n"
                "Clause 12: Track maintenance aur signalling staff ke liye industrial safety helmets aur high visibility clothing.\n"
                "Clause 16: Railway colony water supply distribution ke liye HDPE pipes."
            )
        }
    ],

    # ── Defence / DGQA / MES ──────────────────────────────────────────────────
    "Ministry of Defence (DGQA / MES)": [
        {
            "id": "defence-cables",
            "title": "Defence Electrical Cables / Wiring",
            "sectorBadge": "Electrical · Defence",
            "iconType": "zap",
            "query": (
                "Supply of PVC insulated heavy duty electric cables rated 1100V and XLPE "
                "insulated power cables for defence establishment electrical installations, "
                "military engineering services projects and armament depot power distribution."
            ),
            "query_hi": (
                "Defence establishments, military engineering services projects aur armament "
                "depot power distribution ke liye 1100V rated PVC insulated heavy duty "
                "electric cables aur XLPE insulated power cables ki aapurti."
            )
        },
        {
            "id": "defence-structural",
            "title": "Structural Steel for MES Projects",
            "sectorBadge": "Civil · MES",
            "iconType": "building",
            "query": (
                "Procurement of hot rolled structural steel sections conforming to applicable "
                "Indian Standards for Military Engineering Services construction projects "
                "including barracks, hangars and defence facility structural fabrication."
            ),
            "query_hi": (
                "Barracks, hangars aur defence facility structural fabrication sahit Military "
                "Engineering Services construction projects ke liye applicable Indian Standards "
                "ke anusar hot rolled structural steel sections ki procurement."
            )
        },
        {
            "id": "defence-ppe",
            "title": "Defence PPE / Safety Equipment",
            "sectorBadge": "PPE · Safety",
            "iconType": "hardhat",
            "query": (
                "Supply of personal protective equipment for defence construction sites "
                "including industrial safety helmets, leather safety boots for construction "
                "workers, full body safety harnesses and electrical insulation rubber gloves."
            ),
            "query_hi": (
                "Defence construction sites ke liye personal protective equipment ki aapurti "
                "jisme industrial safety helmets, construction workers ke liye leather safety "
                "boots, full body safety harnesses aur electrical insulation rubber gloves shamil hain."
            )
        },
        {
            "id": "defence-audit",
            "title": "Defence Procurement Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause 4: Supply of OPC cement for MES construction works — verify "
                "applicable IS standard and current active edition.\n"
                "Clause 8: Fe 500D TMT reinforcement steel bars for defence "
                "establishment construction — verify IS compliance requirements.\n"
                "Clause 12: Electrical cables for defence installation power distribution "
                "— verify QCO and ISI certification requirements.\n"
                "Clause 16: Safety helmets and PPE for defence construction site workers."
            ),
            "query_hi": (
                "Clause 4: MES construction ke liye OPC cement — applicable IS standard aur current active edition verify karein.\n"
                "Clause 8: Defence establishment construction ke liye Fe 500D TMT bars — IS compliance requirements verify karein.\n"
                "Clause 12: Defence installation power distribution ke liye electrical cables — QCO aur ISI certification verify karein.\n"
                "Clause 16: Defence construction site workers ke liye safety helmets aur PPE."
            )
        }
    ],

    # ── DPIIT ─────────────────────────────────────────────────────────────────
    "Ministry of Commerce and Industry (DPIIT)": [
        {
            "id": "dpiit-qco",
            "title": "QCO / Product Certification Audit",
            "sectorBadge": "QCO · Mandatory Standards",
            "iconType": "shield",
            "query": (
                "Audit of procurement specification for electrical cables, circuit breakers "
                "and electrical accessories for Quality Control Order applicability and "
                "mandatory BIS ISI certification requirements under DPIIT notified QCOs."
            ),
            "query_hi": (
                "DPIIT notified QCOs ke antargat electrical cables, circuit breakers aur "
                "electrical accessories ki procurement specification ko Quality Control Order "
                "applicability aur mandatory BIS ISI certification requirements ke liye audit karein."
            )
        },
        {
            "id": "dpiit-industrial",
            "title": "Industrial Standards Verification",
            "sectorBadge": "Industrial · Certification",
            "iconType": "alert",
            "query": (
                "Verify applicable Indian Standards for industrial electrical equipment "
                "including distribution transformers up to 100 kVA, low voltage switchgear "
                "and controlgear circuit breakers rated 440V for manufacturing installations."
            ),
            "query_hi": (
                "Manufacturing installations ke liye 100 kVA tak distribution transformers, "
                "low voltage switchgear aur 440V rated controlgear circuit breakers ke liye "
                "applicable Indian Standards verify karein."
            )
        },
        {
            "id": "dpiit-ppe-cert",
            "title": "PPE Product Certification Standards",
            "sectorBadge": "PPE · QCO",
            "iconType": "hardhat",
            "query": (
                "Verify mandatory certification requirements and QCO applicability for "
                "personal protective equipment including industrial safety helmets, "
                "safety footwear and eye protectors for industrial workforce procurement."
            ),
            "query_hi": (
                "Industrial workforce procurement ke liye industrial safety helmets, "
                "safety footwear aur eye protectors sahit personal protective equipment ki "
                "mandatory certification requirements aur QCO applicability verify karein."
            )
        },
        {
            "id": "dpiit-audit",
            "title": "Industrial Procurement Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause 1: Electrical cables PVC insulated 1100V for industrial installation "
                "— verify QCO and mandatory ISI mark requirement.\n"
                "Clause 2: Miniature circuit breakers for industrial distribution boards "
                "— verify applicable IS standard.\n"
                "Clause 3: Industrial safety helmets for factory workforce "
                "— verify BIS ISI certification requirement.\n"
                "Clause 4: Distribution transformers for industrial supply."
            ),
            "query_hi": (
                "Clause 1: Industrial installation ke liye 1100V PVC insulated cables — QCO aur mandatory ISI mark verify karein.\n"
                "Clause 2: Industrial distribution boards ke liye miniature circuit breakers — applicable IS standard verify karein.\n"
                "Clause 3: Factory workforce ke liye industrial safety helmets — BIS ISI certification verify karein.\n"
                "Clause 4: Industrial supply ke liye distribution transformers."
            )
        }
    ],

    # ── Power / CEA ───────────────────────────────────────────────────────────
    "Ministry of Power / Central Electricity Authority (CEA)": [
        {
            "id": "cea-cables",
            "title": "Power Distribution Cables",
            "sectorBadge": "Electrical · Power",
            "iconType": "zap",
            "query": (
                "Supply of XLPE cross-linked polyethylene insulated thermoplastic sheathed "
                "power cables for 11kV and 33kV underground power distribution systems, "
                "substation interconnections and electricity distribution network installations."
            ),
            "query_hi": (
                "Substation interconnections aur electricity distribution network installations "
                "ke liye 11kV aur 33kV underground power distribution systems ke liye XLPE "
                "cross-linked polyethylene insulated thermoplastic sheathed power cables ki aapurti."
            )
        },
        {
            "id": "cea-transformer",
            "title": "Distribution Transformers",
            "sectorBadge": "Electrical · Transformers",
            "iconType": "bolt",
            "query": (
                "Procurement of outdoor type oil immersed distribution transformers up to "
                "100 kVA for rural electricity distribution under government electrification "
                "schemes, conforming to applicable Indian Standards and energy efficiency norms."
            ),
            "query_hi": (
                "Government electrification schemes ke antargat rural electricity distribution "
                "ke liye 100 kVA tak outdoor type oil immersed distribution transformers ki "
                "procurement, applicable Indian Standards aur energy efficiency norms ke anusar."
            )
        },
        {
            "id": "cea-metering",
            "title": "Smart Electricity Meters",
            "sectorBadge": "Electrical · Metering",
            "iconType": "zap",
            "query": (
                "Supply of AC static direct connected smart electricity meters and polyphase "
                "watt-hour meters Class 1 and 2 for electricity board revenue metering, "
                "net metering for rooftop solar and advanced metering infrastructure rollout."
            ),
            "query_hi": (
                "Revenue metering, rooftop solar ke liye net metering aur advanced metering "
                "infrastructure rollout ke liye AC static direct connected smart electricity "
                "meters aur polyphase watt-hour meters Class 1 aur 2 ki aapurti."
            )
        },
        {
            "id": "cea-audit",
            "title": "Power Sector Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause 4: XLPE insulated underground power cables for distribution network "
                "— verify applicable IS standards and QCO requirements.\n"
                "Clause 8: Oil immersed distribution transformers for rural electrification "
                "— verify applicable IS standard and certification.\n"
                "Clause 12: AC static electricity meters for revenue metering rollout "
                "— verify IS standard and mandatory ISI certification.\n"
                "Clause 16: Electrical earthing systems for substation installations."
            ),
            "query_hi": (
                "Clause 4: Distribution network ke liye XLPE insulated underground power cables — applicable IS standards aur QCO requirements verify karein.\n"
                "Clause 8: Rural electrification ke liye oil immersed distribution transformers — applicable IS standard aur certification verify karein.\n"
                "Clause 12: Revenue metering rollout ke liye AC static electricity meters — IS standard aur mandatory ISI certification verify karein.\n"
                "Clause 16: Substation installations ke liye electrical earthing systems."
            )
        }
    ],

    # ── MoHUA ─────────────────────────────────────────────────────────────────
    "Ministry of Housing and Urban Affairs (MoHUA)": [
        {
            "id": "mohua-cement",
            "title": "Cement for Urban Housing Works",
            "sectorBadge": "Civil · Construction",
            "iconType": "alert",
            "query": (
                "Supply of Portland Pozzolana Cement fly ash based and Ordinary Portland "
                "Cement 43 grade for urban housing construction, affordable housing "
                "projects and PMAY government scheme residential construction works."
            ),
            "query_hi": (
                "PMAY government scheme residential construction works aur affordable housing "
                "projects ke liye Portland Pozzolana Cement fly ash based aur 43 grade "
                "Ordinary Portland Cement ki aapurti."
            )
        },
        {
            "id": "mohua-pipes",
            "title": "Water Supply Pipes for Urban Areas",
            "sectorBadge": "Civil · Water Infrastructure",
            "iconType": "building",
            "query": (
                "Supply of HDPE high density polyethylene pipes PN 10 and PN 16 pressure "
                "class and uPVC unplasticized polyvinyl chloride pipes for urban potable "
                "water supply distribution networks under AMRUT and smart city infrastructure."
            ),
            "query_hi": (
                "AMRUT aur smart city infrastructure ke antargat urban potable water supply "
                "distribution networks ke liye HDPE pipes PN 10 aur PN 16 pressure class "
                "aur uPVC pipes ki aapurti."
            )
        },
        {
            "id": "mohua-electrical",
            "title": "Urban Electrical Infrastructure",
            "sectorBadge": "Electrical · Urban",
            "iconType": "zap",
            "query": (
                "Supply of LED lamps, luminaires for general lighting and PVC insulated "
                "copper building wires for urban street lighting, government housing "
                "complex electrical installation and smart city energy efficiency projects."
            ),
            "query_hi": (
                "Urban street lighting, government housing complex electrical installation "
                "aur smart city energy efficiency projects ke liye LED lamps, general "
                "lighting ke liye luminaires aur PVC insulated copper building wires ki aapurti."
            )
        },
        {
            "id": "mohua-audit",
            "title": "Urban Infrastructure Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause 4: Portland Pozzolana Cement for PMAY urban housing construction "
                "— verify applicable IS standard and active edition.\n"
                "Clause 8: HDPE water supply pipes for AMRUT urban infrastructure "
                "— verify IS standard and certification requirements.\n"
                "Clause 12: LED luminaires for urban street lighting "
                "— verify applicable IS standard and BIS certification.\n"
                "Clause 16: PVC insulated copper wires for housing colony electrification."
            ),
            "query_hi": (
                "Clause 4: PMAY urban housing construction ke liye Portland Pozzolana Cement — applicable IS standard aur active edition verify karein.\n"
                "Clause 8: AMRUT urban infrastructure ke liye HDPE water supply pipes — IS standard aur certification requirements verify karein.\n"
                "Clause 12: Urban street lighting ke liye LED luminaires — applicable IS standard aur BIS certification verify karein.\n"
                "Clause 16: Housing colony electrification ke liye PVC insulated copper wires."
            )
        }
    ],

    # ── MoRTH / NHAI ──────────────────────────────────────────────────────────
    "Ministry of Road Transport and Highways (MoRTH / NHAI)": [
        {
            "id": "nhai-cement",
            "title": "Cement for Highway Construction",
            "sectorBadge": "Civil · Highway",
            "iconType": "alert",
            "query": (
                "Supply of 53 Grade Ordinary Portland Cement conforming to IS 12269 for "
                "rigid pavement, concrete road construction, bridge deck works and "
                "highway infrastructure projects under NHAI national highway development."
            ),
            "query_hi": (
                "NHAI national highway development ke antargat rigid pavement, concrete road "
                "construction aur bridge deck works ke liye IS 12269 ke anusar 53 Grade "
                "Ordinary Portland Cement ki aapurti."
            )
        },
        {
            "id": "nhai-tmt",
            "title": "TMT Steel for Bridge / Flyover Works",
            "sectorBadge": "Civil · Bridge Steel",
            "iconType": "building",
            "query": (
                "Supply of high strength deformed TMT steel bars Fe 500D grade and "
                "hot rolled structural steel for reinforced concrete bridge piers, "
                "flyover structures, highway ROB and major bridge construction under NHAI."
            ),
            "query_hi": (
                "NHAI ke antargat reinforced concrete bridge piers, flyover structures "
                "aur highway ROB ke liye Fe 500D grade high strength deformed TMT steel "
                "bars aur hot rolled structural steel ki aapurti."
            )
        },
        {
            "id": "nhai-pipes",
            "title": "HDPE / Ductile Iron Pipes for Roads",
            "sectorBadge": "Civil · Drainage",
            "iconType": "building",
            "query": (
                "Supply of HDPE high density polyethylene pipes and precast concrete pipes "
                "with reinforcement for highway side drainage, culverts, underpasses "
                "and cross-drainage structures on national highway projects."
            ),
            "query_hi": (
                "National highway projects par highway side drainage, culverts, underpasses "
                "aur cross-drainage structures ke liye HDPE pipes aur reinforcement wale "
                "precast concrete pipes ki aapurti."
            )
        },
        {
            "id": "nhai-audit",
            "title": "Highway Procurement Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause 4: 53 Grade OPC Cement for concrete pavement on national highway "
                "— verify IS 12269 status and applicable current standard.\n"
                "Clause 8: Fe 500D TMT bars for highway bridge and flyover reinforcement "
                "— verify IS standard and ductility requirements.\n"
                "Clause 12: Structural steel sections for highway gantry and signage "
                "structures — verify applicable IS standards.\n"
                "Clause 16: Safety helmets and PPE for highway construction workers."
            ),
            "query_hi": (
                "Clause 4: National highway par concrete pavement ke liye 53 Grade OPC Cement — IS 12269 status aur applicable current standard verify karein.\n"
                "Clause 8: Highway bridge aur flyover reinforcement ke liye Fe 500D TMT bars — IS standard aur ductility requirements verify karein.\n"
                "Clause 12: Highway gantry aur signage structures ke liye structural steel sections — applicable IS standards verify karein.\n"
                "Clause 16: Highway construction workers ke liye safety helmets aur PPE."
            )
        }
    ],

    # ── NTPC ──────────────────────────────────────────────────────────────────
    "National Thermal Power Corporation (NTPC)": [
        {
            "id": "ntpc-cables",
            "title": "Power Plant Electrical Cables",
            "sectorBadge": "Electrical · Power Generation",
            "iconType": "zap",
            "query": (
                "Supply of XLPE cross-linked polyethylene insulated power cables and "
                "PVC insulated control cables rated 1100V for thermal power plant "
                "auxiliary systems, boiler controls, turbine hall and coal handling plant "
                "electrical distribution at NTPC generating stations."
            ),
            "query_hi": (
                "NTPC generating stations par thermal power plant auxiliary systems, "
                "boiler controls, turbine hall aur coal handling plant electrical distribution "
                "ke liye XLPE insulated power cables aur 1100V rated PVC insulated control cables ki aapurti."
            )
        },
        {
            "id": "ntpc-switchgear",
            "title": "LV Switchgear / Circuit Breakers",
            "sectorBadge": "Electrical · Switchgear",
            "iconType": "bolt",
            "query": (
                "Procurement of low voltage switchgear and controlgear moulded case "
                "circuit breakers and miniature circuit breakers for power station "
                "control room, auxiliary motor control centres and LT distribution "
                "panels at NTPC thermal power generating units."
            ),
            "query_hi": (
                "NTPC thermal power generating units par power station control room, "
                "auxiliary motor control centres aur LT distribution panels ke liye "
                "low voltage switchgear moulded case circuit breakers aur miniature circuit breakers ki procurement."
            )
        },
        {
            "id": "ntpc-ppe",
            "title": "Power Plant Safety Equipment",
            "sectorBadge": "PPE · Industrial Safety",
            "iconType": "hardhat",
            "query": (
                "Supply of industrial safety helmets, rubber gloves for electrical purposes, "
                "full body harnesses, safety footwear and respiratory protective devices "
                "for thermal power plant operations, maintenance staff and construction workers."
            ),
            "query_hi": (
                "Thermal power plant operations, maintenance staff aur construction workers "
                "ke liye industrial safety helmets, electrical purposes ke liye rubber gloves, "
                "full body harnesses, safety footwear aur respiratory protective devices ki aapurti."
            )
        },
        {
            "id": "ntpc-audit",
            "title": "Power Plant Procurement Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause 4: XLPE insulated power cables for power plant auxiliary systems "
                "— verify applicable IS standards and certification.\n"
                "Clause 8: Moulded case circuit breakers for LT motor control centres "
                "— verify IS standard and mandatory ISI requirements.\n"
                "Clause 12: Rubber gloves for electrical purposes and safety helmets "
                "for plant workers — verify ISI and QCO requirements.\n"
                "Clause 16: Structural steel for power plant service building construction."
            ),
            "query_hi": (
                "Clause 4: Power plant auxiliary systems ke liye XLPE insulated power cables — applicable IS standards aur certification verify karein.\n"
                "Clause 8: LT motor control centres ke liye moulded case circuit breakers — IS standard aur mandatory ISI requirements verify karein.\n"
                "Clause 12: Plant workers ke liye electrical purposes ke rubber gloves aur safety helmets — ISI aur QCO requirements verify karein.\n"
                "Clause 16: Power plant service building construction ke liye structural steel."
            )
        }
    ],

    # ── SAIL ──────────────────────────────────────────────────────────────────
    "Steel Authority of India Limited (SAIL)": [
        {
            "id": "sail-tmt",
            "title": "TMT Reinforcement Steel Bars",
            "sectorBadge": "Civil · Steel Products",
            "iconType": "building",
            "query": (
                "Supply of high strength deformed TMT steel bars Fe 500D grade with "
                "minimum 16% elongation, ductile seismic detailing and required mechanical "
                "and chemical properties for reinforced concrete structural construction."
            ),
            "query_hi": (
                "Reinforced concrete structural construction ke liye minimum 16 pratishat "
                "elongation, ductile seismic detailing aur required mechanical aur chemical "
                "properties wale Fe 500D grade high strength deformed TMT steel bars ki aapurti."
            )
        },
        {
            "id": "sail-structural",
            "title": "Hot Rolled Structural Steel",
            "sectorBadge": "Civil · Structural Steel",
            "iconType": "building",
            "query": (
                "Supply of hot rolled medium and high tensile structural steel plates, "
                "sections, angles and channels conforming to applicable Indian Standards "
                "for industrial building fabrication, gantry girders and structural "
                "steel frameworks for manufacturing facilities."
            ),
            "query_hi": (
                "Industrial building fabrication, gantry girders aur manufacturing facilities "
                "ke structural steel frameworks ke liye applicable Indian Standards ke anusar "
                "hot rolled medium aur high tensile structural steel plates, sections, angles aur channels ki aapurti."
            )
        },
        {
            "id": "sail-concrete",
            "title": "Concrete Standards Verification",
            "sectorBadge": "Civil · Concrete",
            "iconType": "alert",
            "query": (
                "Verify applicable Indian Standards for ready mixed concrete, plain and "
                "reinforced concrete code of practice and coarse and fine aggregate "
                "specifications for SAIL plant construction and civil infrastructure works."
            ),
            "query_hi": (
                "SAIL plant construction aur civil infrastructure karyon ke liye ready mixed "
                "concrete, plain aur reinforced concrete code of practice aur coarse aur "
                "fine aggregate specifications ke applicable Indian Standards verify karein."
            )
        },
        {
            "id": "sail-audit",
            "title": "Steel Plant Procurement Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause 4: High strength deformed TMT steel bars Fe 500D for construction "
                "— verify applicable IS standard, status and ductility certification.\n"
                "Clause 8: Structural steel sections for plant fabrication "
                "— verify IS 2062 applicability and current status.\n"
                "Clause 12: Electrical cables for steel plant power distribution "
                "— verify QCO and ISI certification requirements.\n"
                "Clause 16: Safety helmets, leather safety boots and PPE for steel "
                "plant workers — verify applicable IS standards."
            ),
            "query_hi": (
                "Clause 4: Construction ke liye Fe 500D TMT steel bars — applicable IS standard, status aur ductility certification verify karein.\n"
                "Clause 8: Plant fabrication ke liye structural steel sections — IS 2062 applicability aur current status verify karein.\n"
                "Clause 12: Steel plant power distribution ke liye electrical cables — QCO aur ISI certification verify karein.\n"
                "Clause 16: Steel plant workers ke liye safety helmets, leather safety boots aur PPE — applicable IS standards verify karein."
            )
        }
    ],

    # ── BHEL ──────────────────────────────────────────────────────────────────
    "Bharat Heavy Electricals Limited (BHEL)": [
        {
            "id": "bhel-cables",
            "title": "Heavy Duty Industrial Electrical Cables",
            "sectorBadge": "Electrical · Industrial",
            "iconType": "zap",
            "query": (
                "Supply of PVC insulated heavy duty electric cables 1100V and XLPE "
                "cross-linked polyethylene insulated power cables for industrial power "
                "distribution, transformer connections and switchyard cabling at BHEL "
                "manufacturing units and heavy engineering project sites."
            ),
            "query_hi": (
                "BHEL manufacturing units aur heavy engineering project sites par industrial "
                "power distribution, transformer connections aur switchyard cabling ke liye "
                "1100V PVC insulated heavy duty electric cables aur XLPE insulated power cables ki aapurti."
            )
        },
        {
            "id": "bhel-switchgear",
            "title": "LV Switchgear for Industrial Plants",
            "sectorBadge": "Electrical · Switchgear",
            "iconType": "bolt",
            "query": (
                "Procurement of low voltage switchgear moulded case circuit breakers, "
                "miniature circuit breakers and residual current operated circuit breakers "
                "for BHEL manufacturing plant motor control centres, distribution boards "
                "and industrial electrical panels rated up to 440V."
            ),
            "query_hi": (
                "BHEL manufacturing plant motor control centres, distribution boards aur "
                "440V tak ke industrial electrical panels ke liye low voltage switchgear "
                "moulded case circuit breakers, miniature circuit breakers aur residual "
                "current operated circuit breakers ki procurement."
            )
        },
        {
            "id": "bhel-ppe",
            "title": "Industrial Safety / PPE Equipment",
            "sectorBadge": "PPE · Heavy Industry",
            "iconType": "hardhat",
            "query": (
                "Supply of industrial safety helmets with electrical insulation rated up "
                "to 440V, rubber gloves for electrical purposes, full body harnesses and "
                "leather safety boots for BHEL heavy engineering manufacturing plant "
                "workers, electrical maintenance teams and fabrication shop floor staff."
            ),
            "query_hi": (
                "BHEL heavy engineering manufacturing plant workers, electrical maintenance "
                "teams aur fabrication shop floor staff ke liye 440V tak electrical insulation "
                "wale industrial safety helmets, electrical purposes ke liye rubber gloves, "
                "full body harnesses aur leather safety boots ki aapurti."
            )
        },
        {
            "id": "bhel-audit",
            "title": "Heavy Electrical Procurement Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause 4: PVC insulated copper electrical cables 1100V for BHEL plant "
                "power distribution — verify applicable IS standard and ISI/QCO requirements.\n"
                "Clause 8: Moulded case circuit breakers for plant motor control centres "
                "— verify IS standard and mandatory certification requirements.\n"
                "Clause 12: Industrial safety helmets with 440V electrical insulation for "
                "plant workers — verify BIS ISI mark and certification.\n"
                "Clause 16: Rubber gloves for electrical purposes for maintenance staff "
                "— verify IS standard and mandatory ISI requirement."
            ),
            "query_hi": (
                "Clause 4: BHEL plant power distribution ke liye 1100V PVC insulated copper cables — applicable IS standard aur ISI/QCO requirements verify karein.\n"
                "Clause 8: Plant motor control centres ke liye moulded case circuit breakers — IS standard aur mandatory certification requirements verify karein.\n"
                "Clause 12: Plant workers ke liye 440V electrical insulation wale industrial safety helmets — BIS ISI mark aur certification verify karein.\n"
                "Clause 16: Maintenance staff ke liye electrical purposes ke rubber gloves — IS standard aur mandatory ISI requirement verify karein."
            )
        }
    ],

    # ── State PWD ─────────────────────────────────────────────────────────────
    "State Public Works Department (State PWD)": [
        {
            "id": "statepwd-cement",
            "title": "Cement for State PWD Works",
            "sectorBadge": "Civil · Deprecation Shield",
            "iconType": "alert",
            "query": (
                "Supply of 53 Grade Ordinary Portland Cement conforming to IS 12269 and "
                "Portland Pozzolana Cement fly ash based for State PWD construction works "
                "including roads, bridges, government buildings and public infrastructure."
            ),
            "query_hi": (
                "State PWD construction karyon jaise roads, bridges, government buildings "
                "aur public infrastructure ke liye IS 12269 ke anusar 53 Grade Ordinary "
                "Portland Cement aur Portland Pozzolana Cement fly ash based ki aapurti."
            )
        },
        {
            "id": "statepwd-tmt",
            "title": "TMT / Construction Materials",
            "sectorBadge": "Civil · Construction",
            "iconType": "building",
            "query": (
                "Supply of high strength deformed TMT steel bars Fe 500D and coarse and "
                "fine aggregates conforming to applicable Indian Standards for State PWD "
                "reinforced concrete construction works, bridges and public buildings."
            ),
            "query_hi": (
                "State PWD reinforced concrete construction, bridges aur public buildings "
                "ke liye applicable Indian Standards ke anusar Fe 500D high strength deformed "
                "TMT steel bars aur coarse aur fine aggregates ki aapurti."
            )
        },
        {
            "id": "statepwd-pipes",
            "title": "Water Supply Pipes for Rural Works",
            "sectorBadge": "Civil · Water Supply",
            "iconType": "building",
            "query": (
                "Supply of HDPE high density polyethylene pipes PN 10 and PN 16 and "
                "uPVC pipes for rural water supply distribution under Jal Jeevan Mission "
                "and state government drinking water schemes at State PWD project sites."
            ),
            "query_hi": (
                "State PWD project sites par Jal Jeevan Mission aur state government drinking "
                "water schemes ke antargat rural water supply distribution ke liye HDPE "
                "pipes PN 10 aur PN 16 aur uPVC pipes ki aapurti."
            )
        },
        {
            "id": "statepwd-audit",
            "title": "State PWD Procurement Compliance Audit",
            "sectorBadge": "Multi-Issue Scan",
            "iconType": "shield",
            "query": (
                "Clause 4: 53 Grade OPC Cement for State PWD road and bridge construction "
                "— verify IS 12269 status and identify current applicable standard.\n"
                "Clause 8: Fe 500D TMT reinforcement bars for government building "
                "construction — verify applicable IS standard and status.\n"
                "Clause 12: PVC insulated copper wiring for State PWD government office "
                "electrification — verify QCO and ISI requirements.\n"
                "Clause 16: Safety helmets and PPE for State PWD construction site workers."
            ),
            "query_hi": (
                "Clause 4: State PWD road aur bridge construction ke liye 53 Grade OPC Cement — IS 12269 status aur current applicable standard identify karein.\n"
                "Clause 8: Government building construction ke liye Fe 500D TMT reinforcement bars — applicable IS standard aur status verify karein.\n"
                "Clause 12: State PWD government office electrification ke liye PVC insulated copper wiring — QCO aur ISI requirements verify karein.\n"
                "Clause 16: State PWD construction site workers ke liye safety helmets aur PPE."
            )
        }
    ],
}

# Canonical alias map: handles partial matches and common abbreviations
_ORG_ALIASES: Dict[str, str] = {
    "cpwd": "Central Public Works Department (CPWD)",
    "bis": "Bureau of Indian Standards (BIS)",
    "gem": "Government e-Marketplace (GeM)",
    "railways": "Ministry of Railways / Indian Railways (RDSO)",
    "rdso": "Ministry of Railways / Indian Railways (RDSO)",
    "indian railways": "Ministry of Railways / Indian Railways (RDSO)",
    "defence": "Ministry of Defence (DGQA / MES)",
    "dgqa": "Ministry of Defence (DGQA / MES)",
    "mes": "Ministry of Defence (DGQA / MES)",
    "dpiit": "Ministry of Commerce and Industry (DPIIT)",
    "cea": "Ministry of Power / Central Electricity Authority (CEA)",
    "mohua": "Ministry of Housing and Urban Affairs (MoHUA)",
    "morth": "Ministry of Road Transport and Highways (MoRTH / NHAI)",
    "nhai": "Ministry of Road Transport and Highways (MoRTH / NHAI)",
    "ntpc": "National Thermal Power Corporation (NTPC)",
    "sail": "Steel Authority of India Limited (SAIL)",
    "bhel": "Bharat Heavy Electricals Limited (BHEL)",
    "state pwd": "State Public Works Department (State PWD)",
    "state pwds": "State Public Works Department (State PWD)",
}

# Default fallback (CPWD generic)
_DEFAULT_ORG = "Central Public Works Department (CPWD)"


def resolve_org_key(organization: str) -> str:
    """Resolve organization string to canonical key, with fuzzy alias matching."""
    if not organization:
        return _DEFAULT_ORG

    # 1. Exact match
    if organization in ORG_BENCHMARKS:
        return organization

    # 2. Alias map (lowercase)
    org_lower = organization.strip().lower()
    for alias, canonical in _ORG_ALIASES.items():
        if alias in org_lower:
            return canonical

    # 3. Partial match against canonical keys
    for key in ORG_BENCHMARKS:
        if key.lower() in org_lower or org_lower in key.lower():
            return key

    # 4. Fallback
    return _DEFAULT_ORG


def get_benchmarks_for_org(organization: str) -> List[Dict[str, Any]]:
    """Return 4 benchmark scenarios for the given organization."""
    canonical = resolve_org_key(organization)
    return ORG_BENCHMARKS.get(canonical, ORG_BENCHMARKS[_DEFAULT_ORG])


# ─── API Endpoint ─────────────────────────────────────────────────────────────

@router.get("")
def fetch_org_benchmarks(
    organization: str = Query(
        default="",
        description="Full organization name as registered (e.g. 'Bharat Heavy Electricals Limited (BHEL)')"
    )
):
    """
    Return organization-specific benchmark scenarios for the Officer Dashboard.

    Each scenario includes both English (query) and Hindi (query_hi) tender text.
    The organization string is validated server-side against the canonical map.
    Unknown organizations receive a safe generic fallback (CPWD benchmarks).
    Results from running these benchmarks come from the real ManakSetu
    analysis pipeline — no hardcoded standards data is returned here.
    """
    canonical = resolve_org_key(organization)
    benchmarks = ORG_BENCHMARKS.get(canonical, ORG_BENCHMARKS[_DEFAULT_ORG])

    return {
        "organization": canonical,
        "requested_organization": organization,
        "total": len(benchmarks),
        "benchmarks": benchmarks,
        "note": (
            "Each benchmark includes English (query) and Hindi (query_hi) tender text. "
            "All standards, QCO, and compliance results are retrieved from the "
            "verified ManakSetu Knowledge Base via the real analysis pipeline."
        )
    }
