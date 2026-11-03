/**
 * MANAS-Assam Operational Analytics
 * Chart.js Visualizations for State Health Directorate & NHM Leadership
 */

let trendsChartInstance = null;
let demographicsChartInstance = null;
let loopClosureChartInstance = null;

function initAnalyticsCharts() {
  initTrendsChart();
  initDemographicsChart();
  initLoopClosureChart();
}

function initTrendsChart() {
  const ctx = document.getElementById('stateTrendsChart');
  if (!ctx) return;

  if (trendsChartInstance) trendsChartInstance.destroy();

  trendsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jun 2026', 'Jul 2026 (Flood 1)', 'Aug 2026 (Flood 2)', 'Sep 2026', 'Oct 2026 (Festive)', 'Nov 2026 (Current)'],
      datasets: [
        {
          label: 'Anxiety & Exam Panic',
          data: [1820, 1950, 2100, 2450, 2890, 3120],
          borderColor: '#0284C7',
          backgroundColor: 'rgba(2, 132, 199, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5
        },
        {
          label: 'Post-Disaster / Flood Stress',
          data: [640, 2850, 3420, 1980, 1150, 1480],
          borderColor: '#DC2626',
          backgroundColor: 'rgba(220, 38, 38, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5
        },
        {
          label: 'Substance & Alcohol Dependence',
          data: [1210, 1280, 1350, 1420, 1510, 1630],
          borderColor: '#D97706',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.3,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Inter', size: 11 }, usePointStyle: true }
        },
        tooltip: {
          backgroundColor: '#0F172A',
          titleFont: { family: 'Inter', size: 12 },
          bodyFont: { family: 'Inter', size: 11 },
          padding: 10,
          cornerRadius: 6
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: '#F1F5F9' },
          ticks: { font: { family: 'Inter', size: 10 }, color: '#64748B' }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 10 }, color: '#64748B' }
        }
      }
    }
  });
}

function initDemographicsChart() {
  const ctx = document.getElementById('demographicsChart');
  if (!ctx) return;

  if (demographicsChartInstance) demographicsChartInstance.destroy();

  demographicsChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Adolescents & Students (15–24)', 'Working Adults & Mothers (25–40)', 'Middle-Aged (41–60)', 'Elderly Care (60+)'],
      datasets: [{
        data: [38, 42, 14, 6],
        backgroundColor: ['#0284C7', '#0D9488', '#F59E0B', '#64748B'],
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Inter', size: 10 }, boxWidth: 12, padding: 8 }
        }
      }
    }
  });
}

function initLoopClosureChart() {
  const ctx = document.getElementById('loopClosureChart');
  if (!ctx) return;

  if (loopClosureChartInstance) loopClosureChartInstance.destroy();

  loopClosureChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Kamrup Metro', 'Sonitpur', 'Dhemaji', 'Dibrugarh', 'Cachar', 'Nagaon'],
      datasets: [
        {
          label: 'Tele-Referrals Issued',
          data: [450, 310, 290, 340, 260, 280],
          backgroundColor: '#94A3B8',
          borderRadius: 4
        },
        {
          label: 'Hospital OPD Verified',
          data: [380, 240, 180, 220, 190, 210],
          backgroundColor: '#0284C7',
          borderRadius: 4
        },
        {
          label: 'ASHA Home-Visit Loop Closed',
          data: [420, 295, 265, 310, 240, 260],
          backgroundColor: '#0D9488',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Inter', size: 10 }, usePointStyle: true }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#F1F5F9' },
          ticks: { font: { family: 'Inter', size: 10 }, color: '#64748B' }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 10 }, color: '#64748B' }
        }
      }
    }
  });
}

window.initAnalyticsCharts = initAnalyticsCharts;
