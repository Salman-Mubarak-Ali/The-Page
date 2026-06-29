/**
 * api.js — Authenticated API service for talking to the backend.
 * All requests to /api/notes include the JWT token from localStorage.
 */

import { getToken, logout } from './auth.js';

const NOTES_API = '/api/notes';

/**
 * Returns the auth headers needed for every protected request.
 */
function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

/**
 * Checks if the response is a 401 and forces logout if so.
 */
function handleUnauthorized(res) {
  if (res.status === 401) {
    console.warn('Session expired or invalid. Logging out...');
    logout();
    window.location.reload(); // Return user to login screen
    return true;
  }
  return false;
}

/**
 * Fetches all notes for the logged-in user from the backend.
 * Returns an array of note objects: [{ _id, title, content, ... }, ...]
 */
export async function fetchAllNotes() {
  try {
    const res = await fetch(NOTES_API, {
      method: 'GET',
      headers: authHeaders()
    });

    if (handleUnauthorized(res)) return [];
    if (!res.ok) throw new Error(`GET /api/notes failed: ${res.status}`);

    return await res.json();
  } catch (err) {
    console.error('fetchAllNotes error:', err);
    return [];
  }
}

/**
 * Saves (creates or upserts) a note to the backend.
 * Uses the notebook ID as the title so each notebook maps to one Note document.
 * The full pages array is serialized as JSON into the content field.
 *
 * @param {string} notebookId  - Used as the note title for identification
 * @param {Array}  pages       - Full pages array to persist
 * @param {string|null} noteId - If known, we still POST (backend is append-only for now)
 * @returns {object|null} The saved note document from the API, or null on failure
 */
export async function saveNoteToApi(notebookId, pages, noteId = null) {
  try {
    const body = {
      title: notebookId,
      content: JSON.stringify(pages)
    };

    const res = await fetch(NOTES_API, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body)
    });

    if (handleUnauthorized(res)) return null;
    if (!res.ok) throw new Error(`POST /api/notes failed: ${res.status}`);

    return await res.json();
  } catch (err) {
    console.error('saveNoteToApi error:', err);
    return null;
  }
}

/**
 * Finds the most recent note whose title matches the notebookId and
 * returns the parsed pages array from its content field.
 * Returns null if not found.
 *
 * @param {string} notebookId
 * @returns {Array|null}
 */
export async function loadPagesFromApi(notebookId) {
  try {
    const notes = await fetchAllNotes();
    if (!notes || notes.length === 0) return null;

    // Find the latest note matching this notebook ID (sorted by updatedAt desc from API)
    const match = notes.find(n => n.title === notebookId);
    if (!match) return null;

    return JSON.parse(match.content);
  } catch (err) {
    console.error('loadPagesFromApi error:', err);
    return null;
  }
}
