'use strict';

// Основные элементы
const pageTransition = document.getElementById('pageTransition');
const navbar = document.querySelector('.navbar');
const menuToggle = document.getElementById('menuToggle');

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
    // Бургер-меню
    menuToggle.addEventListener('click', toggleMenu);

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
        // Для главной страницы используем replaceState
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

// Переключение меню
function toggleMenu() {
    navbar.classList.toggle('active');
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

    // Инициализация MailJS (замените YOUR_SERVICE_ID и YOUR_PUBLIC_KEY на реальные значения)
    emailjs.init('dygiCGuVF3FzXaPwf'); // Ваш Public Key из личного кабинета MailJS

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

    // Обработка отправки формы
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Проверка поддержки API
        if (typeof emailjs === 'undefined') {
            alert('Система отправки сообщений недоступна. Пожалуйста, используйте прямой email: standard_doc@list.ru');
            return;
        }

        // Показать окно отправки
        const sendingModal = document.getElementById('sendingModal');
        sendingModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        try {
            // Получить данные формы
            const message = document.getElementById('message').value;
            const userEmail = document.getElementById('email').value;

            if (!navigator.onLine) {
                throw new Error('Нет подключения к интернету');
            }

            const templateParams = {
                from_email: "standard_doc@list.ru",
                reply_to: userEmail,
                message: message
            };

            // Логирование для отладки
            console.log('Отправка письма с параметрами:', templateParams);

            // Отправка с таймаутом
            const response = await Promise.race([
                emailjs.send('service_85os374', 'template_7viyzz9', templateParams),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Таймаут отправки')), 35000)
                )
            ]);

            sendingModal.classList.remove('active');
            alert('Сообщение успешно отправлено!');
            contactForm.reset();
            closeModal();
        } catch (error) {
            sendingModal.classList.remove('active');
            console.error('Ошибка отправки:', error);

            let errorMessage = 'Не удалось отправить сообщение. ';

            if (error.message.includes('Таймаут')) {
                errorMessage += 'Сервер не ответил вовремя. ';
            } else if (error.message.includes('интернет')) {
                errorMessage += 'Нет подключения к интернету. ';
            }

            errorMessage += 'Попробуйте позже или напишите напрямую на standard_doc@list.ru';

            alert(errorMessage);
        }
    });
});

//  В яндекс метрике обработка кликов Скачать

document.querySelectorAll('.template-btn').forEach(button => {
    button.addEventListener('click', () => {
        if (typeof ym !== 'undefined') {
            ym(101296732, 'reachGoal', 'download_template'); // Замените ID!
        }
    });
});

//  Реализация скачивания шаблона

document.querySelectorAll('.template-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();

        // Получаем имя файла из атрибута data-file
        const fileName = this.getAttribute('data-file');
        const downloadUrl = `templates/${fileName}`;

        // Создаем временную ссылку для скачивания
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName// Указываем имя файла для сохранения
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
            // Переходим на страницу всех шаблонов с параметром поиска
            navigateTo(`all-templates.html?search=${encodeURIComponent(searchTerm)}`);
        } else {
            navigateTo('all-templates.html');
        }
    });
});

// Обработка поискового запроса при загрузке страницы
function handleSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');

    if (searchTerm) {
        const cards = document.querySelectorAll('.template-card');
        let found = false;

        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.border = '2px solid red';
                card.style.borderRadius = '8px';
                found = true;

                // Прокручиваем к найденной карточке
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        if (!found) {
            showNotFoundModal(searchTerm);
        }
    }
}

// Показ модального окна "Не найдено"
function showNotFoundModal(searchTerm) {
    const modal = document.createElement('div');
    modal.className = 'not-found-modal';
    modal.innerHTML = `
        <div class="not-found-content">
            <h3>Извините, по Вашему запросу ничего не найдено</h3>
            <p>По запросу "<strong>${searchTerm}</strong>" не удалось найти соответствующие шаблоны документов. Возможно, Вы допустили опечатку или используете слишком узкие критерии поиска.</p>
            <p>Все доступные шаблоны документов представлены на этой странице. Пожалуйста, просмотрите полный каталог — возможно, Вы найдёте подходящий вариант среди имеющихся.</p>
            <p>Если Вам требуется особый шаблон, которого нет на моем сайте, Вы можете обратиться ко мне через форму обратной связи (кнопка "Написать разработчику" внизу страницы). Я рассмотрю Ваш запрос и постараюсь помочь.</p>
            <button class="close-not-found">Понятно</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Активируем анимацию появления
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    // Функция плавного закрытия
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    };

    // Обработчики событий
    modal.querySelector('.close-not-found').addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.parentNode) {
            closeModal();
        }
    });
}

// Вызываем обработчик поиска при загрузке страницы
document.addEventListener('DOMContentLoaded', handleSearch);
