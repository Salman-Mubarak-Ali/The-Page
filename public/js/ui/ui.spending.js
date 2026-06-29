import { buildSpendMapForMonth, buildYearlyTotals } from '../logic/logic.spend.js';
import { loadAllPages } from '../services/storage.js';
import { todayYYYYMMDD } from '../utils/date.js';

export function initSpending(globalState) {
  const spendMonth = document.getElementById('spendMonth');
  const calendarGrid = document.getElementById('calendarGrid');
  const yearlySummary = document.getElementById('yearlySummary');
  const monthTotalDisplay = document.getElementById('monthTotalDisplay');
  const yearTotalDisplay = document.getElementById('yearTotalDisplay');
  const yearAvgDisplay = document.getElementById('yearAvgDisplay');

  function buildCalendar(monthStr) {
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';
    
    const [y, m] = (monthStr || todayYYYYMMDD()).split('-');
    const year = Number(y), month = Number(m);

    const first = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0);
    const startWeekday = first.getDay();
    const days = last.getDate();

    // Header
    const header = document.createElement('div');
    header.className = 'd-flex gap-1 mb-2 small text-muted text-center fw-bold';
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => {
      const el = document.createElement('div');
      el.textContent = d;
      el.style.width = '14.28%';
      header.appendChild(el);
    });
    calendarGrid.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'calendar';

    // Empty cells before first day
    for (let i = 0; i < startWeekday; i++) {
      const c = document.createElement('div');
      c.className = 'cell empty';
      grid.appendChild(c);
    }

    const spendMap = buildSpendMapForMonth(year, month, loadAllPages(globalState.currentNotebookId || ''));
    let monthTotal = 0;

    // Day cells
    for (let day = 1; day <= days; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const amt = spendMap[dateStr] || 0;
      monthTotal += amt;

      const c = document.createElement('div');
      c.className = 'cell';
      
      // Highlight today
      if (dateStr === todayYYYYMMDD()) {
        c.style.border = '2px solid #0d6efd';
        c.style.backgroundColor = '#e7f3ff';
      }

      // Highlight spending days
      if (amt > 0) {
        c.style.backgroundColor = '#d4edda';
      }

      c.innerHTML = `
        <div class="date">${day}</div>
        <div class="amt text-success">${amt > 0 ? '₹' + amt.toFixed(0) : '-'}</div>
      `;

      c.addEventListener('click', () => {
        if (!globalState.currentNotebookId) {
          alert('Open a notebook first.');
          return;
        }
        
        // Open history for this date
        if (typeof globalState.loadHistoryDate === 'function') {
          const spendOff = bootstrap.Offcanvas.getInstance(document.getElementById('spendingOffcanvas'));
          if (spendOff) spendOff.hide();
          
          const histOff = new bootstrap.Offcanvas(document.getElementById('historyOffcanvas'));
          histOff.show();
          
          globalState.loadHistoryDate(dateStr);
        }
      });

      grid.appendChild(c);
    }

    calendarGrid.appendChild(grid);

    // Update month total
    if (monthTotalDisplay) {
      monthTotalDisplay.textContent = `₹ ${monthTotal.toFixed(2)}`;
    }
  }

  function buildYearlySummary(year) {
    if (!yearlySummary) return;
    yearlySummary.innerHTML = '';
    if (!globalState.currentNotebookId) return;

    const all = loadAllPages(globalState.currentNotebookId);
    const monthsData = buildYearlyTotals(year, all);

    const totalYearSpend = monthsData.reduce((acc, val) => acc + val, 0);
    const avgMonthlySpend = totalYearSpend / 12;

    // Update year totals
    if (yearTotalDisplay) yearTotalDisplay.textContent = `Total: ₹ ${totalYearSpend.toFixed(2)}`;
    if (yearAvgDisplay) yearAvgDisplay.textContent = `Avg: ₹ ${avgMonthlySpend.toFixed(2)}/mo`;

    // Month cards
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(year, i).toLocaleString('default', { month: 'short' });
      const amount = monthsData[i] || 0;

      const col = document.createElement('div');
      col.className = 'col-4';
      col.innerHTML = `
        <div class="month-card text-center p-2 border rounded cursor-pointer ${amount > 0 ? 'bg-white shadow-sm' : 'bg-light'}">
          <div class="small text-muted fw-bold">${monthName}</div>
          <div class="fw-bold small ${amount > 0 ? 'text-success' : 'text-secondary'}">${amount > 0 ? '₹' + amount.toFixed(0) : '-'}</div>
        </div>
      `;

      col.addEventListener('click', () => {
        const newMonthStr = `${year}-${String(i + 1).padStart(2, '0')}`;
        if (spendMonth) spendMonth.value = newMonthStr;
        buildCalendar(newMonthStr);
        document.querySelector('.offcanvas-body')?.scrollTo(0, 0);
      });

      yearlySummary.appendChild(col);
    }
  }

  function refreshSpendingUI() {
    const m = spendMonth?.value || (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    })();
    
    buildCalendar(m);
    const [y] = m.split('-');
    buildYearlySummary(Number(y));
  }

  // Initialize with current month
  const d = new Date();
  if (spendMonth) {
    spendMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  globalState.refreshSpendingUI = refreshSpendingUI;
  
  if (spendMonth) {
    spendMonth.addEventListener('change', () => refreshSpendingUI());
  }

  // Auto-refresh when opening
  const spendingOffcanvas = document.getElementById('spendingOffcanvas');
  if (spendingOffcanvas) {
    spendingOffcanvas.addEventListener('shown.bs.offcanvas', () => {
      refreshSpendingUI();
    });
  }
}
