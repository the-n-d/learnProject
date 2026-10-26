let nextId = 1;

export class Book {
	#id;
	#read = false;

	constructor(title, author, year) {
		this.#id = nextId++;
		this.title = title;
		this.author = author;
		this.year = year;
	}

	get id() {
		return this.#id;
	}

	get read() {
		return this.#read;
	}

	markRead(value = true) {
		this.#read = value;
	}

	matches(query) {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		return (
			this.title.toLowerCase().includes(q) ||
			this.author.toLowerCase().includes(q)
		);
	}

	toJSON() {
		return {
			title: this.title,
			author: this.author,
			year: this.year,
			read: this.#read,
		};
	}

	static fromJSON(obj) {
		const book = new Book(obj.title, obj.author, obj.year);
		book.#read = Boolean(obj.read);
		return book;
	}
}

export class Library {
	#books = [];

	add(book) {
		this.#books.push(book);
		return book;
	}

	get(id) {
		return this.#books.find((b) => b.id === id);
	}

	remove(id) {
		this.#books = this.#books.filter((b) => b.id !== id);  
	}

	toggleRead(id) {
		const book = this.get(id);
		if (book) book.markRead(!book.read);
	}

	search(query) {
		return this.#books.filter((b) => b.matches(query));
	}

	get all() {
		return [...this.#books];
	}

	get stats() {
		const total = this.#books.length;
		const read = this.#books.filter((b) => b.read).length;
		return { total, read };
	}
}