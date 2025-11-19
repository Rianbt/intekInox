// Atribui a altura do header para cálculo de scroll
const headerHeight = 85;

// --- FUNÇÕES GERAIS ---
// Smooth scroll
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

// Mobile menu and Dropdown functionality
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


// --- LÓGICA DE ARRASTO E PREVENÇÃO DE CLIQUE (APLICADO SOMENTE A PRODUTOS) ---

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

// Previne o clique (navegação) se houve arraste
productsCarousel.addEventListener('click', (e) => {
    if (dragged) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
}, true);


// --- LÓGICA DE NAVEGAÇÃO POR SETAS E BOLINHAS (APLICADA A AMBOS) ---

function setupCarouselNavigation(carouselId, prevId, nextId, dotsId, itemFullWidth, itemsPerView) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsContainer = document.getElementById(dotsId);
    const items = carousel.querySelectorAll('.carousel-item, .segment-item');

    if (items.length === 0) return;

    // Calcula o número de páginas
    const totalPages = Math.ceil(items.length / itemsPerView);
    let currentPage = 0;

    // Gera as bolinhas de navegação
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

    // Navegação por Seta (Next)
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let targetScroll = carousel.scrollLeft + (itemsPerView * itemFullWidth);
            
            // Loop para o início
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

    // Navegação por Seta (Previous)
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let targetScroll = carousel.scrollLeft - (itemsPerView * itemFullWidth);
            
            // Loop para o final
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

    // Atualiza a bolinha ativa ao arrastar manualmente
    carousel.addEventListener('scroll', () => {
        const scrollPosition = carousel.scrollLeft;
        
        // Pega a largura real do item dinamicamente
        const realItemWidth = items[0].offsetWidth + (parseFloat(window.getComputedStyle(carousel).gap) || 0);

        // Calcula a página com base na posição do scroll
        // Usa itemFullWidth como fallback se realItemWidth for 0
        const baseWidth = realItemWidth || itemFullWidth;
        
        const newPage = Math.round(scrollPosition / (itemsPerView * baseWidth));
        
        // Garante que não ultrapasse os limites
        currentPage = Math.min(Math.max(0, newPage), totalPages - 1);
        
        updateDots(currentPage);
    });
}

// 1. Inicializa Carrossel de PRODUTOS
// Estimativa: 3 itens visíveis, largura de cada item (450px)
setupCarouselNavigation(
    'products-carousel', 
    'prev-product', 
    'next-product', 
    'products-dots', 
    450, 
    3 
);

// 2. Inicializa Carrossel de SEGMENTOS
// Estimativa: 5 itens visíveis, largura de cada item (250px)
setupCarouselNavigation(
    'segments-carousel', 
    'prev-segment', 
    'next-segment', 
    'segments-dots', 
    250, 
    5
);