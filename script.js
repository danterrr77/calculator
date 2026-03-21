
        function updateDateTime() {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            const formattedDateTime = now.toLocaleDateString('ru-RU', options);
            document.getElementById('current-time').textContent = formattedDateTime;
            document.getElementById('current-time-footer').textContent = formattedDateTime;
        }


        setInterval(updateDateTime, 1000);
        updateDateTime();


        const numberWords = {
            'ноль': 0, 'нуль': 0,
            'один': 1, 'одна': 1, 'одно': 1, 'единица': 1,
            'два': 2, 'две': 2, 'двойка': 2,
            'три': 3, 'тройка': 3,
            'четыре': 4, 'четверка': 4,
            'пять': 5, 'пятерка': 5,
            'шесть': 6, 'шестерка': 6,
            'семь': 7, 'семерка': 7,
            'восемь': 8, 'восьмерка': 8,
            'девять': 9, 'девятка': 9,
            'десять': 10, 'десятка': 10,
            'одиннадцать': 11,
            'двенадцать': 12,
            'тринадцать': 13,
            'четырнадцать': 14,
            'пятнадцать': 15,
            'шестнадцать': 16,
            'семнадцать': 17,
            'восемнадцать': 18,
            'девятнадцать': 19,
            'двадцать': 20,
            'тридцать': 30,
            'сорок': 40,
            'пятьдесят': 50,
            'шестьдесят': 60,
            'семьдесят': 70,
            'восемьдесят': 80,
            'девяносто': 90,
            'сто': 100,
            'двести': 200,
            'триста': 300,
            'четыреста': 400,
            'пятьсот': 500,
            'шестьсот': 600,
            'семьсот': 700,
            'восемьсот': 800,
            'девятьсот': 900,
            'тысяча': 1000, 'тысячи': 1000,
            'миллион': 1000000
        };


        let calculationHistory = [];

 
        function textToNumber(text) {
            try {
                if (!text || typeof text !== 'string') {
                    throw new Error('Входные данные должны быть строкой');
                }
                
                const textLower = text.toLowerCase().trim();
                
                if (textLower === '') {
                    throw new Error('Введена пустая строка');
                }
                
              
                if (numberWords.hasOwnProperty(textLower)) {
                    return numberWords[textLower];
                }
                
              
                const words = textLower.split(/\s+/);
                let total = 0;
                let current = 0;
                
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    
                    if (!numberWords.hasOwnProperty(word)) {
                    
                        if (word.includes('-')) {
                            const hyphenWords = word.split('-');
                            let hyphenSum = 0;
                            let allValid = true;
                            
                            for (let hw of hyphenWords) {
                                if (numberWords.hasOwnProperty(hw)) {
                                    hyphenSum += numberWords[hw];
                                } else {
                                    allValid = false;
                                    break;
                                }
                            }
                            
                            if (allValid) {
                                current += hyphenSum;
                                continue;
                            }
                        }
                        
                        throw new Error(`Неподдерживаемое слово: "${word}"`);
                    }
                    
                    const value = numberWords[word];
                    
                    if (value >= 1000) {
                     
                        total += (current || 1) * value;
                        current = 0;
                    } else if (value >= 100) {
                       
                        current += value;
                    } else if (value >= 20) {
                     
                        current += value;
                    } else {
                     
                        current += value;
                    }
                }
                
                total += current;
                
                if (isNaN(total) || total === undefined) {
                    throw new Error('Не удалось преобразовать текст в число');
                }
                
                return total;
            } catch (error) {
                throw error;
            }
        }


        function performOperation(num1, num2, operation) {
            try {
   
                if (typeof num1 !== 'number' || typeof num2 !== 'number') {
                    throw new Error('Операнды должны быть числами');
                }
                
                if (isNaN(num1) || isNaN(num2)) {
                    throw new Error('Операнды не являются допустимыми числами');
                }
                

                switch(operation) {
                    case 'add':
                        return num1 + num2;
                    case 'subtract':
                        return num1 - num2;
                    case 'multiply':
                        return num1 * num2;
                    case 'divide':
                        if (num2 === 0) {
                            throw new Error('Деление на ноль невозможно');
                        }
                        return num1 / num2;
                    default:
                        throw new Error('Неизвестная операция');
                }
            } catch (error) {
                throw error;
            }
        }


        function formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }


        function displayError(message, isError = true) {
            const errorDisplay = document.getElementById('error-display');
            errorDisplay.textContent = message;
            
            if (isError) {
                errorDisplay.className = 'error-message';
            } else {
                errorDisplay.className = 'error-message no-error';
            }
        }


        function addToHistory(entry) {
            calculationHistory.unshift(entry);
            

            if (calculationHistory.length > 10) {
                calculationHistory = calculationHistory.slice(0, 10);
            }
            
            updateHistoryDisplay();
        }


        function updateHistoryDisplay() {
            const historyList = document.getElementById('history-list');
            historyList.innerHTML = '';
            
            if (calculationHistory.length === 0) {
                historyList.innerHTML = '<div class="history-item">История вычислений пуста</div>';
                return;
            }
            
            calculationHistory.forEach(entry => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const time = new Date(entry.timestamp).toLocaleTimeString('ru-RU');
                historyItem.innerHTML = `
                    <div><strong>${time}</strong></div>
                    <div>${entry.operation}</div>
                    <div>Результат: ${formatNumber(entry.result)}</div>
                `;
                
                historyList.appendChild(historyItem);
            });
        }


        function calculate() {
            try {

                const text1 = document.getElementById('number1').value.trim();
                const text2 = document.getElementById('number2').value.trim();
                

                if (!text1 || !text2) {
                    throw new Error('Оба поля должны быть заполнены');
                }
                

                const activeOperation = document.querySelector('.op-btn.active');
                if (!activeOperation) {
                    throw new Error('Не выбрана операция');
                }
                const operation = activeOperation.dataset.operation;
                

                const num1 = textToNumber(text1);
                const num2 = textToNumber(text2);
                

                document.getElementById('conversion1').textContent = `${text1} = ${formatNumber(num1)}`;
                document.getElementById('conversion2').textContent = `${text2} = ${formatNumber(num2)}`;
                

                const operationSymbols = {
                    'add': '+',
                    'subtract': '-',
                    'multiply': '×',
                    'divide': '÷'
                };
                document.getElementById('operation-display').textContent = operationSymbols[operation];
                

                const result = performOperation(num1, num2, operation);
                

                document.getElementById('result').textContent = formatNumber(result);
                

                displayError('Вычисления выполнены успешно!', false);
                

                const operationNames = {
                    'add': 'Сложение',
                    'subtract': 'Вычитание',
                    'multiply': 'Умножение',
                    'divide': 'Деление'
                };
                
                addToHistory({
                    timestamp: new Date(),
                    operation: `${formatNumber(num1)} ${operationSymbols[operation]} ${formatNumber(num2)}`,
                    result: result
                });
                
            } catch (error) {

                displayError(`Ошибка: ${error.message}`);
                

                document.getElementById('conversion1').textContent = '—';
                document.getElementById('conversion2').textContent = '—';
                document.getElementById('operation-display').textContent = '—';
                document.getElementById('result').textContent = '—';
            }
        }


        function clearForm() {
            document.getElementById('number1').value = '';
            document.getElementById('number2').value = '';
            document.getElementById('conversion1').textContent = '—';
            document.getElementById('conversion2').textContent = '—';
            document.getElementById('operation-display').textContent = '—';
            document.getElementById('result').textContent = '—';
            displayError('Нет ошибок. Введите данные для вычислений.');
            

            const firstOpBtn = document.querySelector('.op-btn');
            document.querySelectorAll('.op-btn').forEach(btn => btn.classList.remove('active'));
            firstOpBtn.classList.add('active');
        }


        document.addEventListener('DOMContentLoaded', function() {

            document.querySelectorAll('.op-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            

            document.getElementById('calculate-btn').addEventListener('click', calculate);
            

            document.getElementById('clear-btn').addEventListener('click', clearForm);
            

            document.getElementById('number1').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') calculate();
            });
            
            document.getElementById('number2').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') calculate();
            });
            

            updateHistoryDisplay();
            

            console.log('Примеры использования textToNumber:');
            console.log('textToNumber("сто двадцать пять") =', textToNumber('сто двадцать пять'));
            console.log('textToNumber("двадцать пять") =', textToNumber('двадцать пять'));
            console.log('textToNumber("тысяча") =', textToNumber('тысяча'));
        });