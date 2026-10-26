import { Library, Book } from './model.js';
import { loadBooks } from './storage.js';
import { initUI } from './ui.js';

const library = new Library();
const hasSaved = loadBooks(library);

if (!hasSaved) {
	library.add(new Book('Мастер и Маргарита', 'М. Булгаков', 1967));
	library.add(new Book('Преступление и наказание', 'Ф. Достоевский', 1866));
	library.add(new Book('Чистый код', 'Р. Мартин', 2008));
}

initUI(library);