/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
    var sec = seconds * 1000;
    var promis = new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve();
        }, sec);
    })

    return promis;
}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {
    var promise = new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);

        xhr.onload = function(){
            if (this.status == 200) {
//                console.log(JSON.parse(this.responseText));
                var towns = [];
                var townsObj = JSON.parse(this.response);
//                console.log(townsObj);
                for (var i = 0; i < townsObj.length; i++) {
                    towns.push(townsObj[i].name);
                }
                towns.sort();
//                console.log(towns);

                resolve(towns);
            }
        }

        xhr.send();
    })
    return promise;
}

let result = loadAndSortTowns();

            console.log(result.constructor.name, ' Promise');
            console.log(typeof result.then, ' function');
            console.log(typeof result.catch, ' function');


//loadAndSortTowns().then(towns => console.log(towns));

//export {
//    delayPromise,
//    loadAndSortTowns
//};
