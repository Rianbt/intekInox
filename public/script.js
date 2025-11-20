document.addEventListener('DOMContentLoaded', () => {
    const HEADER_HEIGHT = 85;

    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const dropdown = document.querySelector('.dropdown');
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if(mobileMenuBtn) mobileMenuBtn.innerHTML = '&#9776;';
                }
                window.scrollTo({
                    top: target.offsetTop - HEADER_HEIGHT + 1,
                    behavior: 'smooth'
                });
            }
        });
    });

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
            }
        });
    }

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const productsCarousel = document.getElementById('products-carousel');
    if (productsCarousel) {
        const prevButton = document.getElementById('prev-product');
        const nextButton = document.getElementById('next-product');
        const dotsContainer = document.getElementById('products-dots');
        const items = productsCarousel.querySelectorAll('.carousel-item');
        
        let isDown = false;
        let startX;
        let scrollLeft;

        const getItemsPerView = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
        const getCarouselWidth = () => {
            const item = items[0];
            const style = window.getComputedStyle(productsCarousel);
            const gap = parseFloat(style.gap) || 0;
            return (item.offsetWidth + gap);
        };

        productsCarousel.addEventListener('mousedown', (e) => {
            isDown = true; productsCarousel.classList.add('active'); startX = e.pageX - productsCarousel.offsetLeft; scrollLeft = productsCarousel.scrollLeft;
        });
        productsCarousel.addEventListener('mouseleave', () => { isDown = false; productsCarousel.classList.remove('active'); });
        productsCarousel.addEventListener('mouseup', () => { isDown = false; productsCarousel.classList.remove('active'); });
        productsCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return; e.preventDefault();
            const x = e.pageX - productsCarousel.offsetLeft;
            const walk = (x - startX) * 2;
            productsCarousel.scrollLeft = scrollLeft - walk;
        });

        if(nextButton) nextButton.addEventListener('click', () => {
            productsCarousel.scrollBy({ left: getCarouselWidth(), behavior: 'smooth' });
        });
        if(prevButton) prevButton.addEventListener('click', () => {
            productsCarousel.scrollBy({ left: -getCarouselWidth(), behavior: 'smooth' });
        });
    }
});