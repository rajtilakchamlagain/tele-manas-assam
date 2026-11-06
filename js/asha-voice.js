/**
 * Tele-Raktim ASHA Vernacular Voice-to-Task Module (X-Factor 3)
 * Provides browser Web Speech API vernacular speech recognition (Assamese, Bengali, Hindi, English),
 * live voice note recording, clinical intent extraction, and automated loop closure.
 */

let speechRecognizer = null;
let isVoiceRecording = false;
let activeTaskIdForVoice = null;

// Initialize Speech Recognition
function initSpeechRecognition() {
  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) {
    console.warn("Web Speech API not supported in this browser. Fallback presets available.");
    return null;
  }

  const recognizer = new SpeechRecognitionClass();
  recognizer.continuous = false;
  recognizer.interimResults = true;
  recognizer.maxAlternatives = 1;

  recognizer.onstart = () => {
    isVoiceRecording = true;
    updateVoiceUIState(true);
  };

  recognizer.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const transcriptInput = document.getElementById('ashaVoiceTranscript');
    if (transcriptInput) {
      transcriptInput.value = finalTranscript || interimTranscript;
    }
  };

  recognizer.onerror = (event) => {
    console.warn("Speech recognition error:", event.error);
    isVoiceRecording = false;
    updateVoiceUIState(false);
    if (window.showToast) {
      showToast(`Voice capture note: ${event.error}. You can also type or use the 1-Click Vernacular Presets!`);
    }
  };

  recognizer.onend = () => {
    isVoiceRecording = false;
    updateVoiceUIState(false);
  };

  return recognizer;
}

// Start Voice Recording
window.startAshaVoiceRecording = function(taskId = null) {
  if (taskId) {
    activeTaskIdForVoice = taskId;
    const taskSelector = document.getElementById('ashaTaskSelect');
    if (taskSelector) taskSelector.value = taskId;
  }

  if (!speechRecognizer) {
    speechRecognizer = initSpeechRecognition();
  }

  const langSelect = document.getElementById('ashaSpeechLang');
  const selectedLang = langSelect ? langSelect.value : 'as-IN';

  const transcriptInput = document.getElementById('ashaVoiceTranscript');
  if (transcriptInput) transcriptInput.value = '';

  if (speechRecognizer) {
    try {
      speechRecognizer.lang = selectedLang;
      speechRecognizer.start();
    } catch (e) {
      console.warn("Restarting recognizer:", e);
      try {
        speechRecognizer.stop();
        setTimeout(() => speechRecognizer.start(), 200);
      } catch (err) {}
    }
  } else {
    // If Web Speech API not available, guide to presets
    if (window.showToast) {
      showToast("Speech API not active on this device. Click any 1-Click Vernacular Preset below to test!");
    }
  }
};

// Stop Voice Recording
window.stopAshaVoiceRecording = function() {
  if (speechRecognizer && isVoiceRecording) {
    try {
      speechRecognizer.stop();
    } catch (e) {}
  }
  isVoiceRecording = false;
  updateVoiceUIState(false);
};

// Update Recording UI State
function updateVoiceUIState(recording) {
  const btnStart = document.getElementById('btnStartAshaVoice');
  const btnStop = document.getElementById('btnStopAshaVoice');
  const pulseBadge = document.getElementById('ashaVoicePulseBadge');

  if (btnStart) {
    if (recording) btnStart.classList.add('hidden');
    else btnStart.classList.remove('hidden');
  }

  if (btnStop) {
    if (recording) btnStop.classList.remove('hidden');
    else btnStop.classList.add('hidden');
  }

  if (pulseBadge) {
    if (recording) pulseBadge.classList.remove('hidden');
    else pulseBadge.classList.add('hidden');
  }
}

