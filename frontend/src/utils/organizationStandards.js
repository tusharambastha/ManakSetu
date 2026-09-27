/**
 * Organization Standards Mapping & Domain Taxonomy for ManakSetu
 * Maps each of the 13 verified government organizations to their tailored
 * procurement domains, curated standards, and sector categories.
 */

export const ORG_STANDARDS_TAXONOMY = {
  "Ministry of Railways / Indian Railways (RDSO)": {
    shortName: "Indian Railways (RDSO)",
    icon: "🚆",
    themeColor: "indigo",
    badgeLabel: "Railway Procurement Mandate",
    domains: [
      {
        id: "railway-cables",
        name: "Railway Traction & Station Power Cables",
        name_hi: "रेलवे ट्रैक्शन एवं स्टेशन पावर केबल",
        standard_nos: ["IS 694:2010", "IS 7098 (Part 1):1988", "IS 1554 (Part 1):1988", "IS 7098 (Part 2):2011", "IS 732:2019", "IS 3043:2018"]
      },
      {
        id: "railway-structural",
        name: "Track, FOB & Structural Steel Fabrication",
        name_hi: "ट्रैक, फुट ओवरब्रिज एवं संरचनात्मक इस्पात",
        standard_nos: ["IS 2062:2011", "IS 800:2007", "IS 1786:2008", "IS 13920:2016"]
      },
      {
        id: "railway-ppe",
        name: "Track & Overhead Equipment Workforce Safety (PPE)",
        name_hi: "ट्रैक एवं ओएचई श्रमिक सुरक्षा उपकरण",
        standard_nos: ["IS 2925:1984", "IS 15809:2017", "IS 3521 (Part 1):1999", "IS 15298 (Part 2):2016", "IS 4770:1991", "IS 5983:1980"]
      },
      {
        id: "railway-civil",
        name: "Station Infrastructure, Water Supply & Drainage",
        name_hi: "स्टेशन बुनियादी ढांचा, जलापूर्ति एवं जल निकासी",
        standard_nos: ["IS 4984:2016", "IS 8329:2000", "IS 456:2000", "IS 269:2015", "IS 458:2003"]
      }
    ]
  },

  "Bharat Heavy Electricals Limited (BHEL)": {
    shortName: "BHEL",
    icon: "⚡",
    themeColor: "amber",
    badgeLabel: "Heavy Electrical Mandate",
    domains: [
      {
        id: "bhel-cables",
        name: "Heavy Duty Power, Control & Switchyard Cabling",
        name_hi: "हैवी ड्यूटी पावर, कंट्रोल एवं स्विचयार्ड केबलिंग",
        standard_nos: ["IS 1554 (Part 1):1988", "IS 7098 (Part 1):1988", "IS 7098 (Part 2):2011", "IS 694:2010", "IS 9537 (Part 2):1981", "IS 3043:2018"]
      },
      {
        id: "bhel-switchgear",
        name: "LV Switchgear, Transformers & Motor Control Panels",
        name_hi: "एलवी स्विचगियर, ट्रांसफॉर्मर एवं मोटर कंट्रोल पैनल",
        standard_nos: ["IS/IEC 60947-2:2016", "IS 1180 (Part 1):2014", "IS/IEC 60898-1:2015", "IS 12640 (Part 1):2016"]
      },
      {
        id: "bhel-ppe",
        name: "Heavy Engineering & High Voltage Safety Gear",
        name_hi: "हैवी इंजीनियरिंग एवं हाई वोल्टेज सुरक्षा उपकरण",
        standard_nos: ["IS 2925:1984", "IS 4770:1991", "IS 3521 (Part 1):1999", "IS 15298 (Part 2):2016", "IS 5983:1980", "IS 6994 (Part 1):1973"]
      },
      {
        id: "bhel-structural",
        name: "Plant Structures, Turbines & Boiler Fabrication Steel",
        name_hi: "प्लांट संरचना, टरबाइन एवं बॉयलर फैब्रिकेशन स्टील",
        standard_nos: ["IS 2062:2011", "IS 800:2007", "IS 1786:2008"]
      }
    ]
  },

  "Central Public Works Department (CPWD)": {
    shortName: "CPWD",
    icon: "🏗️",
    themeColor: "sky",
    badgeLabel: "Civil Works & Buildings Mandate",
    domains: [
      {
        id: "cpwd-cement",
        name: "RCC Structural Works, Cements & Concretes",
        name_hi: "आरसीसी संरचनात्मक कार्य, सीमेंट एवं कंक्रीट",
        standard_nos: ["IS 269:2015", "IS 1489 (Part 1):2015", "IS 456:2000", "IS 4926:2003", "IS 383:2016", "IS 12269:2013", "IS 8112:2013"]
      },
      {
        id: "cpwd-tmt",
        name: "Fe 500D TMT Reinforcement & Structural Steel",
        name_hi: "Fe 500D टीएमटी रिइन्फोर्समेंट एवं संरचनात्मक इस्पात",
        standard_nos: ["IS 1786:2008", "IS 2062:2011", "IS 800:2007", "IS 13920:2016", "IS 2185 (Part 1):2005"]
      },
      {
        id: "cpwd-electrical",
        name: "Government Buildings Electrical Wiring, MCBs & Lighting",
        name_hi: "सरकारी भवनों की विद्युत वायरिंग, एमसीबी एवं प्रकाश व्यवस्था",
        standard_nos: ["IS 694:2010", "IS 732:2019", "IS 9537 (Part 3):1983", "IS/IEC 60898-1:2015", "IS 12640 (Part 1):2016", "IS 1293:2019", "IS 3854:1988", "IS 16102 (Part 1):2012", "IS 10322 (Part 5/Sec 1):2012"]
      },
      {
        id: "cpwd-safety",
        name: "Construction Site Engineers & Workforce PPE",
        name_hi: "निर्माण स्थल इंजीनियर एवं श्रमिक सुरक्षा उपकरण",
        standard_nos: ["IS 2925:1984", "IS 15298 (Part 2):2016", "IS 3521 (Part 1):1999", "IS 1322:1993"]
      }
    ]
  },

  "National Thermal Power Corporation (NTPC)": {
    shortName: "NTPC",
    icon: "🔥",
    themeColor: "orange",
    badgeLabel: "Power Generation Mandate",
    domains: [
      {
        id: "ntpc-cables",
        name: "Thermal Power Station Auxiliary & Control Cables",
        name_hi: "थर्मल पावर स्टेशन सहायक एवं नियंत्रण केबल",
        standard_nos: ["IS 7098 (Part 1):1988", "IS 7098 (Part 2):2011", "IS 1554 (Part 1):1988", "IS 694:2010", "IS 3043:2018"]
      },
      {
        id: "ntpc-switchgear",
        name: "LT Distribution Panels, Switchgear & Transformers",
        name_hi: "एलटी वितरण पैनल, स्विचगियर एवं ट्रांसफॉर्मर",
        standard_nos: ["IS/IEC 60947-2:2016", "IS 1180 (Part 1):2014", "IS/IEC 60898-1:2015", "IS 13779:1999"]
      },
      {
        id: "ntpc-ppe",
        name: "Power Plant Operational Safety & Electrical PPE",
        name_hi: "पावर प्लांट परिचालन सुरक्षा एवं इलेक्ट्रिकल पीपीई",
        standard_nos: ["IS 2925:1984", "IS 4770:1991", "IS 15298 (Part 2):2016", "IS 3521 (Part 1):1999", "IS 9473:2002", "IS 5983:1980"]
      },
      {
        id: "ntpc-civil",
        name: "Power Station Civil Foundations & Structural Frameworks",
        name_hi: "पावर स्टेशन सिविल नींव एवं संरचनात्मक ढांचा",
        standard_nos: ["IS 2062:2011", "IS 800:2007", "IS 456:2000", "IS 1786:2008", "IS 383:2016"]
      }
    ]
  },

  "Steel Authority of India Limited (SAIL)": {
    shortName: "SAIL",
    icon: "⚙️",
    themeColor: "slate",
    badgeLabel: "Steel & Metallurgy Mandate",
    domains: [
      {
        id: "sail-tmt",
        name: "High-Strength TMT Rebars & Seismic Steels",
        name_hi: "उच्च शक्ति टीएमटी सरिया एवं भूकंपरोधी इस्पात",
        standard_nos: ["IS 1786:2008", "IS 13920:2016", "IS 2062:2011"]
      },
      {
        id: "sail-structural",
        name: "Hot-Rolled Structural Steel Sections & Plates",
        name_hi: "हॉट-रोल्ड संरचनात्मक इस्पात सेक्शन एवं प्लेट",
        standard_nos: ["IS 2062:2011", "IS 800:2007"]
      },
      {
        id: "sail-concrete",
        name: "Steel Plant Civil Infrastructure & Heavy Foundations",
        name_hi: "इस्पात संयंत्र सिविल बुनियादी ढांचा एवं भारी नींव",
        standard_nos: ["IS 456:2000", "IS 4926:2003", "IS 383:2016", "IS 269:2015"]
      },
      {
        id: "sail-safety",
        name: "Blast Furnace & Rolling Mill Workforce PPE",
        name_hi: "ब्लास्ट फर्नेस एवं रोलिंग मिल श्रमिक सुरक्षा उपकरण",
        standard_nos: ["IS 2925:1984", "IS 15298 (Part 2):2016", "IS 6994 (Part 1):1973", "IS 5983:1980", "IS 1554 (Part 1):1988"]
      }
    ]
  },

  "Ministry of Road Transport and Highways (MoRTH / NHAI)": {
    shortName: "NHAI / MoRTH",
    icon: "🛣️",
    themeColor: "emerald",
    badgeLabel: "National Highways Mandate",
    domains: [
      {
        id: "nhai-cement",
        name: "Rigid Pavements, Highway Cements & Concretes",
        name_hi: "दृढ़ फुटपाथ, राजमार्ग सीमेंट एवं कंक्रीट",
        standard_nos: ["IS 269:2015", "IS 1489 (Part 1):2015", "IS 12269:2013", "IS 456:2000", "IS 4926:2003", "IS 383:2016"]
      },
      {
        id: "nhai-bridges",
        name: "Bridges, Flyovers & Seismic Reinforcement Steel",
        name_hi: "पुल, फ्लाईओवर एवं भूकंपरोधी सरिया",
        standard_nos: ["IS 1786:2008", "IS 2062:2011", "IS 800:2007", "IS 13920:2016"]
      },
      {
        id: "nhai-drainage",
        name: "Highway Culverts, Cross-Drainage & HDPE Pipes",
        name_hi: "राजमार्ग पुलिया, क्रॉस-ड्रेनेज एवं एचडीपीई पाइप",
        standard_nos: ["IS 4984:2016", "IS 458:2003", "IS 8329:2000"]
      },
      {
        id: "nhai-safety",
        name: "Highway Construction & Roadside Workforce Safety",
        name_hi: "राजमार्ग निर्माण एवं सड़क किनारे श्रमिक सुरक्षा",
        standard_nos: ["IS 2925:1984", "IS 15809:2017", "IS 15298 (Part 2):2016", "IS 3521 (Part 1):1999"]
      }
    ]
  },

  "Government e-Marketplace (GeM)": {
    shortName: "GeM Portal",
    icon: "🛒",
    themeColor: "teal",
    badgeLabel: "GeM National Procurement Mandate",
    domains: [
      {
        id: "gem-cables",
        name: "Building Wires, Power Cables & Electrical Conduits",
        name_hi: "भवन वायरिंग, पावर केबल एवं विद्युत पाइप",
        standard_nos: ["IS 694:2010", "IS 7098 (Part 1):1988", "IS 1554 (Part 1):1988", "IS 9537 (Part 3):1983", "IS 732:2019"]
      },
      {
        id: "gem-switchgear",
        name: "Circuit Breakers, Plugs, Sockets & Distribution Boards",
        name_hi: "सर्किट ब्रेकर, प्लग, सॉकेट एवं वितरण बोर्ड",
        standard_nos: ["IS/IEC 60898-1:2015", "IS 12640 (Part 1):2016", "IS 1293:2019", "IS 3854:1988", "IS 16102 (Part 1):2012"]
      },
      {
        id: "gem-ppe",
        name: "ISI Certified Industrial PPE & Protective Footwear",
        name_hi: "आईएसआई प्रमाणित औद्योगिक पीपीई एवं सुरक्षा जूते",
        standard_nos: ["IS 2925:1984", "IS 15298 (Part 2):2016", "IS 3521 (Part 1):1999", "IS 9473:2002", "IS 5983:1980"]
      },
      {
        id: "gem-civil",
        name: "Standardized Building Materials, Cements & Water Pipes",
        name_hi: "मानकीकृत भवन निर्माण सामग्री, सीमेंट एवं जल पाइप",
        standard_nos: ["IS 269:2015", "IS 1786:2008", "IS 4985:2000", "IS 4984:2016", "IS 8329:2000"]
      }
    ]
  },

  "Ministry of Defence (DGQA / MES)": {
    shortName: "Defence (DGQA / MES)",
    icon: "🛡️",
    themeColor: "stone",
    badgeLabel: "Military Engineering Services Mandate",
    domains: [
      {
        id: "defence-structural",
        name: "Barracks, Hangars & Fortified Structural Steel",
        name_hi: "बैरक, हैंगर एवं मजबूत संरचनात्मक इस्पात",
        standard_nos: ["IS 2062:2011", "IS 800:2007", "IS 1786:2008", "IS 13920:2016"]
      },
      {
        id: "defence-electrical",
        name: "Defence Establishment Power Distribution & Cabling",
        name_hi: "रक्षा प्रतिष्ठान विद्युत वितरण एवं केबलिंग",
        standard_nos: ["IS 1554 (Part 1):1988", "IS 7098 (Part 1):1988", "IS 694:2010", "IS 732:2019", "IS 3043:2018"]
      },
      {
        id: "defence-ppe",
        name: "Military Construction, Civil Defence & Protective Gear",
        name_hi: "सैन्य निर्माण, नागरिक सुरक्षा एवं सुरक्षात्मक उपकरण",
        standard_nos: ["IS 2925:1984", "IS 2745:1983", "IS 9562:1980", "IS 15298 (Part 2):2016", "IS 4770:1991", "IS 3521 (Part 1):1999"]
      },
      {
        id: "defence-civil",
        name: "Defence Outposts, Damp-Proofing & Water Infrastructure",
        name_hi: "रक्षा चौकियां, सीलन-रोधी एवं जल ढांचा",
        standard_nos: ["IS 269:2015", "IS 456:2000", "IS 1322:1993", "IS 4984:2016", "IS 8329:2000"]
      }
    ]
  },

  "Ministry of Housing and Urban Affairs (MoHUA)": {
    shortName: "MoHUA (PMAY / AMRUT)",
    icon: "🏙️",
    themeColor: "blue",
    badgeLabel: "Urban Housing & Smart City Mandate",
    domains: [
      {
        id: "mohua-housing",
        name: "Affordable Housing Cements, TMT Rebars & Blocks",
        name_hi: "किफायती आवास सीमेंट, टीएमटी सरिया एवं ब्लॉक",
        standard_nos: ["IS 269:2015", "IS 1489 (Part 1):2015", "IS 1786:2008", "IS 456:2000", "IS 2185 (Part 1):2005", "IS 13920:2016"]
      },
      {
        id: "mohua-water",
        name: "AMRUT Urban Drinking Water Supply Networks (HDPE/uPVC)",
        name_hi: "अमृत शहरी पेयजल आपूर्ति नेटवर्क (एचडीपीई/यूपीवीसी)",
        standard_nos: ["IS 4984:2016", "IS 4985:2000", "IS 8329:2000"]
      },
      {
        id: "mohua-lighting",
        name: "Smart City Street Lighting, LED Luminaires & Wiring",
        name_hi: "स्मार्ट सिटी स्ट्रीट लाइटिंग, एलईडी एवं वायरिंग",
        standard_nos: ["IS 16102 (Part 1):2012", "IS 10322 (Part 5/Sec 1):2012", "IS 694:2010", "IS 732:2019", "IS/IEC 60898-1:2015"]
      },
      {
        id: "mohua-safety",
        name: "Urban Infrastructure Construction Site Safety Gear",
        name_hi: "शहरी बुनियादी ढांचा निर्माण स्थल सुरक्षा उपकरण",
        standard_nos: ["IS 2925:1984", "IS 15809:2017", "IS 15298 (Part 2):2016"]
      }
    ]
  },

  "Ministry of Power / Central Electricity Authority (CEA)": {
    shortName: "CEA / Ministry of Power",
    icon: "⚡",
    themeColor: "yellow",
    badgeLabel: "Power Grid & Distribution Mandate",
    domains: [
      {
        id: "cea-transformers",
        name: "Distribution Transformers (Up to 2500 kVA, 33 kV)",
        name_hi: "वितरण ट्रांसफॉर्मर (2500 केवीए, 33 केवी तक)",
        standard_nos: ["IS 1180 (Part 1):2014"]
      },
      {
        id: "cea-metering",
        name: "Smart Electricity Meters & Polyphase Watt-Hour Meters",
        name_hi: "स्मार्ट बिजली मीटर एवं पॉलीफेज वाट-घंटा मीटर",
        standard_nos: ["IS 16444 (Part 1):2015", "IS 13779:1999"]
      },
      {
        id: "cea-cables",
        name: "Underground & Substation Power Cables (1.1 kV to 33 kV)",
        name_hi: "भूमिगत एवं सबस्टेशन पावर केबल (1.1 केवी से 33 केवी)",
        standard_nos: ["IS 7098 (Part 1):1988", "IS 7098 (Part 2):2011", "IS 1554 (Part 1):1988", "IS 694:2010"]
      },
      {
        id: "cea-earthing",
        name: "Substation Earthing & Switchgear Protection",
        name_hi: "सबस्टेशन अर्थिंग एवं स्विचगियर सुरक्षा",
        standard_nos: ["IS 3043:2018", "IS/IEC 60947-2:2016", "IS/IEC 60898-1:2015", "IS 12640 (Part 1):2016"]
      }
    ]
  },

  "Ministry of Commerce and Industry (DPIIT)": {
    shortName: "DPIIT",
    icon: "📜",
    themeColor: "purple",
    badgeLabel: "Mandatory QCO Regulation Mandate",
    domains: [
      {
        id: "dpiit-qco",
        name: "Mandatory Quality Control Orders (Cables, Steel & Helmets)",
        name_hi: "अनिवार्य गुणवत्ता नियंत्रण आदेश (केबल, इस्पात एवं हेलमेट)",
        standard_nos: ["IS 694:2010", "IS 2925:1984", "IS 1786:2008", "IS 2062:2011", "IS 1180 (Part 1):2014"]
      },
      {
        id: "dpiit-industrial",
        name: "Industrial Electrical Machinery & Low-Voltage Apparatus",
        name_hi: "औद्योगिक विद्युत मशीनरी एवं एलवी उपकरण",
        standard_nos: ["IS/IEC 60947-2:2016", "IS/IEC 60898-1:2015", "IS 1554 (Part 1):1988", "IS 7098 (Part 1):1988"]
      },
      {
        id: "dpiit-safety",
        name: "Industrial Workforce PPE & Safety Footwear Standards",
        name_hi: "औद्योगिक कार्यबल पीपीई एवं सुरक्षा जूते मानक",
        standard_nos: ["IS 15298 (Part 2):2016", "IS 4770:1991", "IS 3521 (Part 1):1999", "IS 5983:1980"]
      },
      {
        id: "dpiit-building",
        name: "Essential Building Products & Water Supply Piping QCOs",
        name_hi: "आवश्यक निर्माण उत्पाद एवं जल पाइपिंग क्यूसीओ",
        standard_nos: ["IS 269:2015", "IS 4984:2016", "IS 4985:2000", "IS 8329:2000"]
      }
    ]
  },

  "Bureau of Indian Standards (BIS)": {
    shortName: "BIS Headquarters",
    icon: "🏛️",
    themeColor: "red",
    badgeLabel: "National Standards Body Mandate",
    domains: [
      {
        id: "bis-qco",
        name: "Mandatory ISI Certification / QCO Standards",
        name_hi: "अनिवार्य आईएसआई प्रमाणन / क्यूसीओ मानक",
        standard_nos: ["IS 694:2010", "IS 2925:1984", "IS 1786:2008", "IS 1180 (Part 1):2014", "IS 16444 (Part 1):2015"]
      },
      {
        id: "bis-superseded",
        name: "Superseded vs Active Standards Verification Hub",
        name_hi: "अतिक्रमित बनाम सक्रिय मानक सत्यापन केंद्र",
        standard_nos: ["IS 12269:2013", "IS 8112:2013", "IS 269:1989", "IS 269:2015"]
      },
      {
        id: "bis-harmonized",
        name: "Harmonized International Standards (IS/IEC)",
        name_hi: "सामंजस्यपूर्ण अंतर्राष्ट्रीय मानक (IS/IEC)",
        standard_nos: ["IS/IEC 60898-1:2015", "IS/IEC 60947-2:2016", "IS 12640 (Part 1):2016"]
      },
      {
        id: "bis-all",
        name: "Core Infrastructure & Personal Protective Schemes",
        name_hi: "मुख्य बुनियादी ढांचा एवं व्यक्तिगत सुरक्षा योजनाएं",
        standard_nos: ["IS 456:2000", "IS 800:2007", "IS 2062:2011", "IS 15298 (Part 2):2016", "IS 15809:2017"]
      }
    ]
  },

  "State Public Works Department (State PWD)": {
    shortName: "State PWD",
    icon: "🏛️",
    themeColor: "cyan",
    badgeLabel: "State Public Works Mandate",
    domains: [
      {
        id: "statepwd-civil",
        name: "State Roads, Bridges & Public Buildings Cements",
        name_hi: "राज्य की सड़कें, पुल एवं सार्वजनिक भवन सीमेंट",
        standard_nos: ["IS 269:2015", "IS 1489 (Part 1):2015", "IS 1786:2008", "IS 456:2000", "IS 4926:2003", "IS 383:2016", "IS 12269:2013"]
      },
      {
        id: "statepwd-water",
        name: "Jal Jeevan Mission Rural & Town Water Piping (HDPE/uPVC)",
        name_hi: "जल जीवन मिशन ग्रामीण एवं कस्बा जल पाइपिंग",
        standard_nos: ["IS 4984:2016", "IS 4985:2000", "IS 8329:2000"]
      },
      {
        id: "statepwd-electrical",
        name: "Government Schools & Hospitals Electrification",
        name_hi: "सरकारी स्कूल एवं अस्पताल विद्युतीकरण",
        standard_nos: ["IS 694:2010", "IS 732:2019", "IS/IEC 60898-1:2015", "IS 12640 (Part 1):2016", "IS 16102 (Part 1):2012"]
      },
      {
        id: "statepwd-safety",
        name: "State PWD Site Staff & Road Maintenance Safety Gear",
        name_hi: "राज्य पीडब्ल्यूडी साइट स्टाफ एवं सड़क रखरखाव सुरक्षा गियर",
        standard_nos: ["IS 2925:1984", "IS 15809:2017", "IS 15298 (Part 2):2016"]
      }
    ]
  }
}

