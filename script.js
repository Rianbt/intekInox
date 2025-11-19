document.addEventListener('DOMContentLoaded', () => {

    const HEADER_HEIGHT = 85;

    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const dropdown = document.querySelector('.dropdown');
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    const productsCarousel = document.getElementById('products-carousel');
    const prevButton = document.getElementById('prev-product');
    const nextButton = document.getElementById('next-product');
    const dotsContainer = document.getElementById('products-dots'); 
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

          
           if (target) {
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

            if (!navLinks.classList.contains('active')) {
                if (dropdownContent && dropdown) {
                    dropdownContent.classList.remove('show');
                    dropdown.classList.remove('open');
                }
            }
        });
    }

  if (dropbtn && dropdownContent) {
        dropbtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault(); 
                dropdownContent.classList.toggle('show');
                dropdown.classList.toggle('open');
            }
        });
    }

    
    navLinksAll.forEach(link => {
        link.addEventListener('click', () => {
            
            if (!link.classList.contains('dropbtn') || window.innerWidth > 768) {
             
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '&#9776;';
                
                
                if (dropdownContent && dropdown) {
                    dropdownContent.classList.remove('show');
                    dropdown.classList.remove('open');
                }
            }
        });
    });
    
    
    
    if (productsCarousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let dragged = false;
        
        
        const items = productsCarousel.querySelectorAll('.carousel-item');
        const totalItems = items.length;
        let currentPage = 0;

        
        const getItemsPerView = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
        
        
        
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
            
            snapToNearestItem();
        });

        productsCarousel.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            productsCarousel.classList.remove('active-drag');
         
            snapToNearestItem();
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
        
       
        
        const snapToNearestItem = () => {
            if (items.length === 0) return;

         
            const itemStyle = window.getComputedStyle(items[0]);
            const itemWidth = items[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(productsCarousel).gap) || 0;
            const itemFullWidth = itemWidth + gap;
            
            const currentScroll = productsCarousel.scrollLeft;
            
          
            const nearestIndex = Math.round(currentScroll / itemFullWidth);
            
          
            const targetScroll = nearestIndex * itemFullWidth;
            
          
            const itemsPerView = getItemsPerView();
            currentPage = Math.floor(nearestIndex / itemsPerView);
            
            productsCarousel.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        };
        
       
        
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
                    
                   
                    let targetIndex = i * itemsPerView;
                    
                    
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

        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const { itemFullWidth } = getCarouselDimensions();
                const maxScroll = productsCarousel.scrollWidth - productsCarousel.offsetWidth;
                
                let targetScroll = productsCarousel.scrollLeft + itemFullWidth;
                
              
                if (productsCarousel.scrollLeft >= maxScroll - 1) {
                     targetScroll = 0; 
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
    
        productsCarousel.addEventListener('scroll', () => {
            const { itemFullWidth, itemsPerView } = getCarouselDimensions();
            
            if (itemFullWidth === 0) return;
            
            const scrollPosition = productsCarousel.scrollLeft;
        
            const realPageWidth = itemsPerView * itemFullWidth;
            
            const newPage = Math.round(scrollPosition / realPageWidth);
        
            currentPage = newPage;
            
            updateDots();
            updateButtons();
        });

        window.addEventListener('resize', () => {

             productsCarousel.scrollTo({ left: 0, behavior: 'auto' });
             currentPage = 0;
             createDots();
             updateButtons();
        });

      
        createDots();
        updateButtons();
    }
});