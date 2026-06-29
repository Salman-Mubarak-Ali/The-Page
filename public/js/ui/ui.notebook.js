import { loadAllPages, saveAllPages } from '../services/storage.js';
import { saveNoteToApi, loadPagesFromApi } from '../services/api.js';
import { getToken } from '../services/auth.js';
import { todayYYYYMMDD } from '../utils/date.js';
import { escapeHtml } from '../utils/helpers.js';

export function initNotebookView(globalState) {
  const homeView = document.getElementById('homeView');
  const notebookView = document.getElementById('notebookView');
  const backToShelf = document.getElementById('backToShelf');
  const notebookTitleInput = document.getElementById('notebookTitleInput');
  const linesContainer = document.getElementById('linesContainer');
  const addLineBtn = document.getElementById('addLineBtn');
  const addPageRound = document.getElementById('addPageRound');
  const savePageBtn = document.getElementById('savePageBtn');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const pageCounter = document.getElementById('pageCounter');
  const pageDate = document.getElementById('pageDate');
  const pageDescription = document.getElementById('pageDescription');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const deletePageBtn = document.getElementById('deletePageBtn');
  const pageTotalDisplay = document.getElementById('pageTotal');
  const downloadPagePDF = document.getElementById('downloadPagePDF');

  function calculateAndUpdateTotal() {
    const page = globalState.pages[globalState.currentPageIndex];
    if (!page) return;

    let total = 0;
    page.items.forEach(item => {
      const price = parseFloat(item.price) || 0;
      total += price;
    });

    if (pageTotalDisplay) {
      pageTotalDisplay.textContent = `₹ ${total.toFixed(2)}`;
    }
  }

  async function openNotebook(nbId) {
    // Guard: if no token, bounce back to login
    if (!getToken()) {
      alert('Your session has expired. Please log in again.');
      window.location.reload();
      return;
    }

    globalState.currentNotebookId = nbId;

    // 1. Show notebook view immediately with local cache while API loads
    globalState.pages = loadAllPages(nbId);
    if (globalState.pages.length === 0) {
      globalState.pages.push({
        date: todayYYYYMMDD(),
        description: '',
        items: [],
        title: 'Page 1'
      });
    }
    globalState.currentPageIndex = 0;

    const nb = globalState.notebooks.find(n => n.id === nbId);
    if (notebookTitleInput && nb) {
      notebookTitleInput.value = nb.label;
    }

    if (homeView) homeView.classList.add('d-none');
    if (notebookView) notebookView.classList.remove('d-none');
    renderCurrentPage();

    // 2. Try to load the latest pages from the backend (overrides local cache)
    try {
      const apiPages = await loadPagesFromApi(nbId);
      if (apiPages && Array.isArray(apiPages) && apiPages.length > 0) {
        globalState.pages = apiPages;
        // Sync the fresh data back to localStorage as cache
        saveAllPages(nbId, apiPages);
        globalState.currentPageIndex = 0;
        renderCurrentPage();
      }
    } catch (err) {
      console.warn('Could not load pages from API, using local cache:', err);
    }

    // Refresh history list
    if (typeof globalState.refreshPagesHistoryLists === 'function') {
      globalState.refreshPagesHistoryLists();
    }
  }

  function renderCurrentPage() {
    const page = globalState.pages[globalState.currentPageIndex];
    if (!page) return;

    if (pageCounter) {
      pageCounter.textContent = `Page ${globalState.currentPageIndex + 1} of ${globalState.pages.length}`;
    }
    if (pageDate) pageDate.value = page.date || todayYYYYMMDD();
    if (pageDescription) pageDescription.value = page.description || '';

    if (linesContainer) {
      linesContainer.innerHTML = '';
      page.items.forEach((item, idx) => {
        const row = createLineRow(item, idx);
        linesContainer.appendChild(row);
      });
    }

    calculateAndUpdateTotal();
  }

  function createLineRow(item, idx) {
    const row = document.createElement('div');
    row.className = 'line-row';
    row.innerHTML = `
      <input type="text" class="product-input" placeholder="Product" value="${escapeHtml(item.name || '')}">
      <input type="text" class="qty-input" placeholder="Qty" value="${escapeHtml(item.qty || '')}">
      <input type="text" class="price-input" placeholder="Price" value="${escapeHtml(item.price || '')}">
      <button class="clear-line-btn">×</button>
    `;

    const productInput = row.querySelector('.product-input');
    const qtyInput = row.querySelector('.qty-input');
    const priceInput = row.querySelector('.price-input');
    const clearBtn = row.querySelector('.clear-line-btn');

    productInput.addEventListener('input', () => {
      globalState.pages[globalState.currentPageIndex].items[idx].name = productInput.value;
    });

    qtyInput.addEventListener('input', () => {
      globalState.pages[globalState.currentPageIndex].items[idx].qty = qtyInput.value;
    });

    priceInput.addEventListener('input', () => {
      globalState.pages[globalState.currentPageIndex].items[idx].price = priceInput.value;
      calculateAndUpdateTotal();
    });

    clearBtn.addEventListener('click', () => {
      globalState.pages[globalState.currentPageIndex].items.splice(idx, 1);
      renderCurrentPage();
    });

    return row;
  }

  if (backToShelf) {
    backToShelf.addEventListener('click', () => {
      if (notebookView) notebookView.classList.add('d-none');
      if (homeView) homeView.classList.remove('d-none');
    });
  }

  if (addLineBtn) {
    addLineBtn.addEventListener('click', () => {
      globalState.pages[globalState.currentPageIndex].items.push({
        name: '',
        qty: '',
        price: ''
      });
      renderCurrentPage();
    });
  }

  if (addPageRound) {
    addPageRound.addEventListener('click', () => {
      globalState.pages.push({
        date: todayYYYYMMDD(),
        description: '',
        items: [],
        title: `Page ${globalState.pages.length + 1}`
      });
      globalState.currentPageIndex = globalState.pages.length - 1;
      renderCurrentPage();
    });
  }

  if (savePageBtn) {
    savePageBtn.addEventListener('click', async () => {
      const page = globalState.pages[globalState.currentPageIndex];
      if (pageDate) page.date = pageDate.value;
      if (pageDescription) page.description = pageDescription.value;

      // 1. Always save to localStorage as fast local cache
      saveAllPages(globalState.currentNotebookId, globalState.pages);

      // 2. Also persist to backend via authenticated POST /api/notes
      if (getToken()) {
        const saved = await saveNoteToApi(globalState.currentNotebookId, globalState.pages);
        if (saved) {
          console.log('Note synced to backend:', saved._id);
        } else {
          console.warn('Backend save failed — changes are in localStorage only.');
        }
      }

      // Refresh history
      if (typeof globalState.refreshPagesHistoryLists === 'function') {
        globalState.refreshPagesHistoryLists();
      }

      alert('Page saved!');
    });
  }

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (globalState.currentPageIndex > 0) {
        globalState.currentPageIndex--;
        renderCurrentPage();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      if (globalState.currentPageIndex < globalState.pages.length - 1) {
        globalState.currentPageIndex++;
        renderCurrentPage();
      } else {
        // At last page, create new page
        globalState.pages.push({
          date: todayYYYYMMDD(),
          description: '',
          items: [],
          title: `Page ${globalState.pages.length + 1}`
        });
        globalState.currentPageIndex = globalState.pages.length - 1;
        saveAllPages(globalState.currentNotebookId, globalState.pages);
        renderCurrentPage();
        if (typeof globalState.refreshPagesHistoryLists === 'function') {
          globalState.refreshPagesHistoryLists();
        }
      }
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('Clear all lines on this page?')) {
        globalState.pages[globalState.currentPageIndex].items = [];
        renderCurrentPage();
      }
    });
  }

  if (deletePageBtn) {
    deletePageBtn.addEventListener('click', () => {
      if (globalState.pages.length === 1) {
        alert('Cannot delete the only page');
        return;
      }
      if (confirm('Delete this page?')) {
        globalState.pages.splice(globalState.currentPageIndex, 1);
        if (globalState.currentPageIndex >= globalState.pages.length) {
          globalState.currentPageIndex = globalState.pages.length - 1;
        }
        saveAllPages(globalState.currentNotebookId, globalState.pages);
        renderCurrentPage();
      }
    });
  }

  // Download page as PDF
  if (downloadPagePDF) {
    downloadPagePDF.addEventListener('click', () => {
      const page = globalState.pages[globalState.currentPageIndex];
      if (!page) {
        alert('No page to download!');
        return;
      }

      if (!page.items || page.items.length === 0) {
        alert('Add some items to the page first!');
        return;
      }

      generateNotebookPagePDF(page, globalState.currentPageIndex);
    });
  }

  function generateNotebookPagePDF(page, pageIndex) {
    const notebookName = notebookTitleInput?.value || 'Notebook';
    const pageTitle = page.title || `Page ${pageIndex + 1}`;
    const date = page.date || todayYYYYMMDD();
    const description = page.description || '';
    
    let total = 0;
    page.items.forEach(item => {
      total += parseFloat(item.price) || 0;
    });

    // Access jsPDF from window
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(`${notebookName} - ${pageTitle}`, 14, 20);

    // Line under title
    doc.setLineWidth(0.5);
    doc.line(14, 24, 196, 24);

    // Info section
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    let yPos = 32;
    doc.text(`Date: ${date}`, 14, yPos);
    yPos += 5;
    
    if (description) {
      doc.text(`Description: ${description}`, 14, yPos);
      yPos += 5;
    }
    
    doc.text(`Total Items: ${page.items.length}`, 14, yPos);
    yPos += 10;

    // Table
    const tableData = page.items.map((item, idx) => [
      (idx + 1).toString(),
      item.name || '-',
      item.qty || '-',
      item.price ? `₹${parseFloat(item.price).toFixed(2)}` : '-'
    ]);

    // Add total row
    tableData.push([
      { content: 'TOTAL', colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' } },
      { content: `₹${total.toFixed(2)}`, styles: { fontStyle: 'bold' } }
    ]);

    doc.autoTable({
      head: [['#', 'Product', 'Quantity', 'Price']],
      body: tableData,
      startY: yPos,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219], fontStyle: 'bold' },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 80 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40, halign: 'right' }
      }
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Generated by The Page Notebook Grocery App', 14, finalY);
    doc.text(new Date().toLocaleString(), 14, finalY + 4);

    // Download
    const filename = `${notebookName.replace(/\s+/g, '-')}-${pageTitle.replace(/\s+/g, '-')}-${date}.pdf`;
    doc.save(filename);
  }

  globalState.openNotebook = openNotebook;
  globalState.renderCurrentPage = renderCurrentPage;
}
