document.addEventListener('DOMContentLoaded', function() {
    // Данные товаров (в реальном проекте будут загружаться с сервера)
    const products = [
        {
            id: 'cake1',
            name: 'Торт "Ягодное наслаждение"',
            price: 85,
            category: 'cakes',
            image: 'images/product-cake1.jpg',
            description: 'Нежный бисквит с клубничным кремом и свежими ягодами',
            rating: 4.5,
            reviews: 24,
            badge: 'hit'
        },
        {
            id: 'cupcake1',
            name: 'Капкейки "Шоколадные"',
            price: 45,
            category: 'cupcakes',
            image: 'images/product-cupcake1.jpg',
            description: 'Шоколадные капкейки с воздушным кремом и посыпкой',
            rating: 4,
            reviews: 18,
            badge: 'new'
        },
        // Другие товары...
    ];

    // Элементы DOM
    const productsGrid = document.querySelector('.products-grid');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortBy = document.getElementById('sort-by');
    const loadMoreBtn = document.querySelector('.btn-load-more');

    // Переменные состояния
    let visibleProducts = 6; // Сколько товаров показывать сначала
    let filteredProducts = [...products];

    // Функция для отображения товаров
    function displayProducts(productsToShow) {
        productsGrid.innerHTML = '';

        productsToShow.slice(0, visibleProducts).forEach(product => {
            const productCard = document.createElement('article');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;

            // Формируем HTML для карточки товара
            productCard.innerHTML = `
                ${product.badge === 'hit' ? '<div class="product-badge">Хит продаж</div>' : ''}
                ${product.badge === 'new' ? '<div class="product-badge new">Новинка</div>' : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                    <button class="quick-view-btn" data-product="${product.id}">Быстрый просмотр</button>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-meta">
                        <span class="product-price">${product.price} руб.</span>
                        <div class="product-rating">
                            ${renderRatingStars(product.rating)}
                            <span class="rating-count">(${product.reviews})</span>
                        </div>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="btn btn-outline btn-wishlist" title="Добавить в избранное">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="btn btn-primary btn-cart" data-id="${product.id}">Заказать</button>
                    </div>
                </div>
            `;

            productsGrid.appendChild(productCard);
        });

        // Обновляем видимость кнопки "Показать еще"
        if (visibleProducts >= productsToShow.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }

        // Добавляем обработчики событий
        addEventListeners();
    }

    // Функция для отрисовки звезд рейтинга
    function renderRatingStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Полные звезды
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        // Половина звезды
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        // Пустые звезды
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    // Функция для фильтрации товаров
    function filterProducts() {
        const category = categoryFilter.value;
        const price = priceFilter.value;
        const sort = sortBy.value;

        // Фильтрация по категории
        filteredProducts = products.filter(product => {
            if (category === 'all') return true;
            return product.category === category;
        });

        // Фильтрация по цене
        filteredProducts = filteredProducts.filter(product => {
            if (price === 'all') return true;
            if (price === 'low') return product.price < 50;
            if (price === 'medium') return product.price >= 50 && product.price <= 100;
            if (price === 'high') return product.price > 100;
            return true;
        });

        // Сортировка
        filteredProducts.sort((a, b) => {
            if (sort === 'popular') return b.reviews - a.reviews;
            if (sort === 'price-asc') return a.price - b.price;
            if (sort === 'price-desc') return b.price - a.price;
            return 0;
        });

        // Сбрасываем счетчик видимых товаров
        visibleProducts = 6;

        // Отображаем отфильтрованные товары
        displayProducts(filteredProducts);
    }

    // Функция для добавления обработчиков событий
    function addEventListeners() {
        // Быстрый просмотр
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.dataset.product;
                showQuickViewModal(productId);
            });
        });

        // Добавление в избранное
        document.querySelectorAll('.btn-wishlist').forEach(btn => {
            btn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.replace('far', 'fas');
                    icon.style.color = '#ff4d4f';
                } else {
                    icon.classList.replace('fas', 'far');
                    icon.style.color = '';
                }
            });
        });
    }

    // Функция для показа модального окна быстрого просмотра
    function showQuickViewModal(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // В реальном проекте здесь будет модальное окно с подробной информацией
        alert(`Быстрый просмотр: ${product.name}\nЦена: ${product.price} руб.`);
    }

    // Обработчики событий для фильтров
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    sortBy.addEventListener('change', filterProducts);

    // Кнопка "Показать еще"
    loadMoreBtn.addEventListener('click', function() {
        visibleProducts += 6;
        displayProducts(filteredProducts);
    });

    // Инициализация - показываем первые товары
    filterProducts();
});