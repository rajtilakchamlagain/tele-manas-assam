/**
 * MANAS-Assam Clinical NLP Triage Engine & Counsellor Copilot
 * Demonstrates DPDP-compliant de-identification, clinical symptom extraction,
 * risk tiering, and 30-second structured shift handover generation.
 */

function initTriageSimulator() {
  const scenarioSelect = document.getElementById('scenarioSelector');
  if (!scenarioSelect || !window.MANAS_DATA) return;

  // Populate dropdown options
  scenarioSelect.innerHTML = '';
  window.MANAS_DATA.scenarios.forEach(sc => {
    const opt = document.createElement('option');
    opt.value = sc.id;
    opt.textContent = sc.title;
    scenarioSelect.appendChild(opt);
  });

  // Load first scenario by default
  loadScenario(window.MANAS_DATA.scenarios[0].id);

  scenarioSelect.addEventListener('change', (e) => {
    loadScenario(e.target.value);
  });
}

function loadScenario(scenarioId) {
  const sc = window.MANAS_DATA.scenarios.find(s => s.id === scenarioId);
  if (!sc) return;

  const rawInput = document.getElementById('triageRawInput');
  const piiContainer = document.getElementById('triagePiiOutput');
  const symptomTags = document.getElementById('triageSymptomTags');
  const icdBadge = document.getElementById('triageIcdBadge');
  const riskBadge = document.getElementById('triageRiskBadge');
  const shiftBrief = document.getElementById('triageShiftBrief');
  const analyzeBtn = document.getElementById('btnAnalyzeTranscript');

  if (rawInput) rawInput.value = sc.rawText;
  
  // Reset outputs until user hits Analyze or auto-runs
  runTriageAnalysis(sc);
}

function runTriageAnalysis(sc) {
  const piiContainer = document.getElementById('triagePiiOutput');
  const symptomTags = document.getElementById('triageSymptomTags');
  const icdBadge = document.getElementById('triageIcdBadge');
  const riskBadge = document.getElementById('triageRiskBadge');
  const shiftBrief = document.getElementById('triageShiftBrief');

  // De-identified text output
  if (piiContainer) {
    piiContainer.innerHTML = sc.piiMasked.replace(/\[(.*?)\]/g, '<span class="bg-amber-100 text-amber-900 font-mono font-semibold px-1 py-0.5 rounded text-xs">[$1]</span>');
  }

  // Symptoms extraction tags
  if (symptomTags) {
    symptomTags.innerHTML = '';
    sc.extractedSymptoms.forEach(sym => {
      const tag = document.createElement('span');
      tag.className = 'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200';
      tag.innerHTML = `<svg class="w-3 h-3 mr-1 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>${sym}`;
      symptomTags.appendChild(tag);
    });
  }

  // ICD code
  if (icdBadge) {
    icdBadge.textContent = sc.icdCode;
  }

  // Risk Badge
  if (riskBadge) {
    if (sc.riskLevel === 'Red') {
      riskBadge.className = 'px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-400 flex items-center space-x-1';
      riskBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-600 mr-1.5 animate-ping"></span>PRIORITY 1: ACUTE CRISIS (CRITICAL)`;
    } else if (sc.riskLevel === 'Yellow') {
      riskBadge.className = 'px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-400 flex items-center space-x-1';
      riskBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-600 mr-1.5"></span>PRIORITY 2: SCHEDULED FOLLOW-UP (MODERATE)`;
    } else {
      riskBadge.className = 'px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-400 flex items-center space-x-1';
      riskBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-600 mr-1.5"></span>PRIORITY 3: ROUTINE COUNSELLING`;
    }
  }

  // Shift brief
  if (shiftBrief) {
    shiftBrief.value = sc.shiftBrief;
  }
}

// User triggerable custom analyze
window.triggerAnalyze = function() {
  const rawInput = document.getElementById('triageRawInput');
  const analyzeBtn = document.getElementById('btnAnalyzeTranscript');
  if (!rawInput) return;

  if (analyzeBtn) {
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>Analyzing Vernacular Speech...`;
  }

  setTimeout(() => {
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = `Process with IndicBERT Engine`;
    }
    // Match closest scenario or parse
    const text = rawInput.value.toLowerCase();
    let matched = window.MANAS_DATA.scenarios[0];
    if (text.includes('exam') || text.includes('পৰীক্ষা') || text.includes('die')) {
      matched = window.MANAS_DATA.scenarios[1];
    } else if (text.includes('alcohol') || text.includes('সুৰা') || text.includes('মোৰ গিৰীয়ে')) {
      matched = window.MANAS_DATA.scenarios[2];
    } else if (text.includes('সন্তান') || text.includes('মাক') || text.includes('postpartum')) {
      matched = window.MANAS_DATA.scenarios[3];
    }
    runTriageAnalysis(matched);
    showToast("NLP Triage Complete: Clinical Entities & Shift Brief Generated.");
  }, 600);
};

window.copyShiftBrief = function() {
  const briefEl = document.getElementById('triageShiftBrief');
  if (briefEl) {
    navigator.clipboard.writeText(briefEl.value).then(() => {
      showToast("Shift Handover Brief copied to clipboard!");
    });
  }
};

window.initTriageSimulator = initTriageSimulator;
