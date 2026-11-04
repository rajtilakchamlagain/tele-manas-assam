/**
 * Tele-Raktim Live Acoustic Vocal Biomarker Laboratory (X-Factor Engine)
 * Captures microphone audio, renders live oscilloscope waveforms,
 * encodes 16-bit PCM WAV in-browser, and streams to Flask DSP Engine.
 */

let audioContext = null;
let mediaStream = null;
let scriptProcessor = null;
let analyserNode = null;
let recordedSamples = [];
let isRecording = false;
let countdownTimer = null;
let animationFrameId = null;
const RECORDING_DURATION_SEC = 8;

// Client-side 16-bit PCM WAV Encoder (Zero External Dependencies)
function encodeWAV(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length minus RIFF identifier & length
  view.setUint32(4, 36 + samples.length * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 = PCM)
  view.setUint16(20, 1, true);
  // channel count (1 = Mono)
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, samples.length * 2, true);

  // Write 16-bit PCM audio samples with clipping protection
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }

  return buffer;
}

function bufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Start Live Microphone Recording
window.startLiveAcousticRecording = async function() {
  if (isRecording) return;

  const btnStart = document.getElementById('btnStartAcousticRec');
  const btnStop = document.getElementById('btnStopAcousticRec');
  const statusBadge = document.getElementById('acousticRecStatusBadge');
  const countdownEl = document.getElementById('acousticCountdown');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: false,
        autoGainControl: true
      }
    });

    mediaStream = stream;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass({ sampleRate: 16000 });

    const source = audioContext.createMediaStreamSource(stream);
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 512;

    // Buffer audio samples
    recordedSamples = [];
    scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
    scriptProcessor.onaudioprocess = (e) => {
      if (!isRecording) return;
      const inputData = e.inputBuffer.getChannelData(0);
      for (let i = 0; i < inputData.length; i++) {
        recordedSamples.push(inputData[i]);
      }
    };

    source.connect(analyserNode);
    analyserNode.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);

    isRecording = true;
    if (btnStart) btnStart.classList.add('hidden');
    if (btnStop) btnStop.classList.remove('hidden');
    if (statusBadge) {
      statusBadge.classList.remove('hidden');
      statusBadge.className = 'px-3 py-1 bg-red-600/90 text-white rounded-full text-xs font-bold flex items-center space-x-2 animate-pulse';
    }

    // Start Real-Time Canvas Oscilloscope Visualizer
    drawOscilloscope();

    // Countdown Timer
    let secondsLeft = RECORDING_DURATION_SEC;
    if (countdownEl) countdownEl.textContent = `${secondsLeft}s`;

    countdownTimer = setInterval(() => {
      secondsLeft--;
      if (countdownEl) countdownEl.textContent = `${secondsLeft}s`;
      if (secondsLeft <= 0) {
        clearInterval(countdownTimer);
        window.stopLiveAcousticRecording();
      }
    }, 1000);

    if (window.showToast) {
      showToast("Microphone connected! Speak naturally for 8 seconds...");
    }
  } catch (err) {
    console.error("Microphone access error:", err);
    if (window.showToast) {
      showToast("Microphone permission denied. Try the 1-Click Clinical Presets below!");
    }
    alert("Microphone Access Notice:\n" + (err.message || "Please allow microphone permissions in your browser, or click any of the 1-Click Clinical Audio Presets to test instant DSP analysis."));
  }
};

