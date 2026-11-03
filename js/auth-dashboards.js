/**
 * Tele-Raktim-Assam Role-Based Authentication & Specialized Dashboards
 * Manages 3 Distinct User Personas:
 * 1. Citizen (Phone + OTP / Mental Health Predictor & Chat)
 * 2. Doctor (Email + OTP + Medical Reg / Patient Redirection & Solved Triage Queue)
 * 3. State Analyzer / IAS (Govt Email + 2FA / Macro Real-Time Data Radar)
 */

window.currentUserRole = null; // 'citizen', 'doctor', 'analyzer', or null (public)

const ROLE_PROFILES = {
  citizen: {
    name: "Rahul Borah",
    nameAs: "ৰাহুল বৰা",
    role: "Citizen / Student",
    phone: "+91 98640 12345",
    email: "rahul.borah2005@gmail.com",
    district: "Kamrup Metropolitan",
    token: "TOKEN-TM-2026-7712",
    assessmentScore: 14, // Moderate Anxiety/Depression
    riskTier: "Moderate (Yellow)",
    assignedFacility: "Gauhati Medical College & Hospital (GMCH)"
  },
  doctor: {
    name: "Dr. Partha Pratim Das, MD (Psychiatry)",
    nameAs: "ডাঃ পাৰ্থ প্ৰতিম দাস",
    role: "Senior Consultant Psychiatrist & Tele-Raktim Tier-2 Lead",
    regNo: "AMC/REG/2012/8841",
    email: "dr.ppdas.gmch@assam.gov.in",
    phone: "+91 94350 99881",
    facility: "GMCH Guwahati & Tele-Raktim Assam Hub",
    totalRedirected: 42,
    pendingCases: 9,
    solvedCases: 33,
    classificationBreakdown: {
      examAnxiety: 38,
      depression: 28,
      substance: 18,
      postTrauma: 12,
      other: 4
    }
  },
  analyzer: {
    name: "Shri Biswajit Pegu, IAS",
    nameAs: "শ্ৰী বিশ্বজিৎ পেগু, আই.এ.এছ.",
    role: "Commissioner & Secretary, Health & Family Welfare, Govt. of Assam",
    idCode: "GOA-IAS-SEC-04",
    email: "sec-health@assam.gov.in",
    phone: "+91 94351 00012",
    clearanceLevel: "State Directorate Apex (Tier-4 Master Access)",
    activeDistrictsMonitored: 35,
    statewideCallsToday: 384,
    criticalRedZones: 3
  }
};

// Initial doctor patients caseload
let doctorPatients = [
  {
    caseId: "CASE-KMR-2026-9041",
    patientToken: "PATIENT_9041",
    ageSex: "21 / M",
    district: "Kamrup Metro (Chandmari)",
    chiefComplaint: "Severe Academic Insomnia & Panic Triggers",
    triageScore: 88,
    tier: "Red",
    status: "Pending Review",
    date: "Today, 08:30 AM",
    notes: "Student facing high emotional distress before semester finals. Needs evaluation for short-term anxiolytic support.",
    prescribedAction: "Awaiting psychiatric video consult"
  },
  {
    caseId: "CASE-DHM-2026-4821",
    patientToken: "PATIENT_4821",
    ageSex: "44 / F",
    district: "Dhemaji (Sissiborgaon)",
    chiefComplaint: "Post-Flood Acute Trauma Reaction (PTSD Symptoms)",
    triageScore: 78,
    tier: "Amber",
    status: "Pending Review",
    date: "Yesterday, 04:15 PM",
    notes: "Displaced by river erosion. Sleep disruption for 15 days. Needs psycho-social grounding protocol.",
    prescribedAction: "Assigned to Sissiborgaon MMU Camp"
  },
  {
    caseId: "CASE-DBR-2026-6022",
    patientToken: "PATIENT_6022",
    ageSex: "38 / M",
    district: "Dibrugarh (Moran)",
    chiefComplaint: "Alcohol Dependence with Withdrawal Delirium",
    triageScore: 96,
    tier: "Red",
    status: "Solved / Discharged",
    date: "02-Nov-2026",
    notes: "Admitted to AMCH Psychiatric Inpatient. Managed with Chlordiazepoxide taper and parenteral thiamine. Discharged to family under ASHA monitoring.",
    prescribedAction: "Weekly ASHA Home Visit scheduled"
  },
  {
    caseId: "CASE-NAG-2026-7143",
    patientToken: "PATIENT_7143",
    ageSex: "26 / F",
    district: "Nagaon (Kaliabor)",
    chiefComplaint: "Postpartum Maternal Depression & Sleep Loss",
    triageScore: 84,
    tier: "Amber",
    status: "Solved / Discharged",
    date: "01-Nov-2026",
    notes: "Reassured mother; started on safe SSRI regimen compatible with lactation. Weekly tele-counselling underway.",
    prescribedAction: "Tele-Followup scheduled Nov 15"
  },
  {
    caseId: "CASE-JRT-2026-5190",
    patientToken: "PATIENT_5190",
    ageSex: "17 / M",
    district: "Jorhat (Titabor)",
    chiefComplaint: "Acute High School Exam Panic & Palpitations",
    triageScore: 92,
    tier: "Red",
    status: "Pending Review",
    date: "Today, 10:45 AM",
    notes: "Passed passive suicidal ideation screening in triage. Immediate de-escalation conducted by counsellor; scheduled for Tier-2 consult.",
    prescribedAction: "Mandatory call within 4 hours"
  }
];

