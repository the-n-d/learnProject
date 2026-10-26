const STORAGE_KEY = 'expenses-app:v1';

const VALID_CATEGORIES = ['food', 'transport', 'fun', 'other'];

function sanitizeExpense(raw) {
	if (!raw || typeof raw !== 'object') return null;

	const id = typeof raw.id === 'string' && raw.id ? raw.id : null;
	const name = typeof raw.name === 'string' ? raw.name.trim() : '';
	const amount = Number(raw.amount);
	const category = VALID_CATEGORIES.includes(raw.category) ? raw.category : 'other';
	const createdAt = Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now();

	if (!id || !name || !Number.isFinite(amount) || amount <= 0) return null;

	return { id, name, amount, category, createdAt };
}

export function loadExpenses() {
	let raw;
	try {
		raw = localStorage.getItem(STORAGE_KEY);
	} catch (e) {
		console.warn('localStorage недоступен:', e);
		return [];
	}

	if (raw === null) return [];

	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (e) {
		console.warn('Сохранённые данные повреждены, сбрасываю.');
		return [];
	}

	if (!Array.isArray(parsed)) {
		console.warn('Ожидался массив, получено:', typeof parsed);
		return [];
	}

	return parsed.map(sanitizeExpense).filter(Boolean);
}

export function saveExpenses(expenses) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
	} catch (e) {
		console.warn('Не удалось сохранить данные:', e);
	}
}