document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const body = document.body;

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');

        if (body.classList.contains('dark-theme')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Mobile menu toggle
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-list');

    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            burgerMenu.setAttribute('aria-expanded', burgerMenu.classList.contains('active'));
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                burgerMenu.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Cart functionality
    const cart = {
        items: [],
        total: 0,

        addItem(product) {
            const existingItem = this.items.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({
                    ...product,
                    quantity: 1
                });
            }

            this.updateTotal();
            this.updateCartUI();
            this.saveToLocalStorage();
        },

        removeItem(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.updateTotal();
            this.updateCartUI();
            this.saveToLocalStorage();
        },

        updateTotal() {
            this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },

        updateCartUI() {
            const cartItemsEl = document.querySelector('.cart-items');
            const cartTotalEl = document.querySelector('.cart-summary .summary-value');
            const cartCountEl = document.querySelector('.cart-count');

            if (cartItemsEl) cartItemsEl.innerHTML = '';
            if (cartTotalEl) cartTotalEl.textContent = `${this.total} руб.`;
            if (cartCountEl) cartCountEl.textContent = this.items.reduce((count, item) => count + item.quantity, 0);

            this.items.forEach(item => {
                if (cartItemsEl) {
                    const cartItemEl = document.createElement('div');
                    cartItemEl.className = 'cart-item';
                    cartItemEl.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <p class="cart-item-price">${item.price} руб. × ${item.quantity}</p>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    cartItemsEl.appendChild(cartItemEl);
                }
            });

            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.removeItem(btn.dataset.id);
                });
            });
        },

        saveToLocalStorage() {
            localStorage.setItem('cart', JSON.stringify({
                items: this.items,
                total: this.total
            }));
        },

        loadFromLocalStorage() {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const { items, total } = JSON.parse(savedCart);
                this.items = items || [];
                this.total = total || 0;
                this.updateCartUI();
            }
        }
    };

    // Initialize cart
    cart.loadFromLocalStorage();

    // Cart button functionality
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            document.getElementById('cart-modal').classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close cart modal
    const cartModalClose = document.querySelector('#cart-modal .modal-close');
    if (cartModalClose) {
        cartModalClose.addEventListener('click', () => {
            document.getElementById('cart-modal').classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    const continueShopping = document.getElementById('continue-shopping');
    if (continueShopping) {
        continueShopping.addEventListener('click', () => {
            document.getElementById('cart-modal').classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Заказ оформлен! Сумма: ' + cart.total + ' руб.');
            cart.items = [];
            cart.total = 0;
            cart.updateCartUI();
            cart.saveToLocalStorage();
            document.getElementById('cart-modal').classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Add to cart buttons
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                id: this.dataset.id || Date.now().toString(),
                name: productCard.querySelector('.product-title').textContent,
                price: parseInt(productCard.querySelector('.product-price').textContent),
                image: productCard.querySelector('.product-img').src
            };

            cart.addItem(product);

            // Animation feedback
            const originalText = this.textContent;
            this.textContent = 'Добавлено!';
            this.style.backgroundColor = '#52c41a';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 2000);
        });
    });
});