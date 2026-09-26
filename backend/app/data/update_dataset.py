"""Transform standards_dataset.json to include Step 1 verification fields,
apply Batch A verified records, and set Batch B records to unverified defaults.
"""
import json
from pathlib import Path

DATA_FILE = Path(__file__).parent / "standards_dataset.json"

BATCH_A_UPDATES = {
    "IS 2925:1984": {
        "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/1258",
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/1258",
        "last_verified_on": "2026-09-24",
        "status_verified": True,
        "status_current": "active",
        "status": "active",
        "superseded_by": None,
        "status_in_text": "Second Revision (Reaffirmed 2020) with Amendments 1-3",
        "current_version": "IS 2925:1984 (Reaffirmed 2020) with Amendments 1-3",
        "qco_reference": "S.O. 4649(E) dated 23-10-2023",
        "qco_verified": True,
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Helmet for Police Force, Civil Defence and Personal Protection (Quality Control) Order, 2023",
            "notifying_ministry": "Ministry of Commerce and Industry / DPIIT",
            "details": "Mandatory ISI mark under BIS Scheme-I per S.O. 4649(E) dated 23 Oct 2023."
        },
        "verification_notes": "Verified on BIS 'Know Your Standard' portal and DPIIT Gazette notification S.O. 4649(E). Active standard under mandatory Scheme-I certification.",
        "related_standards": [
            {
                "standard_no": "IS 9873 (Part 1)",
                "target_standard_no": "IS 9873 (Part 1)",
                "target_title": "Safety of Toys / Mechanical Impact Test Methods",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Drop impact and mechanical energy measurement procedures"
            },
            {
                "standard_no": "IS 2314",
                "target_standard_no": "IS 2314",
                "target_title": "Specification for Hard Hat Chinstraps",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Tensile breaking strength and buckle release requirements for chinstraps"
            },
            {
                "standard_no": "IS 16890:2018",
                "target_standard_no": "IS 16890:2018",
                "target_title": "Helmets for Firefighters - Structural Firefighting",
                "relation_type": "related_product",
                "relation_verified": True,
                "description": "High-temperature radiant heat resistant helmets for firefighting teams"
            },
            {
                "standard_no": "IS 4151:2015",
                "target_standard_no": "IS 4151:2015",
                "target_title": "Protective Helmets for Two-Wheeler Motorcyclists",
                "relation_type": "related_product",
                "relation_verified": True,
                "description": "Vehicular crash protective helmets (distinct from industrial falling-object helmets)"
            },
            {
                "standard_no": "IS 5983:1980",
                "target_standard_no": "IS 5983:1980",
                "target_title": "Eye Protectors",
                "relation_type": "safety",
                "relation_verified": True,
                "description": "Normative eye and face shield integration for head-gear assemblies"
            }
        ]
    },
    "IS 15298 (Part 2):2016": {
        "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/32770",
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/32770",
        "last_verified_on": "2026-09-24",
        "status_verified": True,
        "status_current": "active",
        "status": "active",
        "superseded_by": None,
        "status_in_text": "Second Revision (identical to ISO 20345:2011)",
        "current_version": "IS 15298 (Part 2):2016 / ISO 20345:2011",
        "qco_reference": "S.O. 1421(E) dated 15-03-2024",
        "qco_verified": True,
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Footwear made from Leather and other Materials (Quality Control) Order, 2024",
            "notifying_ministry": "DPIIT, Ministry of Commerce and Industry",
            "details": "Mandatory ISI Mark certification under Scheme-I of BIS Act, 2016 per S.O. 1421(E) dated 15 Mar 2024."
        },
        "verification_notes": "Verified on BIS portal and DPIIT Footwear QCO 2024 (S.O. 1421(E)). Active standard for industrial safety footwear.",
        "related_standards": [
            {
                "standard_no": "IS 15298 (Part 1):2011",
                "target_standard_no": "IS 15298 (Part 1):2011",
                "target_title": "Test Methods for Footwear",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Methods for testing impact resistance, compression, and tear strength"
            },
            {
                "standard_no": "IS 15298 (Part 3):2019",
                "target_standard_no": "IS 15298 (Part 3):2019",
                "target_title": "Protective Footwear (100 Joule Impact)",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Footwear for intermediate mechanical hazard exposure"
            },
            {
                "standard_no": "IS 15298 (Part 4):2017",
                "target_standard_no": "IS 15298 (Part 4):2017",
                "target_title": "Occupational Footwear (No Toe Cap)",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Slip and penetration resistant footwear without steel toe caps"
            },
            {
                "standard_no": "IS 1989 (Part 1):1986",
                "target_standard_no": "IS 1989 (Part 1):1986",
                "target_title": "Leather Safety Boots for Miners",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Specific mining safety footwear standard"
            },
            {
                "standard_no": "IS 5852:2004",
                "target_standard_no": "IS 5852:2004",
                "target_title": "Protective Steel Toe Caps for Footwear",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "200 Joule drop hammer impact testing requirements for toe inserts"
            }
        ]
    },
    "IS 1989 (Part 1):1986": {
        "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/1075",
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/1075",
        "last_verified_on": "2026-09-24",
        "status_verified": True,
        "status_current": "active",
        "status": "active",
        "superseded_by": None,
        "status_in_text": "Third Revision (Reaffirmed April 2022) with Amendments 1-2",
        "current_version": "IS 1989 (Part 1):1986 (Third Revision, Reaffirmed April 2022) with Amendments 1-2",
        "qco_reference": "S.O. 1421(E) dated 15-03-2024",
        "qco_verified": True,
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Footwear made from Leather and other Materials (Quality Control) Order, 2024",
            "notifying_ministry": "DPIIT, Ministry of Commerce and Industry",
            "details": "Mandatory ISI mark under Scheme-I per S.O. 1421(E) dated 15 Mar 2024 for leather safety boots for miners."
        },
        "verification_notes": "Verified on BIS 'Know Your Standard' portal and DPIIT Gazette notification S.O. 1421(E). Active standard specifically governing Leather safety boots for miners; NOT superseded by IS 15298 (Part 2).",
        "related_standards": [
            {
                "standard_no": "IS 15298 (Part 2):2016",
                "target_standard_no": "IS 15298 (Part 2):2016",
                "target_title": "Personal Protective Equipment - Part 2: Safety Footwear",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "General industrial safety footwear specification"
            },
            {
                "standard_no": "IS 5852:2004",
                "target_standard_no": "IS 5852:2004",
                "target_title": "Protective Steel Toe Caps for Footwear",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Impact testing requirements for protective toe inserts"
            },
            {
                "standard_no": "IS 578:1989",
                "target_standard_no": "IS 578:1989",
                "target_title": "Full-Chrome Upper Leather - Specification",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Raw material specifications for leather upper"
            }
        ]
    },
    "IS 9473:2002": {
        "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/1344",
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/1344",
        "last_verified_on": "2026-09-24",
        "status_verified": True,
        "status_current": "active",
        "status": "active",
        "superseded_by": None,
        "status_in_text": "First Revision (Reaffirmed 2019) with Amendments 1-2",
        "current_version": "IS 9473:2002 (Reaffirmed 2019)",
        "qco_reference": None,
        "qco_verified": False,
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": False,
            "order_name": None,
            "notifying_ministry": "DPIIT",
            "details": "Voluntary / Product Certification Scheme-I available. Mandatory statutory QCO Gazette notification not found."
        },
        "verification_notes": "Standard verified ACTIVE on BIS portal under Product Certification Scheme-I. No separate mandatory statutory QCO gazette notification order number found; qco_verified set to false per rule e.",
        "related_standards": [
            {
                "standard_no": "IS 14166:1994",
                "target_standard_no": "IS 14166:1994",
                "target_title": "Respiratory Protective Devices - Full-Face Masks",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Requirements for full-face masks covering eyes, nose, and mouth"
            },
            {
                "standard_no": "IS 15321:2003",
                "target_standard_no": "IS 15321:2003",
                "target_title": "Methods of Test for Eye, Face and Respiratory Protective Devices - Total Inward Leakage",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Measurement of inward leakage using sodium chloride aerosol"
            },
            {
                "standard_no": "IS 15322:2003",
                "target_standard_no": "IS 15322:2003",
                "target_title": "Breathing Resistance Test Methods for Respiratory Devices",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Inhalation and exhalation airflow resistance measurement"
            },
            {
                "standard_no": "IS 9623:2008",
                "target_standard_no": "IS 9623:2008",
                "target_title": "Selection, Use and Maintenance of Respiratory Protective Devices - Code of Practice",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Guidelines for workplace hazard assessment and respirator fit testing"
            }
        ]
    },
    "IS 694:2010": {
        "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2646",
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2646",
        "last_verified_on": "2026-09-24",
        "status_verified": True,
        "status_current": "active",
        "status": "active",
        "superseded_by": None,
        "status_in_text": "Fifth Revision (Reaffirmed 2020) with Amendments 1-2",
        "current_version": "IS 694:2010 (Fifth Revision, Reaffirmed 2020)",
        "qco_reference": "S.O. 189(E) dated 17-02-2003",
        "qco_verified": True,
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Electrical Wires, Cables, Appliances and Protection Devices and Accessories (Quality Control) Order, 2003",
            "notifying_ministry": "Ministry of Commerce and Industry / DPIIT",
            "details": "Mandatory ISI certification mark under Scheme-I per S.O. 189(E) dated 17 Feb 2003 and Cables (Quality Control) Order."
        },
        "verification_notes": "Verified on BIS portal and Gazette of India S.O. 189(E). Mandatory ISI certification mark under Scheme-I.",
        "related_standards": [
            {
                "standard_no": "IS 8130:2013",
                "target_standard_no": "IS 8130:2013",
                "target_title": "Conductors for Insulated Electric Cables and Flexible Cords",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Normative conductor cross-sections, resistance limits, and copper/aluminium wire purity"
            },
            {
                "standard_no": "IS 5831:1984",
                "target_standard_no": "IS 5831:1984",
                "target_title": "PVC Insulation and Sheath of Electric Cables",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Formulation specifications for Type A, C, and ST-1 / ST-2 PVC compounds"
            },
            {
                "standard_no": "IS 10810 (Part 44):1984",
                "target_standard_no": "IS 10810 (Part 44):1984",
                "target_title": "Methods of Test for Cables - Part 44: Spark Test",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Spark test on complete length of extruded insulation to verify absence of pinholes and defects"
            },
            {
                "standard_no": "IS 10810 (Part 5):1984",
                "target_standard_no": "IS 10810 (Part 5):1984",
                "target_title": "Methods of Test for Cables - Part 5: Conductor Resistance Test",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Electrical resistance measurement of copper and aluminium conductors"
            },
            {
                "standard_no": "IS 9537 (Part 3):1983",
                "target_standard_no": "IS 9537 (Part 3):1983",
                "target_title": "Rigid Plain Conduits of Insulating Material (PVC Conduits)",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Normative companion for enclosed building wire installations"
            }
        ]
    },
    "IS 7098 (Part 1):1988": {
        "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2789",
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2789",
        "last_verified_on": "2026-09-24",
        "status_verified": True,
        "status_current": "active",
        "status": "active",
        "superseded_by": None,
        "status_in_text": "Second Revision (Reaffirmed 2020) with Amendments 1-2",
        "current_version": "IS 7098 (Part 1):1988 (Reaffirmed 2020)",
        "qco_reference": "S.O. 294(E) dated 21-01-2020",
        "qco_verified": True,
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Cables (Quality Control) Order, 2020",
            "notifying_ministry": "DPIIT, Ministry of Commerce and Industry",
            "details": "Mandatory ISI mark under Scheme-I for XLPE cables up to 1100 V per S.O. 294(E)."
        },
        "verification_notes": "Verified on BIS portal and DPIIT gazette notification S.O. 294(E). Active standard specifically for XLPE insulated cables.",
        "related_standards": [
            {
                "standard_no": "IS 7098 (Part 2):2011",
                "target_standard_no": "IS 7098 (Part 2):2011",
                "target_title": "XLPE Insulated Cables from 3.3 kV up to 33 kV",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Medium and high-voltage distribution companion standard"
            },
            {
                "standard_no": "IS 8130:2013",
                "target_standard_no": "IS 8130:2013",
                "target_title": "Conductors for Insulated Electric Cables and Flexible Cords",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Normative conductor cross-sections, resistance limits, and material purity"
            },
            {
                "standard_no": "IS 5831:1984",
                "target_standard_no": "IS 5831:1984",
                "target_title": "PVC Insulation and Sheath of Electric Cables",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Outer sheath compound requirements"
            },
            {
                "standard_no": "IS 10810 (Part 30):1984",
                "target_standard_no": "IS 10810 (Part 30):1984",
                "target_title": "Methods of Test for Cables - Part 30: Hot Set Test",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Mandatory thermal cross-linking test for XLPE insulation"
            },
            {
                "standard_no": "IS 10810 (Part 44):1984",
                "target_standard_no": "IS 10810 (Part 44):1984",
                "target_title": "Methods of Test for Cables - Part 44: Spark Test",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Spark test on cable core insulation"
            }
        ]
    },
    "IS 1554 (Part 1):1988": {
        "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2765",
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2765",
        "last_verified_on": "2026-09-24",
        "status_verified": True,
        "status_current": "active",
        "status": "active",
        "superseded_by": None,
        "status_in_text": "Third Revision (Reaffirmed 2020) with Amendments 1-5",
        "current_version": "IS 1554 (Part 1):1988 (Third Revision, Reaffirmed 2020) with Amendments 1-5",
        "qco_reference": "S.O. 294(E) dated 21-01-2020",
        "qco_verified": True,
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Cables (Quality Control) Order, 2020",
            "notifying_ministry": "DPIIT, Ministry of Commerce and Industry",
            "details": "Mandatory ISI mark under Scheme-I per S.O. 294(E) dated 21 Jan 2020."
        },
        "verification_notes": "Verified on BIS portal and DPIIT Gazette S.O. 294(E). Confirmed ACTIVE and NOT superseded by IS 7098 (Part 1). Covers heavy-duty PVC insulated cables (distinct product from XLPE).",
        "related_standards": [
            {
                "standard_no": "IS 8130:2013",
                "target_standard_no": "IS 8130:2013",
                "target_title": "Conductors for Insulated Electric Cables and Flexible Cords",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Normative conductor cross-sections, resistance limits, and material purity"
            },
            {
                "standard_no": "IS 5831:1984",
                "target_standard_no": "IS 5831:1984",
                "target_title": "PVC Insulation and Sheath of Electric Cables",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Formulation specifications for Type A, C, and ST-1 / ST-2 PVC compounds"
            },
            {
                "standard_no": "IS 10810 (Part 45):1984",
                "target_standard_no": "IS 10810 (Part 45):1984",
                "target_title": "Methods of Test for Cables - Part 45: High Voltage Test",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "High voltage AC withstand test for heavy-duty power cables"
            },
            {
                "standard_no": "IS 10810 (Part 44):1984",
                "target_standard_no": "IS 10810 (Part 44):1984",
                "target_title": "Methods of Test for Cables - Part 44: Spark Test",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Spark test for cable insulation defect detection"
            }
        ]
    },
    "IS/IEC 60898-1:2015": {
        "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/33621",
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/33621",
        "last_verified_on": "2026-09-24",
        "status_verified": True,
        "status_current": "active",
        "status": "active",
        "superseded_by": None,
        "status_in_text": "Identical adoption of IEC 60898-1:2015 (Reaffirmed 2020)",
        "current_version": "IS/IEC 60898-1:2015 (Reaffirmed 2020)",
        "qco_reference": "S.O. 4509(E) dated 11-11-2020",
        "qco_verified": True,
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Low-Voltage Switchgear and Controlgear (Quality Control) Order, 2020",
            "notifying_ministry": "Ministry of Heavy Industries / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I for circuit breakers up to 125 A per S.O. 4509(E)."
        },
        "verification_notes": "Verified on BIS portal and Gazette of India S.O. 4509(E). Mandatory ISI mark under Scheme-I.",
        "related_standards": [
            {
                "standard_no": "IS 12640 (Part 1):2016",
                "target_standard_no": "IS 12640 (Part 1):2016",
                "target_title": "Residual Current Circuit Breakers (RCCBs) Without Integral Overcurrent Protection",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Companion earth leakage fault protection device for consumer distribution boards"
            },
            {
                "standard_no": "IS/IEC 60947-2:2016",
                "target_standard_no": "IS/IEC 60947-2:2016",
                "target_title": "Low-Voltage Switchgear and Controlgear - Part 2: Circuit-Breakers (MCCB)",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Industrial feeder and high breaking capacity circuit breaker standard"
            },
            {
                "standard_no": "IS 13032:1991",
                "target_standard_no": "IS 13032:1991",
                "target_title": "Miniature Circuit-Breaker Boards for Low-Voltage Applications",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Enclosure and mounting busbar distribution box specifications"
            }
        ]
    },
    "IS 1786:2008": {
        "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/3412",
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/3412",
        "last_verified_on": "2026-09-24",
        "status_verified": True,
        "status_current": "active",
        "status": "active",
        "superseded_by": None,
        "status_in_text": "Fourth Revision (Reaffirmed 2023) with Amendments 1-3",
        "current_version": "IS 1786:2008 (Fourth Revision, Reaffirmed 2023)",
        "qco_reference": "S.O. 1673(E) dated 27-05-2020",
        "qco_verified": True,
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Steel and Steel Products (Quality Control) Order, 2020",
            "notifying_ministry": "Ministry of Steel / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I per S.O. 1673(E). No manufacturer or trader can sell TMT bars >= 8mm without valid BIS license."
        },
        "verification_notes": "Verified on BIS portal and Ministry of Steel Gazette notification S.O. 1673(E). Mandatory ISI mark under Scheme-I.",
        "related_standards": [
            {
                "standard_no": "IS 456:2000",
                "target_standard_no": "IS 456:2000",
                "target_title": "Plain and Reinforced Concrete - Code of Practice",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "National structural concrete design code governing development length and bar spacing"
            },
            {
                "standard_no": "IS 1608 (Part 1):2022",
                "target_standard_no": "IS 1608 (Part 1):2022",
                "target_title": "Metallic Materials — Tensile Testing — Part 1: Method of Test at Room Temperature",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Normative proof stress (0.2%), ultimate tensile strength, and percentage elongation test (updated to current 2022 edition)"
            },
            {
                "standard_no": "IS 1599:2019",
                "target_standard_no": "IS 1599:2019",
                "target_title": "Metallic Materials - Bend Test",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Mandatory 180-degree bend and rebend test around specified mandrel diameters"
            },
            {
                "standard_no": "IS 13920:2016",
                "target_standard_no": "IS 13920:2016",
                "target_title": "Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces",
                "relation_type": "safety",
                "relation_verified": True,
                "description": "Code of practice mandating Fe 415D / Fe 500D rebars in earthquake zones III, IV, and V"
            }
        ]
    },
    "IS 456:2000": {
        "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2141",
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2141",
        "last_verified_on": "2026-09-24",
        "status_verified": True,
        "status_current": "active",
        "status": "active",
        "superseded_by": None,
        "status_in_text": "Fourth Revision (Reviewed 2025, Amendments 1-6)",
        "current_version": "IS 456:2000 (Fourth Revision, Reviewed 2025) with Amendments 1-6",
        "qco_reference": None,
        "qco_verified": False,
        "certification": {
            "scheme": "None",
            "is_mandatory": False,
            "order_name": "National Building Code of India (NBC) / CPWD Mandate",
            "notifying_ministry": "Ministry of Housing and Urban Affairs",
            "details": "Code of Practice; not a manufactured product covered under BIS certification mark scheme or product QCO. Cited normatively in public works contracts."
        },
        "verification_notes": "Verified on BIS portal. IS 456 is an engineering design Code of Practice, not a manufactured product, hence no product QCO exists.",
        "related_standards": [
            {
                "standard_no": "IS 516 (Part 1/Sec 1):2021",
                "target_standard_no": "IS 516 (Part 1/Sec 1):2021",
                "target_title": "Hardened Concrete - Methods of Test - Compressive Strength",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Compressive testing of 150 mm concrete cubes at 7 and 28 days"
            },
            {
                "standard_no": "IS 1199 (Part 2):2018",
                "target_standard_no": "IS 1199 (Part 2):2018",
                "target_title": "Fresh Concrete - Methods of Sampling, Testing and Analysis - Workability",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Slump test and flow table workability determinations on site"
            },
            {
                "standard_no": "IS 4926:2003",
                "target_standard_no": "IS 4926:2003",
                "target_title": "Ready-Mixed Concrete - Code of Practice",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Production and quality control criteria for commercial RMC batching plants"
            },
            {
                "standard_no": "IS 1786:2008",
                "target_standard_no": "IS 1786:2008",
                "target_title": "High Strength Deformed Steel Bars for Concrete Reinforcement",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Reinforcement specifications for RCC members"
            },
            {
                "standard_no": "IS 269:2015",
                "target_standard_no": "IS 269:2015",
                "target_title": "Ordinary Portland Cement - Specification",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Cement binder specification for structural concrete"
            }
        ]
    },
    "IS 12269:2013": {
        "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/5921",
        "source_ref": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/5921",
        "last_verified_on": "2026-09-24",
        "status_verified": True,
        "status_current": "superseded",
        "status": "superseded",
        "superseded_by": "IS 269:2015",
        "status_in_text": "Withdrawn as of 14-03-2022; amalgamated into IS 269:2015 (Ordinary Portland Cement - Specification)",
        "current_version": "Withdrawn (effective 14-03-2022); superseded by IS 269:2015",
        "qco_reference": "S.O. 1533(E) dated 28-04-2017",
        "qco_verified": True,
        "certification": {
            "scheme": "BIS Product Certification",
            "is_mandatory": True,
            "order_name": "Cement (Quality Control) Order",
            "notifying_ministry": "Ministry of Commerce and Industry / DPIIT",
            "details": "Mandatory ISI mark under Scheme-I for cement. 53 Grade now certified under unified standard IS 269:2015."
        },
        "verification_notes": "Verified on BIS portal: IS 12269:2013 was WITHDRAWN on 14 March 2022 and amalgamated into IS 269:2015. Deprecation shield routes procurement officers to IS 269:2015.",
        "related_standards": [
            {
                "standard_no": "IS 269:2015",
                "target_standard_no": "IS 269:2015",
                "target_title": "Ordinary Portland Cement - Specification",
                "relation_type": "superseded_by",
                "relation_verified": True,
                "description": "Unified standard replacing IS 12269:2013, IS 8112:2013, and IS 269:1989"
            },
            {
                "standard_no": "IS 8112:2013",
                "target_standard_no": "IS 8112:2013",
                "target_title": "Ordinary Portland Cement, 43 Grade - Specification",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "43 Grade Portland Cement specification"
            },
            {
                "standard_no": "IS 1489 (Part 1):2015",
                "target_standard_no": "IS 1489 (Part 1):2015",
                "target_title": "Portland Pozzolana Cement - Part 1: Fly Ash Based",
                "relation_type": "normative_reference",
                "relation_verified": True,
                "description": "Blended cement alternative for general construction"
            },
            {
                "standard_no": "IS 4031 (Part 6):1988",
                "target_standard_no": "IS 4031 (Part 6):1988",
                "target_title": "Methods of Physical Tests for Hydraulic Cement - Compressive Strength",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Mortar cube 28-day 53 MPa compressive strength compliance method"
            },
            {
                "standard_no": "IS 4031 (Part 5):1988",
                "target_standard_no": "IS 4031 (Part 5):1988",
                "target_title": "Methods of Physical Tests for Hydraulic Cement - Setting Time",
                "relation_type": "test_method",
                "relation_verified": True,
                "description": "Initial and final setting time test by Vicat apparatus"
            }
        ]
    }
}

