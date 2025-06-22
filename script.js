'use strict';

// Основные элементы
const pageTransition = document.getElementById('pageTransition');
const navbar = document.querySelector('.navbar');

// Состояние приложения
let isTransitioning = false;

// Карта соответствия категорий и страниц
const categoryPages = {
    'Резюме': 'resume-templates.html',
    'Стандарты организации': 'org-standards.html',
    'Текстовые конструкторские документы': 'construction-docs.html',
    'Должностные инструкции': 'job-descriptions.html',
    'Положения об отделе': 'department-regulations.html'
};

// Инициализация приложения
function initApp() {
    setupEventListeners();
    showContent();
}

// Настройка всех обработчиков событий
function setupEventListeners() {
    // Навигационные ссылки
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });

    // Карточки категорий
    document.querySelectorAll('.category-card').forEach(card => {
        setupCardHoverEffects(card);
        card.addEventListener('click', handleCategoryClick);
    });

    // Обработка истории браузера
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pageshow', handlePageShow);
}

// Показать контент с анимацией
function showContent() {
    document.querySelector('.main-content').style.opacity = '1';
}

// Анимация перехода между страницами
function startPageTransition() {
    if (isTransitioning) return;
    isTransitioning = true;
    pageTransition.classList.add('active');
}

function endPageTransition() {
    pageTransition.classList.remove('active');
    isTransitioning = false;
}

// Обработка кликов по навигации
function handleNavLinkClick(e) {
    e.preventDefault();
    const targetPage = this.getAttribute('data-page');
    navigateTo(targetPage);
}

// Обработка кликов по категориям
function handleCategoryClick(e) {
    e.preventDefault();
    const categoryName = this.querySelector('h3').textContent.trim();
    const targetPage = categoryPages[categoryName];

    if (targetPage) {
        navigateTo(targetPage);
    }
}

// Навигация с анимацией
function navigateTo(url) {
    startPageTransition();

    setTimeout(() => {
        if (url === 'index.html') {
            history.replaceState(null, '', url);
        } else {
            history.pushState(null, '', url);
        }

        window.location.href = url;
    }, 500);
}

// Обработка кнопок Назад/Вперед
function handlePopState() {
    startPageTransition();
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

// Обработка загрузки из кэша (при Назад)
function handlePageShow(event) {
    if (event.persisted) {
        startPageTransition();
        setTimeout(endPageTransition, 500);
    }
}

// Эффекты при наведении на карточки
function setupCardHoverEffects(card) {
    card.style.cursor = 'pointer';

    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
}

// Запуск приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', initApp);

// Плавное появление контента при полной загрузке
window.addEventListener('load', showContent);

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('developerModal');
    const contactLink = document.getElementById('contactDeveloper');
    const closeBtn = document.querySelector('.close-modal');
    const contactForm = document.getElementById('contactForm');

    // Открытие модального окна
    contactLink.addEventListener('click', function (e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Закрытие модального окна
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });

    // Обработка отправки формы в Telegram
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const sendingModal = document.getElementById('sendingModal');
        sendingModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        try {
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Проверка заполнения полей
            if (!email || !message) {
                throw new Error('Пожалуйста, проверьте правильность введенного email и заполнение окна сообщения');
            }

            // Настройки Telegram бота
            const botToken = '7838519001:AAHiffzIPsbTG0f28Xo6i9c3eB83uJvhAAY';
            const chatId = '966757737';

            // Форматирование сообщения
            const telegramText = `📩 Новое сообщение с сайта\n\n` +
                `✉️ Email: ${email}\n` +
                `📝 Сообщение:\n${message}`;

            // 1. Сначала отправляем простое сообщение без кнопки
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: telegramText
                })
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Telegram API Error:', result);
                throw new Error('Ошибка при отправке сообщения');
            }

            // Успешная отправка
            alert('✅ Сообщение успешно отправлено!');
            contactForm.reset();
            closeModal();
        } catch (error) {
            console.error('Ошибка:', error);

            // Резервный вариант через почту
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const mailtoLink = `mailto:standard_doc@list.ru?subject=Сообщение с сайта&body=Email: ${encodeURIComponent(email)}%0D%0AСообщение: ${encodeURIComponent(message)}`;

            alert(`❌ ${error.message}\nПеренаправляю на почтовый клиент...`);
            window.location.href = mailtoLink;
        } finally {
            sendingModal.classList.remove('active');
        }
    });
});

// Обработка скачивания шаблонов
document.querySelectorAll('.template-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();

        // Получаем имя файла
        const fileName = this.getAttribute('data-file');
        const downloadUrl = `templates/${fileName}`;

        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Отправка события в Яндекс.Метрику
        if (typeof ym !== 'undefined') {
            ym(101296732, 'reachGoal', 'download_template');
        }
    });
});

// Установка текущего года в футере
document.addEventListener('DOMContentLoaded', function () {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Реализация поиска
document.querySelectorAll('.search-form').forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const searchInput = this.querySelector('.search-input');
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm) {
            navigateTo(`all-templates.html?search=${encodeURIComponent(searchTerm)}`);
        } else {
            navigateTo('all-templates.html');
        }
    });
});

// Обработка поискового запроса
function handleSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');

    if (searchTerm) {
        const cards = document.querySelectorAll('.template-card');
        let found = false;

        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.border = '2px solid red';
                card.style.borderRadius = '8px';
                found = true;
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        if (!found) {
            showNotFoundModal(searchTerm);
        }
    }
}

// Модальное окно "Не найдено"
function showNotFoundModal(searchTerm) {
    const modal = document.createElement('div');
    modal.className = 'not-found-modal';
    modal.innerHTML = `
        <div class="not-found-content">
            <h3>Извините, по Вашему запросу ничего не найдено</h3>
            <p>По запросу "<strong>${searchTerm}</strong>" не удалось найти соответствующие шаблоны документов. Возможно, Вы допустили опечатку или используете слишком узкие критерии поиска.
            </p>
            <p>Все доступные шаблоны документов представлены на этой странице. Пожалуйста, просмотрите полный каталог — возможно, Вы найдёте подходящий вариант среди имеющихся.</p>
            <p>Если Вам требуется особый шаблон, которого нет на моем сайте, Вы можете обратиться ко мне через форму обратной связи (кнопка "Написать разработчику" внизу страницы). Я рассмотрю Ваш запрос и постараюсь помочь.</p>
            <button class="close-not-found">Понятно</button>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => modal.classList.add('active'), 10);

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.close-not-found').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => e.target === modal && closeModal());
    document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());
}

// Инициализация поиска
document.addEventListener('DOMContentLoaded', handleSearch);