// Stop Recording & Send to DSP Engine
window.stopLiveAcousticRecording = async function() {
  if (!isRecording) return;
  isRecording = false;

  if (countdownTimer) clearInterval(countdownTimer);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);

  // Stop audio tracks
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }
  if (scriptProcessor) scriptProcessor.disconnect();
  if (analyserNode) analyserNode.disconnect();
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close();
  }

  const btnStart = document.getElementById('btnStartAcousticRec');
  const btnStop = document.getElementById('btnStopAcousticRec');
  const statusBadge = document.getElementById('acousticRecStatusBadge');

  if (btnStop) btnStop.classList.add('hidden');
  if (btnStart) {
    btnStart.classList.remove('hidden');
    btnStart.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>Running DSP Micro-Tremor Analysis...`;
  }

  if (recordedSamples.length < 1600) {
    if (btnStart) btnStart.innerHTML = `🎙️ Record Live Voice (8s Mic)`;
    if (window.showToast) showToast("Audio clip too short. Please speak longer.");
    return;
  }

  // Encode WAV
  const wavBuffer = encodeWAV(recordedSamples, 16000);
  const base64Wav = bufferToBase64(wavBuffer);

  // Send to backend live DSP endpoint
  try {
    const result = await window.apiAnalyzeAcousticLive(base64Wav, "CASE-LIVE-MIC-TRIAGE");
    updateAcousticUI(result);
  } catch (err) {
    console.error("DSP analysis failed:", err);
    if (window.showToast) showToast("DSP analysis failed. Using clinical baseline.");
  } finally {
    if (btnStart) btnStart.innerHTML = `🎙️ Record Live Voice (8s Mic)`;
    if (statusBadge) statusBadge.classList.add('hidden');
  }
};

// Real-Time Canvas Oscilloscope
function drawOscilloscope() {
  const canvas = document.getElementById('acousticVisualizer');
  if (!canvas || !analyserNode) return;

  const ctx = canvas.getContext('2d');
  const bufferLength = analyserNode.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function render() {
    if (!isRecording) {
      // Draw idle line
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      return;
    }

    animationFrameId = requestAnimationFrame(render);
    analyserNode.getByteTimeDomainData(dataArray);

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle background grid
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Waveform line
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#2dd4bf'; // Teal-400
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#14b8a6';

    ctx.beginPath();
    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * (canvas.height / 2);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  render();
}

// 1-Click Clinical Audio Presets
window.testAcousticPreset = async function(presetType) {
  const btn = event?.currentTarget;
  const originalText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = `<svg class="animate-spin -ml-1 mr-1 h-3 w-3 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Analyzing...`;
  }

  // Synthesize realistic audio in memory
  const sr = 16000;
  const durationSec = 3.5;
  const numSamples = Math.floor(sr * durationSec);
  const samples = new Float32Array(numSamples);

  let baseF0 = 180;
  let jitterStrength = 0.02;
  let tremorHz = 5.0;
  let pauseStart = 1.0;
  let pauseEnd = 1.4;

  if (presetType === 'panic') {
    // Acute panic / Flood distress: High pitch, high tremor, choking pauses
    baseF0 = 265;
    jitterStrength = 0.08;
    tremorHz = 7.4;
    pauseStart = 1.2;
    pauseEnd = 2.0;
  } else if (presetType === 'depression') {
    // Depressive flat affect: Low monotone pitch, lengthy latency pauses
    baseF0 = 115;
    jitterStrength = 0.015;
    tremorHz = 4.2;
    pauseStart = 0.8;
    pauseEnd = 2.2;
  } else {
    // Calm baseline: Moderate resonant pitch, steady cadence
    baseF0 = 160;
    jitterStrength = 0.008;
    tremorHz = 4.5;
    pauseStart = 0.0;
    pauseEnd = 0.0;
  }

  let phase = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sr;
    if (t >= pauseStart && t <= pauseEnd) {
      samples[i] = (Math.random() - 0.5) * 0.005; // silence / breath
    } else {
      const f0 = baseF0 + Math.sin(2 * Math.PI * tremorHz * t) * (baseF0 * jitterStrength) + (Math.random() - 0.5) * 8;
      phase += 2 * Math.PI * f0 / sr;
      samples[i] = 0.6 * Math.sin(phase) + 0.15 * Math.sin(2 * phase) + (Math.random() - 0.5) * 0.05;
    }
  }

  const wavBuffer = encodeWAV(samples, sr);
  const base64Wav = bufferToBase64(wavBuffer);

  try {
    const result = await window.apiAnalyzeAcousticLive(base64Wav, `PRESET-${presetType.toUpperCase()}`);
    updateAcousticUI(result);
    if (window.showToast) {
      showToast(`Loaded Preset: ${result.acoustic_status} (Score: ${result.acoustic_anxiety_score}/100)`);
    }
  } catch (err) {
    console.error("Preset test failed:", err);
  } finally {
    if (btn) btn.innerHTML = originalText;
  }
};

// Update UI with DSP Biomarkers
function updateAcousticUI(data) {
  if (!data) return;

  const bm = data.biomarkers || {};
  const jitterEl = document.getElementById('acousticJitter');
  const tremorEl = document.getElementById('acousticTremor');
  const pausesEl = document.getElementById('acousticPauses');
  const pitchEl = document.getElementById('acousticPitch');
  const hnrEl = document.getElementById('acousticHNR');
  const shimmerEl = document.getElementById('acousticShimmer');

  const scoreEl = document.getElementById('acousticScore');
  const statusEl = document.getElementById('acousticStatus');
  const recEl = document.getElementById('acousticRec');
  const tierBadge = document.getElementById('acousticTierBadge');
  const sessIdEl = document.getElementById('acousticSessionId');

  if (jitterEl) jitterEl.textContent = `${bm.pitch_jitter_pct ?? 1.2}%`;
  if (tremorEl) tremorEl.textContent = `${bm.vocal_tremor_hz ?? 5.5} Hz`;
  if (pausesEl) pausesEl.textContent = bm.speech_pause_ratio ?? 0.22;
  if (pitchEl) pitchEl.textContent = `${bm.mean_pitch_hz ?? 180} Hz`;
  if (hnrEl) hnrEl.textContent = `${bm.hnr_db ?? 16.5} dB`;
  if (shimmerEl) shimmerEl.textContent = `${bm.shimmer_pct ?? 2.8}%`;

  const score = data.acoustic_anxiety_score ?? 50;
  if (scoreEl) {
    scoreEl.textContent = `${score} / 100`;
    scoreEl.className = score >= 75 ? "text-2xl font-black text-red-400 mt-0.5" : (score >= 55 ? "text-2xl font-black text-amber-400 mt-0.5" : "text-2xl font-black text-emerald-400 mt-0.5");
  }

  if (statusEl) {
    statusEl.textContent = data.acoustic_status || "Baseline";
  }

  if (tierBadge) {
    const tier = data.tier || (score >= 75 ? "Red" : (score >= 55 ? "Amber" : "Green"));
    tierBadge.textContent = `${tier.toUpperCase()} TIER`;
    if (tier === 'Red') {
      tierBadge.className = 'px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-950 text-red-300 border border-red-600 animate-pulse';
    } else if (tier === 'Amber') {
      tierBadge.className = 'px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-950 text-amber-300 border border-amber-600';
    } else {
      tierBadge.className = 'px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-600';
    }
  }

  if (recEl) {
    recEl.textContent = `"${data.recommendation || 'Clinical biomarkers within physiological range.'}"`;
  }

  if (sessIdEl && data.session_id) {
    sessIdEl.textContent = data.session_id;
  }

  // Draw static waveform pulse on canvas after update
  const canvas = document.getElementById('acousticVisualizer');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = score >= 75 ? '#f87171' : (score >= 55 ? '#fbbf24' : '#34d399');
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 4) {
      const freq = score >= 75 ? 0.25 : 0.08;
      const amp = score >= 75 ? 18 : 8;
      const y = canvas.height / 2 + Math.sin(x * freq) * amp * (Math.sin(x * 0.02) + 0.3);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('acousticVisualizer');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }
});
