import { Book } from './model.js';
import { saveBooks } from './storage.js';

export function initUI(library) {
	const form = document.getElementById('book-form');
	const list = document.getElementById('book-list');
	const search = document.getElementById('search');
	const stats = document.getElementById('stats');

	function render() {
		const books = library.search(search.value);
		list.innerHTML = '';

		if (books.length === 0) {
			const li = document.createElement('li');
			li.className = 'empty';
			li.textContent = 'Книг не найдено';
			list.append(li);
		}

		for (const book of books) {
			const li = document.createElement('li');
			li.className = book.read ? 'book read' : 'book';
			li.innerHTML = `
        <div class="info">
          <strong>${escapeHtml(book.title)}</strong>
          <span>${escapeHtml(book.author)}, ${book.year}</span>
        </div>
        <div class="actions">
          <button data-action="toggle" data-id="${book.id}">
            ${book.read ? 'Прочитано' : 'Не прочитано'}
          </button>
          <button data-action="remove" data-id="${book.id}">Удалить</button>
        </div>
      `;
			list.append(li);
		}

		const { total, read } = library.stats;
		stats.textContent = `Всего книг: ${total}. Прочитано: ${read}.`;
	}

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const { title, author, year } = form.elements;
		const book = new Book(
			title.value.trim(),
			author.value.trim(),
			Number(year.value)
		);
		library.add(book);
		form.reset();
		saveBooks(library);
		render();
	});

	list.addEventListener('click', (event) => {
		const button = event.target.closest('button[data-action]');
		if (!button) return;

		const id = Number(button.dataset.id);
		if (button.dataset.action === 'toggle') library.toggleRead(id);
		if (button.dataset.action === 'remove') library.remove(id);

		saveBooks(library);
		render();
	});

	search.addEventListener('input', render);

	render();
}

function escapeHtml(text) {
	return String(text).replace(
		/[&<>"']/g,
		(ch) =>
			({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])
	);
}