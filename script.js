// Initialize Telegram Web App
Telegram.WebApp.ready();

let bombCount = 1; // Начальное значение — 1 (нечётное)

document.querySelector('.minus').addEventListener('click', () => {
    if (bombCount > 1) {
        bombCount -= 2;
        updateBombDisplay();
    }
});

document.querySelector('.plus').addEventListener('click', () => {
    if (bombCount < 7) {
        bombCount += 2;
        updateBombDisplay();
    }
});

function updateBombDisplay() {
    document.querySelector('.amount').textContent = `${bombCount} `;
}

// Обработчик нажатия на кнопку "Получить сигнал"
document.querySelector('.signal-button').addEventListener('click', () => {
    const signalButton = document.querySelector('.signal-button');
    // Меняем текст кнопки на "Получение информации..."
    signalButton.textContent = "Получение информации...";
    signalButton.disabled = true; // Отключаем кнопку во время задержки

    // Случайная задержка от 0.1 до 2 секунд (100–2000 мс)
    const delay = Math.random() * 1900 + 100; // От 100 до 2000 мс
    setTimeout(() => {
        placeSafeCells(bombCount);
    }, delay);
});

function placeSafeCells(count) {
    // Получаем все кнопки в сетке
    const buttons = Array.from(document.querySelectorAll('.button'));
    const totalButtons = buttons.length; // 25 кнопок (5x5)

    // Очищаем все кнопки (убираем классы bomb и safe)
    buttons.forEach(button => {
        button.classList.remove('bomb', 'safe');
    });

    // Определяем количество открываемых безопасных ячеек в зависимости от выбранного числа
    const safeCellsToOpen = getSafeCellsToOpen(count);

    // Все ячейки считаются безопасными, выбираем случайные индексы для открытия
    const safeIndices = buttons.map((_, index) => index);
    const safeCellsToShow = [];
    while (safeCellsToShow.length < safeCellsToOpen && safeIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * safeIndices.length);
        safeCellsToShow.push(safeIndices.splice(randomIndex, 1)[0]);
    }

    // Открываем безопасные ячейки по очереди с задержкой 0.2с
    safeCellsToShow.forEach((index, i) => {
        setTimeout(() => {
            buttons[index].classList.add('safe');
            // Если это последняя ячейка, возвращаем текст кнопки
            if (i === safeCellsToShow.length - 1) {
                const signalButton = document.querySelector('.signal-button');
                signalButton.textContent = "Получить сигнал";
                signalButton.disabled = false;
            }
        }, i * 200); // Задержка 200 мс между открытиями
    });

    // Отправляем данные в Telegram (опционально, для бота)
    Telegram.WebApp.sendData(`Safe cells shown: ${safeCellsToShow.length}`);
}

// Функция для определения количества открываемых безопасных ячеек
function getSafeCellsToOpen(bombCount) {
    switch (bombCount) {
        case 1:
            return 10;
        case 3:
            return 5;
        case 5:
            return 4;
        case 7:
            return 3;
        default:
            return 0; // На случай ошибки
    }
}