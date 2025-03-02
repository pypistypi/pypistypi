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
    placeBombs(bombCount);
});

function placeBombs(count) {
    // Получаем все кнопки в сетке
    const buttons = document.querySelectorAll('.button');
    const totalButtons = buttons.length; // 25 кнопок (5x5)

    // Очищаем все кнопки (убираем классы bomb и safe)
    buttons.forEach(button => {
        button.classList.remove('bomb', 'safe');
    });

    // Генерируем случайные индексы для бомб
    const bombIndices = [];
    while (bombIndices.length < count) {
        const randomIndex = Math.floor(Math.random() * totalButtons);
        if (!bombIndices.includes(randomIndex)) {
            bombIndices.push(randomIndex);
        }
    }

    // Устанавливаем классы для всех ячеек
    buttons.forEach((button, index) => {
        if (bombIndices.includes(index)) {
            button.classList.add('bomb'); // Ячейка-ловушка
        } else {
            button.classList.add('safe'); // Безопасная ячейка
        }
    });

    // Отправляем данные в Telegram (опционально, для бота)
    Telegram.WebApp.sendData(`Bombs placed: ${bombCount}`);
}