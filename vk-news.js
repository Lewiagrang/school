// Функция загрузки виджета ВК
function loadVKWidget() {
    const container = document.getElementById('vk-news-all');
    const newsCounter = document.querySelector('.news-count');
    
    if (!container) return;
    
    // Очищаем контейнер
    container.innerHTML = `
        <div class="widget-loading">
            <div class="spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>Загружаем новости из нашей группы ВКонтакте...</p>
        </div>
    `;
    
    // Обновляем счетчик
    if (newsCounter) {
        newsCounter.textContent = 'Загружаем новости...';
    }
    
    // Временное решение: используем iframe для вставки виджета
    // без необходимости инициализации VK API
    setTimeout(() => {
        showVKWidgetDirect(container, newsCounter);
    }, 1000);
}

// Прямая загрузка виджета через iframe
function showVKWidgetDirect(container, newsCounter) {
    const groupId = 235171057;
    const widgetUrl = `https://vk.com/widget_community.php?app=0&width=auto&_ver=1&gid=${groupId}&mode=3&color1=FFFFFF&color2=2B587A&color3=5B7FA6&class_name=&height=600&url=${encodeURIComponent(window.location.href)}&referrer=&title=${encodeURIComponent(document.title)}`;
    
    container.innerHTML = `
        <div class="vk-widget-wrapper">
            <iframe 
                id="vk-widget-iframe"
                src="${widgetUrl}"
                width="100%"
                height="650"
                frameborder="0"
                scrolling="no"
                allowtransparency="true"
                style="border-radius: 10px; overflow: hidden;"
            ></iframe>
            <div class="widget-loading-fallback" id="widget-fallback">
                <div class="spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <p>Загружаем виджет...</p>
                <p class="widget-hint">Если виджет не загрузился, проверьте подключение к интернету</p>
            </div>
        </div>
        <div class="widget-alternative" style="margin-top: 20px; text-align: center;">
            <p>Если новости не загрузились, вы можете:</p>
            <div class="alternative-actions" style="margin-top: 10px;">
                <a href="https://vk.com/club235171057" target="_blank" class="btn vk-btn" style="margin: 5px;">
                    <i class="fab fa-vk"></i> Перейти в группу ВК
                </a>
                <button class="btn btn-alt" id="show-demo-news-btn" style="margin: 5px;">
                    <i class="fas fa-eye"></i> Показать демо-новости
                </button>
            </div>
        </div>
    `;
    
    // Проверяем загрузку iframe
    const iframe = document.getElementById('vk-widget-iframe');
    const fallback = document.getElementById('widget-fallback');
    
    if (iframe) {
        iframe.onload = function() {
            console.log('VK widget iframe loaded');
            if (fallback) {
                fallback.style.display = 'none';
            }
            if (newsCounter) {
                newsCounter.textContent = 'Новости загружены из группы ВКонтакте';
            }
        };
        
        iframe.onerror = function() {
            console.error('Failed to load VK widget iframe');
            showWidgetError(container, newsCounter);
        };
        
        // Если iframe не загрузился за 5 секунд, показываем ошибку
        setTimeout(() => {
            if (fallback && fallback.style.display !== 'none') {
                showWidgetError(container, newsCounter);
            }
        }, 5000);
    }
    
    // Обработчик для демо-новостей
    setTimeout(() => {
        const demoBtn = document.getElementById('show-demo-news-btn');
        if (demoBtn) {
            demoBtn.addEventListener('click', function() {
                showDemoNews(container, newsCounter);
            });
        }
    }, 100);
}

