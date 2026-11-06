/**
 * Tele-Raktim-Assam Main Controller
 * Handles e-Prastuti Accessibility, Bilingual i18n, Tab Navigation,
 * Search Modal, and Government Dispatch Order Modals.
 */

window.currentLang = 'en';
window.currentFontSize = 16;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize subsystems
  if (window.initAssamMap) window.initAssamMap();
  if (window.initTriageSimulator) window.initTriageSimulator();
  if (window.initAnalyticsCharts) window.initAnalyticsCharts();

  // Populate ASHA tasks and Document tables
  populateAshaTasks();
  populateDocumentsTable();

  // Setup search shortcut (Ctrl + K)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeSearchModal();
      closeDispatchModal();
    }
  });
});

/* ==========================================================================
   Bilingual Translation Engine (English <-> Assamese)
   ========================================================================== */
function toggleLanguage() {
  window.currentLang = window.currentLang === 'en' ? 'as' : 'en';
  applyLanguage(window.currentLang);
  
  // Re-render map and triage with current language
  if (window.renderDistrictMarkers) {
    const activeFilter = document.querySelector('.dist-filter-btn.bg-slate-900');
    const filterType = activeFilter ? activeFilter.id.replace('filter-btn-', '') : 'all';
    window.renderDistrictMarkers(filterType);
  }

  showToast(window.currentLang === 'as' ? 'ভাষা অসমীয়ালৈ পৰিৱৰ্তন কৰা হ\'ল' : 'Language switched to English');
}

function applyLanguage(lang) {
  const dictionary = window.RAKTIM_I18N[lang];
  if (!dictionary) return;

  // Update elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dictionary[key]) {
      el.textContent = dictionary[key];
    }
  });

  // Update language toggle button text
  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.textContent = dictionary.langToggle;
  }

  // Set font family class
  if (lang === 'as') {
    document.body.classList.add('lang-as');
  } else {
    document.body.classList.remove('lang-as');
  }

  // Refresh tables
  populateAshaTasks();
  populateDocumentsTable();
}

/* ==========================================================================
   e-Prastuti Accessibility Functions
   ========================================================================== */
function adjustFontSize(delta) {
  if (delta === 0) {
    window.currentFontSize = 16;
  } else {
    window.currentFontSize = Math.min(22, Math.max(13, window.currentFontSize + delta));
  }
  document.documentElement.style.setProperty('--font-base', `${window.currentFontSize}px`);
  showToast(`Text size: ${window.currentFontSize}px`);
}

function toggleContrast() {
  document.body.classList.toggle('high-contrast');
  const isHigh = document.body.classList.contains('high-contrast');
  const contrastText = document.getElementById('contrastLabel');
  if (contrastText) {
    contrastText.textContent = isHigh ? (window.currentLang === 'as' ? 'স্বাভাৱিক' : 'Normal') : (window.currentLang === 'as' ? 'উচ্চ বৈসাদৃশ্য' : 'High Contrast');
  }
  showToast(isHigh ? 'High Contrast Mode Enabled' : 'Normal Contrast Restored');
}

function triggerScreenReaderInfo() {
  const msg = window.currentLang === 'as'
    ? 'টেলি-ৰক্তিম অসম প’ৰ্টেললৈ স্বাগতম। এই ৱেবছাইটটো স্ক্ৰীণ ৰিডাৰৰ সৈতে ব্যৱহাৰৰ বাবে সম্পূৰ্ণ উপযুক্ত।'
    : 'Welcome to Tele-Raktim Assam Portal. This website is fully compliant with WCAG 2.1 AA and compatible with screen readers including NVDA and JAWS.';
  
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = window.currentLang === 'as' ? 'as-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  }
  showToast('Screen reader narration triggered');
}

/* ==========================================================================
   Tab Navigation Router
   ========================================================================== */
