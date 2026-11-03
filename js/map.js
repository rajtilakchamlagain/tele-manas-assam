/**
 * MANAS-Assam Geospatial Map Engine
 * Leaflet.js-powered interactive GIS Heatmap of Assam Districts
 */

let assamMap = null;
let districtMarkers = [];

function initAssamMap() {
  const mapElement = document.getElementById('assamMapContainer');
  if (!mapElement) return;

  // Initialize map centered over Assam
  assamMap = L.map('assamMapContainer', {
    center: [26.25, 92.8],
    zoom: 7.4,
    minZoom: 6.5,
    maxZoom: 11,
    scrollWheelZoom: false
  });

  // Clean, official basemap tiles (CartoDB Positron for government enterprise look)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(assamMap);

  // Render markers
  renderDistrictMarkers('all');
}

function renderDistrictMarkers(filter) {
  if (!assamMap || !window.RAKTIM_DATA) return;

  // Clear existing markers
  districtMarkers.forEach(m => assamMap.removeLayer(m));
  districtMarkers = [];

  const districts = window.RAKTIM_DATA.districts;
  const currentLang = window.currentLang || 'en';

  districts.forEach(dist => {
    // Apply filters
    if (filter === 'red' && dist.tier !== 'Red') return;
    if (filter === 'tea' && !dist.teaBelt) return;
    if (filter === 'flood' && !dist.floodAffected) return;

    // Custom HTML marker
    let markerClass = 'marker-alert-green';
    if (dist.tier === 'Red') markerClass = 'marker-alert-red';
    else if (dist.tier === 'Amber') markerClass = 'marker-alert-amber';

    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="district-marker ${markerClass}" style="width: 32px; height: 32px;">${dist.distressIndex}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([dist.lat, dist.lng], { icon: customIcon }).addTo(assamMap);

    const displayName = currentLang === 'as' ? dist.nameAs : dist.name;
    const complaint = currentLang === 'as' ? dist.topComplaintAs : dist.topComplaint;
    const facility = currentLang === 'as' ? dist.primaryFacilityAs : dist.primaryFacility;

    marker.bindTooltip(`<b>${displayName}</b><br/>Distress Index: ${dist.distressIndex}/100`, {
      direction: 'top',
      offset: [0, -16]
    });

    marker.on('click', () => {
      selectDistrict(dist);
    });

    districtMarkers.push(marker);
  });

  // Select default first district (Kamrup Metro or Dhemaji)
  if (districts.length > 0) {
    const defaultDist = districts.find(d => d.id === 'dhemaji') || districts[0];
    selectDistrict(defaultDist);
  }
}

function selectDistrict(dist) {
  const currentLang = window.currentLang || 'en';
  const nameEl = document.getElementById('selectedDistName');
  const indexEl = document.getElementById('selectedDistIndex');
  const indexBarEl = document.getElementById('selectedDistIndexBar');
  const callsEl = document.getElementById('selectedDistCalls');
  const complaintEl = document.getElementById('selectedDistComplaint');
  const facilityEl = document.getElementById('selectedDistFacility');
  const mmuEl = document.getElementById('selectedDistMmu');
  const campDateEl = document.getElementById('selectedDistCampDate');
  const campVenueEl = document.getElementById('selectedDistCampVenue');
  const actionEl = document.getElementById('selectedDistAction');

  if (nameEl) nameEl.textContent = currentLang === 'as' ? dist.nameAs : dist.name;
  if (indexEl) {
    indexEl.textContent = `${dist.distressIndex} / 100`;
    indexEl.className = dist.tier === 'Red' ? 'text-red-700 font-bold' : (dist.tier === 'Amber' ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold');
  }
  if (indexBarEl) {
    indexBarEl.style.width = `${dist.distressIndex}%`;
    indexBarEl.className = dist.tier === 'Red' ? 'h-full bg-red-600 rounded-full transition-all duration-500' : (dist.tier === 'Amber' ? 'h-full bg-amber-500 rounded-full transition-all duration-500' : 'h-full bg-emerald-500 rounded-full transition-all duration-500');
  }
  if (callsEl) callsEl.textContent = dist.calls30d.toLocaleString();
  if (complaintEl) complaintEl.textContent = currentLang === 'as' ? dist.topComplaintAs : dist.topComplaint;
  if (facilityEl) facilityEl.textContent = currentLang === 'as' ? dist.primaryFacilityAs : dist.primaryFacility;
  if (mmuEl) mmuEl.textContent = dist.mmuAssigned;
  if (campDateEl) campDateEl.textContent = dist.nextCampDate;
  if (campVenueEl) campVenueEl.textContent = currentLang === 'as' ? dist.campVenueAs : dist.campVenue;
  if (actionEl) actionEl.textContent = dist.recommendedAction;

  // Visual status pill
  const statusPill = document.getElementById('selectedDistTierPill');
  if (statusPill) {
    if (dist.tier === 'Red') {
      statusPill.textContent = currentLang === 'as' ? 'উচ্চ সতৰ্কতা (ৰেড এলৰ্ট)' : 'CRITICAL PRIORITY';
      statusPill.className = 'px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-300';
    } else if (dist.tier === 'Amber') {
      statusPill.textContent = currentLang === 'as' ? 'মধ্যম সতৰ্কতা (এম্বাৰ)' : 'MODERATE PRIORITY';
      statusPill.className = 'px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300';
    } else {
      statusPill.textContent = currentLang === 'as' ? 'নিয়মীয়া অৱস্থা (গ্ৰীণ)' : 'ROUTINE SURVEILLANCE';
      statusPill.className = 'px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300';
    }
  }

  // Smooth pan to selected district
  if (assamMap) {
    assamMap.panTo([dist.lat, dist.lng], { animate: true, duration: 0.8 });
  }
}

// Global hook for filter buttons
window.filterDistricts = function(type) {
  // Update active pill UI
  const buttons = document.querySelectorAll('.dist-filter-btn');
  buttons.forEach(btn => {
    btn.classList.remove('bg-navy-900', 'text-white', 'border-navy-900');
    btn.classList.add('bg-white', 'text-slate-700', 'border-slate-300');
  });
  const activeBtn = document.getElementById(`filter-btn-${type}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-white', 'text-slate-700');
    activeBtn.classList.add('bg-slate-900', 'text-white', 'border-slate-900');
  }

  renderDistrictMarkers(type);
};

window.initAssamMap = initAssamMap;
