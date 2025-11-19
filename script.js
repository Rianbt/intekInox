document.addEventListener('DOMContentLoaded', () => {
    // --- Variáveis Globais de Configuração ---
    // A altura do header é importante para o scroll suave (offset)
    const HEADER_HEIGHT = 85;

    // --- Elementos de Navegação e Menu ---
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const dropdown = document.querySelector('.dropdown');
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const navLinksAll = document.querySelectorAll('.nav-links a');
    
    // --- Elementos do Carrossel de Produtos ---
    const productsCarousel = document.getElementById('products-carousel');
    const prevButton = document.getElementById('prev-product');
    const nextButton = document.getElementById('next-product');
    const dotsContainer = document.getElementById('products-dots');
    
    // --- Lógica de Scroll Suave com Offset do Header ---
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Calcula a posição de destino menos a altura do cabeçalho
                window.scrollTo({
                    top: target.offsetTop - HEADER_HEIGHT + 1,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Lógica do Menu Mobile e Dropdown ---

    // 1. Alterna Menu Mobile (☰ / ✕)
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Altera o texto do botão (se você estiver usando os símbolos '☰' / '✕')
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '&#9776;'; // Usando &#9776; para ☰
            
            // Garante que o dropdown de Produtos feche ao fechar o menu principal
            if (!navLinks.classList.contains('active')) {
                if (dropdownContent && dropdown) {
                    dropdownContent.classList.remove('show');
                    dropdown.classList.remove('open');
                }
            }
        });
    }

    // 2. Controla o Dropdown de Produtos no Mobile
    if (dropbtn && dropdownContent) {
        dropbtn.addEventListener('click', (e) => {
            // Apenas no mobile (768px ou menos)
            if (window.innerWidth <= 768) {
                e.preventDefault(); 
                dropdownContent.classList.toggle('show');
                dropdown.classList.toggle('open');
            }
        });
    }

    // 3. Fecha o menu mobile ao clicar em qualquer link (exceto o dropdown)
    navLinksAll.forEach(link => {
        link.addEventListener('click', () => {
            // Verifica se o link clicado não é o botão do dropdown, ou se está no desktop
            if (!link.classList.contains('dropbtn') || window.innerWidth > 768) {
                // Fecha o menu principal e reseta o botão
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '&#9776;';
                
                // Fecha o dropdown de Produtos (apenas para garantir)
                if (dropdownContent && dropdown) {
                    dropdownContent.classList.remove('show');
                    dropdown.classList.remove('open');
                }
            }
        });
    });
    
    // --- Lógica do Carrossel de Produtos (Drag e Navegação) ---
    
    if (productsCarousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let dragged = false;
        
        // Obter itens e variáveis do Carrossel
        const items = productsCarousel.querySelectorAll('.carousel-item');
        const totalItems = items.length;
        let currentPage = 0;

        // Função para obter o número de itens visíveis
        const getItemsPerView = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
        
        // --- 1. Funcionalidade de Arrastar (Drag) ---
        
        productsCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            dragged = false;
            productsCarousel.classList.add('active-drag');
            startX = e.pageX - productsCarousel.offsetLeft;
            scrollLeft = productsCarousel.scrollLeft;
        });

        productsCarousel.addEventListener('mouseleave', () => {
            if (!isDown) return;
            isDown = false;
            productsCarousel.classList.remove('active-drag');
            // Após soltar o drag, força o alinhamento para o item mais próximo
            snapToNearestItem();
        });

        productsCarousel.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            productsCarousel.classList.remove('active-drag');
            // Após soltar o drag, força o alinhamento para o item mais próximo
            snapToNearestItem();
        });

        productsCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - productsCarousel.offsetLeft;
            const walk = (x - startX) * 2; // Fator de velocidade 2
            productsCarousel.scrollLeft = scrollLeft - walk;
            
            // Verifica se houve movimento suficiente para considerar como drag
            if (Math.abs(walk) > 10) {
                dragged = true;
            }
        });
        
        // Impede o clique em links dentro do carrossel se houve drag
        productsCarousel.addEventListener('click', (e) => {
            if (dragged) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }, true);
        
        // --- 2. Snap (Alinhamento) após o Drag ---
        
        const snapToNearestItem = () => {
            if (items.length === 0) return;

            // Calcula a largura real do item + gap
            const itemStyle = window.getComputedStyle(items[0]);
            const itemWidth = items[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(productsCarousel).gap) || 0;
            const itemFullWidth = itemWidth + gap;
            
            const currentScroll = productsCarousel.scrollLeft;
            
            // Encontra o índice do item mais próximo
            const nearestIndex = Math.round(currentScroll / itemFullWidth);
            
            // Calcula o scroll exato para o item mais próximo
            const targetScroll = nearestIndex * itemFullWidth;
            
            // Atualiza a página atual e faz o scroll suave
            const itemsPerView = getItemsPerView();
            currentPage = Math.floor(nearestIndex / itemsPerView);
            
            productsCarousel.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        };
        
        // --- 3. Lógica de Navegação por Botões e Dots ---
        
        const getCarouselDimensions = () => {
             if (items.length === 0) return { itemFullWidth: 0, itemsPerView: 1 };
             
             const itemsPerView = getItemsPerView();
             const itemWidth = items[0].offsetWidth;
             const gap = parseFloat(window.getComputedStyle(productsCarousel).gap) || 0;
             const itemFullWidth = itemWidth + gap;
             
             return { itemFullWidth, itemsPerView };
        };
        
        const createDots = () => {
            dotsContainer.innerHTML = '';
            const { itemsPerView } = getCarouselDimensions();
            const totalDots = Math.ceil(totalItems / itemsPerView);
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    const { itemFullWidth, itemsPerView } = getCarouselDimensions();
                    
                    // Calcula o índice inicial do bloco a ser exibido
                    let targetIndex = i * itemsPerView;
                    
                    // Limita o scroll ao último item visível, se necessário
                    const maxIndex = totalItems - itemsPerView;
                    if (targetIndex > maxIndex && maxIndex >= 0) {
                         targetIndex = maxIndex;
                    } else if (maxIndex < 0) {
                         targetIndex = 0;
                    }
                    
                    const scrollPosition = targetIndex * itemFullWidth;
                    
                    productsCarousel.scrollTo({
                        left: scrollPosition,
                        behavior: 'smooth'
                    });
                });
                dotsContainer.appendChild(dot);
            }
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentPage);
            });
        };

        const updateButtons = () => {
            const { itemsPerView } = getCarouselDimensions();
            const maxPage = Math.ceil(totalItems / itemsPerView) - 1;

            prevButton.style.opacity = currentPage === 0 ? '0.5' : '1';
            prevButton.style.pointerEvents = currentPage === 0 ? 'none' : 'auto';

            nextButton.style.opacity = currentPage >= maxPage ? '0.5' : '1';
            nextButton.style.pointerEvents = currentPage >= maxPage ? 'none' : 'auto';
        };

        // Navegação por botão (move um item por vez)
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const { itemFullWidth } = getCarouselDimensions();
                const maxScroll = productsCarousel.scrollWidth - productsCarousel.offsetWidth;
                
                let targetScroll = productsCarousel.scrollLeft + itemFullWidth;
                
                // Evita que o scroll vá além do limite
                if (productsCarousel.scrollLeft >= maxScroll - 1) {
                     targetScroll = 0; // Volta ao início
                }
                
                productsCarousel.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            });
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                const { itemFullWidth } = getCarouselDimensions();
                let targetScroll = productsCarousel.scrollLeft - itemFullWidth;

                // Volta ao final se estiver no início
                if (productsCarousel.scrollLeft < 1) {
                     targetScroll = productsCarousel.scrollWidth - productsCarousel.offsetWidth;
                }
                
                productsCarousel.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            });
        }
        
        // Atualiza a página e dots ao rolar (seja por drag, toque ou botão)
        productsCarousel.addEventListener('scroll', () => {
            const { itemFullWidth, itemsPerView } = getCarouselDimensions();
            
            if (itemFullWidth === 0) return;
            
            const scrollPosition = productsCarousel.scrollLeft;
            
            // A página atual é calculada dividindo a posição de scroll pela largura de um "bloco de visualização"
            // Multiplicamos pela largura do item completo (item + gap)
            const realPageWidth = itemsPerView * itemFullWidth;
            
            const newPage = Math.round(scrollPosition / realPageWidth);
            
            // Opcional: Para evitar que a página fique "quebrada" no final em resoluções específicas
            // const maxPage = Math.ceil(totalItems / itemsPerView) - 1;
            // currentPage = Math.min(Math.max(0, newPage), maxPage);
            
            // Simplificado:
            currentPage = newPage;
            
            updateDots();
            updateButtons();
        });

        // Atualização em Redimensionamento
        window.addEventListener('resize', () => {
             // Reconstroi os dots e redefine o scroll para 0 em mudanças de tamanho de tela
             productsCarousel.scrollTo({ left: 0, behavior: 'auto' });
             currentPage = 0;
             createDots();
             updateButtons();
        });

        // Inicialização
        createDots();
        updateButtons();
    }
});