/* ==========================================================================
   Auth Gateway & Modal Controls
   ========================================================================== */
function openAuthModal(roleType) {
  const modal = document.getElementById('authModal');
  if (!modal) return;

  if (roleType) {
    selectRoleTab(roleType);
  }
  modal.classList.remove('hidden');
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('hidden');
}

function selectRoleTab(role) {
  // Update tabs
  ['citizen', 'doctor', 'analyzer'].forEach(r => {
    const tabBtn = document.getElementById(`tab-auth-${r}`);
    const formBox = document.getElementById(`form-auth-${r}`);
    if (tabBtn) {
      if (r === role) {
        tabBtn.className = "flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 border-navy-900 text-navy-900 bg-white transition-all";
      } else {
        tabBtn.className = "flex-1 py-3 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 bg-slate-50 transition-all";
      }
    }
    if (formBox) {
      if (r === role) formBox.classList.remove('hidden');
      else formBox.classList.add('hidden');
    }
  });
}

// Quick 1-Click Demo Login
function quickLogin(role) {
  window.currentUserRole = role;
  closeAuthModal();
  updateUserInterfaceForRole(role);
  showToast(`Authenticated successfully as ${ROLE_PROFILES[role].name} (${ROLE_PROFILES[role].role})`);
}

function handleLogout() {
  window.currentUserRole = null;
  updateUserInterfaceForRole(null);
  showToast("Logged out of session. Returned to Public e-Prastuti View.");
}

function updateUserInterfaceForRole(role) {
  // Update header auth pill
  const userPill = document.getElementById('headerUserPill');
  const userPillContainer = document.getElementById('headerUserPillContainer');
  const loginBtn = document.getElementById('headerLoginBtn');
  const roleDropdown = document.getElementById('roleSwitcherDropdown');

  // Hide all specialized dashboards first
  document.querySelectorAll('.role-dashboard-container').forEach(el => el.classList.add('hidden'));

  if (!role) {
    if (userPillContainer) userPillContainer.classList.add('hidden');
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (roleDropdown) roleDropdown.value = 'public';
    // Show standard public home
    if (window.switchTab) window.switchTab('home');
    return;
  }

  // Active Role Session
  const profile = ROLE_PROFILES[role];
  if (loginBtn) loginBtn.classList.add('hidden');
  if (userPillContainer) userPillContainer.classList.remove('hidden');
  if (userPill) userPill.textContent = `${profile.name} (${role.toUpperCase()})`;
  if (roleDropdown) roleDropdown.value = role;

  // Show the corresponding specialized dashboard
  if (role === 'citizen') {
    const d = document.getElementById('dashboard-citizen');
    if (d) d.classList.remove('hidden');
    renderCitizenDashboard();
    window.location.hash = "#dashboard-citizen";
  } else if (role === 'doctor') {
    const d = document.getElementById('dashboard-doctor');
    if (d) d.classList.remove('hidden');
    renderDoctorDashboard();
    window.location.hash = "#dashboard-doctor";
  } else if (role === 'analyzer') {
    const d = document.getElementById('dashboard-analyzer');
    if (d) d.classList.remove('hidden');
    renderAnalyzerDashboard();
    window.location.hash = "#dashboard-analyzer";
  }
}

