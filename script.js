const numbers = {
    'ноль': 0, 'один': 1, 'одна': 1, 'два': 2, 'две': 2, 'три': 3, 'четыре': 4,
    'пять': 5, 'шесть': 6, 'семь': 7, 'восемь': 8, 'девять': 9,
    'десять': 10, 'одиннадцать': 11, 'двенадцать': 12, 'тринадцать': 13,
    'четырнадцать': 14, 'пятнадцать': 15, 'шестнадцать': 16, 'семнадцать': 17,
    'восемнадцать': 18, 'девятнадцать': 19,
    'двадцать': 20, 'тридцать': 30, 'сорок': 40, 'пятьдесят': 50,
    'шестьдесят': 60, 'семьдесят': 70, 'восемьдесят': 80, 'девяносто': 90,
    'сто': 100, 'двести': 200, 'триста': 300, 'четыреста': 400,
    'пятьсот': 500, 'шестьсот': 600, 'семьсот': 700, 'восемьсот': 800, 'девятьсот': 900,
    'тысяча': 1000, 'тысячи': 1000, 'тысяч': 1000
};

const timeUnits = {
    'секунда': 1, 'секунды': 1, 'секунд': 1, 'с': 1,
    'минута': 60, 'минуты': 60, 'минут': 60, 'мин': 60, 'м': 60,
    'час': 3600, 'часа': 3600, 'часов': 3600, 'ч': 3600
};

let currentOperation = 'add';
let history = [];

const time1Input = document.getElementById('time1');
const time2Input = document.getElementById('time2');
const time1Result = document.getElementById('time1-result');
const time2Result = document.getElementById('time2-result');
const displayTime1Span = document.getElementById('display-time1');
const displayTime2Span = document.getElementById('display-time2');
const displayOperationSpan = document.getElementById('display-operation');
const resultSecondsSpan = document.getElementById('result-seconds');
const resultFormattedSpan = document.getElementById('result-formatted');
const errorDisplayDiv = document.getElementById('error-display');
const historyListDiv = document.getElementById('history-list');
const calculateBtn = document.getElementById('calculate-btn');
const clearBtn = document.getElementById('clear-btn');
const clearHistoryBtn = document.getElementById('clear-history');
const currentDateSpan = document.getElementById('current-date');
const currentTimeSpan = document.getElementById('current-time');
const currentSecondsSpan = document.getElementById('current-seconds');
const infoDateSpan = document.getElementById('info-date');
const infoTimeSpan = document.getElementById('info-time');

function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU');
    const timeStr = now.toLocaleTimeString('ru-RU');
    const seconds = now.getSeconds();
    
    currentDateSpan.textContent = dateStr;
    currentTimeSpan.textContent = timeStr;
    currentSecondsSpan.textContent = seconds + ' сек';
    infoDateSpan.textContent = dateStr;
    infoTimeSpan.textContent = timeStr;
}
updateDateTime();
setInterval(updateDateTime, 1000);

function timeTextToSeconds(text) {
    try {
        if (!text || text.trim() === '') {
            throw new Error('Поле пустое');
        }
        
        let cleanedText = text.toLowerCase().trim();
        
        // Специальные фразы
        if (cleanedText === 'полминуты') return 30;
        if (cleanedText === 'полчаса') return 1800;
        if (cleanedText === 'полторы минуты') return 90;
        if (cleanedText === 'полтора часа') return 5400;
        
        // Десятичный формат (2.5 часа)
        const decimalMatch = cleanedText.match(/^(\d+(?:\.\d+)?)\s*(час|часа|часов|ч|минута|минуты|минут|мин|секунда|секунды|секунд|с)$/);
        if (decimalMatch) {
            const value = parseFloat(decimalMatch[1]);
            const unit = decimalMatch[2];
            let multiplier = 1;
            if (unit === 'час' || unit === 'часа' || unit === 'часов' || unit === 'ч') multiplier = 3600;
            else if (unit === 'минута' || unit === 'минуты' || unit === 'минут' || unit === 'мин') multiplier = 60;
            const result = Math.round(value * multiplier);
            // Проверка на слишком большое время для десятичного формата
            if (result > 31536000) {
                throw new Error('Слишком большое время');
            }
            return result;
        }
        
        let totalSeconds = 0;
        let currentNumber = 0;
        let waitingForUnit = false;
        
        const words = cleanedText.split(/[\s-]+/);
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            
            if (numbers[word] !== undefined) {
                currentNumber = numbers[word];
                waitingForUnit = true;
            }
            else if (!isNaN(parseInt(word))) {
                currentNumber = parseInt(word);
                waitingForUnit = true;
            }
            else if (waitingForUnit && timeUnits[word] !== undefined) {
                totalSeconds += currentNumber * timeUnits[word];
                waitingForUnit = false;
            }
            else if (timeUnits[word] !== undefined && !waitingForUnit) {
                totalSeconds += timeUnits[word];
            }
        }
        
        if (totalSeconds === 0) {
            throw new Error('Не удалось распознать время');
        }
        
        // Проверка на слишком большое время
        if (totalSeconds > 31536000) {
            throw new Error('Слишком большое время (более 365 дней)');
        }
        
        return totalSeconds;
        
    } catch (error) {
        throw error;
    }
}

