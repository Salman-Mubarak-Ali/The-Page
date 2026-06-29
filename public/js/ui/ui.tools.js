import { escapeHtml } from '../utils/helpers.js';
import { saveAllPages } from '../services/storage.js';
import { getUserStorageKey } from '../services/auth.js';

export function initTools(globalState) {
  const toolOpenNotes = document.getElementById('toolOpenNotes');
  const backFromToolsBtn = document.getElementById('backFromTools');
  const homeView = document.getElementById('homeView');
  const notebookView = document.getElementById('notebookView');
  const shoppingListView = document.getElementById('shoppingListView');

  const itemInput = document.getElementById('utilItemInput');
  const addBtn = document.getElementById('utilAddItemBtn');
  const listEl = document.getElementById('utilShoppingList');
  const clearBtn = document.getElementById('utilClearAllBtn');
  const reflectBtn = document.getElementById('utilReflectBtn');
  
  // Custom lists elements
  const saveCurrentListBtn = document.getElementById('saveCurrentListBtn');
  const customListsContainer = document.getElementById('customListsContainer');
  const saveListModal = document.getElementById('saveListModal');
  const saveListNameInput = document.getElementById('saveListNameInput');
  const confirmSaveListBtn = document.getElementById('confirmSaveListBtn');

  let shoppingList = [];
  let customLists = [];
  
  const SHOPPING_KEY = getUserStorageKey('thepage_shopping_list');
  const CUSTOM_LISTS_KEY = getUserStorageKey('thepage_custom_lists');

  // Load data
  try {
    const raw = localStorage.getItem(SHOPPING_KEY);
    if (raw) shoppingList = JSON.parse(raw);
  } catch (e) {
    shoppingList = [];
  }

  try {
    const raw = localStorage.getItem(CUSTOM_LISTS_KEY);
    if (raw) customLists = JSON.parse(raw);
  } catch (e) {
    customLists = [];
  }

  function hideAllViews() {
    if (homeView) homeView.classList.add('d-none');
    if (notebookView) notebookView.classList.add('d-none');
    if (shoppingListView) shoppingListView.classList.add('d-none');
  }

  function showShoppingList() {
    hideAllViews();
    if (shoppingListView) {
      shoppingListView.classList.remove('d-none');
      renderList();
      renderCustomLists();
      if (itemInput) itemInput.focus();
    }
  }

  function goBack() {
    hideAllViews();
    if (globalState.currentNotebookId && notebookView) {
      notebookView.classList.remove('d-none');
    } else if (homeView) {
      homeView.classList.remove('d-none');
    }
  }

  if (toolOpenNotes) toolOpenNotes.addEventListener('click', showShoppingList);
  if (backFromToolsBtn) backFromToolsBtn.addEventListener('click', goBack);

  function saveList() {
    localStorage.setItem(SHOPPING_KEY, JSON.stringify(shoppingList));
  }

  function saveCustomLists() {
    localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(customLists));
  }

  function renderCustomLists() {
    if (!customListsContainer) return;
    
    customListsContainer.innerHTML = '';
    
    if (customLists.length === 0) {
      customListsContainer.innerHTML = '<div class="text-muted small">No saved lists yet. Add items below and click "Save Current List"</div>';
      return;
    }

    customLists.forEach((list, idx) => {
      const listCard = document.createElement('div');
      listCard.className = 'position-relative';
      listCard.innerHTML = `
        <button class="btn btn-outline-primary btn-sm custom-list-btn" data-index="${idx}">
          📋 ${escapeHtml(list.name)} (${list.items.length})
        </button>
        <button class="btn btn-sm btn-link text-danger position-absolute top-0 end-0 p-0 delete-custom-list" data-index="${idx}" style="font-size: 0.7rem; margin-top: -5px; margin-right: -5px;">×</button>
      `;
      
      // Load list
      listCard.querySelector('.custom-list-btn').addEventListener('click', () => {
        loadCustomList(idx);
      });
      
      // Delete list
      listCard.querySelector('.delete-custom-list').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete "${list.name}"?`)) {
          customLists.splice(idx, 1);
          saveCustomLists();
          renderCustomLists();
        }
      });
      
      customListsContainer.appendChild(listCard);
    });
  }

  function loadCustomList(index) {
    const list = customLists[index];
    if (!list) return;
    
    // Clear current list and load saved list
    shoppingList = list.items.map(item => ({ text: item, done: false }));
    saveList();
    renderList();
    
    // Visual feedback
    alert(`Loaded "${list.name}" - ${list.items.length} items`);
  }

  function saveCurrentList() {
    if (shoppingList.length === 0) {
      alert('Add some items to the list first!');
      return;
    }
    
    // Show modal
    if (saveListModal) {
      const modal = new bootstrap.Modal(saveListModal);
      modal.show();
      if (saveListNameInput) saveListNameInput.value = '';
    }
  }

  // Save list confirm
  if (confirmSaveListBtn) {
    confirmSaveListBtn.addEventListener('click', () => {
      const name = saveListNameInput?.value.trim();
      if (!name) {
        alert('Please enter a name for this list');
        return;
      }
      
      // Get only checked items (done items) or all items
      const itemsToSave = shoppingList.map(item => item.text);
      
      // Check if list with same name exists
      const existingIndex = customLists.findIndex(l => l.name === name);
      if (existingIndex !== -1) {
        if (confirm(`"${name}" already exists. Overwrite?`)) {
          customLists[existingIndex] = { name, items: itemsToSave };
        } else {
          return;
        }
      } else {
        customLists.push({ name, items: itemsToSave });
      }
      
      saveCustomLists();
      renderCustomLists();
      
      // Close modal
      const modal = bootstrap.Modal.getInstance(saveListModal);
      if (modal) modal.hide();
      
      alert(`Saved "${name}" with ${itemsToSave.length} items!`);
    });
  }

  // Save current list button
  if (saveCurrentListBtn) {
    saveCurrentListBtn.addEventListener('click', saveCurrentList);
  }

  function renderList() {
    if (!listEl) return;
    listEl.innerHTML = '';
    
    if (shoppingList.length === 0) {
      listEl.innerHTML = '<div class="text-center text-muted mt-5"><h5>List is empty</h5></div>';
      return;
    }

    shoppingList.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = `list-group-item d-flex justify-content-between align-items-center ${item.done ? 'bg-light' : ''}`;
      
      const checkIcon = item.done ? '☑' : '☐';
      const textStyle = item.done ? 'text-decoration: line-through; color: #aaa;' : 'font-weight: 500;';
      
      li.innerHTML = `
        <div class="d-flex align-items-center gap-3 cursor-pointer flex-grow-1" style="font-size: 1.1rem;">
          <span class="text-primary">${checkIcon}</span>
          <span style="${textStyle}">${escapeHtml(item.text)}</span>
        </div>
        <button class="btn btn-sm text-danger border-0 p-2 remove-item" style="font-size:1.2rem;">&times;</button>
      `;

      li.querySelector('div').addEventListener('click', () => {
        shoppingList[idx].done = !shoppingList[idx].done;
        saveList();
        renderList();
      });

      li.querySelector('.remove-item').addEventListener('click', (e) => {
        e.stopPropagation();
        shoppingList.splice(idx, 1);
        saveList();
        renderList();
      });

      listEl.appendChild(li);
    });
  }

  function addItem() {
    if (!itemInput) return;
    const txt = itemInput.value.trim();
    if (!txt) return;
    
    shoppingList.push({ text: txt, done: false });
    itemInput.value = '';
    saveList();
    renderList();
  }

  if (addBtn) addBtn.addEventListener('click', addItem);
  if (itemInput) {
    itemInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addItem();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear list?')) {
        shoppingList = [];
        saveList();
        renderList();
      }
    });
  }

  if (reflectBtn) {
    reflectBtn.addEventListener('click', () => {
      if (!globalState.currentNotebookId) {
        alert("Please open a notebook first to reflect items into it.");
        return;
      }

      const itemsToMove = shoppingList.filter(i => i.done);
      if (itemsToMove.length === 0) {
        alert("No finished items to move. Strike out items first.");
        return;
      }

      if (!globalState.pages[globalState.currentPageIndex]) {
        alert("No active page. Please create a page in the notebook first.");
        return;
      }

      const currentPage = globalState.pages[globalState.currentPageIndex];
      itemsToMove.forEach(item => {
        currentPage.items.push({
          name: item.text,
          qty: '1',
          price: ''
        });
      });

      shoppingList = shoppingList.filter(i => !i.done);
      saveList();
      saveAllPages(globalState.currentNotebookId, globalState.pages);
      
      alert(`Moved ${itemsToMove.length} items to notebook.`);
      goBack();
      
      if (typeof globalState.renderCurrentPage === 'function') {
        globalState.renderCurrentPage();
      }
    });
  }
}