/* ==========================================================================
   DASHBOARD 1: CITIZEN VIEW
   ========================================================================== */
function renderCitizenDashboard() {
  const profile = ROLE_PROFILES.citizen;
  const nameEl = document.getElementById('citizenProfileName');
  const phoneEl = document.getElementById('citizenProfilePhone');
  const distEl = document.getElementById('citizenProfileDistrict');
  const tokenEl = document.getElementById('citizenProfileToken');

  if (nameEl) nameEl.textContent = profile.name;
  if (phoneEl) phoneEl.textContent = profile.phone;
  if (distEl) distEl.textContent = profile.district;
  if (tokenEl) tokenEl.textContent = profile.token;
}

// Interactive Mental Health Self-Check (PHQ-9 / GAD-7)
function calculateCitizenScore() {
  const q1 = parseInt(document.getElementById('phq-q1')?.value || 0);
  const q2 = parseInt(document.getElementById('phq-q2')?.value || 0);
  const q3 = parseInt(document.getElementById('phq-q3')?.value || 0);
  const q4 = parseInt(document.getElementById('phq-q4')?.value || 0);
  const q5 = parseInt(document.getElementById('phq-q5')?.value || 0);

  const total = q1 + q2 + q3 + q4 + q5;
  const scoreBadge = document.getElementById('citizenScoreBadge');
  const adviceBox = document.getElementById('citizenScoreAdvice');

  let risk = "Mild / Normal (Green)";
  let advice = "Your responses suggest mild stress levels. Daily mindfulness, sleep hygiene, and light physical exercise are advised.";
  let badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300";

  if (total >= 11) {
    risk = "High Distress / Acute Alert (Red)";
    advice = "Your responses indicate acute emotional or stress overload. An urgent confidential tele-counselling callback from a GMCH specialist has been pre-scheduled for you.";
    badgeColor = "bg-red-100 text-red-800 border-red-300 animate-pulse";
  } else if (total >= 6) {
    risk = "Moderate Stress (Yellow)";
    advice = "You are experiencing moderate anxiety or depressive fatigue. We recommend scheduling a free 20-minute tele-consultation with a Tele-Raktim counsellor.";
    badgeColor = "bg-amber-100 text-amber-800 border-amber-300";
  }

  if (scoreBadge) {
    scoreBadge.className = `px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`;
    scoreBadge.textContent = `Score: ${total}/15 - ${risk}`;
  }
  if (adviceBox) {
    adviceBox.textContent = advice;
  }

  showToast(`Mental Health Assessment calculated: ${total}/15`);
}

// Citizen Confidential Chat Bot
function sendCitizenChatMessage() {
  const input = document.getElementById('citizenChatInput');
  const container = document.getElementById('citizenChatMessages');
  if (!input || !container || !input.value.trim()) return;

  const userMsg = input.value.trim();
  input.value = '';

  // Append user message
  const userBubble = document.createElement('div');
  userBubble.className = "flex justify-end mb-2";
  userBubble.innerHTML = `<div class="bg-navy-900 text-white rounded-2xl rounded-tr-none px-3.5 py-2 text-xs max-w-xs shadow-sm">${userMsg}</div>`;
  container.appendChild(userBubble);
  container.scrollTop = container.scrollHeight;

  // Bot response simulator
  setTimeout(() => {
    let reply = "Hello Rahul, I am your Tele-Raktim Wellness Assistant. Your privacy is protected under DPDP Act 2023. How are you feeling right now?";
    const lower = userMsg.toLowerCase();
    if (lower.includes('exam') || lower.includes('stress') || lower.includes('panic') || lower.includes('fear')) {
      reply = "Exam panic is very common, but you are not alone. Take three slow deep breaths (4 seconds in, 4 seconds hold, 6 seconds out). Would you like to connect with our adolescent counsellor on 14416 right now?";
    } else if (lower.includes('sleep') || lower.includes('insomnia')) {
      reply = "Sleep fragmentation worsens anxiety. Keep your mobile away 45 minutes before bedtime and drink a glass of warm water. Shall I reserve a slot at the GMCH sleep wellness clinic for you?";
    }

    const botBubble = document.createElement('div');
    botBubble.className = "flex justify-start mb-2";
    botBubble.innerHTML = `<div class="bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl rounded-tl-none px-3.5 py-2 text-xs max-w-xs shadow-sm">
      <div class="text-[10px] font-bold text-teal-700 uppercase mb-0.5">Tele-Raktim Copilot</div>
      ${reply}
    </div>`;
    container.appendChild(botBubble);
    container.scrollTop = container.scrollHeight;
  }, 500);
}

