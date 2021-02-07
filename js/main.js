'use strict';

// Генерация случайного нечетного числа
function generateOddNumber(x, y) {
    let randInt;
    let minInt;
    let maxInt;
    // Проверка границ генерации
    if (x === y) {
        if (x%2 === 0) {
            console.log('В данном диапазоне нет нечетных чисел');
        }
        else {
            console.log(x);
        }
    }
    else {
        if (y < x) {
            minInt = y;
            maxInt = x;
        }
        else {
            minInt = x;
            maxInt = y;
        }
        let min = (minInt + 1) / 2;
        let max = (maxInt + 1) / 2;
        do {
            randInt = Math.floor(min + Math.random() * (max + 1 - min)) * 2 - 1;
        } while (randInt < minInt || randInt > maxInt);
        return randInt;
    }
}

console.log(generateOddNumber(1, 100));
console.log(generateOddNumber(0, -10));
console.log(generateOddNumber(-7, -3));
console.log(generateOddNumber(-100, 100));
console.log(generateOddNumber(-1, 1));


