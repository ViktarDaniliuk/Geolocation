ymaps.ready(init);

//var coords;

function init() {
    var myPlacemark,
        myMap = new ymaps.Map('map', {
            center: [52.237750, 21.018374],
            zoom: 17
        });

    // вешаем событие на клик по карте
    myMap.events.add('click', e => {
        // получаем координаты клика
        coords = e.get('coords');


//        // на клик по карте показываем popup
//        document.getElementById('map').addEventListener('click', showPopup);
        showPopup();

        // создаем placemark на координатах клика (это надо делать после нажатия кнопки "Добавить")
        myPlacemark = createPlacemark(coords);


        // добавляем placemark на карту!!!!!после нажатия на кнопку "Добавить"
//        myMap.geoObjects
//            .add(myPlacemark);

//        getAddress(coords);

//        getCoord(coords);

        // появление всплывающего окна
        // document.querySelector('#popup').classList.toggle('hidden');

    })

    // на клик по карте показываем popup
//    document.getElementById('map').addEventListener('click', showPopup);

    // на клик по крестике скрываем popup
    document.getElementById('close').addEventListener('click', closePopup);

    // на клик по кнопке "Добавить" сохраняем данные в localStorage
//    document.getElementById('submit').addEventListener('click', addStore);

    function getCoord(coords) { // не работает!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        return fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=<dcbcc347-ca94-452b-b918-d0dc3ce72247>&format=json&geocode=${coords}`)
            .then(response => response.json())
            .then(res => res)
        console.log(res);
    }


//    // создаем геообъект (эксперементальный блок)
//    var myGeoObject = new ymaps.GeoObject({
//        geometry: {
//            type: "Point",
//            coordinates: [52.237750, 21.018374] // координаты точки для которой создали placemark
//        },
//        properties: {
//            iconContent: 'Королевский замок',
//            hintContent: 'Реально классный замок'
//        }
//    }, {
//            // Иконка метки будет растягиваться под размер ее содержимого.
//            preset: 'islands#blackStretchyIcon',
//            draggable: true
//    });
//
//    // добавляем геообъект на карту
//    myMap.geoObjects
//        .add(myGeoObject);













    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');


//        myPlacemark = createPlacemark(coords);
//        myMap.geoObjects.add(myPlacemark);

        getAddress(coords);
    });

    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {}, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: false
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        var adr,
            coordss = coords;
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                    // Формируем строку с данными об объекте.
                    iconCaption: [
                        // Название населенного пункта или вышестоящее административно-территориальное образование.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: firstGeoObject.getAddressLine()
                });

            adr = firstGeoObject.getAddressLine();
            document.getElementById('adres').innerHTML = adr;

            document.getElementById('submit').addEventListener('click', function(e) {
                e.preventDefault();
                addStore(coordss);
                myPlacemark = createPlacemark(coords);
                myMap.geoObjects.add(myPlacemark);
                closePopup.call(this);
            });


        });
    }
}


// ----------------------------------------------------------------------
// создать форму и вставить в .container при первой инициализации (т.е. при первом запуске программы)
function createForm() {
    let form = document.createElement('form');
    let inputName = document.createElement('input');
    let inputPlace = document.createElement('input');
    let textArea = docuemnt.createElement('textarea');
    let submitButton = document.createEmeent('buttoon');
    let container = document.querySelector('.container');

    // настроить атрибуты всех полей ввода при помощи setAttribute

    // вставить все элементы в форму

    container.appendChild('form');
}
// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
function cleanForm() {
    // сделать функцию по очистке формы

    document.form.reset()
}
// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// собираем данные со всех полей формы (в т.ч. координаты), создаем объект и добавляем его в localStorage
function addStore(coordss) {
    let name = document.getElementById('name');
    let placeName = document.getElementById('place-name');
    let comment = document.getElementById('comment');
    let commentBlock = {};

    commentBlock.name = name.value;
    commentBlock.placeName = placeName.value;
    commentBlock.comment = comment.value;
    commentBlock.coords = coordss;

    localStorage.setItem('n', JSON.stringify(commentBlock));
    cleanForm();
}
// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// получаем данные с localStorage и добывляем их в блоки с комментариями
function getStore() {

}
// -----------------------------------------------------------------------

//// создаем Placemark
//function createPlacemark(coords) {
//    return new ymaps.Placemark(coords, {
//        iconCaption: 'поиск...'
//    }, {
//        preset: 'islands#violetDotIconWithCaption',
//        draggable: false
//    });
//}

// показываем popup
function showPopup() {
    var form = document.querySelector('.form-wrapper');

    form.classList.remove('hidden');

    document.getElementById('map').addEventListener('click', function(e) {
        var top = e.clientY;
        var left = e.clientX;
        var screenHeight = window.innerHeight;
        var screenWidth = window.innerWidth;

        // контролируем, что бы popup не выходило за пределы карты по высоте
        if (top < 205) {
            form.style.top = 5 + 'px';
        } else
        if (screenHeight - top < 325) {
            form.style.top = screenHeight - 535 + 'px';
        } else {
            form.style.top = top - 200 + 'px';
        }

        // контролируем, что бы popup не выходило за пределы карты по ширине
        if (left < 455) {
            form.style.left = left + 80 + 'px';
        } else {
            form.style.left = left - 450 + 'px';
        }
    })
}

// закрываем popup
function closePopup() {
    var comments = document.querySelector('.comments');

    if (this.id === 'close') {
        this.parentElement.parentElement.classList.add('hidden');
    } else
    if (this.id === 'submit') {
        this.parentElement.parentElement.parentElement.classList.add('hidden');
    }

    // чистим div с комментариями
    comments.innerHTML = '';
}

// получаем размер экрана
function setSizeMap() {
    var screenHeight = window.innerHeight;
    var container = document.querySelector('.container');

    container.style.height = screenHeight + 'px';
}

setSizeMap();

//// на клик по карте показываем popup
//document.getElementById('map').addEventListener('click', showPopup);
//
//// на клик по крестике скрываем popup
//document.getElementById('close').addEventListener('click', closePopup);
//
//// на клик по кнопке "Добавить" сохраняем данные в localStorage
//document.getElementById('submit').addEventListener('click', addStore);



// сделать свои попопы (всплывающие окна)
// сделать свои balloons (кружочки показвающие отзывы)
// от яндекса нужно взять плэйсмарк в типах геообъектов (объекты на карте)
// GeoObjectCollection
// геообъект - это объект на карте, который имеет какие-то свойства, по которому можно кликнуть и получить дополнительную информацию (которые можно создать при помощи placemark)
//
//
