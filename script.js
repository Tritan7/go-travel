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
    const slideDuration = 2500;

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

// Tour Packages Section Logic
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tpCards = document.querySelectorAll('.tp-card');
    const tpCarousel = document.getElementById('tp-carousel');
    const tpPrevBtn = document.getElementById('tp-prev');
    const tpNextBtn = document.getElementById('tp-next');
    const tpProgressBar = document.getElementById('tp-progress');

    let tpCurrentIndex = 0; // Start from the first card
    let visibleCards = Array.from(tpCards);

    function updateTpCarousel() {
        if (visibleCards.length === 0) return;

        // Ensure index is within bounds
        if (tpCurrentIndex >= visibleCards.length) tpCurrentIndex = visibleCards.length - 1;
        if (tpCurrentIndex < 0) tpCurrentIndex = 0;

        // Update active class
        tpCards.forEach(card => card.classList.remove('active'));
        visibleCards[tpCurrentIndex].classList.add('active');

        // Update progress bar
        const progressPercentage = ((tpCurrentIndex + 1) / visibleCards.length) * 100;
        tpProgressBar.style.width = `${progressPercentage}%`;

        // Calculate translation
        // Assuming a fixed card width of 300px + 2rem (32px) gap = 332px
        // And active card is 380px. This is an approximation.
        if (window.innerWidth > 1024) {
            const containerWidth = document.querySelector('.tp-carousel-container').offsetWidth;
            const centerOffset = containerWidth / 2;
            const cardOffset = (tpCurrentIndex * 332) + (380 / 2);

            let translateX = centerOffset - cardOffset;
            // tpCarousel.style.transform = `translateX(${translateX}px)`;
        } else {
            visibleCards[tpCurrentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filter cards
            visibleCards = [];
            tpCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    visibleCards.push(card);
                } else {
                    card.style.display = 'none';
                }
            });

            // Always start from the first card of the filtered set
            tpCurrentIndex = 0;
            updateTpCarousel();
        });
    });

    // Navigation Logic
    tpPrevBtn.addEventListener('click', () => {
        if (tpCurrentIndex > 0) {
            tpCurrentIndex--;
            updateTpCarousel();
        }
    });

    tpNextBtn.addEventListener('click', () => {
        if (tpCurrentIndex < visibleCards.length - 1) {
            tpCurrentIndex++;
            updateTpCarousel();
        }
    });

    // Click on card to make it active
    tpCards.forEach(card => {
        card.addEventListener('click', () => {
            const index = visibleCards.indexOf(card);
            if (index !== -1) {
                tpCurrentIndex = index;
                updateTpCarousel();
            }
        });

        // Prevent arrow click from bubbling if needed, and handle specific action
        const arrow = card.querySelector('.btn-arrow');
        if (arrow) {
            arrow.addEventListener('click', (e) => {
                e.stopPropagation();
                // Add any specific action for the arrow here if needed
                console.log('Arrow clicked for:', card.querySelector('h4').textContent);
            });
        }
    });

    // Initial setup — trigger the default active filter so only its cards are shown
    const defaultActiveBtn = document.querySelector('.filter-btn.active');
    if (defaultActiveBtn) {
        defaultActiveBtn.click();
    } else {
        updateTpCarousel();
    }
});

