/**
 * MANAS-Assam Operational Data Repository
 * Verified Geographical, Clinical & Administrative Data for Assam Tele-MANAS Cell
 * Department of Health & Family Welfare, Government of Assam
 */

const MANAS_DATA = {
  // Live KPI Summary
  metrics: {
    totalCallsToday: 384,
    activeTriageQueue: 18,
    priorityOneCrises: 7,
    campsDeployedThisMonth: 64,
    totalConsultationsYTD: 142850,
    referralCompletionRate: 78.4,
    avgResponseSeconds: 11.2,
    activeSpecialistsAssigned: 42
  },

  // District-Level Geospatial & Public Health Indicators (Assam)
  districts: [
    {
      id: "kamrup_metro",
      name: "Kamrup Metropolitan",
      nameAs: "কামৰূপ মহানগৰ",
      lat: 26.1445,
      lng: 91.7362,
      tier: "Red",
      calls30d: 3820,
      distressIndex: 86,
      topComplaint: "Adolescent & Career Anxiety (42%)",
      topComplaintAs: "কিশোৰ আৰু বৃত্তিজনিত মানসিক চাপ (৪২%)",
      floodAffected: false,
      teaBelt: false,
      primaryFacility: "Gauhati Medical College & Hospital (GMCH) - Dept. of Psychiatry",
      primaryFacilityAs: "গুৱাহাটী চিকিৎসা মহাবিদ্যালয় আৰু চিকিৎসালয়",
      mmuAssigned: "MMU Unit #01 (Dispur Hub)",
      nextCampDate: "2026-11-08",
      campVenue: "Sonapur Community Health Centre",
      campVenueAs: "সোণাপুৰ সমূহীয়া স্বাস্থ্য কেন্দ্ৰ",
      recommendedAction: "Roster 3 additional evening tele-counsellors; host youth stress coping seminar at Guwahati University."
    },
    {
      id: "sonitpur",
      name: "Sonitpur",
      nameAs: "শোণিতপুৰ",
      lat: 26.6528,
      lng: 92.7926,
      tier: "Amber",
      calls30d: 1940,
      distressIndex: 72,
      topComplaint: "Substance De-Addiction & Depressive Disorders (36%)",
      topComplaintAs: "মাদকাসক্তি আৰু বিষাদজনিত সমস্যা (৩৬%)",
      floodAffected: false,
      teaBelt: true,
      primaryFacility: "LGB Regional Institute of Mental Health (LGBRIMH), Tezpur",
      primaryFacilityAs: "এল.জি.বি. আঞ্চলিক মানসিক স্বাস্থ্য প্ৰতিষ্ঠান, তেজপুৰ",
      mmuAssigned: "MMU Unit #04 (Tezpur Hub)",
      nextCampDate: "2026-11-10",
      campVenue: "Dhekiajuli Model Hospital",
      campVenueAs: "ঢেকিয়াজুলি মডেল হাস্পতাল",
      recommendedAction: "Dispatch 150 vials of injectable thiamine and oral anxiolytics; conduct tea-garden de-addiction drive."
    },
    {
      id: "dhemaji",
      name: "Dhemaji",
      nameAs: "ধেমাজি",
      lat: 27.4815,
      lng: 94.5776,
      tier: "Red",
      calls30d: 1480,
      distressIndex: 91,
      topComplaint: "Post-Flood Acute Trauma & Severe Insomnia (+340% Spike)",
      topComplaintAs: "বানপানী উত্তৰ তীব্ৰ মানসিক আঘাত আৰু অনিদ্ৰা (+৩৪০% বৃদ্ধি)",
      floodAffected: true,
      teaBelt: false,
      primaryFacility: "Dhemaji Civil Hospital (DMHP Psychiatric OPD)",
      primaryFacilityAs: "ধেমাজি অসামৰিক চিকিৎসালয়",
      mmuAssigned: "MMU Unit #07 (North Lakhimpur / Dhemaji)",
      nextCampDate: "2026-11-06",
      campVenue: "Sissiborgaon Flood Relief Centre & CHC",
      campVenueAs: "চিচিবৰগাঁও বান সাহায্য কেন্দ্ৰ আৰু সমূহীয়া স্বাস্থ্য কেন্দ্ৰ",
      recommendedAction: "Deploy Mobile Mental Health Van urgently for 3 days; conduct trauma counseling and psycho-social first aid."
    },
    {
      id: "dibrugarh",
      name: "Dibrugarh",
      nameAs: "ডিব্ৰুগড়",
      lat: 27.4728,
      lng: 94.9120,
      tier: "Amber",
      calls30d: 2110,
      distressIndex: 74,
      topComplaint: "Tea-Garden Worker Stress & Alcohol Withdrawal (44%)",
      topComplaintAs: "চাহ জনগোষ্ঠীয় শ্ৰমিকৰ মানসিক চাপ আৰু সুৰাসক্তি (৪৪%)",
      floodAffected: false,
      teaBelt: true,
      primaryFacility: "Assam Medical College & Hospital (AMCH) - Dept. of Psychiatry",
      primaryFacilityAs: "অসম চিকিৎসা মহাবিদ্যালয়, ডিব্ৰুগড়",
      mmuAssigned: "MMU Unit #03 (Upper Assam Hub)",
      nextCampDate: "2026-11-12",
      campVenue: "Moran Tea Estate Community Hall",
      campVenueAs: "মৰাণ চাহ বাগিচা প্ৰেক্ষাগৃহ",
      recommendedAction: "Empower local ASHA workers with vernacular audio toolkits on confidentiality; schedule weekend follow-up."
    },
    {
      id: "cachar",
      name: "Cachar",
      nameAs: "কাছাৰ",
      lat: 24.8333,
      lng: 92.7789,
      tier: "Amber",
      calls30d: 1650,
      distressIndex: 68,
      topComplaint: "Somatic Distress & Post-Disaster Anxiety (31%)",
      topComplaintAs: "শাৰীৰিক উপসৰ্গ আৰু দুশ্চিন্তা (৩১%)",
      floodAffected: true,
      teaBelt: true,
      primaryFacility: "Silchar Medical College & Hospital (SMCH)",
      primaryFacilityAs: "শিলচৰ চিকিৎসা মহাবিদ্যালয়",
      mmuAssigned: "MMU Unit #05 (Barak Valley Hub)",
      nextCampDate: "2026-11-14",
      campVenue: "Borkhola Community Health Centre",
      campVenueAs: "বৰখোলা সমূহীয়া স্বাস্থ্য কেন্দ্ৰ",
      recommendedAction: "Bilingual Bengali/Meitei mental health outreach van scheduled; replenish essential antidepressant stocks."
    },
    {
      id: "jorhat",
      name: "Jorhat",
      nameAs: "যোৰহাট",
      lat: 26.7509,
      lng: 94.2037,
      tier: "Green",
      calls30d: 1320,
      distressIndex: 58,
      topComplaint: "Academic & Exam Stress (38%)",
      topComplaintAs: "শৈক্ষিক আৰু পৰীক্ষাৰ চাপ (৩৮%)",
      floodAffected: false,
      teaBelt: true,
      primaryFacility: "Jorhat Medical College & Hospital (JMCH)",
      primaryFacilityAs: "যোৰহাট চিকিৎসা মহাবিদ্যালয়",
      mmuAssigned: "MMU Unit #02 (Central Assam)",
      nextCampDate: "2026-11-17",
      campVenue: "Titabor Sub-Divisional Hospital",
      campVenueAs: "তিতাবৰ মহকুমা চিকিৎসালয়",
      recommendedAction: "Routine DMHP counselling camps; distribute student mental resilience toolkits to secondary schools."
    },
    {
      id: "nagaon",
      name: "Nagaon",
      nameAs: "নগাঁও",
      lat: 26.3468,
      lng: 92.6840,
      tier: "Amber",
      calls30d: 1890,
      distressIndex: 69,
      topComplaint: "Depressive Disorders & Domestic Stress (35%)",
      topComplaintAs: "বিষাদ আৰু ঘৰুৱা মানসিক উদ্বেগ (৩৫%)",
      floodAffected: false,
      teaBelt: false,
      primaryFacility: "Nagaon Medical College & Hospital / BP Civil Hospital",
      primaryFacilityAs: "নগাঁও চিকিৎসা মহাবিদ্যালয় / ভোগেশ্বৰী ফুকননী অসামৰিক চিকিৎসালয়",
      mmuAssigned: "MMU Unit #06 (Middle Assam)",
      nextCampDate: "2026-11-11",
      campVenue: "Kaliabor Sub-Divisional Hospital",
      campVenueAs: "কলিয়াবৰ মহকুমা চিকিৎসালয়",
      recommendedAction: "Intensify maternal health screening for postpartum depression at peripheral sub-centres."
    },
    {
      id: "barpeta",
      name: "Barpeta",
      nameAs: "বৰপেটা",
      lat: 26.3211,
      lng: 91.0049,
      tier: "Red",
      calls30d: 1540,
      distressIndex: 82,
      topComplaint: "Displacement Trauma & Financial Despair (41%)",
      topComplaintAs: "নদীভাঙনি আৰু অৰ্থনৈতিক হতাশা (৪১%)",
      floodAffected: true,
      teaBelt: false,
      primaryFacility: "Fakhruddin Ali Ahmed Medical College & Hospital (FAAMCH)",
      primaryFacilityAs: "ফখৰুদ্দিন আলী আহমেদ চিকিৎসা মহাবিদ্যালয়",
      mmuAssigned: "MMU Unit #08 (Lower Assam Hub)",
      nextCampDate: "2026-11-09",
      campVenue: "Chenga Riverine Primary Health Centre",
      campVenueAs: "চেঙা প্ৰাথমিক স্বাস্থ্য কেন্দ্ৰ",
      recommendedAction: "Deploy mobile psychiatric boat-clinic to char/riverine areas; distribute sleep hygiene kits."
    },
    {
      id: "kokrajhar",
      name: "Kokrajhar (BTR)",
      nameAs: "কোকৰাঝাৰ (বিটিআৰ)",
      lat: 26.4014,
      lng: 90.2718,
      tier: "Amber",
      calls30d: 1180,
      distressIndex: 64,
      topComplaint: "General Anxiety & Somatic Complaints (32%)",
      topComplaintAs: "সাধাৰণ দুশ্চিন্তা আৰু শাৰীৰিক উদ্বেগ (৩২%)",
      floodAffected: false,
      teaBelt: true,
      primaryFacility: "Kokrajhar Medical College & Hospital (KMCH)",
      primaryFacilityAs: "কোকৰাঝাৰ চিকিৎসা মহাবিদ্যালয়",
      mmuAssigned: "MMU Unit #09 (Bodoland Region)",
      nextCampDate: "2026-11-18",
      campVenue: "Gossaigaon Community Health Centre",
      campVenueAs: "গোসাইগাঁও সমূহীয়া স্বাস্থ্য কেন্দ্ৰ",
      recommendedAction: "Organize Bodo and Assamese bilingual mental health awareness drive through VCDC committees."
    },
    {
      id: "karbi_anglong",
      name: "Karbi Anglong",
      nameAs: "কাৰ্বি আংলং",
      lat: 25.8427,
      lng: 93.4338,
      tier: "Green",
      calls30d: 890,
      distressIndex: 52,
      topComplaint: "Substance Use & Mood Disorders (29%)",
      topComplaintAs: "মাদক ব্যৱহাৰ আৰু মানসিক বিষাদ (২৯%)",
      floodAffected: false,
      teaBelt: false,
      primaryFacility: "Diphu Medical College & Hospital (DMCH)",
      primaryFacilityAs: "ডিফু চিকিৎসা মহাবিদ্যালয়",
      mmuAssigned: "MMU Unit #10 (Hills Region)",
      nextCampDate: "2026-11-20",
      campVenue: "Bokajan Community Health Centre",
      campVenueAs: "বোকাজান সমূহীয়া স্বাস্থ্য কেন্দ্ৰ",
      recommendedAction: "Collaborate with Karbi Anglong Autonomous Council (KAAC) health cell for youth de-addiction."
    }
  ],

  // Interactive Clinical Scenarios for the NLP Triage Simulator
  scenarios: [
    {
      id: "scenario_1",
      title: "Case A: Post-Flood Acute Stress & Insomnia (Dhemaji District)",
      titleAs: "উদাহৰণ ১: বানপানী উত্তৰ তীব্ৰ মানসিক আঘাত আৰু অনিদ্ৰা (ধেমাজি)",
      category: "Disaster Mental Health",
      rawText: "Caller: 44F, rural homemaker from Sissiborgaon block. Ph: 98642XXXXX. Caller reports our house washed away during second wave of Brahmaputra flood. 'মই যোৱা ১৫ দিন একো শুব পৰা নাই। অলপ শব্দ হ'লেই বুকুখন কঁপি উঠে। সদায় ভয় লাগে আকৌ পানী আহিব বুলি।' Complains of persistent tremors, severe headache, hopelessness about rebuilding livelihood, crying spells, appetite loss. No past psychiatric history. Husband working in dimapur.",
      piiMasked: "Caller: [PATIENT_ID_4821], 44F, Rural Homemaker, Block: Sissiborgaon, Dist: Dhemaji. Phone: [REDACTED_DPDP_ACT]. Details: Home displaced in Brahmaputra flood wave. Patient experiencing severe insomnia (15 days), trauma flash reactions, hyperarousal, crying episodes, appetite loss, anticipatory flood panic.",
      riskLevel: "Yellow",
      riskScore: 78,
      icdCode: "F43.10 (Acute Post-Traumatic Stress Reaction)",
      extractedSymptoms: ["Severe Insomnia (15d)", "Autonomic Hyperarousal", "Trauma Flash Cues", "Appetite Loss", "Situational Hopelessness"],
      shiftBrief: "• Primary Issue: Post-flood acute stress reaction with severe sleep deprivation.\n• Action Taken: Psycho-education on stress response, grounding techniques taught, referral to Sissiborgaon Mobile Health Camp (Nov 6).\n• Follow-Up Checklist for Counsellor: [1] Inquire about sleep hours; [2] Confirm if visited Sissiborgaon camp for non-benzodiazepine sleep aid."
    },
    {
      id: "scenario_2",
      title: "Case B: Adolescent SEBA Board Exam Panic & Hopelessness (Jorhat District)",
      titleAs: "উদাহৰণ ২: পৰীক্ষাৰ তীব্ৰ মানসিক চাপ আৰু আত্মবিশ্বাসহীনতা (যোৰহাট)",
      category: "Adolescent Mental Health",
      rawText: "Caller: 17M, Class 10 student from Titabor. Ph: 94350XXXXX. Calling from home landline. 'মই পৰীক্ষাত ফেইল কৰিম যেন লাগিছে। মা-দেউতাৰ মুখলৈ চাব নোৱাৰিম। I can't concentrate for even 5 minutes. মনলৈ বেয়া ভাৱ আহি থাকে, মোৰ মৃত্যু হ'লে সকলোৰে ভালেই হ'ব।' Severe palpitations during study, exam phobia, excessive parental pressure.",
      piiMasked: "Caller: [PATIENT_ID_5190], 17M, Student, Block: Titabor, Dist: Jorhat. Phone: [REDACTED_DPDP_ACT]. Patient reports acute test anxiety, inability to concentrate, parental expectations conflict, cognitive distortion, passive death wish ('better if I die').",
      riskLevel: "Red",
      riskScore: 92,
      icdCode: "F41.0 (Panic Disorder) with F32.2 (Severe Depressive Symptom)",
      extractedSymptoms: ["Passive Suicidal Ideation", "Severe Test Anxiety", "Cognitive Distortion", "Autonomic Palpitations", "Academic Helplessness"],
      shiftBrief: "• Primary Issue: Acute adolescent exam panic with secondary passive death ideation.\n• Urgent Action: Priority 1 safety protocol activated. Crisis de-escalation completed; consent taken to involve school wellness mentor.\n• Follow-Up Checklist: Mandatory Tier-2 Clinical Psychologist call scheduled within 6 hours. Safety contract confirmed with student."
    },
    {
      id: "scenario_3",
      title: "Case C: Tea-Garden Alcohol Withdrawal & Family Crisis (Dibrugarh District)",
      titleAs: "উদাহৰণ ৩: চাহ বাগিচা শ্ৰমিকৰ সুৰা আসক্তি আৰু প্ৰত্যাহাৰ লক্ষণ (ডিব্ৰুগড়)",
      category: "Substance De-Addiction",
      rawText: "Caller: Wife calling on behalf of 38M tea estate worker, Moran block. 'মোৰ গিৰীয়ে যোৱা ৩ দিন সুৰা এৰিছে, কিন্তু এতিয়া হাত-ভৰি কপিছে, বিভ্ৰান্তি হৈছে, দেৱালত কিবা ভূত দেখা বুলি চিঞৰিছে।' Patient is aggressive, experiencing coarse tremors, visual hallucinations, diaphoresis. Daily country liquor user for 14 years.",
      piiMasked: "Caller: Spouse of [PATIENT_ID_6022], 38M, Tea Garden Worker, Block: Moran, Dist: Dibrugarh. Phone: [REDACTED_DPDP_ACT]. Third-party distress call. Male experiencing acute alcohol withdrawal state with delirium tremens (visual hallucinations, coarse tremors, autonomic hyperactivity).",
      riskLevel: "Red",
      riskScore: 96,
      icdCode: "F10.4 (Alcohol Withdrawal State with Delirium)",
      extractedSymptoms: ["Delirium Tremens", "Visual Hallucinations", "Gross Tremors", "Autonomic Instability", "Severe Addiction"],
      shiftBrief: "• Medical Emergency: Suspected Delirium Tremens. Immediate physical hospitalization required.\n• Action Taken: Direct ambulance dispatch coordinated with 108 Emergency Service to Assam Medical College (AMCH) Casualty.\n• ASHA Task: Moran Sector ASHA Supervisor alerted to assist spouse at hospital reception."
    },
    {
      id: "scenario_4",
      title: "Case D: Postpartum Depression & Maternal Anxiety (Nagaon District)",
      titleAs: "উদাহৰণ ৪: প্ৰসৱোত্তৰ মানসিক বিষাদ আৰু উদ্বেগ (নগাঁও)",
      category: "Maternal Health",
      rawText: "Caller: 26F, 3 months postpartum, Kaliabor block. 'সন্তানটো জন্ম হোৱাৰ পিছৰে পৰা মোৰ একো ভাল লগা নাই। মই ভাল মাক হ'ব পৰা নাই। কেতিয়াবা সন্তানটোক আঘাত কৰাৰ ভয় লাগে।' Severe crying, detachment from infant, insomnia despite exhaustion, feelings of intense guilt. Family considers it bad temper.",
      piiMasked: "Caller: [PATIENT_ID_7143], 26F, 3-Months Postpartum, Block: Kaliabor, Dist: Nagaon. Phone: [REDACTED_DPDP_ACT]. Mother exhibiting moderate-to-severe postpartum depression, obsessive intrusive thoughts regarding infant safety, emotional numbing, severe maternal guilt.",
      riskLevel: "Yellow",
      riskScore: 84,
      icdCode: "F53.0 (Mild/Moderate Mental and Behavioural Disorders Associated with Puerperium)",
      extractedSymptoms: ["Postpartum Depression", "Intrusive Harm Phobia", "Emotional Numbing", "Maternal Guilt", "Sleep Disruption"],
      shiftBrief: "• Clinical Finding: Postpartum depressive episode with intrusive maternal phobias (ego-dystonic).\n• Intervention: Reassured mother on medical nature of postpartum depression; scheduled tele-consultation with Lady Medical Officer.\n• Frontline Linkage: ANM at Kaliabor Sub-Centre assigned for home visits and breastfeeding comfort support."
    }
  ],

  // Official e-Prastuti Document Repository (Acts, Rules & SOPs)
  documents: [
    {
      title: "Tele-MANAS Assam Cell: Standard Operating Procedures & Clinical Triage Protocol (v3.2)",
      titleAs: "টেলি-মানস অসম: মানক পৰিচালনা পদ্ধতি আৰু ক্লিনিকেল ট্ৰায়াজ প্ৰট'কল",
      category: "Clinical Guidelines",
      refNumber: "NHM/MH/TM/2026/SOP-01",
      date: "2026-09-15",
      size: "2.4 MB",
      format: "PDF"
    },
    {
      title: "District Mental Health Programme (DMHP) Operational Framework & MMU Roster - Assam",
      titleAs: "জিলা মানসিক স্বাস্থ্য কাৰ্যক্ৰম (ডিএমএইচপি) নিৰ্দেশনা আৰু ভ্ৰাম্যমাণ ইউনিট ৰষ্টাৰ",
      category: "Operational Manual",
      refNumber: "HFW-NHM-AS-774/2026",
      date: "2026-10-01",
      size: "3.8 MB",
      format: "PDF"
    },
    {
      title: "Data Protection Impact Assessment (DPIA) & DPDP Act 2023 Compliance Matrix for Tele-MANAS",
      titleAs: "তথ্য সুৰক্ষা প্ৰভাৱ মূল্যায়ন আৰু ডিপিডিপি আইন ২০২৩ অনুকৰণ প্ৰতিবেদন",
      category: "Data Privacy & Legal",
      refNumber: "AS/GOV/HFW/DPDP/2026/49",
      date: "2026-08-20",
      size: "1.6 MB",
      format: "PDF"
    },
    {
      title: "Assam State Suicide Prevention & Crisis Intervention Action Strategy (2024–2028)",
      titleAs: "অসম ৰাজ্যিক আত্মহত্যা প্ৰতিৰোধ আৰু সংকট পৰিচালনা কৌশল",
      category: "State Policy",
      refNumber: "GOA-HFW-POL-2024-88",
      date: "2026-05-10",
      size: "4.1 MB",
      format: "PDF"
    },
    {
      title: "Notice: Deployment of Mobile Mental Health Units in Flood-Vulnerable Districts of Assam",
      titleAs: "বিজ্ঞপ্তি: বানপানী প্ৰৱণ জিলাসমূহত ভ্ৰাম্যমাণ মানসিক স্বাস্থ্য সেৱা নিয়োজন",
      category: "Government Notification",
      refNumber: "NHM/EST/DMHP-NOTIF/2026/112",
      date: "2026-10-28",
      size: "820 KB",
      format: "PDF"
    }
  ],

  // Frontline Worker Tasks (Grassroots ASHA & CHO Loop Closure)
  ashaTasks: [
    {
      taskId: "TASK-DBR-084",
      district: "Dibrugarh",
      block: "Moran Tea Estate (Line 4)",
      patientCode: "PATIENT_6022",
      reason: "Missed Scheduled De-Addiction Appointment (12 Days Overdue)",
      assignedAsha: "Runjun Gogoi (ASHA #412)",
      priority: "High",
      status: "Pending Visit",
      guidance: "Visit during evening shift. Ensure privacy; speak with spouse first. Reassure family regarding completely free medications under DMHP and transport assistance."
    },
    {
      taskId: "TASK-DHM-019",
      district: "Dhemaji",
      block: "Sissiborgaon (Relief Cluster B)",
      patientCode: "PATIENT_4821",
      reason: "Flood Displaced - Post-Trauma Follow-up & Sleep Hygiene",
      assignedAsha: "Anamika Doley (ASHA #108)",
      priority: "Medium",
      status: "Completed",
      guidance: "Delivered oral electrolyte and vitamin supplements; accompanied patient to Sissiborgaon Mobile Health Camp on Nov 6."
    },
    {
      taskId: "TASK-NAG-103",
      district: "Nagaon",
      block: "Kaliabor (Hatbor Sub-Centre)",
      patientCode: "PATIENT_7143",
      reason: "Postpartum Maternal Health Check & Mental Wellness Check",
      assignedAsha: "Mina Saikia (CHO Hatbor)",
      priority: "Medium",
      status: "In Progress",
      guidance: "Screen infant feeding progress; check maternal vital signs; confirm mother attended virtual counselling session."
    }
  ]
};

// Expose globally
window.MANAS_DATA = MANAS_DATA;