/**
 * Resolve organization department string to taxonomy entry
 */
export function getTaxonomyForOrg(department) {
  if (!department) return ORG_STANDARDS_TAXONOMY["Central Public Works Department (CPWD)"]

  // Exact match
  if (ORG_STANDARDS_TAXONOMY[department]) return ORG_STANDARDS_TAXONOMY[department]

  const clean = department.trim().toLowerCase()
  for (const [key, val] of Object.entries(ORG_STANDARDS_TAXONOMY)) {
    if (clean.includes(val.shortName.toLowerCase()) || key.toLowerCase().includes(clean)) {
      return val
    }
    if (clean.includes('rail') && key.includes('Railways')) return val
    if (clean.includes('bhel') && key.includes('BHEL')) return val
    if (clean.includes('sail') && key.includes('SAIL')) return val
    if (clean.includes('ntpc') && key.includes('NTPC')) return val
    if (clean.includes('cpwd') && key.includes('CPWD')) return val
    if (clean.includes('nhai') && key.includes('NHAI')) return val
    if (clean.includes('morth') && key.includes('MoRTH')) return val
    if (clean.includes('gem') && key.includes('GeM')) return val
    if (clean.includes('defence') && key.includes('Defence')) return val
    if (clean.includes('mes') && key.includes('Defence')) return val
    if (clean.includes('mohua') && key.includes('Housing')) return val
    if (clean.includes('cea') && key.includes('Power')) return val
    if (clean.includes('dpiit') && key.includes('Commerce')) return val
    if (clean.includes('bis') && key.includes('Bureau')) return val
    if (clean.includes('pwd') && key.includes('State Public')) return val
  }

  return ORG_STANDARDS_TAXONOMY["Central Public Works Department (CPWD)"]
}

