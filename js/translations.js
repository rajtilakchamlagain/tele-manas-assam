/**
 * Tele-Raktim-Assam Bilingual Translation Matrix
 * Standard e-Prastuti Language Dictionary (English & Assamese - অসমীয়া)
 */

const RAKTIM_I18N = {
  en: {
    // Header & Meta
    govtOfAssam: "GOVERNMENT OF ASSAM",
    deptTitle: "Department of Health & Family Welfare",
    nhmTitle: "National Health Mission, Assam",
    portalTitle: "Tele-Raktim Assam",
    portalSubtitle: "Intelligent Mental Health Decision-Support & Operational Planning Platform",
    stateNodalCenter: "State Nodal Hub: Gauhati Medical College & Hospital (GMCH) | Regional Centre: LGBRIMH Tezpur",
    
    // Accessibility Toolbar
    skipToMain: "Skip to Main Content",
    screenReader: "Screen Reader Access",
    textSize: "Text Size:",
    contrastMode: "Contrast",
    highContrast: "High Contrast",
    normalContrast: "Normal Contrast",
    langToggle: "অসমীয়া",

    // Navigation
    navHome: "Home",
    navAbout: "About Tele-Raktim",
    navMap: "District Heatmap & GIS",
    navTriage: "Clinical Triage Sandbox",
    navPlanning: "Mobile Camp Planner",
    navAsha: "Frontline ASHA Portal",
    navDocs: "Government Circulars",
    navContact: "WIM & Directory",

    // Hero Section
    tollFreeEmergency: "24x7 TOLL-FREE MENTAL HEALTH HELPLINE",
    tollFreeNumber: "14416 / 1800 891 4416",
    heroHeading: "Earlier Identification & Proactive Service Planning for Mental Health in Assam",
    heroDesc: "A certified decision-support extension layer built over Tele-Raktim and NHM infrastructure. Empowering counsellors with AI clinical copilots and directing mobile mental health units and essential medications to vulnerable districts before crises escalate.",
    btnCallNow: "Call 14416 Now",
    btnOpenTriage: "Launch Counsellor Copilot",
    btnViewMap: "Inspect District Radar",

    // KPI Cards
    kpiCallsToday: "Calls Triaged Today",
    kpiActiveQueue: "Active Triage Queue",
    kpiPriorityOne: "Priority 1 Acute Alerts",
    kpiCampsDeployed: "Camps Deployed This Month",
    kpiTotalYTD: "Total Consultations YTD",
    kpiReferralRate: "Referral Completion Rate",

    // GIS Map Section
    mapHeading: "District-Level Spatio-Temporal Distress Radar",
    mapSubheading: "Real-time surveillance of mental health distress spikes across Assam's 35 districts. Visualizes emergency clusters, active mobile units, and AI camp recommendations.",
    filterAll: "All Districts",
    filterRed: "High Priority (Red Alert)",
    filterTeaBelt: "Tea Garden Belts",
    filterFlood: "Flood Affected Zones",
    districtDetailTitle: "District Operational Card",
    btnDispatchCamp: "Generate Camp Dispatch Order",

    // Triage Sandbox
    triageHeading: "Clinical NLP Triage & Counsellor Shift Copilot",
    triageSubheading: "Interactive simulator demonstrating real-time de-identification (DPDP Act 2023 compliant), clinical symptom tagging, risk tiering, and 30-second handover note generation.",
    selectScenario: "Select a Field Clinical Scenario:",
    labelRawTranscript: "Raw Clinical Notes / Voice Transcript (Mixed Vernacular)",
    labelPiiScrubbed: "DPDP-Compliant De-Identified Record (PII Redacted)",
    labelSymptoms: "Extracted Clinical Symptoms & ICD-11 Diagnostic Codes",
    labelShiftBrief: "Automated 30-Second Shift Handover Brief",
    btnRunTriage: "Analyze with IndicBERT Triage Engine",
    btnCopyBrief: "Copy Handover Brief",
    badgePriority1: "PRIORITY 1: ACUTE CRISIS ESCALATION",
    badgePriority2: "PRIORITY 2: MODERATE / SCHEDULED FOLLOW-UP",
    badgePriority3: "PRIORITY 3: ROUTINE COUNSELLING / QUERY",

    // ASHA Section
    ashaHeading: "Grassroots Referral Loop Closure & ASHA Tasking",
    ashaSubheading: "Connecting helpline referrals to village ASHA workers and Community Health Officers (CHOs) to ensure patients in tea gardens and rural riverine blocks do not drop out.",
    colTask: "Task ID",
    colDistrict: "District & Sub-Centre",
    colPatient: "Patient Code",
    colReason: "Follow-up Trigger",
    colAsha: "Assigned Frontline Worker",
    colStatus: "Loop Status",
    colAction: "Actionable Guidance",

    // Documents Section
    docsHeading: "Official Guidelines, Acts & Clinical SOPs",
    docsSubheading: "Public repository of state notifications, clinical triage manuals, and compliance documentation compliant with e-Prastuti standards.",
    colTitle: "Document Title & Reference",
    colCategory: "Category",
    colDate: "Notification Date",
    colSize: "File Size",
    colDownload: "Download",

    // Footer
    footerDisclaimer: "This official portal is an advanced operational extension designed for the Department of Health & Family Welfare, Government of Assam and the National Health Mission.",
    wimTitle: "Website Information Manager (WIM)",
    wimOfficer: "Dr. A. K. Sarma, State Programme Officer (Mental Health)",
    wimOffice: "National Health Mission, Saikia Commercial Complex, Christian Basti, Guwahati-781005",
    wimEmail: "Email: spomh-nhm@assam.gov.in | Phone: 0361-2340240",
    policyHyperlink: "Hyperlinking Policy",
    policyPrivacy: "Privacy Policy",
    policyCopyright: "Copyright Policy",
    policyTerms: "Terms & Conditions",
    policyAccessibility: "Accessibility Statement",
    policyHelp: "Help & FAQ",
    nicCredit: "Designed and Developed for Government of Assam. Hosted by National Informatics Centre (NIC) Assam State Centre.",
    copyrightText: "© 2026 National Health Mission, Department of Health & Family Welfare, Government of Assam. All Rights Reserved.",
    devAttribution: "Platform Architecture, AI Decision-Support Pipeline & Prototype Engineering by RTCLtd for Government Demonstration & State Healthcare Evaluation."
  },

  as: {
    // Header & Meta
    govtOfAssam: "অসম চৰকাৰ",
    deptTitle: "স্বাস্থ্য আৰু পৰিয়াল কল্যাণ বিভাগ",
    nhmTitle: "ৰাষ্ট্ৰীয় স্বাস্থ্য অভিযান, অসম",
    portalTitle: "টেলি-ৰক্তিম অসম",
    portalSubtitle: "মানসিক স্বাস্থ্যৰ সিদ্ধান্ত-সহায় আৰু অভিযান পৰিকল্পনা মঞ্চ",
    stateNodalCenter: "ৰাজ্যিক সমন্বয় কেন্দ্ৰ: গুৱাহাটী চিকিৎসা মহাবিদ্যালয় (GMCH) | আঞ্চলিক কেন্দ্ৰ: এল.জি.বি.আই.এম.এইচ. তেজপুৰ",

    // Accessibility Toolbar
    skipToMain: "মূল সমললৈ যাওক",
    screenReader: "স্ক্ৰীণ ৰিডাৰ প্ৰৱেশাধিকাৰ",
    textSize: "আখৰৰ আকাৰ:",
    contrastMode: "ৰং বৈসাদৃশ্য",
    highContrast: "উচ্চ বৈসাদৃশ্য",
    normalContrast: "স্বাভাৱিক",
    langToggle: "English",

    // Navigation
    navHome: "মূল পৃষ্ঠা",
    navAbout: "টেলি-ৰক্তিম পৰিচিতি",
    navMap: "জিলা মানচিত্ৰ আৰু জিআইএছ",
    navTriage: "ক্লিনিকেল ট্ৰায়াজ পৰীক্ষাগাৰ",
    navPlanning: "ভ্ৰাম্যমাণ শিবিৰ পৰিকল্পক",
    navAsha: "আশা কৰ্মী পৰ্টেল",
    navDocs: "চৰকাৰী জাননী",
    navContact: "যোগাযোগ আৰু ডব্লিউআইএম",

    // Hero Section
    tollFreeEmergency: "২৪x৭ বিনামূলীয়া মানসিক স্বাস্থ্য হেল্পলাইন",
    tollFreeNumber: "১৪৪১৬ / ১৮০০ ৮৯১ ৪৪১৬",
    heroHeading: "অসমত মানসিক স্বাস্থ্য সেৱাৰ আগতীয়া চিনাক্তকৰণ আৰু সুপৰিকল্পিত ব্যৱস্থাপনা",
    heroDesc: "ৰাষ্ট্ৰীয় স্বাস্থ্য অভিযান আৰু টেলি-ৰক্তিম ব্যৱস্থাৰ ওপৰত নিৰ্মিত এক অত্যাধুনিক এআই সিদ্ধান্ত-সহায় মঞ্চ। পৰামৰ্শদাতাসকলক ক্লিনিকেল সহায় আৰু জিলা স্বাস্থ্য বিষয়াসকলক ভ্ৰাম্যমাণ মানসিক স্বাস্থ্য বাহন আৰু ঔষধ সঠিক সময়ত প্ৰেৰণ কৰাত সহায় কৰে।",
    btnCallNow: "এতিয়াই ১৪৪১৬ নম্বৰত কল কৰক",
    btnOpenTriage: "ট্ৰায়াজ এআই পৰীক্ষা কৰক",
    btnViewMap: "জিলা মানচিত্ৰ চাওক",

    // KPI Cards
    kpiCallsToday: "আজি গ্ৰহণ কৰা ফোন কল",
    kpiActiveQueue: "সক্ৰিয় ট্ৰায়াজ তালিকা",
    kpiPriorityOne: "জৰুৰী প্ৰাথমিক সতৰ্কতা (ৰেড)",
    kpiCampsDeployed: "এই মাহত পৰিচালিত শিবিৰ",
    kpiTotalYTD: "সৰ্বমুঠ পৰামৰ্শ (বৰ্ষভিত্তিক)",
    kpiReferralRate: "চিকিৎসালয় চিকিৎসালৈ যোৱাৰ হাৰ",

    // GIS Map Section
    mapHeading: "জিলাভিত্তিক মানসিক চাপ নিৰীক্ষণ মানচিত্ৰ (জিআইএছ)",
    mapSubheading: "অসমৰ ৩৫খন জিলাৰ মানসিক স্বাস্থ্য সমস্যাৰ বাস্তৱ নিৰীক্ষণ। জৰুৰী এলেকা, ভ্ৰাম্যমাণ ইউনিট আৰু শিবিৰ পৰিকল্পনাৰ স্বয়ংচালিত ব্যৱস্থা।",
    filterAll: "সকলো জিলা",
    filterRed: "উচ্চ সংকটপূৰ্ণ জিলা",
    filterTeaBelt: "চাহ জনগোষ্ঠীয় অঞ্চল",
    filterFlood: "বানপানী প্ৰভাৱিত অঞ্চল",
    districtDetailTitle: "জিলা কাৰ্যবাহী তথ্য কাৰ্ড",
    btnDispatchCamp: "শিবিৰ অনুমোদন নিৰ্দেশনা প্ৰস্তুত কৰক",

    // Triage Sandbox
    triageHeading: "ক্লিনিকেল এনএলপি ট্ৰায়াজ আৰু সহায়ক",
    triageSubheading: "ব্যক্তিগত গোপনীয়তা ৰক্ষা (ডিপিডিপি আইন ২০২৩), লক্ষণ চিনাক্তকৰণ আৰু ৩০ ছেকেণ্ডত চিকিৎসালয় হস্তান্তৰ টোকা প্ৰস্তুত কৰাৰ বাস্তৱ প্ৰদৰ্শন।",
    selectScenario: "এক বাস্তৱিক ক্লিনিকেল উদাহৰণ বাছনি কৰক:",
    labelRawTranscript: "মূল কথা-বতৰা / কণ্ঠ টোকা (অসমীয়া আৰু ইংৰাজী মিশ্ৰিত)",
    labelPiiScrubbed: "গোপনীয়তা ৰক্ষিত তথ্য (ব্যক্তিগত তথ্য পৰিহাৰ কৰা হৈছে)",
    labelSymptoms: "চিনাক্ত কৰা ক্লিনিকেল লক্ষণ আৰু আইচিডি ক'ড",
    labelShiftBrief: "স্বয়ংচালিত ৩০ ছেকেণ্ডৰ পৰামৰ্শদাতা হস্তান্তৰ টোকা",
    btnRunTriage: "ইণ্ডিক-বাৰ্ট ইঞ্জিনেৰে বিশ্লেষণ কৰক",
    btnCopyBrief: "টোকা নকল কৰক",
    badgePriority1: "প্ৰাথমিকতা ১: জৰুৰী সংকট ব্যৱস্থাপনা",
    badgePriority2: "প্ৰাথমিকতা ২: নিয়মীয়া অনুৱৰ্তী পৰীক্ষণ",
    badgePriority3: "প্ৰাথমিকতা ৩: সাধাৰণ পৰামৰ্শ আৰু তথ্য",

    // ASHA Section
    ashaHeading: "তৃণমূল পৰ্যায়ৰ সমন্বয় আৰু আশা কৰ্মীৰ কাৰ্যতালিকা",
    ashaSubheading: "টেলি-ৰক্তিমৰ পৰা বিশেষজ্ঞ চিকিৎসালয়লৈ প্ৰেৰণ কৰা ৰোগী যাতে বঞ্চিত নহয়, তাৰ বাবে গ্ৰাম্য আশা আৰু স্বাস্থ্য বিষয়াৰ সৈতে সংযোগ।",
    colTask: "কাৰ্য আইডি",
    colDistrict: "জিলা আৰু উপ-কেন্দ্ৰ",
    colPatient: "ৰোগী ক'ড",
    colReason: "অনুৱৰ্তনৰ কাৰণ",
    colAsha: "দায়িত্বপ্ৰাপ্ত আশা কৰ্মী",
    colStatus: "অৱস্থা",
    colAction: "পৰামৰ্শ আৰু কাৰ্যবিধি",

    // Documents Section
    docsHeading: "চৰকাৰী নিৰ্দেশনা, আইন আৰু কাৰ্যপদ্ধতি",
    docsSubheading: "ই-প্ৰস্তুতি নিৰ্দেশনা অনুসৰি ৰাজ্যিক অধিসূচনা, মানসিক স্বাস্থ্য গাইডলাইন আৰু আইনী নথিপত্ৰৰ কেন্দ্ৰ।",
    colTitle: "নথিৰ শিৰোনাম আৰু সংখ্যা",
    colCategory: "শ্ৰেণী",
    colDate: "অধিসূচনাৰ তাৰিখ",
    colSize: "নথিৰ আকাৰ",
    colDownload: "ডাউনলোড",

    // Footer
    footerDisclaimer: "এই আনুষ্ঠানিক পৰ্টেলটো অসম চৰকাৰৰ স্বাস্থ্য আৰু পৰিয়াল কল্যাণ বিভাগ আৰু ৰাষ্ট্ৰীয় স্বাস্থ্য অভিযানৰ বাবে নিৰ্মিত এক কাৰ্যবাহী মঞ্চ।",
    wimTitle: "ৱেবছাইট তথ্য প্ৰবন্ধক (WIM)",
    wimOfficer: "ডাঃ এ. কে. শৰ্মা, ৰাজ্যিক কাৰ্যক্ৰম বিষয়া (মানসিক স্বাস্থ্য)",
    wimOffice: "ৰাষ্ট্ৰীয় স্বাস্থ্য অভিযান, শইকীয়া কমাৰ্চিয়েল কমপ্লেক্স, খ্ৰীষ্টানবস্তি, গুৱাহাটী-৭৮১০০৫",
    wimEmail: "ইমেইল: spomh-nhm@assam.gov.in | ফোন: ০৩৬১-২৩৪০২৪০",
    policyHyperlink: "হাইপাৰলিংকিং নীতি",
    policyPrivacy: "গোপনীয়তা নীতি",
    policyCopyright: "স্বত্বাধিকাৰ নীতি",
    policyTerms: "নিয়মাৱলী আৰু চৰ্তসমূহ",
    policyAccessibility: "প্ৰৱেশাধিকাৰ বিবৃতি",
    policyHelp: "সহায় আৰু প্ৰশ্নোত্তৰ",
    nicCredit: "অসম চৰকাৰৰ বাবে পৰিকল্পিত আৰু ৰাষ্ট্ৰীয় তথ্যবিজ্ঞান কেন্দ্ৰ (NIC) অসম ৰাজ্যিক কেন্দ্ৰৰ দ্বাৰা সংৰক্ষিত।",
    copyrightText: "© ২০২৬ ৰাষ্ট্ৰীয় স্বাস্থ্য অভিযান, স্বাস্থ্য আৰু পৰিয়াল কল্যাণ বিভাগ, অসম চৰকাৰ। সৰ্বস্বত্ব সংৰক্ষিত।",
    devAttribution: "চৰকাৰী মূল্যায়ন আৰু প্ৰদৰ্শনৰ বাবে RTCLtd দ্বাৰা এই এআই সিদ্ধান্ত-সহায় মঞ্চ আৰু প্ৰট'টাইপ অভিযান্ত্ৰিকতা প্ৰস্তুত কৰা হৈছে।"
  }
};

window.RAKTIM_I18N = RAKTIM_I18N;

window.MANAS_I18N = window.RAKTIM_I18N;