/* ==========================================================================
   DASHBOARD 2: DOCTOR / CLINICAL PSYCHOLOGIST VIEW
   ========================================================================== */
function renderDoctorDashboard() {
  const profile = ROLE_PROFILES.doctor;
  const nameEl = document.getElementById('doctorProfileName');
  const regEl = document.getElementById('doctorProfileReg');
  const facilityEl = document.getElementById('doctorProfileFacility');
  const totalRedirEl = document.getElementById('doctorTotalRedirected');
  const pendingEl = document.getElementById('doctorPendingCases');
  const solvedEl = document.getElementById('doctorSolvedCases');

  if (nameEl) nameEl.textContent = profile.name;
  if (regEl) regEl.textContent = `Reg: ${profile.regNo}`;
  if (facilityEl) facilityEl.textContent = profile.facility;
  if (totalRedirEl) totalRedirEl.textContent = profile.totalRedirected;
  if (pendingEl) pendingEl.textContent = profile.pendingCases;
  if (solvedEl) solvedEl.textContent = profile.solvedCases;

  populateDoctorPatientTable();
}

function populateDoctorPatientTable() {
  const tbody = document.getElementById('doctorPatientsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  doctorPatients.forEach((patient, idx) => {
    const tr = document.createElement('tr');
    tr.className = "border-b border-slate-100 hover:bg-slate-50 transition-colors text-xs";

    let statusPill = `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Pending Review</span>`;
    if (patient.status.includes('Solved')) {
      statusPill = `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Solved / Discharged</span>`;
    }

    let tierPill = `<span class="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-red-100 text-red-800">Priority 1 (Red)</span>`;
    if (patient.tier === 'Amber') {
      tierPill = `<span class="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-100 text-amber-800">Priority 2 (Amber)</span>`;
    }

    tr.innerHTML = `
      <td class="py-3 px-3">
        <div class="font-mono font-bold text-navy-900">${patient.caseId}</div>
        <div class="text-[10px] text-slate-500 font-mono">${patient.patientToken} (${patient.ageSex})</div>
      </td>
      <td class="py-3 px-3">
        <div class="font-semibold text-slate-800">${patient.district}</div>
        <div class="text-[11px] text-slate-600">${patient.chiefComplaint}</div>
      </td>
      <td class="py-3 px-3">${tierPill}</td>
      <td class="py-3 px-3">${statusPill}</td>
      <td class="py-3 px-3 text-slate-700">${patient.prescribedAction}</td>
      <td class="py-3 px-3">
        <div class="flex items-center space-x-1.5">
          <button onclick="toggleDoctorCaseStatus(${idx})" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px]">
            ${patient.status === 'Pending Review' ? 'Mark Solved' : 'Re-open'}
          </button>
          <button onclick="inspectDoctorCase(${idx})" class="px-2 py-1 rounded bg-teal-700 hover:bg-teal-600 text-white font-bold text-[10px]">
            Inspect
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleDoctorCaseStatus(idx) {
  const p = doctorPatients[idx];
  if (p.status === 'Pending Review') {
    p.status = 'Solved / Discharged';
    p.prescribedAction = 'Completed evaluation; therapy regimen authorized.';
    ROLE_PROFILES.doctor.pendingCases--;
    ROLE_PROFILES.doctor.solvedCases++;
    showToast(`Case ${p.caseId} marked as Solved / Discharged`);
  } else {
    p.status = 'Pending Review';
    p.prescribedAction = 'Follow-up clinical reassessment queued';
    ROLE_PROFILES.doctor.pendingCases++;
    ROLE_PROFILES.doctor.solvedCases--;
    showToast(`Case ${p.caseId} re-opened for review`);
  }
  renderDoctorDashboard();
}

function inspectDoctorCase(idx) {
  const p = doctorPatients[idx];
  alert(`CLINICAL INSPECTION - ${p.caseId}\n\nPatient Token: ${p.patientToken}\nDemographics: ${p.ageSex}\nDistrict: ${p.district}\nChief Complaint: ${p.chiefComplaint}\nTriage Severity Score: ${p.triageScore}/100\nStatus: ${p.status}\n\nClinical Notes:\n${p.notes}`);
}

/* ==========================================================================
   DASHBOARD 3: STATE ANALYZER / IAS REPRESENTATIVE VIEW
   ========================================================================== */
function renderAnalyzerDashboard() {
  const profile = ROLE_PROFILES.analyzer;
  const nameEl = document.getElementById('analyzerProfileName');
  const roleEl = document.getElementById('analyzerProfileRole');
  const clearanceEl = document.getElementById('analyzerProfileClearance');

  if (nameEl) nameEl.textContent = profile.name;
  if (roleEl) roleEl.textContent = profile.role;
  if (clearanceEl) clearanceEl.textContent = profile.clearanceLevel;

  initAnalyzerCharts();
}

let analyzerMacroChartInstance = null;
let analyzerSuccessChartInstance = null;

function initAnalyzerCharts() {
  // Chart A: District-wise Distress Severity Bar Chart (Interactive Drilldown)
  const ctxA = document.getElementById('analyzerDistressChart');
  if (ctxA) {
    if (analyzerMacroChartInstance) analyzerMacroChartInstance.destroy();

    const districts = window.RAKTIM_DATA.districts;
    const labels = districts.map(d => d.name);
    const scores = districts.map(d => d.distressIndex);
    const bgColors = districts.map(d => d.tier === 'Red' ? '#DC2626' : (d.tier === 'Amber' ? '#D97706' : '#059669'));

    analyzerMacroChartInstance = new Chart(ctxA, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Vulnerability / Distress Index (0–100)',
          data: scores,
          backgroundColor: bgColors,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const dist = districts[context.dataIndex];
                return `Top Issue: ${dist.topComplaint}\nAssigned: ${dist.mmuAssigned}`;
              }
            }
          }
        },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: '#F1F5F9' } },
          x: { ticks: { font: { size: 9 }, maxRotation: 45, minRotation: 45 } }
        }
      }
    });
  }

  // Chart B: State Outreach Camp Success vs Resolution
  const ctxB = document.getElementById('analyzerSuccessChart');
  if (ctxB) {
    if (analyzerSuccessChartInstance) analyzerSuccessChartInstance.destroy();

    analyzerSuccessChartInstance = new Chart(ctxB, {
      type: 'doughnut',
      data: {
        labels: ['Referrals Completed & Resolved (78.4%)', 'Active Under ASHA Care (14.2%)', 'Drop-out / High Risk (7.4%)'],
        datasets: [{
          data: [78.4, 14.2, 7.4],
          backgroundColor: ['#0D9488', '#F59E0B', '#DC2626'],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
        }
      }
    });
  }
}

// Global Exports
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.selectRoleTab = selectRoleTab;
window.quickLogin = quickLogin;
window.handleLogout = handleLogout;
window.updateUserInterfaceForRole = updateUserInterfaceForRole;
window.calculateCitizenScore = calculateCitizenScore;
window.sendCitizenChatMessage = sendCitizenChatMessage;
window.toggleDoctorCaseStatus = toggleDoctorCaseStatus;
window.inspectDoctorCase = inspectDoctorCase;
