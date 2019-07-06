function init() {
    let myPlacemark;
    let coords;
    let myMap = new ymaps.Map('map', {
            center: [52.237750, 21.018374],
            zoom: 17
        });
    let customItemContentLayout = ymaps.templateLayoutFactory.createClass(
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
    let getPointData = function (key, placeName, comment, date) {
            return {
                balloonContentBody: '<div style="height: 130px"><p style="line-height: 28px"><strong>' + placeName + '</strong></p><p><a href="#">' + key + '</a></p><p style="line-height: 28px">' + comment + '</p></div>',
                balloonContentFooter: '<p style="text-align: right; font-size: 12px">' + date + '</p>'
            };
        };
    let getPointOptions = function () {
            return {
                preset: 'islands#violetDotIconWithCaption',
                draggable: false,
                hasBalloon: false
            };
        };
    let objPlacemarks = localStorage;
    const submitBtn = document.getElementById('submit');
    const geocode = (address) => ymaps.geocode(coords).then(function (res) {
        let commentsBlock;
        let adr;
        let firstGeoObject = res.geoObjects.get(0);
        let comments = document.querySelector('.comments');

        adr = firstGeoObject.getAddressLine();
        if (adr !== address) {
            comments.innerHTML = '';
            commentsBlock = localStorage.getItem(adr);
            createComments(commentsBlock);
        }
    });
    const handlePlaceMarkClick = e => {
        let address = document.getElementById('address').textContent;

        coords = e.get('coords');
        geocode(address);
        getAddress(coords);
    };
    const handleSubmit = e => {
        e.preventDefault();
        if (isFormCompleted()) {
            let address = document.getElementById('address').textContent;
            let placeName = document.getElementById('place-name').value;
            let comment = document.getElementById('comment').value;
            let date = getDate();

            myPlacemark = createPlacemark(coords, getPointData(address, placeName, comment, date), getPointOptions());
            myPlacemark.events.add('click', handlePlaceMarkClick);
            myMap.geoObjects.add(myPlacemark);
            clusterer.add(myPlacemark);
            myMap.geoObjects.add(clusterer);
            addStore(coords);
            closePopup();
        }
    };
    function addAllPlacemark() {
        for (let key in objPlacemarks) {
            let coords;
            let placeName;
            let comment;

            if (localStorage.length === 0) return;
            if (JSON.parse(localStorage.getItem(key)) !== null) {

                JSON.parse(localStorage.getItem(key)).forEach(function(item, i, arr) {
                    coords = item.coords;
                    placeName = item.placeName;
                    comment = item.comment;
                    date = item.date;
                    myPlacemark = createPlacemark(coords, getPointData(key, placeName, comment, date), getPointOptions());
                    myPlacemark.events.add('click', handlePlaceMarkClick);
                    myMap.geoObjects.add(myPlacemark);
                    clusterer.add(myPlacemark);
                })
            }
        };

        myMap.geoObjects.add(clusterer);
    }

    function openPopupFromBalloon(e) {
        if (e.target.hasAttribute('href')) {
            let key = e.target.textContent;
            let comment;

            document.getElementById('address').textContent = key;
            comment = localStorage.getItem(key);
            createComments(comment);
            showPopup();
            myMap.balloon.close();
        }
    }

    clusterer.options.set({
        gridSize: 80,
        clusterDisableClickZoom: true
    });

    // вешаем событие на клик по карте
    myMap.events.add('click', e => {

        // получаем координаты клика
        coords = e.get('coords');
        // на клик по карте показываем popup
        showPopup();
        // полчаем адрес и добавляем его в popup
        getAddress(coords);

        createP();
    });

    // скрываем popup при клике по кластеру
    myMap.events.add('balloonopen', function (e) {
        closePopup();
    });

    myMap.events.add('click', function (e) {
        if (!!myMap.balloon.isOpen()) {
            myMap.balloon.close();
        }
    });

    addAllPlacemark();

    // при нажатии на кнопку "Добавить" проверяем заполнены ли все поля, добавляем placemark на карту, собираем данные с формы,добавляем в localStorage и закрываем окно
    submitBtn.addEventListener('click', handleSubmit);

    document.getElementById('map').addEventListener('click', positioningPopup);

    document.getElementById('map').addEventListener('click', openPopupFromBalloon);
}

ymaps.ready(init);

// на клик по крестику скрываем popup
    document.getElementById('close').addEventListener('click', closePopup);

// получаем адрес по координатам и добавляем в форму
function getAddress(coords) {
    var adr;
    var myAdr = ymaps.geocode(coords).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);

        // добавляем адресс в форму
        adr = firstGeoObject.getAddressLine();
        document.getElementById('address').innerHTML = adr;
    });
}