def update_dataset():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"Loaded {len(data)} records.")
    
    for item in data:
        std_no = item["standard_no"]
        if std_no in BATCH_A_UPDATES:
            # Apply Batch A verified details
            updates = BATCH_A_UPDATES[std_no]
            for k, v in updates.items():
                item[k] = v
        else:
            # Batch B: Apply Step 1 schema defaults (unverified)
            item.setdefault("source_url", item.get("source_ref"))
            item["last_verified_on"] = None
            item["status_verified"] = False
            item["status_current"] = item.get("status", "active")
            item["status_in_text"] = None
            item["qco_reference"] = None
            item["qco_verified"] = False
            item["verification_notes"] = "Pending verification in Batch B."

            # Update related_standards entries
            updated_rels = []
            for rel in item.get("related_standards", []):
                t_no = rel.get("target_standard_no") or rel.get("standard_no")
                updated_rels.append({
                    "standard_no": rel.get("standard_no") or t_no,
                    "target_standard_no": t_no,
                    "target_title": rel.get("target_title"),
                    "relation_type": rel.get("relation_type", "normative_reference"),
                    "relation_verified": False,
                    "description": rel.get("description")
                })
            item["related_standards"] = updated_rels

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("Dataset updated successfully!")

if __name__ == "__main__":
    update_dataset()
