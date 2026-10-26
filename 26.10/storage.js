import { Book } from './model.js';

const STORAGE_KEY = 'library.books';

export function saveBooks(library) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library.all));
}

export function loadBooks(library) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const data = JSON.parse(raw);
    data.forEach((item) => library.add(Book.fromJSON(item)));
    return true;
  } catch {
    return false;
  }
}