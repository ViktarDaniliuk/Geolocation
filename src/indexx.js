//ymaps.ready(init);

function init() {
    let myPlacemark;
    let coords;
    let myMap = new ymaps.Map('map', {
            center: [52.237750, 21.018374],
            zoom: 17,
            controls: []
        });
    let customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
        '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
            '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
            '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    );
    let clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 300,
        clusterBalloonContentLayoutHeight: 150,
        clusterBalloonPagerSize: 5,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
        placemarkOpenBalloonOnClick: false
    });
    let getPointData = function (i, key, placeName, comment) {
        console.log('getPointData');
            return {
//                balloonContentHeader: '<font size=3><b><a target="_blank" href="https://yandex.ru">Здесь может быть ваша ссылка</a></b></font>',
                balloonContentBody: '<div style="height: 130px"><p style="line-height: 28px"><strong>' + placeName + '</strong></p><p><a href="#">' + key + '</a></p><p style="line-height: 28px">' + comment + '</p></div>',
                balloonContentFooter: '<p style="text-align: right; font-size: 12px">Здесь будет дата</p>'
            };
        };
    let getPointOptions = function () {
        console.log('getPointOptions');
            return {
                preset: 'islands#violetDotIconWithCaption',
                draggable: false,
                hasBalloon: false
            };
        };
//    let points = [];
//    let geoObjects = [];
    let objPlacemarks = localStorage;

//    for (let key in objPlacemarks) {
//        if (JSON.parse(localStorage.getItem(key)) !== null) {
//            coords = JSON.parse(localStorage.getItem(key)).coords;
//            points.push(coords);
//        }
//    }

//    for(var i = 0, len = points.length; i < len; i++) {
//        geoObjects[i] = new ymaps.Placemark(points[i], getPointData(i), getPointOptions());
//    }

    clusterer.options.set({
        gridSize: 80,
        clusterDisableClickZoom: true
    });

//    clusterer.add(geoObjects);
//    myMap.geoObjects.add(clusterer);

//    myMap.setBounds(clusterer.getBounds(), {
//        checkZoomRange: true
//    });



















//    let balloon = new ymaps.Balloon(myMap);



//    clusterer.add(myPlacemark);
//    myMap.geoObjects.add(clusterer);

    // вешаем событие на клик по карте
    myMap.events.add('click', e => {
        let coords;

        // получаем координаты клика
        coords = e.get('coords');
        // на клик по карте показываем popup
        showPopup();
        // полчаем адрес и добавляем его в popup
        getAddress(coords);

        createP();
    });

//    clusterer.events.add('click', function(e) {
//
//    })

    const submitBtn = document.getElementById('submit');
    const geocode = (address) => ymaps.geocode(coords).then(function (res) {
        let comment;
        let adr;
        let firstGeoObject = res.geoObjects.get(0);
        let comments = document.querySelector('.comments');
        console.log('geocode');
        adr = firstGeoObject.getAddressLine();

        if (adr !== address) {
            comments.innerHTML = '';
            comment = localStorage.getItem(adr);
            createComment(comment);
        }
    });
    const handlePlaceMarkClick = e => {
        let address = document.getElementById('address').textContent;
        console.log('handlePlaceMarkClick');
        coords = e.get('coords');
        geocode();
        geocode(address);
        getAddress(coords);
    };
    const handleSubmit = e => {
        e.preventDefault();
        console.log('handleSubmit');
        if (isFormCompleted()) {
            addStore(coords);
            myPlacemark = createPlacemark(coords);
            myPlacemark.events.add('click', handlePlaceMarkClick);
            myMap.geoObjects.add(myPlacemark);
            clusterer.add(myPlacemark);
            myMap.geoObjects.add(clusterer);
            closePopup();
        }
    };

    let i = 0;

    for (let key in objPlacemarks) {
        let coords;
        let placeName;
        let comment;
        i++;
        if (JSON.parse(localStorage.getItem(key)) !== null) {
            coords = JSON.parse(localStorage.getItem(key)).coords;
            placeName = JSON.parse(localStorage.getItem(key)).placeName;
            comment = JSON.parse(localStorage.getItem(key)).comment;
            myPlacemark = createPlacemark(coords, getPointData(i, key, placeName, comment), getPointOptions());
            myPlacemark.events.add('click', handlePlaceMarkClick);
            myMap.geoObjects.add(myPlacemark);
//            clusterer.add(myPlacemark);
        }
    };

//    myMap.geoObjects.add(clusterer);
//
//    myMap.setBounds(clusterer.getBounds(), {
//        checkZoomRange: true
//    });







//    console.log(clusterer.getObjectState(myPlacemark));

//    if (clusterer.getObjectState(myPlacemark).isShown) {
//        myPlacemark.balloon.close();
//    }

    // наносим существующие маркеры на карту при первом старте
