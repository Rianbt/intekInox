document.addEventListener('DOMContentLoaded', () => {
    const HEADER_HEIGHT = 85;
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdown = document.querySelector('.dropdown');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '&#9776;';
        });
    }

    if (dropbtn && dropdownContent) {
        dropbtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdownContent.classList.toggle('show');
                if (dropdown) dropdown.classList.toggle('open');
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
 
            if (window.innerWidth <= 768 && link.classList.contains('dropbtn')) return;

            if (navLinks) navLinks.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.innerHTML = '&#9776;';
            if (dropdownContent) dropdownContent.classList.remove('show');
            if (dropdown) dropdown.classList.remove('open');
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));


    const productsCarousel = document.getElementById('products-carousel');
    
    if (productsCarousel) {
        const prevButton = document.getElementById('prev-product');
        const nextButton = document.getElementById('next-product');
        const dotsContainer = document.getElementById('products-dots');
        const items = productsCarousel.querySelectorAll('.carousel-item');
        const totalItems = items.length;
        let currentPage = 0;
        let isDown = false;
        let startX;
        let scrollLeft;

        const getItemsPerView = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
        
        const getCarouselDimensions = () => {
            if (items.length === 0) return { itemFullWidth: 0, itemsPerView: 1 };
            const itemsPerView = getItemsPerView();
            const itemWidth = items[0].offsetWidth || 300;
            const gap = parseFloat(window.getComputedStyle(productsCarousel).gap) || 0;
            return { itemFullWidth: itemWidth + gap, itemsPerView };
        };

        const updateControls = () => {
            if(!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => dot.classList.toggle('active', index === currentPage));
            
            const { itemsPerView } = getCarouselDimensions();
            const maxPage = Math.ceil(totalItems / itemsPerView) - 1;

            if (prevButton) prevButton.style.opacity = currentPage === 0 ? '0.5' : '1';
            if (nextButton) nextButton.style.opacity = currentPage >= maxPage ? '0.5' : '1';
        };

        const createDots = () => {
            if(!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const { itemsPerView, itemFullWidth } = getCarouselDimensions();
            const totalDots = Math.ceil(totalItems / itemsPerView);

            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    productsCarousel.scrollTo({ left: i * itemsPerView * itemFullWidth, behavior: 'smooth' });
                });
                dotsContainer.appendChild(dot);
            }
            updateControls();
        };

        productsCarousel.addEventListener('mousedown', (e) => {
            isDown = true; productsCarousel.classList.add('active-drag');
            startX = e.pageX - productsCarousel.offsetLeft; scrollLeft = productsCarousel.scrollLeft;
        });
        productsCarousel.addEventListener('mouseleave', () => {
            isDown = false; productsCarousel.classList.remove('active-drag');
        });
        productsCarousel.addEventListener('mouseup', () => {
            isDown = false; productsCarousel.classList.remove('active-drag');
        });
        productsCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - productsCarousel.offsetLeft;
            const walk = (x - startX) * 2;
            productsCarousel.scrollLeft = scrollLeft - walk;
        });

        if(nextButton) nextButton.addEventListener('click', () => {
            const { itemFullWidth } = getCarouselDimensions();
            productsCarousel.scrollBy({ left: itemFullWidth, behavior: 'smooth' });
        });
        if(prevButton) prevButton.addEventListener('click', () => {
            const { itemFullWidth } = getCarouselDimensions();
            productsCarousel.scrollBy({ left: -itemFullWidth, behavior: 'smooth' });
        });

        productsCarousel.addEventListener('scroll', () => {
            if(isDown) return;
            const { itemFullWidth, itemsPerView } = getCarouselDimensions();
            if(itemFullWidth > 0) {
                currentPage = Math.round(productsCarousel.scrollLeft / (itemFullWidth * itemsPerView));
                updateControls();
            }
        });

        window.addEventListener('resize', () => { createDots(); });
        createDots();
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if(!href || href === "#") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - HEADER_HEIGHT + 1,
                    behavior: 'smooth'
                });
            }
        });
    });
});