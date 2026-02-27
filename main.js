// Основной JavaScript для всего сайта
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.innerHTML = navList.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList) {
                navList.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
    
    // Подсветка активной страницы в меню
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-list a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Анимация при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за анимируемыми элементами
    document.querySelectorAll('.format-card, .review-card, .value-card, .team-card, .method-item, .schedule-item, .stage, .news-card-full, .gallery-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(element);
    });
    
    // Карусель отзывов
    const reviewsCarousel = document.querySelector('.reviews-carousel');
    if (reviewsCarousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        reviewsCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            reviewsCarousel.classList.add('active');
            startX = e.pageX - reviewsCarousel.offsetLeft;
            scrollLeft = reviewsCarousel.scrollLeft;
        });
        
        reviewsCarousel.addEventListener('mouseleave', () => {
            isDown = false;
            reviewsCarousel.classList.remove('active');
        });
        
        reviewsCarousel.addEventListener('mouseup', () => {
            isDown = false;
            reviewsCarousel.classList.remove('active');
        });
        
        reviewsCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - reviewsCarousel.offsetLeft;
            const walk = (x - startX) * 2;
            reviewsCarousel.scrollLeft = scrollLeft - walk;
        });
        
        // Добавляем кнопки для мобильных
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        reviewsCarousel.parentElement.style.position = 'relative';
        reviewsCarousel.parentElement.appendChild(nextBtn);
        reviewsCarousel.parentElement.appendChild(prevBtn);
        
        nextBtn.addEventListener('click', () => {
            reviewsCarousel.scrollLeft += 300;
        });
        
        prevBtn.addEventListener('click', () => {
            reviewsCarousel.scrollLeft -= 300;
        });
    }
});