function textToNumber(text) {
    try {
        if (!text || text.trim() === '') {
            throw new Error('Пустое поле');
        }
        
        const cleanedText = text.toLowerCase().trim();
        
        if (!isNaN(parseFloat(cleanedText))) {
            const num = parseFloat(cleanedText);
            if (num > 999999) {
                throw new Error('Число превышает 999 999');
            }
            return num;
        }
        
        const words = cleanedText.split(/[\s-]+/);
        let total = 0;
        let current = 0;
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (numbers[word] === undefined) {
                throw new Error(`Неизвестное слово "${word}"`);
            }
            const value = numbers[word];
            if (value === 1000) {
                if (current === 0) current = 1;
                total += current * value;
                current = 0;
            } else if (value >= 100) {
                if (current === 0) current = 1;
                total += current * value;
                current = 0;
            } else {
                current += value;
            }
        }
        total += current;
        
        if (total > 999999) {
            throw new Error('Число превышает 999 999');
        }
        
        return total;
    } catch (error) {
        throw error;
    }
}

function formatSecondsToHMS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatSecondsToText(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours} ${getHourWord(hours)}`);
    if (minutes > 0) parts.push(`${minutes} ${getMinuteWord(minutes)}`);
    if (seconds > 0) parts.push(`${seconds} ${getSecondWord(seconds)}`);
    
    return parts.join(' ') || '0 секунд';
}

function getHourWord(hours) {
    const lastDigit = hours % 10;
    const lastTwo = hours % 100;
    if (lastTwo >= 11 && lastTwo <= 14) return 'часов';
    if (lastDigit === 1) return 'час';
    if (lastDigit >= 2 && lastDigit <= 4) return 'часа';
    return 'часов';
}

function getMinuteWord(minutes) {
    const lastDigit = minutes % 10;
    const lastTwo = minutes % 100;
    if (lastTwo >= 11 && lastTwo <= 14) return 'минут';
    if (lastDigit === 1) return 'минута';
    if (lastDigit >= 2 && lastDigit <= 4) return 'минуты';
    return 'минут';
}

function getSecondWord(seconds) {
    const lastDigit = seconds % 10;
    const lastTwo = seconds % 100;
    if (lastTwo >= 11 && lastTwo <= 14) return 'секунд';
    if (lastDigit === 1) return 'секунда';
    if (lastDigit >= 2 && lastDigit <= 4) return 'секунды';
    return 'секунд';
}

function performOperation(seconds1, value2, operation) {
    try {
        let resultSeconds;
        
        switch (operation) {
            case 'add':
                resultSeconds = seconds1 + value2;
                break;
            case 'subtract':
                resultSeconds = seconds1 - value2;
                if (resultSeconds < 0) {
                    throw new Error('Результат не может быть отрицательным');
                }
                break;
            case 'multiply':
                resultSeconds = seconds1 * value2;
                break;
            case 'divide':
                if (value2 === 0) {
                    throw new Error('Деление на ноль невозможно');
                }
                resultSeconds = seconds1 / value2;
                break;
            default:
                throw new Error('Неизвестная операция');
        }
        
        return Math.round(resultSeconds);
    } catch (error) {
        throw error;
    }
}

function calculate() {
    try {
        errorDisplayDiv.classList.remove('error');
        errorDisplayDiv.classList.add('no-error');
        
        const time1Text = time1Input.value;
        const time2Text = time2Input.value;
        
        if (!time1Text.trim()) {
            throw new Error('Введите первое время');
        }
        if (!time2Text.trim()) {
            throw new Error('Введите второе время или число');
        }
        
        let seconds1;
        try {
            seconds1 = timeTextToSeconds(time1Text);
            time1Result.innerHTML = `${seconds1} сек (${formatSecondsToText(seconds1)})`;
        } catch (e) {
            throw new Error(`Первое время: ${e.message}`);
        }
        
        let value2;
        let isTimeValue = false;
        let value2Display = '';
        
        try {
            value2 = timeTextToSeconds(time2Text);
            isTimeValue = true;
            value2Display = `${value2} сек (${formatSecondsToText(value2)})`;
            time2Result.innerHTML = value2Display;
        } catch (e) {
            try {
                value2 = textToNumber(time2Text);
                value2Display = `${value2} (число)`;
                time2Result.innerHTML = value2Display;
            } catch (e2) {
                throw new Error(`Второе значение: ${e.message}`);
            }
        }
        
        const operationSymbols = {
            add: '+', subtract: '-', multiply: '×', divide: '÷'
        };
        
        let resultSeconds = performOperation(seconds1, value2, currentOperation);
        
        displayTime1Span.innerHTML = `${formatSecondsToText(seconds1)} (${seconds1} сек)`;
        displayOperationSpan.innerHTML = `${operationSymbols[currentOperation]}`;
        displayTime2Span.innerHTML = isTimeValue ? `${formatSecondsToText(value2)} (${value2} сек)` : `${value2}`;
        
        resultSecondsSpan.innerHTML = `${resultSeconds} секунд`;
        resultFormattedSpan.innerHTML = formatSecondsToHMS(resultSeconds);
        
        errorDisplayDiv.innerHTML = `<i class="fas fa-check-circle"></i> Вычисление выполнено! Результат: ${formatSecondsToText(resultSeconds)}`;
        
        addToHistory(time1Text, time2Text, seconds1, value2, operationSymbols[currentOperation], resultSeconds, isTimeValue);
        
    } catch (error) {
        errorDisplayDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Ошибка: ${error.message}`;
        errorDisplayDiv.classList.add('error');
        errorDisplayDiv.classList.remove('no-error');
        
        resultSecondsSpan.innerHTML = '—';
        resultFormattedSpan.innerHTML = '—';
        
        addErrorToHistory(error.message);
    }
}

