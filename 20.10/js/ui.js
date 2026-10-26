const CATEGORY_LABELS = {
	food: 'Еда',
	transport: 'Транспорт',
	fun: 'Развлечения',
	other: 'Другое',
};

function formatMoney(value) {
	return value.toFixed(2);
}

function categoryLabel(category) {
	return CATEGORY_LABELS[category] ?? 'Другое';
}

export function renderList(container, emptyMessage, expenses) {
	container.replaceChildren();

	if (expenses.length === 0) {
		emptyMessage.hidden = false;
		return;
	}
	emptyMessage.hidden = true;

	const fragment = document.createDocumentFragment();

	for (const expense of expenses) {
		const li = document.createElement('li');
		li.className = 'item';
		li.dataset.id = expense.id;

		const name = document.createElement('span');
		name.className = 'item__name';
		name.textContent = expense.name;

		const category = document.createElement('span');
		category.className = 'item__category';
		category.textContent = categoryLabel(expense.category);

		const amount = document.createElement('span');
		amount.className = 'item__amount';
		amount.textContent = `${formatMoney(expense.amount)} ₽`;

		const del = document.createElement('button');
		del.type = 'button';
		del.className = 'item__delete';
		del.dataset.action = 'delete';
		del.dataset.id = expense.id;
		del.textContent = 'Удалить';

		li.append(name, category, amount, del);
		fragment.append(li);
	}

	container.append(fragment);
}

export function renderSummary(countEl, totalEl, visibleExpenses) {
	const total = visibleExpenses.reduce((acc, e) => acc + e.amount, 0);
	countEl.textContent = String(visibleExpenses.length);
	totalEl.textContent = formatMoney(total);
}

export function setFormError(errorEl, message) {
	errorEl.textContent = message || '';
}