function switchTab(tabId) {
  // Hide all sections
  document.querySelectorAll('.portal-tab-section').forEach(sec => {
    sec.classList.add('hidden');
  });

  // Remove active styling on nav buttons
  document.querySelectorAll('.portal-nav-btn').forEach(btn => {
    btn.classList.remove('border-b-2', 'border-navy-900', 'text-navy-900', 'font-bold');
    btn.classList.add('text-slate-600', 'font-medium');
  });

  // Show target section
  const targetSection = document.getElementById(`section-${tabId}`);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Highlight active button
  const activeBtn = document.getElementById(`nav-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-slate-600', 'font-medium');
    activeBtn.classList.add('border-b-2', 'border-navy-900', 'text-navy-900', 'font-bold');
  }

  // Trigger leaflet redraw if map tab was opened
  if (tabId === 'map' && window.assamMap) {
    setTimeout(() => {
      window.assamMap.invalidateSize();
    }, 200);
  }
}

/* ==========================================================================
   Dynamic Table Renderers (ASHA Tasks & Documents)
   ========================================================================== */
function populateAshaTasks() {
  if (typeof window.refreshAshaTasksTable === 'function') {
    window.refreshAshaTasksTable();
    return;
  }
  const tbody = document.getElementById('ashaTasksTableBody');
  if (!tbody || !window.RAKTIM_DATA) return;

  const currentLang = window.currentLang || 'en';
  tbody.innerHTML = '';

  window.RAKTIM_DATA.ashaTasks.forEach(task => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-100 hover:bg-slate-50 transition-colors text-xs sm:text-sm';

    let statusPill = `<span class="px-2 py-0.5 rounded-full font-bold text-xs bg-amber-100 text-amber-800 border border-amber-300">Pending</span>`;
    if (task.status === 'Completed') {
      statusPill = `<span class="px-2 py-0.5 rounded-full font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-300">Completed</span>`;
    } else if (task.status === 'In Progress') {
      statusPill = `<span class="px-2 py-0.5 rounded-full font-bold text-xs bg-sky-100 text-sky-800 border border-sky-300">In Progress</span>`;
    }

    tr.innerHTML = `
      <td class="py-3 px-3 font-mono font-bold text-navy-900">${task.taskId}</td>
      <td class="py-3 px-3"><b>${task.district}</b><br/><span class="text-xs text-slate-500">${task.block}</span></td>
      <td class="py-3 px-3 font-mono text-slate-600">${task.patientCode}</td>
      <td class="py-3 px-3 text-slate-700">${task.reason}</td>
      <td class="py-3 px-3 font-medium text-slate-800">${task.assignedAsha}</td>
      <td class="py-3 px-3">${statusPill}</td>
      <td class="py-3 px-3 text-xs text-slate-600 italic max-w-xs">${task.guidance}</td>
    `;
    tbody.appendChild(tr);
  });
}

function populateDocumentsTable() {
  const tbody = document.getElementById('documentsTableBody');
  if (!tbody || !window.RAKTIM_DATA) return;

  const currentLang = window.currentLang || 'en';
  tbody.innerHTML = '';

  window.RAKTIM_DATA.documents.forEach(doc => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-100 hover:bg-slate-50 transition-colors text-xs sm:text-sm';
    const displayTitle = currentLang === 'as' ? doc.titleAs : doc.title;

    tr.innerHTML = `
      <td class="py-3 px-3">
        <div class="font-bold text-navy-900 flex items-center">
          <svg class="w-4 h-4 mr-1.5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>
          ${displayTitle}
        </div>
        <div class="text-xs text-slate-500 font-mono mt-0.5">Ref: ${doc.refNumber}</div>
      </td>
      <td class="py-3 px-3"><span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">${doc.category}</span></td>
      <td class="py-3 px-3 text-slate-600">${doc.date}</td>
      <td class="py-3 px-3 text-slate-600">${doc.size}</td>
      <td class="py-3 px-3">
        <button onclick="downloadOfficialDoc('${doc.refNumber}')" class="px-2.5 py-1 text-xs font-bold rounded bg-navy-900 text-white hover:bg-navy-800 transition-colors inline-flex items-center">
          <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          PDF
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function downloadOfficialDoc(refNumber) {
  showToast(`Downloading official Gazette Ref: ${refNumber}...`);
}

/* ==========================================================================
   Official Government Dispatch Order Modal Generator
   ========================================================================== */
function openDispatchModal() {
  const modal = document.getElementById('dispatchModal');
  if (!modal) return;

  const currentLang = window.currentLang || 'en';
  const nameEl = document.getElementById('selectedDistName');
  const distName = nameEl ? nameEl.textContent : 'Assam District';
  const venueEl = document.getElementById('selectedDistCampVenue');
  const venue = venueEl ? venueEl.textContent : 'District CHC';
  const mmuEl = document.getElementById('selectedDistMmu');
  const mmu = mmuEl ? mmuEl.textContent : 'MMU Unit';
  const dateEl = document.getElementById('selectedDistCampDate');
  const date = dateEl ? dateEl.textContent : '2026-11-08';

  const orderNumber = `GOA/HFW/MMU-ORD/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

  document.getElementById('modalOrderNumber').textContent = orderNumber;
  document.getElementById('modalOrderDate').textContent = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  document.getElementById('modalOrderDistrict').textContent = distName;
  document.getElementById('modalOrderVenue').textContent = venue;
  document.getElementById('modalOrderMmu').textContent = mmu;
  document.getElementById('modalOrderCampDate').textContent = date;

  modal.classList.remove('hidden');
}

function closeDispatchModal() {
  const modal = document.getElementById('dispatchModal');
  if (modal) modal.classList.add('hidden');
}

function printDispatchOrder() {
  window.print();
}

/* ==========================================================================
   Global Search Modal (Ctrl + K)
   ========================================================================== */
function openSearchModal() {
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('globalSearchInput');
  if (modal) {
    modal.classList.remove('hidden');
    if (input) input.focus();
  }
}

function closeSearchModal() {
  const modal = document.getElementById('searchModal');
  if (modal) modal.classList.add('hidden');
}

function handleSearchQuery(query) {
  const resultsContainer = document.getElementById('searchResultsContainer');
  if (!resultsContainer) return;

  if (!query || query.trim().length === 0) {
    resultsContainer.innerHTML = '<div class="text-xs text-slate-500 py-3 text-center">Type a keyword like "Dhemaji", "Triage", "SOP", "14416", or "ASHA"</div>';
    return;
  }

  const q = query.toLowerCase();
  let matches = [];

  // Search districts
  window.RAKTIM_DATA.districts.forEach(d => {
    if (d.name.toLowerCase().includes(q) || d.topComplaint.toLowerCase().includes(q)) {
      matches.push({ type: 'District Radar', title: `${d.name} (${d.tier} Alert)`, action: `switchTab('map'); selectDistrict(window.RAKTIM_DATA.districts.find(x => x.id === '${d.id}')); closeSearchModal();` });
    }
  });

  // Search documents
  window.RAKTIM_DATA.documents.forEach(doc => {
    if (doc.title.toLowerCase().includes(q) || doc.category.toLowerCase().includes(q)) {
      matches.push({ type: 'Government Circular', title: doc.title, action: `switchTab('docs'); closeSearchModal();` });
    }
  });

  if (matches.length === 0) {
    resultsContainer.innerHTML = '<div class="text-xs text-slate-500 py-3 text-center">No matching official records found.</div>';
    return;
  }

  resultsContainer.innerHTML = '';
  matches.slice(0, 5).forEach(m => {
    const item = document.createElement('div');
    item.className = 'p-2.5 hover:bg-slate-100 rounded cursor-pointer transition-colors border-b border-slate-100';
    item.innerHTML = `<span class="text-xs font-bold text-navy-900 px-1.5 py-0.5 bg-slate-200 rounded mr-2">${m.type}</span><span class="text-sm text-slate-800">${m.title}</span>`;
    item.onclick = () => eval(m.action);
    resultsContainer.appendChild(item);
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('manasToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'manasToast';
    toast.className = 'fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-2xl text-xs sm:text-sm font-medium flex items-center space-x-2 transition-all transform duration-300 translate-y-10 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<svg class="w-4 h-4 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg><span>${message}</span>`;
  
  toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3500);
}

// Global functions
window.toggleLanguage = toggleLanguage;
window.adjustFontSize = adjustFontSize;
window.toggleContrast = toggleContrast;
window.triggerScreenReaderInfo = triggerScreenReaderInfo;
window.switchTab = switchTab;
window.openDispatchModal = openDispatchModal;
window.closeDispatchModal = closeDispatchModal;
window.printDispatchOrder = printDispatchOrder;
window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;
window.handleSearchQuery = handleSearchQuery;
window.downloadOfficialDoc = downloadOfficialDoc;
window.showToast = showToast;
