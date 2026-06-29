import { initAuth, getToken } from './services/auth.js';
import { initShelf } from './ui/ui.shelf.js';
import { initNotebookView } from './ui/ui.notebook.js';
import { initHistory } from './ui/ui.history.js';
import { initSpending } from './ui/ui.spending.js';
import { initTools } from './ui/ui.tools.js';
import { loadNotebooks } from './services/storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const globalState = {
    notebooks: [],
    currentNotebookId: null,
    pages: [],
    currentPageIndex: 0,
    onChange: () => {
      if (typeof globalState.renderShelf === 'function') {
        globalState.renderShelf();
      }
    }
  };

  // Initialize auth first, then the rest on success
  initAuth(() => {
    initShelf(globalState);
    initNotebookView(globalState);
    initHistory(globalState);
    initSpending(globalState);
    initTools(globalState);

    // Handle share links
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('share');
    
    if (shareId) {
      if (globalState.notebooks.length === 0) {
        globalState.notebooks = loadNotebooks();
      }
      
      let nb = globalState.notebooks.find(n => n.id === shareId);
      if (!nb) {
        nb = { id: shareId, label: 'Shared Notebook', color: 'blue' };
        globalState.notebooks.push(nb);
        localStorage.setItem('notebook_app_notebooks', JSON.stringify(globalState.notebooks));
        if (typeof globalState.renderShelf === 'function') {
          globalState.renderShelf();
        }
      }
      
      if (typeof globalState.openNotebook === 'function') {
        globalState.openNotebook(shareId);
      }
    }
  });
});
