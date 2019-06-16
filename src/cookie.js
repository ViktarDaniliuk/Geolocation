/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

var chunk;

getCookies();

filterNameInput.addEventListener('keyup', function(e) {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    chunk = filterNameInput.value;

    if (e) {
        getCookies(chunk);
    }
});

// фильтрация всего массива с cookies
function arrFilter(arr) {
    var filteredArr = [];

    for (let i = 0; i < arr.length; i++) {
        if (isMatching(arr[i].name, chunk) == true || isMatching(arr[i].value, chunk) == true) {
            filteredArr.push(arr[i]);
        } else {
            continue;
        }
    }

    fillTable(filteredArr);

    return filteredArr;
}

// поиск по имени cookie
function isMatching(full, chunk) {
    var flag = false;

    full = full.toUpperCase();
    chunk = chunk.toUpperCase();

    if (~full.indexOf(chunk)) {
        return true;
    }

    return flag;
}

// строим таблицу из массива с cookies
function fillTable(cookies) {
    var listTableFrag = document.createDocumentFragment();

    if (!cookies) {
        listTable.innerHTML = '';

        return;
    }

    for (let i = 0; i < cookies.length; i++) {
        var tableRow = document.createElement('tr');
        var firstCell = document.createElement('th');
        var secondCell = document.createElement('th');
        var button = document.createElement('button');
        var name = cookies[i].name;
        var value = cookies[i].value;

        button.className = 'removeButton';
        button.innerText = 'Удалить';
        firstCell.innerText = name;
        tableRow.append(firstCell);
        secondCell.innerText = value;
        tableRow.append(secondCell);
        tableRow.appendChild(button);
        listTableFrag.append(tableRow);
    }

    listTable.innerHTML = '';
    listTable.append(listTableFrag);
}

// получаем и сортируем все cookies на странице и формируем из них массив объектов {name: name, value: value }
function getCookies() {
    var cookiesStr = document.cookie;
    var cookiesArrHelper = cookiesStr.split('; ');
    var cookiesArr = [];

    for (var i = 0; i < cookiesArrHelper.length; i++) {
        var name = cookiesArrHelper[i].split('=')[0];
        var value = cookiesArrHelper[i].split('=')[1];

        if (value === '' || name === '') {
            break;
        }

        cookiesArr.push({ name: name, value: value });
    }

    cookiesArr.sort(function(a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
    });

    if (filterNameInput.value) {
        arrFilter(cookiesArr);
    } else {
        fillTable(cookiesArr);
    }

    return cookiesArr;
}

// добавляем новый cookie
function setCookie(name, value, options) {
    options = options || {};
    var expires = options.expires;

    if (typeof expires == 'number' && expires) {
        var d = new Date();

        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    var updatedCookie = name + '=' + value;

    for (var propName in options) {
        updatedCookie += '; ' + propName;
        var propValue = options[propName];

        if (propValue !== true) {
            updatedCookie += '=' + propValue;
        }
    }

    document.cookie = updatedCookie;
}

// удаляем cookie
function deleteCookie(name) {
    setCookie(name, '', {
        expires: -1
    })
}

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    var name = addNameInput.value;
    var value = addValueInput.value;

    if (value === '' || name === '') {
        return;
    }

    setCookie(name, value);
    getCookies();
});

document.body.addEventListener('click', function(e) {
    var removeName;

    if (e.target.className == 'removeButton') {
        removeName = e.target.parentElement.firstElementChild.textContent;

        deleteCookie(removeName);
        getCookies();
    }
})
