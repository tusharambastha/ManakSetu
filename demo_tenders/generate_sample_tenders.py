"""Generate sample PDF and DOCX tender documents for live testing and demonstration"""
import io
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor

DEMO_DIR = Path(__file__).parent

def create_electrical_tender_docx():
    doc = Document()
    title = doc.add_heading("CENTRAL PUBLIC WORKS DEPARTMENT (CPWD)", 0)
    title.runs[0].font.color.rgb = RGBColor(33, 82, 120)

    doc.add_paragraph("NIT Reference: CPWD/EE/ELECT/2026/048\nDate of Issue: 15-September-2026")
    doc.add_paragraph("NOTICE INVITING TENDER FOR INTERNAL ELECTRIFICATION WORKS AT NEW SECRETARIAT COMPLEX")

    # Section I: General Conditions
    doc.add_heading("Section I: Eligibility & General Conditions", level=1)
    doc.add_paragraph(
        "1.1 The bidder must be an authorized class-1 electrical contractor registered with CPWD or State PWD.\n"
        "1.2 Earnest Money Deposit: INR 2,50,000 to be deposited via electronic RTGS/NEFT.\n"
        "1.3 Bids shall remain valid for 90 days from the date of technical bid opening."
    )

    # Section IV: Technical Specifications (the section SETU isolates)
    doc.add_heading("Section IV: Technical Specifications and Schedule of Requirements", level=1)
    doc.add_paragraph(
        "4.1 Wiring Cables: Supply and laying of 1100V working voltage grade PVC insulated single-core and multi-core "
        "flexible copper conductor building wires with Flame Retardant Low Smoke (FRLS) insulation. Conductor purity must conform to "
        "electrolytic tough pitch copper.\n"
        "4.2 Distribution Switchgear: Miniature Circuit Breakers (MCB) of breaking capacity 10 kA, C-curve characteristics, "
        "for 16A and 32A lighting and power circuits. Sub-main boards must include 30mA residual current protection for shock prevention.\n"
        "4.3 Conduit System: Rigid plain non-metallic PVC conduits of heavy mechanical stress class for concealed wall and ceiling wiring.\n"
        "4.4 Plugs & Sockets: 6A and 16A modular 3-pin shuttered socket-outlets with copper alloy contacts."
    )

    # Section V: Commercial Terms
    doc.add_heading("Section V: Commercial Terms and Payment Conditions", level=1)
    doc.add_paragraph(
        "5.1 Payment terms: 80% against delivery and physical verification, 20% on successful installation.\n"
        "5.2 Liquidated damages shall be applicable at 0.5% per week of delay up to a maximum of 10%."
    )

    file_path = DEMO_DIR / "Sample_CPWD_Electrical_Cable_Tender.docx"
    doc.save(file_path)
    print(f"Created: {file_path}")

def create_ppe_safety_tender_docx():
    doc = Document()
    title = doc.add_heading("STEEL AUTHORITY OF INDIA LIMITED (SAIL)", 0)
    title.runs[0].font.color.rgb = RGBColor(33, 82, 120)

    doc.add_paragraph("Global Tender Notice: SAIL/SAFETY/PPE/2026/102\nProcurement of Personal Protective Equipment")

    doc.add_heading("Technical Specifications", level=1)
    doc.add_paragraph(
        "Item 1: Industrial Safety Helmets — High-density polyethylene shell equipped with 4-point fabric harness, "
        "adjustable ratchet suspension, chin-strap, providing impact protection and electrical insulation resistance up to 440 V.\n\n"
        "Item 2: Safety Footwear — Ankle-cut safety shoes with genuine split leather uppers, fitted with steel toe caps tested "
        "for 200 Joules impact energy resistance, anti-static slip-resistant PU soles, and penetration-resistant midsole inserts.\n\n"
        "Item 3: Protective Safety Goggles — Clear polycarbonate impact-resistant lenses with UV radiation shielding and anti-fog coating."
    )

    doc.add_heading("Commercial Conditions", level=1)
    doc.add_paragraph("All items must have valid manufacturer warranty of minimum 12 months.")

    file_path = DEMO_DIR / "Sample_SAIL_PPE_Safety_Tender.docx"
    doc.save(file_path)
    print(f"Created: {file_path}")

def main():
    DEMO_DIR.mkdir(parents=True, exist_ok=True)
    create_electrical_tender_docx()
    create_ppe_safety_tender_docx()

if __name__ == "__main__":
    main()
