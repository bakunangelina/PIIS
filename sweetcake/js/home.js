document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.indicator');

    if (carouselContainer && carouselSlides.length > 0) {
        let currentIndex = 0;

        function updateCarousel() {
            carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update indicators
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % carouselSlides.length;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + carouselSlides.length) % carouselSlides.length;
            updateCarousel();
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Indicator click
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                currentIndex = index;
                updateCarousel();
            });
        });

        // Auto-advance carousel every 5 seconds
        let carouselInterval = setInterval(nextSlide, 5000);

        // Pause auto-advance on hover
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', function() {
                clearInterval(carouselInterval);
            });

            carousel.addEventListener('mouseleave', function() {
                carouselInterval = setInterval(nextSlide, 5000);
            });
        }
    }
});