/**
 * Returns array of standard numbers that belong to an organization
 */
export function getCuratedStandardNosForOrg(department) {
  const tax = getTaxonomyForOrg(department)
  const set = new Set()
  tax.domains.forEach(d => {
    d.standard_nos.forEach(no => set.add(no))
  })
  return Array.from(set)
}

/**
 * Returns tag text for a standard if it belongs to the user's organization
 */
export function getOrgTagForStandard(standardNo, department) {
  const tax = getTaxonomyForOrg(department)
  for (const domain of tax.domains) {
    if (domain.standard_nos.includes(standardNo)) {
      return {
        tag: `${tax.icon} ${domain.name.split(',')[0].split('&')[0].trim()}`,
        domainName: domain.name,
        color: tax.themeColor
      }
    }
  }
  return null
}

/**
 * Maps a domain name or keyword to primary technical sector (Electrical & Power / Civil & Construction / PPE & Safety Equipment)
 */
export function getSectorForDomain(domainNameOrId) {
  if (!domainNameOrId) return ''
  const lower = domainNameOrId.toLowerCase()
  if (
    lower.includes('cable') ||
    lower.includes('wire') ||
    lower.includes('switchgear') ||
    lower.includes('transformer') ||
    lower.includes('meter') ||
    lower.includes('earthing') ||
    lower.includes('electrical') ||
    lower.includes('lighting')
  ) {
    return 'Electrical & Power'
  }
  if (
    lower.includes('steel') ||
    lower.includes('cement') ||
    lower.includes('concrete') ||
    lower.includes('pipe') ||
    lower.includes('water') ||
    lower.includes('civil') ||
    lower.includes('bridge') ||
    lower.includes('fob') ||
    lower.includes('pavement') ||
    lower.includes('drainage') ||
    lower.includes('housing') ||
    lower.includes('barrack') ||
    lower.includes('structure') ||
    lower.includes('rebar') ||
    lower.includes('tmt')
  ) {
    return 'Civil & Construction'
  }
  if (
    lower.includes('ppe') ||
    lower.includes('safety') ||
    lower.includes('helmet') ||
    lower.includes('shoe') ||
    lower.includes('boot') ||
    lower.includes('harness') ||
    lower.includes('glove') ||
    lower.includes('respirat') ||
    lower.includes('warning')
  ) {
    return 'PPE & Safety Equipment'
  }
  return domainNameOrId
}

