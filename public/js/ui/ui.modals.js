import { saveNotebooks } from '../services/storage.js';
import { generateShareLink } from '../services/share.js';

export function initModals(state) {
  const renameNotebookModalEl = document.getElementById('renameNotebookModal');
  const renameNotebookModal = new bootstrap.Modal(renameNotebookModalEl);
  const renameNotebookInput = document.getElementById('renameNotebookInput');
  const renameNotebookSave = document.getElementById('renameNotebookSave');

  const shareModalEl = document.getElementById('shareModal');
  const shareModal = new bootstrap.Modal(shareModalEl);
  const shareLinkInput = document.getElementById('shareLinkInput');
  const copyShareBtn = document.getElementById('copyShareBtn');

  function showRenameNotebook(nb) {
    if (!nb) return;
    renameNotebookInput.value = nb.label;
    renameNotebookModal.show();
    
    renameNotebookSave.onclick = () => {
      const v = renameNotebookInput.value.trim();
      nb.label = v || nb.label;
      saveNotebooks(state.notebooks);
      renameNotebookModal.hide();
      if (typeof state.onChange === 'function') state.onChange();
    };
  }

  function showShare(nb) {
    const url = generateShareLink(nb.id);
    shareLinkInput.value = url;
    shareModal.show();
    
    copyShareBtn.onclick = () => {
      navigator.clipboard?.writeText(shareLinkInput.value);
      copyShareBtn.textContent = 'Copied!';
      setTimeout(() => copyShareBtn.textContent = 'Copy link', 900);
    };
  }

  return { showRenameNotebook, showShare };
}
