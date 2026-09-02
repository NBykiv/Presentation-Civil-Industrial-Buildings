// ===== ЗМІННІ ===== 
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// ===== ІНІЦІАЛІЗАЦІЯ =====
document.addEventListener('DOMContentLoaded', function() {
    initializePresentation();
    updateSlideDisplay();
    createSlideIndicators();
});

// ===== ІНІЦІАЛІЗАЦІЯ ПРЕЗЕНТАЦІЇ =====
function initializePresentation() {
    // Показуємо перший слайд
    slides[0].classList.add('active');
    
    // Додаємо обробники клавіш
    document.addEventListener('keydown', handleKeyPress);
    
    // Додаємо обробники для сенсорного екрану
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.querySelector('.presentation').addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.querySelector('.presentation').addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            changeSlide(1); // Свайп вліво - наступний слайд
        } else if (touchEndX > touchStartX + 50) {
            changeSlide(-1); // Свайп вправо - попередній слайд
        }
    }
}

// ===== ОБРОБНИК КЛАВІШ =====
function handleKeyPress(event) {
    switch(event.key) {
        case 'ArrowRight':
        case ' ':
            changeSlide(1);
            break;
        case 'ArrowLeft':
            changeSlide(-1);
            break;
        case 'Home':
            goToSlide(0);
            break;
        case 'End':
            goToSlide(totalSlides - 1);
            break;
    }
}

// ===== ЗМІНА СЛАЙДА =====
function changeSlide(direction) {
    let newSlide = currentSlide + direction;
    
    // Циклічна навігація
    if (newSlide >= totalSlides) {
        newSlide = 0;
    } else if (newSlide < 0) {
        newSlide = totalSlides - 1;
    }
    
    goToSlide(newSlide);
}

// ===== ПЕРЕХІД НА КОНКРЕТНИЙ СЛАЙД =====
function goToSlide(slideIndex) {
    // Видаляємо активний клас з поточного слайда
    slides[currentSlide].classList.remove('active');
    
    // Встановлюємо новий слайд
    currentSlide = slideIndex;
    slides[currentSlide].classList.add('active');
    
    // Оновлюємо відображення
    updateSlideDisplay();
}

// ===== ОНОВЛЕННЯ ВІДОБРАЖЕННЯ =====
function updateSlideDisplay() {
    // Оновлюємо лічильник слайдів
    const slideCounter = document.getElementById('slideCounter');
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    
    // Оновлюємо індикатори
    updateSlideIndicators();
    
    // Оновлюємо стан кнопок
    updateButtonStates();
}

// ===== ОНОВЛЕННЯ СТАНУ КНОПОК =====
function updateButtonStates() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Для циклічної навігації кнопки завжди активні
    prevBtn.disabled = false;
    nextBtn.disabled = false;
}

// ===== СТВОРЕННЯ ІНДИКАТОРІВ СЛАЙДІВ =====
function createSlideIndicators() {
    const indicatorsContainer = document.getElementById('indicators');
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'slide-dot';
        if (i === 0) {
            dot.classList.add('active');
        }
        
        dot.addEventListener('click', function() {
            goToSlide(i);
        });
        
        indicatorsContainer.appendChild(dot);
    }
}

// ===== ОНОВЛЕННЯ ІНДИКАТОРІВ =====
function updateSlideIndicators() {
    const dots = document.querySelectorAll('.slide-dot');
    
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// ===== ЯРЛИКИ КЛАВІАТУРИ =====
// Спеціальні функції для попередження екрана
window.addEventListener('keydown', function(e) {
    // Запобігаємо скролюванню при натисканні на стрілки
    if (['ArrowRight', 'ArrowLeft', ' '].includes(e.key)) {
        e.preventDefault();
    }
});

// ===== ІНФОРМАЦІЯ ДЛЯ КОРИСТУВАЧА =====
console.log(`
╔═════════���══════════════════════════════════════════╗
║   Презентація "Цивільні і промислові будівлі"     ║
╠════════════════════════════════════════════════════╣
║ Всього слайдів: ${totalSlides}                                 ║
║                                                    ║
║ Навігація:                                        ║
║ • Натисніть стрілку → або пробіл → наступний      ║
║ • Натисніть стрілку ← → попередній                ║
║ • Home → перший слайд                             ║
║ • End → останній слайд                            ║
║ • Натисніть на точку → перейти на слайд           ║
║ • Свайп на мобілі                                 ║
╚════════════════════════════════════════════════════╝
`);

// ===== АВТОСОХРАНЕННЯ ПРОГРЕСУ (LOCAL STORAGE) =====
function saveProgress() {
    localStorage.setItem('currentSlide', currentSlide);
    localStorage.setItem('lastVisited', new Date().toISOString());
}

function loadProgress() {
    const saved = localStorage.getItem('currentSlide');
    if (saved !== null) {
        const slideIndex = parseInt(saved);
        if (slideIndex < totalSlides) {
            goToSlide(slideIndex);
        }
    }
}

// Зберігаємо прогрес перед закриттям
window.addEventListener('beforeunload', saveProgress);

// Опціонально: завантажуємо прогрес при завантаженні
// loadProgress(); // Розкоментуйте, якщо хочете відновити посилення