/**
 * Normalizes standard number string for comparison
 */
export function normalizeStandardNo(stdNo) {
  if (!stdNo) return ''
  return stdNo
    .replace(/[—–-]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

/**
 * Robust matching between two standard numbers, tolerating year suffixes and punctuation
 */
export function doesStandardMatch(stdA, stdB) {
  if (!stdA || !stdB) return false
  const a = normalizeStandardNo(stdA)
  const b = normalizeStandardNo(stdB)
  if (a === b) return true

  // Compare without year revision: e.g. "is 1786" vs "is 1786:2008"
  const aBase = a.split(':')[0].trim()
  const bBase = b.split(':')[0].trim()
  if (aBase === bBase) return true

  // Strip all non-alphanumeric
  const aClean = a.replace(/[^a-z0-9]/g, '')
  const bClean = b.replace(/[^a-z0-9]/g, '')
  if (aClean === bClean) return true
  if (aClean.length > 5 && bClean.length > 5) {
    if (aClean.startsWith(bClean) || bClean.startsWith(aClean)) return true
  }
  return false
}

/**
 * Returns specific domain details for a standard within an organization
 */
export function getOrgDomainForStandard(standardNo, department) {
  if (!standardNo || !department) return null
  const tax = getTaxonomyForOrg(department)
  if (!tax || !tax.domains) return null

  for (const domain of tax.domains) {
    if (domain.standard_nos.some((no) => doesStandardMatch(no, standardNo))) {
      return {
        id: domain.id,
        domainName: domain.name,
        domainName_hi: domain.name_hi,
        icon: tax.icon,
        shortName: tax.shortName,
        themeColor: tax.themeColor,
        badgeLabel: tax.badgeLabel
      }
    }
  }
  return null
}

/**
 * Returns all organizations and domains that mandate or use this standard
 */
export function getAllOrgsForStandard(standardNo) {
  if (!standardNo) return []
  const results = []

  for (const [key, tax] of Object.entries(ORG_STANDARDS_TAXONOMY)) {
    if (!tax.domains) continue
    for (const domain of tax.domains) {
      if (domain.standard_nos.some((no) => doesStandardMatch(no, standardNo))) {
        results.push({
          orgKey: key,
          shortName: tax.shortName,
          icon: tax.icon,
          themeColor: tax.themeColor,
          badgeLabel: tax.badgeLabel,
          domainName: domain.name,
          domainName_hi: domain.name_hi
        })
        break // Keep one primary domain per organization
      }
    }
  }
  return results
}

