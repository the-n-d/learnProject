import { saveExpenses } from './storage.js';

const VALID_CATEGORIES = ['food', 'transport', 'fun', 'other'];

export function validateInput({ name, amount, category }) {
	const trimmedName = String(name ?? '').trim();
	if (!trimmedName) {
		return { ok: false, error: 'Укажите название расхода.' };
	}
	if (trimmedName.length > 80) {
		return { ok: false, error: 'Название слишком длинное (макс. 80 символов).' };
	}

	const normalized = String(amount ?? '').trim().replace(',', '.');
	if (!normalized) {
		return { ok: false, error: 'Укажите сумму.' };
	}

	const parsed = Number(normalized);
	if (!Number.isFinite(parsed)) {
		return { ok: false, error: 'Сумма должна быть числом.' };
	}
	if (parsed <= 0) {
		return { ok: false, error: 'Сумма должна быть больше нуля.' };
	}
	if (parsed > 1_000_000_000) {
		return { ok: false, error: 'Слишком большая сумма.' };
	}

	const safeCategory = VALID_CATEGORIES.includes(category) ? category : 'other';

	return {
		ok: true,
		value: {
			name: trimmedName,
			amount: Math.round(parsed * 100) / 100,
			category: safeCategory,
		},
	};
}

export function createExpense(validated) {
	return {
		id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
		name: validated.name,
		amount: validated.amount,
		category: validated.category,
		createdAt: Date.now(),
	};
}

export function removeExpense(expenses, id) {
	return expenses.filter((e) => e.id !== id);
}

export function getVisibleExpenses(expenses, { category = 'all', sort = 'none' } = {}) {
	let result = expenses;

	if (category !== 'all') {
		result = result.filter((e) => e.category === category);
	}

	if (sort === 'asc') {
		result = [...result].sort((a, b) => a.amount - b.amount);
	} else if (sort === 'desc') {
		result = [...result].sort((a, b) => b.amount - a.amount);
	}

	return result;
}

export function sumAmount(expenses) {
	return expenses.reduce((acc, e) => acc + e.amount, 0);
}

export function persist(expenses) {
	saveExpenses(expenses);
}