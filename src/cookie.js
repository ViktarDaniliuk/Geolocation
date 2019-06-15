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

filterNameInput.addEventListener('keyup', function() {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    var chunk = filterNameInput.value;

//    filterResult.innerHTML = '';

    for (let i = 0; i < cookies.length; i++) {
        if (isMatching(cookies[i].name, chunk) == true && chunk.length != 0) {
//            var p = document.createElement('p');
//
//            p.innerText = cookies[i].name;
//            filterResult.appendChild(p);
        } else {
            continue;
        }
    }
});

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
//        console.log(tableRow);
        tableRow.appendChild(button);
        listTableFrag.append(tableRow);
    }

    return listTableFrag;
}

// получаем и сортируем все cookies на странице и формируем из них массив объектов {name: name, value: value }
function getCookies() {
    var cookiesStr = document.cookie;
    var cookiesArrHelper = cookiesStr.split('; ');
    var cookiesArr = [];

    for (var i = 0; i < cookiesArrHelper.length; i++) {
		var name = cookiesArrHelper[i].split('=')[0];
		var value = cookiesArrHelper[i].split('=')[1];

        cookiesArr.push({name: name, value: value});
    }

    cookiesArr.sort(function(a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
    });

    return cookiesArr;
}

var cookies = getCookies();
var fillTableFrag;

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    var name = addNameInput.value;
    var value = addValueInput.value;
    console.log(name);
    for (let i = 0; i < cookies.length; i++) {
        if (name == cookies[i].name) {
            cookies[i].value = value;
            console.log(cookies[i].value);
        } else {
            document.cookie = `${addNameInput.value}=${addValueInput.value}`;
        }
    }
    console.log(cookies);
    fillTableFrag = fillTable(cookies);
    listTable.append(fillTableFrag)
    addNameInput.value = '';
    addValueInput.value = '';
});

document.body.addEventListener('click', function(e){
    var removeName;

    if (e.target.className == 'removeButton') {
        removeName = e.target.parentElement.firstElementChild.textContent;
        console.log(removeName);
        for (let i = 0; i < cookies.length; i++) {
            console.log(cookies[i].name);
            console.log(cookies[i].name == removeName);
            console.log(i)
            if (cookies[i].name == removeName) {
                cookies.splice(i, 1);
                console.log(cookies);
            } else {
                continue;
            }
        }

    fillTableFrag = fillTable(cookies);
    console.log(fillTableFrag);
    listTable.append(fillTableFrag);
    }
})
