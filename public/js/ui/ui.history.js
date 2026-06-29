import { loadAllPages } from '../services/storage.js';
import { todayYYYYMMDD } from '../utils/date.js';
import { escapeHtml } from '../utils/helpers.js';

export function initHistory(globalState) {
  const pagesHistoryListMobile = document.getElementById('pagesHistoryListMobile');
  const recentPagesList = document.getElementById('recentPagesList');
  const historyDatePicker = document.getElementById('historyDatePicker');
  const loadPickedDate = document.getElementById('loadPickedDate');
  const historyBtns = document.querySelectorAll('.history-btn');
  const showAllPagesBtn = document.getElementById('showAllPagesBtn');

  let allPages = [];
  let currentFilter = 'all';

  function getDateByPeriod(period) {
    const today = new Date();
    switch(period) {
      case 'today':
        return todayYYYYMMDD();
      case 'yesterday':
        today.setDate(today.getDate() - 1);
        break;
      case 'week':
        today.setDate(today.getDate() - 7);
        break;
    }
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getPageTotal(page) {
    let total = 0;
    if (page.items && Array.isArray(page.items)) {
      page.items.forEach(item => {
        total += parseFloat(item.price) || 0;
      });
    }
    return total;
  }

  function createPageListItem(page, actualIndex) {
    const li = document.createElement('li');
    li.className = 'list-group-item list-group-item-action cursor-pointer p-2';
    
    const total = getPageTotal(page);
    const description = page.description ? escapeHtml(page.description) : '';
    const pageNumber = actualIndex + 1;

    li.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <div class="flex-grow-1">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-primary" style="font-size: 0.7rem;">Page ${pageNumber}</span>
            <span class="fw-bold" style="font-size: 0.85rem;">${escapeHtml(page.title || 'Untitled')}</span>
          </div>
          ${description ? `<div class="text-muted mt-1" style="font-size: 0.7rem;">${description}</div>` : ''}
          <div class="text-muted mt-1" style="font-size: 0.7rem;">📅 ${page.date || 'No date'}</div>
        </div>
        <div class="text-success fw-bold" style="font-size: 0.85rem;">₹${total.toFixed(2)}</div>
      </div>
    `;
    
    li.addEventListener('click', () => {
      globalState.currentPageIndex = actualIndex;
      globalState.pages = allPages;
      if (typeof globalState.renderCurrentPage === 'function') {
        globalState.renderCurrentPage();
      }
      
      const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('historyOffcanvas'));
      if (offcanvas) offcanvas.hide();
    });

    return li;
  }

  function renderRecentPages() {
    if (!recentPagesList) return;
    if (!globalState.currentNotebookId) return;

    recentPagesList.innerHTML = '';
    
    // Get last 5 pages (most recent)
    const pages = loadAllPages(globalState.currentNotebookId);
    const recentPages = pages.slice(-5).reverse(); // Last 5, newest first

    if (recentPages.length === 0) {
      recentPagesList.innerHTML = '<div class="list-group-item text-muted small">No recent pages</div>';
      return;
    }

    recentPages.forEach((page) => {
      const actualIndex = pages.findIndex(p => 
        p.date === page.date && 
        p.title === page.title && 
        p.description === page.description
      );
      
      const li = createPageListItem(page, actualIndex);
      recentPagesList.appendChild(li);
    });
  }

  function filterPagesByDate(dateStr) {
    if (!globalState.currentNotebookId) return;
    
    allPages = loadAllPages(globalState.currentNotebookId);
    const filtered = dateStr ? allPages.filter(p => p.date === dateStr) : allPages;
    
    currentFilter = dateStr || 'all';
    renderAllPages(filtered);
  }

  function renderAllPages(pagesToShow = null) {
    if (!pagesHistoryListMobile) return;
    if (!globalState.currentNotebookId) return;

    allPages = loadAllPages(globalState.currentNotebookId);
    const pages = pagesToShow || allPages;
    
    pagesHistoryListMobile.innerHTML = '';

    if (pages.length === 0) {
      pagesHistoryListMobile.innerHTML = '<li class="list-group-item text-muted small">No pages found</li>';
      return;
    }

    // Show pages in reverse order (newest first)
    const reversedPages = [...pages].reverse();
    
    reversedPages.forEach((page) => {
      const actualIndex = allPages.findIndex(p => 
        p.date === page.date && 
        p.title === page.title && 
        p.description === page.description
      );
      
      if (actualIndex !== -1) {
        const li = createPageListItem(page, actualIndex);
        pagesHistoryListMobile.appendChild(li);
      }
    });
  }

  function refreshPagesHistoryLists(pagesToShow = null) {
    console.log('refreshPagesHistoryLists called', globalState.currentNotebookId);
    renderRecentPages();
    renderAllPages(pagesToShow);
  }

  // Initialize on load
  if (pagesHistoryListMobile) {
    pagesHistoryListMobile.innerHTML = '<li class="list-group-item text-muted small">Open a notebook to see pages...</li>';
  }
  if (recentPagesList) {
    recentPagesList.innerHTML = '<div class="list-group-item text-muted small">No recent pages yet</div>';
  }

  // Quick date buttons
  if (historyBtns) {
    historyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const period = btn.dataset.period;
        const dateStr = getDateByPeriod(period);
        if (historyDatePicker) historyDatePicker.value = dateStr;
        filterPagesByDate(dateStr);
      });
    });
  }

  // Show all pages button
  if (showAllPagesBtn) {
    showAllPagesBtn.addEventListener('click', () => {
      if (historyDatePicker) historyDatePicker.value = '';
      filterPagesByDate(null);
    });
  }

  // Custom date picker
  if (loadPickedDate && historyDatePicker) {
    loadPickedDate.addEventListener('click', () => {
      const dateStr = historyDatePicker.value;
      filterPagesByDate(dateStr);
    });

    historyDatePicker.addEventListener('change', () => {
      const dateStr = historyDatePicker.value;
      if (dateStr) {
        filterPagesByDate(dateStr);
      }
    });
  }

  globalState.refreshPagesHistoryLists = refreshPagesHistoryLists;
  globalState.loadHistoryDate = (dateStr) => {
    if (historyDatePicker) historyDatePicker.value = dateStr;
    filterPagesByDate(dateStr);
  };
}