// получаем текущую дату и время
function getDate() {
    let date = new Date();
    let currentYear = date.getFullYear();
    let currentMonth = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    let currentDay = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let currentHours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let currentMinutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let currentSeconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    let currentDate = `${currentYear}.${currentMonth}.${currentDay} ${currentHours}:${currentMinutes}:${currentSeconds}`;

    return currentDate;
}

// создаем параграф с сообщением об отсутствии отзывав
function createP() {
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
//    console.log('createPlacemark');
    return new ymaps.Placemark(coords, fn, fnc);
}

// создание блока сожержащего блоки отдельных отзывов
function createComments(commentsArray) {
    let frag = document.createDocumentFragment();
    let comments = document.querySelector('.comments');
    let comment;

    commentsArray = JSON.parse(commentsArray);
    commentsArray.forEach(function(item, i, arr){
        comment = createComment(item);
        frag.append(comment);
    })

    showPopup();
    comments.append(frag);
}

// создание блока отзыва
function createComment(commentObj) {
    let comment = document.createElement('div');
    let p = document.createElement('p');
    let name = document.createElement('span');
    let placeName = document.createElement('span');
    let commentText = document.createElement('p');
    let pText = document.querySelector('.text');
    let date = document.createElement('span');
    let firstSpace = document.createElement('span');
    let secondSpace = document.createElement('span');

    comment.className = 'comment';
    name.className = 'user-name';
    name.innerText = commentObj.name;
    placeName.className = 'place-name';
    placeName.innerText = commentObj.placeName;
    date.innerText = commentObj.date;
    date.style.fontSize = 14 + 'px';
    firstSpace.innerText = ' ';
    secondSpace.innerText = ' ';
    commentText.className = 'comment-text';
    commentText.innerText = commentObj.comment;
    p.append(name);
    p.append(firstSpace);
    p.append(placeName);
    p.append(secondSpace);
    p.append(date);
    comment.append(p);
    comment.append(commentText);

    return comment;
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
    document.form.reset();
}

// собираем данные со всех полей формы (в т.ч. координаты), создаем объект и добавляем его в localStorage
function addStore(coords) {
    let address = document.getElementById('address').textContent;
    let name = document.getElementById('name');
    let placeName = document.getElementById('place-name');
    let comment = document.getElementById('comment');
    let commentBlock = {};
    let commentsBlock = [];
    let date = getDate();
    let objPlacemarks = localStorage;
    let flag = true;

    commentBlock.name = name.value;
    commentBlock.placeName = placeName.value;
    commentBlock.comment = comment.value;
    commentBlock.coords = coords;
    commentBlock.date = date;

    for (let key in objPlacemarks) {
        if (key === address) {
            commentsBlock = JSON.parse(objPlacemarks[key]);
            commentsBlock.push(commentBlock);
            flag = false;
            break;
        }
    }

    if (flag) {
        commentsBlock.push(commentBlock);
    }
    localStorage.setItem(address, JSON.stringify(commentsBlock));
    cleanForm();
}

// проверяем заполнены ли все поля формы
function isFormCompleted() {
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
    var form = document.querySelector('.form-wrapper');

    form.classList.remove('hidden');
}

// позиционирование popup
function positioningPopup(e) {
    var top = e.clientY;
    var left = e.clientX;
    var screenHeight = window.innerHeight;
    var screenWidth = window.innerWidth;
    var form = document.querySelector('.form-wrapper');

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
    var comments = document.querySelector('.comments');

    comments.parentElement.parentElement.classList.add('hidden');
    // чистим div с комментариями (лучше при помощи функции очистить и комментарии и форму)
    comments.innerHTML = '';
}

// получаем размер экрана
function setSizeMap() {
    var screenHeight = window.innerHeight;
    var container = document.querySelector('.container');

    container.style.height = screenHeight + 'px';
}

setSizeMap();