function addToHistory(text1, text2, sec1, val2, operation, result, isTime) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const val2Display = isTime ? formatSecondsToText(val2) : val2;
    const historyText = `"${text1}" ${operation} "${text2}" = ${formatSecondsToText(result)} (${result} сек)`;
    
    history.unshift({ text: historyText, time: timeStr, isError: false });
    
    if (history.length > 15) history.pop();
    updateHistoryDisplay();
}

function addErrorToHistory(errorMsg) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    history.unshift({ text: `❌ ${errorMsg}`, time: timeStr, isError: true });
    if (history.length > 15) history.pop();
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (history.length === 0) {
        historyListDiv.innerHTML = '<div class="history-item">История пуста</div>';
        return;
    }
    
    historyListDiv.innerHTML = history.map(item => `
        <div class="history-item" style="${item.isError ? 'border-left: 3px solid #c92a2a;' : ''}">
            ${item.text} <span style="float: right; color: #7E7665;">${item.time}</span>
        </div>
    `).join('');
}

function clearHistory() {
    history = [];
    updateHistoryDisplay();
    errorDisplayDiv.innerHTML = '<i class="fas fa-check-circle"></i> История очищена';
    errorDisplayDiv.classList.remove('error');
    setTimeout(() => {
        if (errorDisplayDiv.innerHTML.includes('История очищена')) {
            errorDisplayDiv.innerHTML = '<i class="fas fa-info-circle"></i> Система готова к работе';
        }
    }, 2000);
}

function clearForm() {
    time1Input.value = '';
    time2Input.value = '';
    time1Result.innerHTML = '—';
    time2Result.innerHTML = '—';
    displayTime1Span.innerHTML = '—';
    displayTime2Span.innerHTML = '—';
    displayOperationSpan.innerHTML = '—';
    resultSecondsSpan.innerHTML = '—';
    resultFormattedSpan.innerHTML = '—';
    errorDisplayDiv.innerHTML = '<i class="fas fa-info-circle"></i> Форма очищена';
    errorDisplayDiv.classList.remove('error');
}

function setupOperationButtons() {
    const buttons = document.querySelectorAll('.op-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentOperation = btn.dataset.operation;
            errorDisplayDiv.innerHTML = `<i class="fas fa-info-circle"></i> Выбрана операция: ${btn.textContent}`;
            errorDisplayDiv.classList.remove('error');
        });
    });
}

function init() {
    setupOperationButtons();
    calculateBtn.addEventListener('click', calculate);
    clearBtn.addEventListener('click', clearForm);
    clearHistoryBtn.addEventListener('click', clearHistory);
    errorDisplayDiv.innerHTML = '<i class="fas fa-info-circle"></i> Система готова к работе';
}

init();
