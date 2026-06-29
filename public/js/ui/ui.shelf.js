import { uid, escapeHtml } from '../utils/helpers.js';
import { loadNotebooks, saveNotebooks, pagesKey } from '../services/storage.js';
import { initModals as initModalsFactory } from './ui.modals.js';

const DEFAULT_NOTEBOOKS = [
  { id: 'nb_house', label: 'Household', color: 'blue' },
  { id: 'nb_groc', label: 'Grocery', color: 'green' }
];

export function initShelf(globalState) {
  globalState.notebooks = loadNotebooks(DEFAULT_NOTEBOOKS);
  const shelfEl = document.getElementById('shelf');
  const addNotebookBtnShelf = document.getElementById('addNotebookBtnShelf');
  const importShareBtn = document.getElementById('importShareBtn');

  const modals = initModalsFactory(globalState);

  function saveAndRender() {
    saveNotebooks(globalState.notebooks);
    renderShelf();
  }

  function promptAddNotebook() {
    const label = prompt('Enter notebook name:', 'New Notebook');
    if (!label) return;
    const id = uid('nb');
    globalState.notebooks.push({ id, label: label.trim(), color: 'blue' });
    saveAndRender();
  }

  function renderShelf() {
    if (!shelfEl) return;
    shelfEl.innerHTML = '';
    
    globalState.notebooks.forEach(nb => {
      const col = document.createElement('div');
      col.innerHTML = `
        <div class="notebook-cover notebook-color-${nb.color || 'blue'}" data-id="${nb.id}">
          <div class="card-menu">
            <div class="dropdown">
              <button class="btn btn-sm btn-light menu-btn" data-bs-toggle="dropdown">⋮</button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><button class="dropdown-item rename-notebook">Rename</button></li>
                <li><button class="dropdown-item change-color">Change color</button></li>
                <li><button class="dropdown-item share-notebook">Share</button></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger delete-notebook">Delete</button></li>
              </ul>
            </div>
          </div>
          <div class="notebook-inner">
            <div class="notebook-title">${escapeHtml(nb.label)}</div>
          </div>
        </div>
      `;

      const card = col.querySelector('.notebook-cover');
      
      // Open notebook
      card.addEventListener('click', (e) => {
        if (e.target.closest('.menu-btn') || e.target.closest('.dropdown')) return;
        if (typeof globalState.openNotebook === 'function') {
          globalState.openNotebook(nb.id);
        }
      });

      // Rename
      col.querySelector('.rename-notebook').onclick = (e) => {
        e.stopPropagation();
        modals.showRenameNotebook(nb);
      };

      // Change color
      col.querySelector('.change-color').onclick = (e) => {
        e.stopPropagation();
        const colors = ['blue', 'green', 'purple', 'orange', 'red'];
        const idx = colors.indexOf(nb.color || 'blue');
        nb.color = colors[(idx + 1) % colors.length];
        saveAndRender();
      };

      // Share
      col.querySelector('.share-notebook').onclick = (e) => {
        e.stopPropagation();
        modals.showShare(nb);
      };

      // Delete
      col.querySelector('.delete-notebook').onclick = (e) => {
        e.stopPropagation();
        if (!confirm('Delete this notebook?')) return;
        globalState.notebooks = globalState.notebooks.filter(n => n.id !== nb.id);
        localStorage.removeItem(pagesKey(nb.id));
        saveAndRender();
      };

      shelfEl.appendChild(col);
    });

    // Add new button
    const addCol = document.createElement('div');
    addCol.innerHTML = `
      <div class="notebook-cover" style="border: 2px dashed #ccc; background: transparent; display:flex; align-items:center; justify-content:center; cursor:pointer;">
        <div class="text-muted fw-bold">+ Add Notebook</div>
      </div>
    `;
    addCol.onclick = promptAddNotebook;
    shelfEl.appendChild(addCol);
  }

  if (addNotebookBtnShelf) {
    addNotebookBtnShelf.addEventListener('click', promptAddNotebook);
  }

  if (importShareBtn) {
    importShareBtn.addEventListener('click', () => {
      const link = prompt('Paste share link:');
      if (!link) return;
      try {
        const u = new URL(link);
        const id = u.searchParams.get('share');
        if (!id) return alert('Invalid link');
        
        let nb = globalState.notebooks.find(n => n.id === id);
        if (!nb) {
          globalState.notebooks.push({ id, label: 'Shared Notebook', color: 'blue' });
          saveAndRender();
        }
        if (typeof globalState.openNotebook === 'function') {
          globalState.openNotebook(id);
        }
      } catch (e) {
        alert('Invalid URL');
      }
    });
  }

  renderShelf();
  globalState.renderShelf = renderShelf;
}
