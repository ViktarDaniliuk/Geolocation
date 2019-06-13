/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    var promise = new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);

        xhr.responseType = 'json';

        xhr.onreadystatechange = function() {
            if (xhr.readyState ==4 && xhr.status == 200) {
                var towns = xhr.response;

                towns.sort(function(a, b) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                });

                resolve(towns);
            }
        };

        xhr.onerror = function() {
            var p = document.createElement
            reject(new Error('Не удалось загрузить города'));
        };

        xhr.send();
    })

    return promise;
}

loadTowns().then(function() {
    loadingBlock.style.display = 'none';
    filterBlock.style.display = 'block';
})

var d = [];

    loadTowns().then(function(towns) {
        for (var j = 0; j < towns.length; j++) {
            d.push(towns[j]);
        }
    });

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    var flag = false;

    full = full.toUpperCase();
    chunk = chunk.toUpperCase();

    if (~full.indexOf(chunk)) {
        return true;
    }

    return flag;
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

filterInput.addEventListener('keyup', function(e) {
    // это обработчик нажатия кливиш в текстовом поле
    var chunk = filterInput.value;

    filterResult.innerHTML = '';
    var p = document.createElement('p');

    for (let j = 0; j < d.length; j++) {
        if(isMatching(d[j].name, chunk) == true && chunk.length != 0) {
            var p = document.createElement('p');
            p.innerText = d[j].name;
            filterResult.appendChild(p);
        } else {
            continue;
        }
    }
});

export {
    loadTowns,
    isMatching
};