//    function createAllPlacemark(myMap) {
////        let objPlacemarks = localStorage;
//        let coords;
//        console.log('createAllPlacemark');
//        for (let key in objPlacemarks) {
//            if (JSON.parse(localStorage.getItem(key)) !== null) {
//                coords = JSON.parse(localStorage.getItem(key)).coords;
////                console.log(coords);
////                console.log(key);
//                myPlacemark = createPlacemark(coords, getPointData(), getPointOptions());
//                myPlacemark.events.add('click', handlePlaceMarkClick);
//                myMap.geoObjects.add(myPlacemark);
//                clusterer.add(myPlacemark);
//            }
//        }
//        myMap.geoObjects.add(clusterer);
//    }
//
//    createAllPlacemark(myMap);

    // при нажатии на кнопку "Добавить" проверяем заполнены ли все поля, добавляем placemark на карту, собираем данные с формы,добавляем в localStorage и закрываем окно
    submitBtn.addEventListener('click', handleSubmit);

    document.getElementById('map').addEventListener('click', positioningPopup);
}

ymaps.ready(init);

// на клик по крестику скрываем popup
    document.getElementById('close').addEventListener('click', closePopup);

// получаем адрес по координатам и добавляем в форму
function getAddress(coords) {
    console.log('getAddress');
    var adr;
    var myAdr = ymaps.geocode(coords).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);

        // добавляем адресс в форму
        adr = firstGeoObject.getAddressLine();
        document.getElementById('address').innerHTML = adr;
    });
}

// создаем параграф с сообщением об отсутствии отзывав
function createP() {
    console.log('createP');
    var comments = document.querySelector('.comments');
    var p = document.createElement('p');

    if (!document.querySelector('.text')) {
        comments.innerHTML = '';
        p.className = 'text';
        p.innerText = 'Отзывов пока нет...';
        comments.append(p);
    }
}

// cоздание метки
function createPlacemark(coords, fn, fnc) {
    console.log('createPlacemark');
    return new ymaps.Placemark(coords, fn, fnc);
}

// создание блока отзыва
function createComment(commentObj) {
    console.log('createComment');
    let frag = document.createDocumentFragment();
    let comment = document.createElement('div');
    let p = document.createElement('p');
    let name = document.createElement('span');
    let br = document.createElement('br');
    let placeName = document.createElement('span');
    let commentText = document.createElement('p');
    let comments = document.querySelector('.comments');
    let pText = document.querySelector('.text');


    commentObj = JSON.parse(commentObj);
    comment.className = 'comment';
    name.className = 'user-name';
    name.innerText = commentObj.name;
    placeName.className = 'place-name';
    placeName.innerText = commentObj.placeName;
    commentText.className = 'comment-text';
    commentText.innerText = commentObj.comment;
    p.append(name);
    p.append(br);
    p.append(placeName);
    comment.append(p);
    comment.append(commentText);
    frag.append(comment);
    showPopup();
    comments.append(frag);
}

// ----------------------------------------------------------------------
// создать форму и вставить в .container при первой инициализации (т.е. при первом запуске программы)
function createForm() {
    console.log('createForm');
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

// очистка формы после отправки данных в localStorage
function cleanForm() {
    console.log('cleanForm');
    document.form.reset();
}

// -----------------------------------------------------------------------
// собираем данные со всех полей формы (в т.ч. координаты), создаем объект и добавляем его в localStorage
function addStore(coords) {
    console.log('addStore');
    let address = document.getElementById('address').textContent;
    let name = document.getElementById('name');
    let placeName = document.getElementById('place-name');
    let comment = document.getElementById('comment');
    let commentBlock = {};

    commentBlock.name = name.value;
    commentBlock.placeName = placeName.value;
    commentBlock.comment = comment.value;
    commentBlock.coords = coords;
    // если адресс существует, то создавать массив объктов и
    localStorage.setItem(address, JSON.stringify(commentBlock));
    cleanForm();
}
// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// получаем данные с localStorage и добывляем их в блоки с комментариями
function getStore() {
    console.log('getStore');

}
// -----------------------------------------------------------------------

// проверяем заполнены ли все поля формы
function isFormCompleted() {
    console.log('isFormCopleted');
    let name = document.getElementById('name').value;
    let placeName = document.getElementById('place-name').value;
    let comment = document.getElementById('comment').value;

    if (Boolean(name) && Boolean(placeName) && Boolean(comment)) {
        return true;
    }
    alert('Заполните все поля формы');

    return false;
}

// показываем popup
function showPopup() {
    console.log('showPopup');
    var form = document.querySelector('.form-wrapper');

    form.classList.remove('hidden');
}

// позиционирование popup
function positioningPopup(e) {
    console.log('positioningPopup');
    var top = e.clientY;
    var left = e.clientX;
    var screenHeight = window.innerHeight;
    var screenWidth = window.innerWidth;
    var form = document.querySelector('.form-wrapper');

//    form.classList.remove('hidden');

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
}

// закрываем popup
function closePopup() {
    console.log('closePopup');
    var comments = document.querySelector('.comments');

    comments.parentElement.parentElement.classList.add('hidden');

    // чистим div с комментариями (лучше при помощи функции очистить и комментарии и форму)
    comments.innerHTML = '';
}

function getDate() {

}

// получаем размер экрана
function setSizeMap() {
    console.log('setSizeMap');
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
