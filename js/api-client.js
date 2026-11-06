/**
 * MANAS-Assam / Tele-Raktim Live REST API Client
 * Seamlessly connects the frontend to the Flask Dual-Vault Backend.
 * Features automated health detection and resilient fallback.
 */

window.API_BASE = window.location.origin.includes('github.io') ? '' : window.location.origin;
window.isBackendOnline = false;

document.addEventListener('DOMContentLoaded', () => {
  checkBackendHealth();
});

async function checkBackendHealth() {
  const badge = document.getElementById('backendStatusBadge');
  try {
    const res = await fetch(`${window.API_BASE}/api/health`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      window.isBackendOnline = true;
      if (badge) {
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span><span>Live SDC API Connected (Dual-Vault Active)</span>`;
        badge.className = "hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800";
      }
      return;
    }
  } catch (e) {
    // Backend offline / GitHub Pages mode
  }

  window.isBackendOnline = false;
  if (badge) {
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-sky-400 mr-1.5"></span><span>Dual-Vault Ready (Static Demo Mode)</span>`;
    badge.className = "hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-sky-300 border border-slate-700";
  }
}

// Live Triage Call
async function apiAnalyzeTranscript(rawText, district, ageSex) {
  if (window.isBackendOnline) {
    try {
      const res = await fetch(`${window.API_BASE}/api/triage/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: rawText, district: district, age_sex: ageSex })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn("Backend error, falling back to local NLP:", e);
    }
  }
  return null;
}

// Live Doctor Caseload Fetch
async function apiGetDoctorCaseload() {
  if (window.isBackendOnline) {
    try {
      const res = await fetch(`${window.API_BASE}/api/doctor/caseload`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend error:", e);
    }
  }
  return null;
}

// Live Doctor Case Status Update
async function apiUpdateCaseStatus(caseId, newStatus, action) {
  if (window.isBackendOnline) {
    try {
      const res = await fetch(`${window.API_BASE}/api/doctor/case/${caseId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, prescribed_action: action })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend error:", e);
    }
  }
  return null;
}

// Live Citizen Assessment Submit
async function apiSubmitAssessment(answers) {
  if (window.isBackendOnline) {
    try {
      const res = await fetch(`${window.API_BASE}/api/citizen/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answers, citizen_token: ROLE_PROFILES.citizen.token })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend error:", e);
    }
  }
  return null;
}

// Live Acoustic Vocal Biomarker Analysis (Live Mic & Audio Buffer)
async function apiAnalyzeAcousticLive(audioBase64, caseId, token) {
  if (window.isBackendOnline) {
    try {
      const res = await fetch(`${window.API_BASE}/api/acoustic/analyze-live`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_base64: audioBase64,
          case_id: caseId || "CASE-LIVE-MIC",
          citizen_token: token || "TOKEN-LIVE-MIC"
        })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn("Backend error during live acoustic analysis:", e);
    }
  }

  // Graceful simulated fallback if backend offline
  return {
    success: true,
    duration_seconds: 5.2,
    acoustic_anxiety_score: 82,
    tier: "Red",
    acoustic_status: "Acute Vocal Tremor & Autonomic Hyperarousal",
    recommendation: "Severe sympathetic fight-or-flight vocal tension detected (high jitter/tremor). Prioritize caller for urgent psychiatrist de-escalation.",
    biomarkers: {
      mean_pitch_hz: 215.4,
      pitch_std_hz: 38.2,
      pitch_jitter_pct: 4.62,
      vocal_tremor_hz: 7.20,
      shimmer_pct: 6.85,
      hnr_db: 9.8,
      speech_pause_ratio: 0.46
    },
    session_id: "AC-SESS-OFFLINE-SIM"
  };
}

// Live Acoustic Vocal Biomarker Analysis (Synthetic / legacy)
async function apiAnalyzeAcoustic() {
  if (window.isBackendOnline) {
    try {
      const res = await fetch(`${window.API_BASE}/api/acoustic/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn("Backend error:", e);
    }
  }
  return {
    pitch_jitter_pct: 4.82,
    vocal_tremor_hz: 7.45,
    speech_pause_ratio: 0.54,
    acoustic_anxiety_score: 84,
    acoustic_status: "HIGH VOCAL TREMOR (Acute Distress Cues)",
    recommendation: "Acoustic cues confirm sympathetic nervous system hyperarousal. Prioritize caller."
  };
}

// Grassroots ASHA Tasks & Loop Closure (X-Factor 3)
async function apiGetAshaTasks() {
  if (window.isBackendOnline) {
    try {
      const res = await fetch(`${window.API_BASE}/api/asha/tasks`);
      if (res.ok) {
        const json = await res.json();
        return json.tasks;
      }
    } catch (e) {
      console.warn("Backend error fetching ASHA tasks:", e);
    }
  }
  return null;
}

async function apiSubmitAshaVoiceNote(taskId, transcript, ashaName) {
  if (window.isBackendOnline) {
    try {
      const res = await fetch(`${window.API_BASE}/api/asha/voice-note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          transcript: transcript,
          asha_name: ashaName || "Assigned ASHA"
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend error submitting ASHA voice note:", e);
    }
  }

  // Fallback offline simulation
  return {
    success: true,
    task_id: taskId || "TASK-DBR-084",
    status: "Completed",
    clinical_action_en: "Home Visit Conducted & Medication Compliance Verified",
    clinical_action_as: "গৃহ পৰিদৰ্শন সম্পন্ন আৰু ঔষধৰ ব্যৱহাৰ নিশ্চিত",
    transcript: transcript,
    doctor_handover: `ASHA Voice Note processed offline: ${transcript}. Status: Completed.`,
    completed_at: new Date().toISOString()
  };
}

// Global Exports
window.apiAnalyzeTranscript = apiAnalyzeTranscript;
window.apiGetDoctorCaseload = apiGetDoctorCaseload;
window.apiUpdateCaseStatus = apiUpdateCaseStatus;
window.apiSubmitAssessment = apiSubmitAssessment;
window.apiAnalyzeAcoustic = apiAnalyzeAcoustic;
window.apiAnalyzeAcousticLive = apiAnalyzeAcousticLive;
window.apiGetAshaTasks = apiGetAshaTasks;
window.apiSubmitAshaVoiceNote = apiSubmitAshaVoiceNote;
window.checkBackendHealth = checkBackendHealth;
