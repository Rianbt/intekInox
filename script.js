
const headerHeight = 85;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - headerHeight + 1,
                behavior: 'smooth'
            });
        }
    });
});

const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const dropdown = document.querySelector('.dropdown');
const dropbtn = document.querySelector('.dropbtn');
const dropdownContent = document.querySelector('.dropdown-content');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    if (!navLinks.classList.contains('active')) {
        dropdownContent.classList.remove('show');
        dropdown.classList.remove('open');
    }
});

dropbtn.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        e.preventDefault(); 
        dropdownContent.classList.toggle('show');
        dropdown.classList.toggle('open');
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (!link.classList.contains('dropbtn') || window.innerWidth > 768) {
            navLinks.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
            dropdownContent.classList.remove('show');
            dropdown.classList.remove('open');
        }
    });
});


const productsCarousel = document.getElementById('products-carousel');

let isDown = false;
let startX;
let scrollLeft;
let dragged = false;

productsCarousel.addEventListener('mousedown', (e) => {
    isDown = true;
    dragged = false;
    productsCarousel.classList.add('active-drag');
    startX = e.pageX - productsCarousel.offsetLeft;
    scrollLeft = productsCarousel.scrollLeft;
});

productsCarousel.addEventListener('mouseleave', () => {
    isDown = false;
    productsCarousel.classList.remove('active-drag');
});

productsCarousel.addEventListener('mouseup', () => {
    isDown = false;
    productsCarousel.classList.remove('active-drag');
});

productsCarousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - productsCarousel.offsetLeft;
    const walk = (x - startX) * 2;
    productsCarousel.scrollLeft = scrollLeft - walk;
    
    if (Math.abs(walk) > 10) {
        dragged = true;
    }
});

productsCarousel.addEventListener('click', (e) => {
    if (dragged) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
}, true);


function setupCarouselNavigation(carouselId, prevId, nextId, dotsId, itemFullWidth, itemsPerView) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsContainer = document.getElementById(dotsId);
    const items = carousel.querySelectorAll('.carousel-item, .segment-item');

    if (items.length === 0) return;

    const totalPages = Math.ceil(items.length / itemsPerView);
    let currentPage = 0;

    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.setAttribute('data-index', i);
        dotsContainer.appendChild(dot);
        
        dot.addEventListener('click', () => {
            const scrollPosition = i * itemsPerView * itemFullWidth;
            carousel.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            updateDots(i);
        });
    }

    const dots = dotsContainer.querySelectorAll('.dot');
    if (dots.length > 0) {
        updateDots(0);
    }

    function updateDots(activePage) {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activePage);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let targetScroll = carousel.scrollLeft + (itemsPerView * itemFullWidth);

            if (carousel.scrollWidth - carousel.scrollLeft - carousel.offsetWidth < 10) {
                targetScroll = 0;
                currentPage = 0;
            } else {
                currentPage++;
            }
            
            carousel.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
            updateDots(currentPage);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let targetScroll = carousel.scrollLeft - (itemsPerView * itemFullWidth);

            if (carousel.scrollLeft < 10) {
                targetScroll = carousel.scrollWidth - carousel.offsetWidth;
                currentPage = totalPages - 1;
            } else {
                currentPage--;
            }
            
            carousel.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
            updateDots(currentPage);
        });
    }


    carousel.addEventListener('scroll', () => {
        const scrollPosition = carousel.scrollLeft;
        
        const realItemWidth = items[0].offsetWidth + (parseFloat(window.getComputedStyle(carousel).gap) || 0);

        const baseWidth = realItemWidth || itemFullWidth;
        
        const newPage = Math.round(scrollPosition / (itemsPerView * baseWidth));

        currentPage = Math.min(Math.max(0, newPage), totalPages - 1);
        
        updateDots(currentPage);
    });
}

setupCarouselNavigation(
    'products-carousel', 
    'prev-product', 
    'next-product', 
    'products-dots', 
    450, 
    3 
);