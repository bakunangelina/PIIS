document.addEventListener('DOMContentLoaded', function() {
    // Инициализация отзывов
    const allReviews = document.querySelectorAll('.review-item');
    showAllReviews();

    const paginationEnabled = false; // Переключить на true для включения пагинации
    initPagination(paginationEnabled);
    initReviewForm();

    function showAllReviews() {
        allReviews.forEach(review => {
            review.style.display = 'block';
            review.style.opacity = '1';
            review.style.height = 'auto';
        });
    }

    function initPagination(enabled = false) {
        if (!enabled) return;

        const itemsPerPage = 3;
        let currentPage = 1;
        const totalPages = Math.ceil(allReviews.length / itemsPerPage);
        const prevBtn = document.querySelector('.prev-review');
        const nextBtn = document.querySelector('.next-review');
        const pageInfo = document.querySelector('.page-info');

        function showPage(page) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            allReviews.forEach((review, index) => {
                review.style.display = (index >= start && index < end) ? 'block' : 'none';
            });

            prevBtn.disabled = page <= 1;
            nextBtn.disabled = page >= totalPages;
            if (pageInfo) pageInfo.textContent = `${page}/${totalPages}`;
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) showPage(--currentPage);
            });

            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) showPage(++currentPage);
            });
        }

        showPage(currentPage);
    }

    function initReviewForm() {
        const form = document.getElementById('reviewForm');
        if (!form) return;

        // Обработка аватарки
        const avatarUpload = document.getElementById('avatarUpload');
        const avatarPreview = document.getElementById('avatarPreview');
        const defaultAvatar = document.querySelector('.default-avatar');
        let selectedRating = 0;

        if (avatarUpload && avatarPreview) {
            avatarUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file && file.type.match('image.*')) {
                    const reader = new FileReader();

                    reader.onload = function(e) {
                        avatarPreview.src = e.target.result;
                        avatarPreview.style.display = 'block';
                        if (defaultAvatar) defaultAvatar.style.display = 'none';
                    }

                    reader.readAsDataURL(file);
                }
            });
        }

        // Обработка рейтинга
        const stars = document.querySelectorAll('.rating-stars i');
        stars.forEach(star => {
            star.addEventListener('click', setRating);
            star.addEventListener('mouseover', hoverRating);
            star.addEventListener('mouseout', resetRatingHover);
        });

        function setRating(e) {
            selectedRating = parseInt(e.target.getAttribute('data-rating'));
            updateStars();
        }

        function hoverRating(e) {
            const hoverRating = parseInt(e.target.getAttribute('data-rating'));
            stars.forEach((star, i) => {
                star.classList.toggle('hover', i < hoverRating);
            });
        }

        function resetRatingHover() {
            stars.forEach(star => star.classList.remove('hover'));
            updateStars();
        }

        function updateStars() {
            stars.forEach((star, i) => {
                star.classList.toggle('fas', i < selectedRating);
                star.classList.toggle('far', i >= selectedRating);
            });
        }

        // Отправка формы
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('reviewName').value.trim();
            const text = document.getElementById('reviewText').value.trim();

            if (!name || !text || selectedRating === 0) {
                alert('Пожалуйста, заполните все поля и поставьте оценку');
                return;
            }

            console.log('Отзыв отправлен:', { name, rating: selectedRating, text });

            // Сброс формы
            form.reset();
            selectedRating = 0;
            updateStars();

            if (avatarPreview) {
                avatarPreview.src = '';
                avatarPreview.style.display = 'none';
            }
            if (defaultAvatar) defaultAvatar.style.display = 'block';

            alert('Спасибо за ваш отзыв! После модерации он появится на сайте.');
        });
    }
});