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
            // For mobile, scroll the container explicitly to avoid vertical page jumps
            const cardElement = cards[index];
            const scrollPos = cardElement.offsetLeft - (carousel.offsetWidth / 2) + (cardElement.offsetWidth / 2);
            carousel.scrollTo({
                left: Math.max(0, scrollPos),
                behavior: 'smooth'
            });
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
            // Mobile layout side-by-side peek carousel
            // Card width (260px) + gap (2rem = 32px) = 292px
            const cardTotalWidth = 260 + 32;
            const translateX = -(tpCurrentIndex * cardTotalWidth);
            tpCarousel.style.transform = `translateX(${translateX}px)`;
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

    // Swipe/Drag support for tpCarousel on Mobile
    let isDragging = false;
    let didDrag = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function touchStart(event) {
        if (window.innerWidth > 768) return;
        isDragging = true;
        startPos = getPositionX(event);
        tpCarousel.style.transition = 'none';

        const style = window.getComputedStyle(tpCarousel);
        // Fallback for browsers that might not support DOMMatrix on computed transforms directly
        const transformString = style.transform !== 'none' ? style.transform : 'matrix(1, 0, 0, 1, 0, 0)';
        const matrix = new DOMMatrixReadOnly(transformString);
        prevTranslate = matrix.m41;
    }

    function touchMove(event) {
        if (isDragging && window.innerWidth <= 768) {
            const currentPosition = getPositionX(event);
            const diff = currentPosition - startPos;
            
            if (Math.abs(diff) > 10) {
                didDrag = true;
            }
            
            currentTranslate = prevTranslate + diff;
            tpCarousel.style.transform = `translateX(${currentTranslate}px)`;
        }
    }

    function touchEnd(event) {
        if (!isDragging || window.innerWidth > 768) return;
        isDragging = false;
        tpCarousel.style.transition = 'transform 0.5s ease-out';
        
        const currentPosition = event.type.includes('mouse') ? event.pageX : event.changedTouches[0].clientX;
        const movedBy = currentPosition - startPos;

        if (movedBy < -50 && tpCurrentIndex < visibleCards.length - 1) {
            tpCurrentIndex += 1;
        } else if (movedBy > 50 && tpCurrentIndex > 0) {
            tpCurrentIndex -= 1;
        }

        updateTpCarousel();
        
        if (didDrag) {
            setTimeout(() => { didDrag = false; }, 50);
        }
    }

    tpCarousel.addEventListener('touchstart', touchStart, { passive: true });
    tpCarousel.addEventListener('touchend', touchEnd);
    tpCarousel.addEventListener('touchmove', touchMove, { passive: true });

    tpCarousel.addEventListener('mousedown', touchStart);
    tpCarousel.addEventListener('mouseup', touchEnd);
    tpCarousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            tpCarousel.style.transition = 'transform 0.5s ease-out';
            updateTpCarousel();
        }
    });
    tpCarousel.addEventListener('mousemove', touchMove);

    // Click on card to make it active
    tpCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (didDrag) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            
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

// Sticky Header & Scrollspy Logic
const header = document.querySelector('header');
const sections = document.querySelectorAll('main, section');
const navLinks = document.querySelectorAll('.glass-nav a');

window.addEventListener('scroll', () => {
    // Sticky header
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Scrollspy: update active nav link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Adjust the offset threshold based on header height (~100px)
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (current && link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Step Cards Interactive Logic
const stepCards = document.querySelectorAll('.step-card');
const stepsContainer = document.querySelector('.steps-container');

stepCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Remove active class from all cards
        stepCards.forEach(c => c.classList.remove('active'));
        // Add active class to hovered card
        card.classList.add('active');
    });
});


// Mobile Menu Toggle
const hamburgerBtn = document.getElementById('hamburger-btn');
const navMenu = document.getElementById('nav-menu');
const closeMenuBtn = document.getElementById('close-menu-btn');

if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.add('active');
        document.body.classList.add('menu-open');
    });

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }

    // Close menu when clicking a link
    const navLinksMobile = navMenu.querySelectorAll('a');
    navLinksMobile.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Scroll Entrance Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target); // Optional: only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});