// 1-Click Vernacular Speech Presets
window.setAshaVoicePreset = function(presetType) {
  const transcriptInput = document.getElementById('ashaVoiceTranscript');
  const taskSelector = document.getElementById('ashaTaskSelect');
  if (!transcriptInput) return;

  if (presetType === 'home_visit_as') {
    transcriptInput.value = "ৰমেন দাসৰ ঘৰলৈ গৈছিলোঁ। ঔষধ নিয়মিত খোৱা হৈছে আৰু বৰ্তমান সুস্থ। কামটো সম্পন্ন হ'ল।";
    if (taskSelector) taskSelector.value = "TASK-DBR-084";
  } else if (presetType === 'counselling_as') {
    transcriptInput.value = "মৰাণ চাহ বাগিচাৰ শ্ৰমিকৰ পৰিয়ালৰ লগত কথা পাতিলোঁ। বুজাই দিয়া হ'ল আৰু মানসিক সমৰ্থন দিলোঁ।";
    if (taskSelector) taskSelector.value = "TASK-DBR-084";
  } else if (presetType === 'relapse_escalate') {
    transcriptInput.value = "ৰোগীয়ে পুনৰ সুৰা খোৱাৰ লক্ষণ দেখা গৈছে। জৰুৰীভাৱে চিএইচচি হাস্পতালৰ ডাক্তৰক জনাব লাগে।";
    if (taskSelector) taskSelector.value = "TASK-DBR-084";
  } else if (presetType === 'postpartum_en') {
    transcriptInput.value = "Patient Dipika Saikia home visit done. Postpartum baby care counselling given. Patient stable. Task completed.";
    if (taskSelector) taskSelector.value = "TASK-NAG-031";
  }

  if (window.showToast) {
    showToast("Vernacular audio transcript loaded. Click 'Process & Auto-Close Loop'!");
  }
};

