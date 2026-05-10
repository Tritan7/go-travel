document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const bgSlides = document.querySelectorAll('.bg-slide');
    const currentIndicator = document.getElementById('current-slide');
    const progressBar = document.getElementById('progress-bar');
    const carousel = document.getElementById('carousel');

    let currentIndex = 0;
    const totalSlides = cards.length;

    function updateCarousel(index) {
        // Update cards
        cards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });

        // Update background
        bgSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });

        // Update indicator
        currentIndicator.textContent = `0${index + 1}`;

        // Update progress bar
        const progressPercentage = ((index + 1) / totalSlides) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Shift carousel based on screen size
        if (window.innerWidth > 1024) {
             const cardWidth = 200 + 16; // width + gap
             let translateX = 0;
             
             // Simple logic to keep the active card visible
             if (index > 0) {
                 translateX = - (index * cardWidth) + (index > 2 ? cardWidth : 0);
             }
             
             // carousel.style.transform = `translateX(${translateX}px)`;
        } else {
             // For mobile, scroll into view
             cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }

    // Auto Slide
    let autoSlideInterval;
    const slideDuration = 5000;

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel(currentIndex);
        }, slideDuration);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel(currentIndex);
            stopAutoSlide();
            startAutoSlide();
        });

        card.addEventListener('mouseenter', stopAutoSlide);
        card.addEventListener('mouseleave', startAutoSlide);
    });

    // Initialize
    updateCarousel(currentIndex);
    startAutoSlide();
});
