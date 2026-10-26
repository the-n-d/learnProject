import { loadExpenses } from './storage.js';
import {
	validateInput,
	createExpense,
	removeExpense,
	getVisibleExpenses,
	persist,
} from './model.js';
import { renderList, renderSummary, setFormError } from './ui.js';

const form = document.getElementById('expense-form');
const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const errorEl = document.getElementById('form-error');

const filterSelect = document.getElementById('filter');
const sortSelect = document.getElementById('sort');

const listEl = document.getElementById('expense-list');
const emptyEl = document.getElementById('empty-message');
const countEl = document.getElementById('count');
const totalEl = document.getElementById('total');

const state = {
	expenses: [],
	filter: 'all',
	sort: 'none',
};

function render() {
	const visible = getVisibleExpenses(state.expenses, {
		category: state.filter,
		sort: state.sort,
	});
	renderList(listEl, emptyEl, visible);
	renderSummary(countEl, totalEl, visible);
}

function commit() {
	persist(state.expenses);
	render();
}

function handleAdd(event) {
	event.preventDefault();

	const validation = validateInput({
		name: nameInput.value,
		amount: amountInput.value,
		category: categorySelect.value,
	});

	if (!validation.ok) {
		setFormError(errorEl, validation.error);
		return;
	}

	setFormError(errorEl, '');
	state.expenses = [createExpense(validation.value), ...state.expenses];
	commit();

	form.reset();
	categorySelect.value = 'food';
	nameInput.focus();
}

function handleDelete(id) {
	if (!id) return;
	state.expenses = removeExpense(state.expenses, id);
	commit();
}

function handleListClick(event) {
	const button = event.target.closest('[data-action="delete"]');
	if (!button) return;
	handleDelete(button.dataset.id);
}

function handleFilterChange(event) {
	state.filter = event.target.value;
	render();
}

function handleSortChange(event) {
	state.sort = event.target.value;
	render();
}

function init() {
	state.expenses = loadExpenses();

	form.addEventListener('submit', handleAdd);
	listEl.addEventListener('click', handleListClick);
	filterSelect.addEventListener('change', handleFilterChange);
	sortSelect.addEventListener('change', handleSortChange);

	render();
}

init();