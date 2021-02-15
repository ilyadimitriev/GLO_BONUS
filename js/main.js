'use strict';

const ul = document.querySelector('ul');
const h1 = document.querySelector('h1');

function isText(str) {
    return (/[\p{S}\p{P}\d]/gu.test(str)) ? false : true;
}

let usersData = [];

let dateObj = {
    date: {},
    hourValue: 0,
    minValue: 0,
    secValue: 0,
    allMonths: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    getDate: function(){
        dateObj.date = new Date();
        dateObj.hourValue = dateObj.date.getHours();
        dateObj.minValue = dateObj.date.getMinutes();
        dateObj.secValue = dateObj.date.getSeconds();
        // Добавляем ноль перед числом при необходимости
        function addZero(num){
            return (num >= 0 && num <=9) ? '0' + num : num;
        }
        return dateObj.date.getDate() + ' ' + dateObj.allMonths[dateObj.date.getMonth()] + ' ' + dateObj.date.getFullYear() + 'г., ' + addZero(dateObj.hourValue) + ':' + addZero(dateObj.minValue) + ':' + addZero(dateObj.secValue);
    }
};

const render = function(prevData){
    ul.textContent = '';

    usersData.forEach(function(user){
        const li = document.createElement('li');
        const text = 'Имя: ' + user.firstName + ', фамилия: ' + user.lastName + ', зарегистрирован: ' + user.regDate;
        li.innerHTML = '<span>' + text + '</span>' +
        '<button class="delete-btn">Х</button>';
        ul.append(li);

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function(){
            const prevData = usersData.slice();
            usersData.splice(usersData.indexOf(user), 1);
            render(prevData);
        });
    });

    if (usersData.length === 0) {
        localStorage.removeItem('data');
        return;
    }
    if (prevData !== usersData) {
        localStorage.setItem('data', JSON.stringify(usersData));
    }
};

const sayHello = function(){
    let login;
    do {
        login = prompt('Введите логин:');
        if (login === null) {
            alert('Авторизация отменена');
            return;
        }
        if (login === '') {
            alert('Логин не может быть пустым!');
        }
    } while (login === '');
    login = login.trim();

    let password;
    do {
        password = prompt('Введите пароль:');
        if (password === null) {
            alert('Авторизация отменена');
            return;
        }
        if (password === '') {
            alert('Пароль не может быть пустым!');
        }
    } while (password === '');
    password = password.trim();

    let firstName;
    let sucsess = usersData.some(function(user){
        // Проверяем логин
        const loginCheck = (login === user.login) ? true : false;
        // Проверяем пароль
        const passwordCheck = (password === user.password) ? true : false;
        if (loginCheck && passwordCheck) {
            firstName = user.firstName;
            // Отмечаем, что данные совпадают
            return true;
        }
    });
    if (sucsess) {
        h1.textContent = 'Привет, ' + firstName;
    }
    else {
        alert('Пользователь не найден');
    }
};

const regUser = function(){
    let fullName = prompt('Введите через пробел свои Имя и Фамилию:');
    if (fullName === null) {
        alert('Регистрация отменена');
        return;
    }
    fullName = fullName.split(' ');
    if (fullName.length !== 2 || !isText(fullName[0]) || !isText(fullName[1]) || fullName[0] === '' || fullName[1] === '') {
        alert('Данные введены не правильно!');
        regUser();
    }
    else {
        let newUser = {};
        fullName = fullName.map(function(word){
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        newUser.firstName = fullName[0];
        newUser.lastName = fullName[1];
        let login;
        do {
            login = prompt('Введите логин:');
            if (login === null) {
                alert('Регистрация отменена');
                return;
            }
            if (login === '') {
                alert('Логин не может быть пустым!');
            }
        } while (login === '');
        newUser.login = login.trim();
        let password;
        do {
            password = prompt('Введите пароль:');
            if (password === null) {
                alert('Регистрация отменена');
                return;
            }
            if (password === '') {
                alert('Пароль не может быть пустым!');
            }
        } while (password === '');
        newUser.password = password.trim();
        const regDate = dateObj.getDate();
        newUser.regDate = regDate;

        const prevData = usersData.slice();

        usersData.push(newUser);
        render(prevData);
    }
    
};

document.querySelector('.registration-btn').addEventListener('click',function(){regUser();});
document.querySelector('.authorization-btn').addEventListener('click',function(){sayHello();});

if (localStorage.getItem('data') !== null) {
    usersData = JSON.parse(localStorage.getItem('data'));
    render(usersData);
}