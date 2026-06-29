import { getUserStorageKey } from './auth.js';

const NOTEBOOKS_KEY = 'notebook_app_notebooks';

export function pagesKey(nbId) {
  return getUserStorageKey(`notebook_pages_${nbId}`);
}

export function loadNotebooks(defaults = []) {
  try {
    const key = getUserStorageKey(NOTEBOOKS_KEY);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaults.slice();
  } catch (e) {
    return defaults.slice();
  }
}

export function saveNotebooks(list) {
  const key = getUserStorageKey(NOTEBOOKS_KEY);
  localStorage.setItem(key, JSON.stringify(list));
}

export function loadAllPages(nbId) {
  try {
    const raw = localStorage.getItem(pagesKey(nbId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAllPages(nbId, arr) {
  localStorage.setItem(pagesKey(nbId), JSON.stringify(arr || []));
}
