		const API_URL = 'https://dummyjson.com/products';
		const statusEl = document.getElementById('status');
		const productsEl = document.getElementById('products');
		const searchInput = document.getElementById('searchInput');

		function showLoading() {
			statusEl.innerHTML = `
		<div class="d-flex align-items-center gap-2 text-primary">
		  <div class="spinner-border spinner-border-sm"></div>
		  <span>Загрузка...</span>
		</div>`;
			productsEl.innerHTML = '';
		}

		function showError(message) {
			statusEl.innerHTML = `
		<div class="alert alert-danger mb-0">
		  Ошибка: ${message}
		</div>`;
		}

		function clearStatus() {
			statusEl.innerHTML = '';
		}

		function renderProducts(products) {
			productsEl.innerHTML = '';

			if (products.length === 0) {
				statusEl.innerHTML = `
		  <div class="alert alert-warning mb-0">Ничего не найдено</div>`;
				return;
			}

			clearStatus();

			for (const p of products) {
				const col = document.createElement('div');
				col.className = 'col-sm-6 col-md-4 col-lg-3';
				col.innerHTML = `
		  <div class="card h-100">
			<img src="${p.thumbnail}"
				 class="card-img-top"
				 alt="${p.title}"
				 style="object-fit: cover; height: 160px;">
			<div class="card-body d-flex flex-column">
			  <h6 class="card-title">${p.title}</h6>
			  <p class="card-text small text-muted flex-grow-1">
				${p.description.slice(0, 60)}...
			  </p>
			  <div class="d-flex justify-content-between align-items-center">
				<span class="fw-bold">$${p.price}</span>
				<span class="badge bg-secondary">${p.category}</span>
			  </div>
			</div>
		  </div>`;
				productsEl.appendChild(col);
			}
		}

		async function loadProducts(query = '') {
			showLoading();

			try {
				const url = query
					? `${API_URL}/search?q=${encodeURIComponent(query)}`
					: `${API_URL}?limit=20`;

				const response = await fetch(url);

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}

				const data = await response.json();

				if (!data || !Array.isArray(data.products)) {
					throw new Error('Некорректный формат ответа от сервера');
				}

				renderProducts(data.products);
			} catch (err) {
				showError(err.message || 'не удалось загрузить данные');
			}
		}

		document.getElementById('searchBtn').addEventListener('click', () => {
			loadProducts(searchInput.value.trim());
		});

		searchInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				loadProducts(searchInput.value.trim());
			}
		});

		document.getElementById('reloadBtn').addEventListener('click', () => {
			searchInput.value = '';
			loadProducts();
		});

		loadProducts();