// Ошибка загрузки виджета
function showWidgetError(container, newsCounter) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="vk-error-message">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Не удалось загрузить новости</h3>
            <p>Возможно, возникли проблемы с доступом к ВКонтакте или загрузкой виджета.</p>
            <p>Возможные причины:</p>
            <ul>
                <li>Проблемы с подключением к интернету</li>
                <li>Блокировка ВКонтакте в вашем регионе</li>
                <li>Защита браузера или антивируса</li>
            </ul>
            <div class="error-actions">
                <button class="btn" id="retry-widget-load">
                    <i class="fas fa-redo"></i> Попробовать снова
                </button>
                <a href="https://vk.com/club${235171057}" target="_blank" class="btn vk-btn">
                    <i class="fab fa-vk"></i> Перейти в группу ВК
                </a>
                <button class="btn btn-alt" id="show-demo-on-error">
                    <i class="fas fa-eye"></i> Показать демо-новости
                </button>
            </div>
        </div>
    `;
    
    if (newsCounter) {
        newsCounter.textContent = 'Ошибка загрузки новостей';
    }
    
    // Обработчики кнопок
    setTimeout(() => {
        const retryBtn = document.getElementById('retry-widget-load');
        const demoBtn = document.getElementById('show-demo-on-error');
        
        if (retryBtn) {
            retryBtn.addEventListener('click', function() {
                loadVKWidget();
            });
        }
        
        if (demoBtn) {
            demoBtn.addEventListener('click', function() {
                showDemoNews(container, newsCounter);
            });
        }
    }, 100);
}

// Показать демо-новости
function showDemoNews(container, newsCounter) {
    if (!container) return;
    
    if (newsCounter) {
        newsCounter.textContent = 'Показаны демонстрационные новости';
    }
    
    showMockNews(container, 8);
    
    // Добавляем кнопку для возврата к виджету
    const backBtn = document.createElement('div');
    backBtn.className = 'back-to-widget';
    backBtn.innerHTML = `
        <button class="btn" id="back-to-vk-widget" style="margin: 20px auto; display: block;">
            <i class="fas fa-arrow-left"></i> Вернуться к загрузке новостей из ВК
        </button>
    `;
    container.appendChild(backBtn);
    
    // Обработчик кнопки возврата
    setTimeout(() => {
        const backButton = document.getElementById('back-to-vk-widget');
        if (backButton) {
            backButton.addEventListener('click', function() {
                loadVKWidget();
            });
        }
    }, 100);
}

// Загрузка всех новостей
function loadVKNewsAll() {
    const container = document.getElementById('vk-news-all');
    const newsCounter = document.querySelector('.news-count');
    
    if (!container) return;
    
    // Показываем сообщение о загрузке
    container.innerHTML = `
        <div class="widget-loading">
            <div class="spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>Загружаем новости из нашей группы ВКонтакте...</p>
        </div>
    `;
    
    if (newsCounter) {
        newsCounter.textContent = 'Загружаем новости...';
    }
    
    // Загружаем виджет
    setTimeout(() => {
        loadVKWidget();
    }, 500);
}

// Показать заглушки новостей
function showMockNews(container, count) {
    if (!container) return;
    
    container.innerHTML = '';
    
    const mockNews = [
        {
            id: 1,
            date: Math.floor(Date.now() / 1000) - 86400,
            text: 'На этой неделе мы начали новый цикл занятий по сторителлингу. Дети учатся рассказывать истории о своих мечтах и достижениях.',
            attachments: null
        },
        {
            id: 2,
            date: Math.floor(Date.now() / 1000) - 172800,
            text: 'Провели уникальный мастер-класс с профессиональным радиоведущим. Дети пробовали себя в роли дикторов и брали интервью друг у друга.',
            attachments: null
        },
        {
            id: 3,
            date: Math.floor(Date.now() / 1000) - 259200,
            text: 'Состоялся открытый урок, на котором дети показали свои проекты. Мы гордимся их успехами и приглашаем всех на наши занятия!',
            attachments: null
        },
        {
            id: 4,
            date: Math.floor(Date.now() / 1000) - 345600,
            text: 'Разработали новые игровые методики для развития речи. Теперь занятия стали еще интереснее и эффективнее!',
            attachments: null
        },
        {
            id: 5,
            date: Math.floor(Date.now() / 1000) - 432000,
            text: 'Наши воспитанники приняли участие в городском фестивале детского творчества. Они представили свои видеодневники и аудиорассказы.',
            attachments: null
        },
        {
            id: 6,
            date: Math.floor(Date.now() / 1000) - 518400,
            text: 'Приглашаем волонтеров для участия в проекте. Если вы хотите помочь детям найти свой голос - присоединяйтесь к нашей команде!',
            attachments: null
        },
        {
            id: 7,
            date: Math.floor(Date.now() / 1000) - 604800,
            text: 'Запустили YouTube-канал с работами наших учеников. Теперь каждый может увидеть, как развиваются наши подопечные!',
            attachments: null
        },
        {
            id: 8,
            date: Math.floor(Date.now() / 1000) - 691200,
            text: 'Получили новые комплекты оборудования для видеосъемки. Теперь дети могут создавать еще более качественный контент.',
            attachments: null
        }
    ];
    
    const postsToShow = mockNews.slice(0, count);
    
    // Создаем контейнер для карточек
    const newsGrid = document.createElement('div');
    newsGrid.className = 'demo-news-grid';
    
    postsToShow.forEach(post => {
        const text = processPostText(post.text, 300);
        const date = formatDate(post.date);
        
        const newsCard = document.createElement('div');
        newsCard.className = 'demo-news-card';
        
        const color = getRandomColor();
        newsCard.innerHTML = `
            <div class="demo-news-image">
                <div style="background-color: ${color}; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-newspaper" style="font-size: 3rem; color: rgba(0,0,0,0.2);"></i>
                </div>
            </div>
            <div class="demo-news-content">
                <div class="demo-news-date">
                    <i class="far fa-calendar"></i> ${date}
                </div>
                <h3>${post.text.substring(0, 50)}${post.text.length > 50 ? '...' : ''}</h3>
                <p>${text.replace(/\n/g, '<br>')}</p>
                <div class="demo-news-actions">
                    <a href="https://vk.com/club235171057" target="_blank" class="btn">
                        <i class="fab fa-vk"></i> Больше новостей в ВК
                    </a>
                </div>
            </div>
        `;
        
        newsGrid.appendChild(newsCard);
    });
    
    container.appendChild(newsGrid);
    
    // Добавляем сообщение о демо-данных
    const demoMessage = document.createElement('div');
    demoMessage.className = 'demo-message';
    demoMessage.innerHTML = `
        <div style="text-align: center; padding: 20px; background: #f0f8ff; border-radius: 10px; margin-top: 30px;">
            <p><i class="fas fa-info-circle"></i> Показываем демонстрационные новости. <a href="https://vk.com/club235171057" target="_blank">Перейдите в нашу группу ВК</a> чтобы увидеть реальные посты и события.</p>
        </div>
    `;
    container.appendChild(demoMessage);
}

// Форматирование даты
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'только что';
    if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч. назад`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} дн. назад`;
    
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Обработка текста поста
function processPostText(text, maxLength = 200) {
    if (!text || text.trim() === '') return 'Новость без текста';
    
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    
    return text;
}

// Вспомогательная функция для случайного цвета
function getRandomColor() {
    const colors = ['#FFD6CC', '#CCE7FF', '#D4EDDA', '#FFF3CD', '#F8D7DA', '#E2D9F3'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем CSS стили
    const styles = `
    <style>
        .widget-loading {
            text-align: center;
            padding: 40px;
            background: #f8f9fa;
            border-radius: 10px;
            margin: 20px 0;
        }
        
        .spinner {
            font-size: 3rem;
            color: #4C75A3;
            margin-bottom: 20px;
        }
        
        .widget-hint {
            font-size: 0.9rem;
            color: #6c757d;
            margin-top: 10px;
        }
        
        .vk-widget-wrapper {
            position: relative;
            width: 100%;
            min-height: 650px;
            margin: 20px 0;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .widget-loading-fallback {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        
        #vk-widget-iframe {
            width: 100%;
            height: 100%;
            min-height: 650px;
            border: none;
            display: block;
        }
        
        .vk-error-message {
            text-align: center;
            padding: 40px 20px;
            background: #fff8f8;
            border-radius: 10px;
            margin: 20px 0;
            border: 2px dashed #f5c6cb;
        }
        
        .error-icon {
            font-size: 3rem;
            color: #dc3545;
            margin-bottom: 20px;
        }
        
        .error-actions {
            margin-top: 30px;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .btn-alt {
            background: #6c757d;
            color: white;
        }
        
        .btn-alt:hover {
            background: #5a6268;
        }
        
        .demo-news-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        
        @media (min-width: 768px) {
            .demo-news-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        .demo-news-card {
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            background: white;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .demo-news-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .demo-news-image {
            height: 150px;
            width: 100%;
            overflow: hidden;
        }
        
        .demo-news-content {
            padding: 20px;
        }
        
        .demo-news-date {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        
        .demo-news-actions {
            margin-top: 15px;
        }
        
        .demo-message {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #4C75A3;
        }
        
        .demo-message a {
            color: #4C75A3;
            font-weight: 600;
            text-decoration: none;
        }
        
        .demo-message a:hover {
            text-decoration: underline;
        }
        
        .news-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .news-count {
            color: #666;
            font-size: 0.9rem;
            padding: 8px 12px;
            background: #f8f9fa;
            border-radius: 5px;
        }
    </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
    
    // Загружаем новости
    loadVKNewsAll();
    
    // Кнопка обновления новостей
    const refreshBtn = document.getElementById('refresh-news');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadVKNewsAll();
            this.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Обновление...';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить новости';
            }, 2000);
        });
    }
});