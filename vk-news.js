// НАСТРОЙКИ
const VK_CONFIG = {
    groupId: 235171057,
    baseHeight: 3000,
    maxWidth: 800,
    minWidth: 300,
    viewportThreshold: 768 // Порог для мобильных устройств
};

// Глобальные переменные для контроля перезагрузки
let resizeTimeout;
let lastWidth = 0;
let isInitialized = false;

// Главная функция загрузки новостей
function loadVKNewsAll() {
    const container = document.getElementById('vk-news-all');
    if (!container) return;
    
    // Очищаем контейнер
    container.innerHTML = `
        <div class="centered-vk-widget">
            <div class="widget-container" id="vk-widget-placeholder">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Загружаем новости из ВКонтакте...</p>
                </div>
            </div>
            <div class="widget-notice">
                <p>Если новости не загрузились, обновите страницу или посетите нашу 
                <a href="https://vk.com/club235171057" target="_blank">группу ВК</a></p>
            </div>
        </div>
    `;
    
    // Загружаем виджет с небольшой задержкой
    setTimeout(() => {
        initCenteredVKWidget();
        isInitialized = true;
    }, 300);
}

// Инициализация центрированного виджета
function initCenteredVKWidget() {
    const container = document.getElementById('vk-widget-placeholder');
    if (!container) return;
    
    // Останавливаем предыдущие таймеры
    clearTimeout(resizeTimeout);
    
    // Вычисляем оптимальные размеры
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Запоминаем текущую ширину
    lastWidth = screenWidth;
    
    // Определяем ширину виджета
    let widgetWidth;
    if (screenWidth >= 1200) {
        widgetWidth = Math.min(VK_CONFIG.maxWidth, screenWidth * 0.7);
    } else if (screenWidth >= 768) {
        widgetWidth = Math.min(700, screenWidth * 0.85);
    } else {
        // Для мобильных - используем почти всю ширину
        widgetWidth = Math.max(VK_CONFIG.minWidth, screenWidth * 0.95);
    }
    
    // Высота зависит от ширины (меньшая высота на узких экранах)
    let widgetHeight;
    if (screenWidth < VK_CONFIG.viewportThreshold) {
        // Для мобильных - высота меньше
        widgetHeight = Math.min(600, screenHeight * 0.7);
    } else {
        // Для десктопа - полная высота
        widgetHeight = VK_CONFIG.baseHeight;
        if (screenHeight > 900) widgetHeight = 800;
        if (screenHeight > 1200) widgetHeight = 1000;
    }
    
    // Параметры для ВК виджета
    const vkParams = new URLSearchParams({
        app: 0,
        width: widgetWidth,
        _ver: 1,
        gid: VK_CONFIG.groupId,
        mode: 4,
        no_cover: 1,
        color1: 'FFFFFF',
        color2: '2B587A',
        color3: '5B7FA6',
        height: widgetHeight
    });
    
    // Для мобильных добавляем дополнительные параметры
    if (screenWidth < VK_CONFIG.viewportThreshold) {
        vkParams.append('adaptive', 1); // Включаем адаптивный режим ВК
        vkParams.append('no_cover', 1); // Убираем обложку
        vkParams.append('no_header', 1); // Убираем заголовок для экономии места
    }
    
    // Создаем iframe
    const iframeId = 'vk_widget_' + Date.now();
    const iframe = document.createElement('iframe');
    
    iframe.id = iframeId;
    iframe.src = `https://vk.com/widget_community.php?${vkParams.toString()}`;
    iframe.width = widgetWidth;
    iframe.height = widgetHeight;
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.title = 'Новости группы НЕ МОЛЧИ ВКонтакте';
    
    // Стили для центрирования
    iframe.style.cssText = `
        display: block;
        margin: 0 auto;
        border: none;
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        background: white;
        max-width: 100%;
        width: ${widgetWidth}px;
        overflow: hidden;
    `;
    
    // Для мобильных - дополнительные стили
    if (screenWidth < VK_CONFIG.viewportThreshold) {
        iframe.style.cssText += `
            transform: scale(0.98);
            transform-origin: top center;
            -webkit-overflow-scrolling: touch;
        `;
        
        // Контейнер для скролла на мобильных
        container.style.cssText = `
            overflow-x: hidden;
            overflow-y: auto;
            max-height: 80vh;
            -webkit-overflow-scrolling: touch;
        `;
    }
    
    // Очищаем контейнер и добавляем iframe
    container.innerHTML = '';
    container.appendChild(iframe);
    
    // Обработчик для адаптации при изменении размера окна
    setupWidgetResizeHandler();
    
    // После загрузки iframe, проверяем его содержимое
    iframe.onload = function() {
        // Даем время на загрузку контента
        setTimeout(() => {
            adjustWidgetContent(screenWidth, iframe);
        }, 1000);
    };
}

// Функция для адаптации содержимого виджета
function adjustWidgetContent(screenWidth, iframe) {
    if (screenWidth < VK_CONFIG.viewportThreshold) {
        try {
            // Пытаемся влиять на стили через родительский контейнер
            const widgetContainer = iframe.closest('.centered-vk-widget');
            if (widgetContainer) {
                widgetContainer.style.cssText = `
                    max-width: 100vw;
                    overflow-x: hidden;
                    padding: 10px;
                    box-sizing: border-box;
                `;
            }
            
            // Принудительно устанавливаем ширину iframe для мобильных
            iframe.style.width = '100%';
            iframe.style.maxWidth = '100vw';
            
        } catch (e) {
            console.log('Не удалось настроить адаптивность виджета:', e);
        }
    }
}

// Упрощенный обработчик изменения размеров окна
function setupWidgetResizeHandler() {
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(function() {
            const currentWidth = window.innerWidth;
            const widthDiff = Math.abs(currentWidth - lastWidth);
            
            // Перезагружаем только при значительном изменении ширины (более 200px)
            // И только если виджет уже был инициализирован
            if (isInitialized && widthDiff > 200) {
                console.log('Перезагрузка виджета из-за изменения ширины:', widthDiff);
                initCenteredVKWidget();
            }
        }, 500); // Увеличиваем задержку до 500мс
    });
}

// Функция для фикса ширины (используется в других скриптах)
function fixVKWidgetWidth() {
    const iframes = document.querySelectorAll('iframe[src*="vk.com/widget_community"]');
    iframes.forEach(iframe => {
        const screenWidth = window.innerWidth;
        
        if (screenWidth < VK_CONFIG.viewportThreshold) {
            // Для мобильных устройств
            iframe.style.width = '100%';
            iframe.style.maxWidth = '100vw';
            iframe.style.height = 'auto';
            iframe.style.minHeight = '500px';
            
            // Пытаемся обновить src с параметрами для мобильных
            try {
                const url = new URL(iframe.src);
                url.searchParams.set('adaptive', '1');
                url.searchParams.set('width', Math.min(screenWidth - 20, VK_CONFIG.maxWidth));
                url.searchParams.set('height', '600');
                iframe.src = url.toString();
            } catch (e) {
                // Если не удалось обновить URL
            }
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadVKNewsAll();
    
    // Кнопка обновления (если есть)
    const refreshBtn = document.getElementById('refresh-news');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Обновление...';
            loadVKNewsAll();
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить новости';
            }, 1500);
        });
    }
    
    // Добавляем обработчик для изменения ориентации устройства
    window.addEventListener('orientationchange', function() {
        // Даем время на изменение ориентации
        setTimeout(() => {
            if (isInitialized) {
                initCenteredVKWidget();
            }
        }, 300);
    });
});