// Submit Spoken Note to Backend
window.submitAshaVoiceNote = async function() {
  const transcriptInput = document.getElementById('ashaVoiceTranscript');
  const taskSelector = document.getElementById('ashaTaskSelect');
  const resultCard = document.getElementById('ashaVoiceResultCard');
  const submitBtn = document.getElementById('btnSubmitAshaVoice');

  const transcript = transcriptInput ? transcriptInput.value.trim() : '';
  const taskId = (taskSelector ? taskSelector.value : null) || activeTaskIdForVoice || "TASK-DBR-084";

  if (!transcript) {
    if (window.showToast) showToast("Please record your voice or select a vernacular preset first.");
    return;
  }

  if (submitBtn) {
    submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>Transcribing & Closing Loop...`;
    submitBtn.disabled = true;
  }

  try {
    const res = await window.apiSubmitAshaVoiceNote(taskId, transcript, "Runjun Gogoi (ASHA #412)");

    if (submitBtn) {
      submitBtn.innerHTML = `<span>Submit Voice Note & Close Loop</span>`;
      submitBtn.disabled = false;
    }

    if (res && res.success) {
      // Display result breakdown
      if (resultCard) {
        resultCard.classList.remove('hidden');
        document.getElementById('ashaResTaskId').textContent = res.task_id;
        document.getElementById('ashaResStatus').textContent = res.status;
        document.getElementById('ashaResActionEn').textContent = res.clinical_action_en;
        document.getElementById('ashaResActionAs').textContent = res.clinical_action_as || "পৰিদৰ্শন সম্পন্ন";
        document.getElementById('ashaResTranscript').textContent = `"${res.transcript}"`;
        document.getElementById('ashaResDoctorHandover').textContent = res.doctor_handover;
      }

      // Update task in local dataset
      if (window.RAKTIM_DATA && window.RAKTIM_DATA.ashaTasks) {
        const t = window.RAKTIM_DATA.ashaTasks.find(x => x.taskId === res.task_id);
        if (t) {
          t.status = res.status;
          t.clinicalAction = res.clinical_action_en;
          t.voiceTranscript = res.transcript;
        }
      }

      // Re-render ASHA Tasks Table
      window.refreshAshaTasksTable();

      if (window.showToast) {
        showToast(`✅ ASHA Loop Closed! Status: ${res.status}. Case synchronized with GMCH Hub.`);
      }
    } else {
      if (window.showToast) showToast("Could not process voice note. Check connection.");
    }
  } catch (err) {
    console.error("ASHA voice submit error:", err);
    if (submitBtn) {
      submitBtn.innerHTML = `<span>Submit Voice Note & Close Loop</span>`;
      submitBtn.disabled = false;
    }
  }
};

// Render ASHA Tasks Table with Voice Note Buttons
window.refreshAshaTasksTable = async function() {
  const tbody = document.getElementById('ashaTasksTableBody');
  if (!tbody) return;

  let tasks = null;
  if (window.apiGetAshaTasks) {
    tasks = await window.apiGetAshaTasks();
  }

  // Fallback to local data
  if (!tasks || tasks.length === 0) {
    tasks = (window.RAKTIM_DATA && window.RAKTIM_DATA.ashaTasks) ? window.RAKTIM_DATA.ashaTasks.map(t => ({
      task_id: t.taskId,
      case_id: t.caseId || "CASE-ASM-2026",
      district: t.district,
      block: t.block,
      patient_token: t.patientCode,
      reason: t.reason,
      assigned_asha: t.assignedAsha,
      priority: t.priority,
      status: t.status,
      guidance: t.guidance,
      clinical_action: t.clinicalAction,
      voice_note_transcript: t.voiceTranscript
    })) : [];
  }

  tbody.innerHTML = '';

  tasks.forEach(task => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-100 hover:bg-slate-50 transition-colors text-xs sm:text-sm';

    const isCompleted = task.status === 'Completed';
    const isEscalated = task.status.includes('Escalated');

    let statusPill = `<span class="px-2.5 py-0.5 rounded-full font-bold text-xs bg-amber-100 text-amber-800 border border-amber-300">Pending Visit</span>`;
    if (isCompleted) {
      statusPill = `<span class="px-2.5 py-0.5 rounded-full font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 w-fit"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Completed (Voice Verified)</span>`;
    } else if (isEscalated) {
      statusPill = `<span class="px-2.5 py-0.5 rounded-full font-bold text-xs bg-red-100 text-red-800 border border-red-300">⚠️ Escalated to Doctor</span>`;
    }

    const actionCell = isCompleted
      ? `<div class="space-y-1">
           <div class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
             ${task.clinical_action || "Home Visit & Meds Verified"}
           </div>
           ${task.voice_note_transcript ? `<div class="text-[10px] text-slate-500 italic truncate max-w-xs" title="${task.voice_note_transcript}">"${task.voice_note_transcript}"</div>` : ''}
         </div>`
      : `<button onclick="openVoiceModalForTask('${task.task_id}')" class="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded text-xs flex items-center space-x-1 shadow transition-colors cursor-pointer">
           <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"/></svg>
           <span>🎙️ Voice Note (কণ্ঠ বাৰ্তা)</span>
         </button>`;

    tr.innerHTML = `
      <td class="py-3 px-3 font-mono font-bold text-navy-900">${task.task_id}</td>
      <td class="py-3 px-3"><b>${task.district}</b><br/><span class="text-xs text-slate-500">${task.block}</span></td>
      <td class="py-3 px-3 font-mono text-slate-600">${task.patient_token}</td>
      <td class="py-3 px-3 text-slate-700 max-w-xs">${task.reason}</td>
      <td class="py-3 px-3 font-medium text-slate-800">${task.assigned_asha}</td>
      <td class="py-3 px-3">${statusPill}</td>
      <td class="py-3 px-3">${actionCell}</td>
    `;
    tbody.appendChild(tr);
  });
};

// Open voice recorder pre-selected to specific task
window.openVoiceModalForTask = function(taskId) {
  activeTaskIdForVoice = taskId;
  const taskSelector = document.getElementById('ashaTaskSelect');
  if (taskSelector) taskSelector.value = taskId;

  // Scroll to studio
  const studio = document.getElementById('ashaVoiceStudio');
  if (studio) {
    studio.scrollIntoView({ behavior: 'smooth' });
    studio.classList.add('ring-2', 'ring-teal-400');
    setTimeout(() => studio.classList.remove('ring-2', 'ring-teal-400'), 1500);
  }

  // Pre-fill transcript with standard prompt
  const transcriptInput = document.getElementById('ashaVoiceTranscript');
  if (transcriptInput && !transcriptInput.value) {
    transcriptInput.placeholder = `Speak patient update for ${taskId}... (অসমীয়া বা ইংৰাজীত কওক)`;
  }

  if (window.showToast) {
    showToast(`Task ${taskId} selected! Click 🎙️ Record Spoken Note or select a vernacular preset.`);
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  window.refreshAshaTasksTable();
});
